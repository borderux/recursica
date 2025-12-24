var bn = Object.defineProperty, $n = Object.defineProperties;
var Sn = Object.getOwnPropertyDescriptors;
var rt = Object.getOwnPropertySymbols;
var Mt = Object.prototype.hasOwnProperty, kt = Object.prototype.propertyIsEnumerable;
var bt = (e, n, o) => n in e ? bn(e, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[n] = o, re = (e, n) => {
  for (var o in n || (n = {}))
    Mt.call(n, o) && bt(e, o, n[o]);
  if (rt)
    for (var o of rt(n))
      kt.call(n, o) && bt(e, o, n[o]);
  return e;
}, Ie = (e, n) => $n(e, Sn(n));
var $t = (e, n) => {
  var o = {};
  for (var i in e)
    Mt.call(e, i) && n.indexOf(i) < 0 && (o[i] = e[i]);
  if (e != null && rt)
    for (var i of rt(e))
      n.indexOf(i) < 0 && kt.call(e, i) && (o[i] = e[i]);
  return o;
};
var Oe = (e, n, o) => bt(e, typeof n != "symbol" ? n + "" : n, o);
async function vn(e) {
  var n;
  try {
    return {
      type: "getCurrentUser",
      success: !0,
      error: !1,
      message: "Current user retrieved successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        userId: ((n = figma.currentUser) == null ? void 0 : n.id) || null
      }
    };
  } catch (o) {
    return {
      type: "getCurrentUser",
      success: !1,
      error: !0,
      message: o instanceof Error ? o.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Nn(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((a, s) => ({
          name: a.name,
          index: s
        }))
      }
    };
  } catch (n) {
    return console.error("Error loading pages:", n), {
      type: "loadPages",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
const we = {
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
}, Te = Ie(re({}, we), {
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
}), ke = Ie(re({}, we), {
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
}), Ze = Ie(re({}, we), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), jt = Ie(re({}, we), {
  cornerRadius: 0
}), Cn = Ie(re({}, we), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function En(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return Te;
    case "TEXT":
      return ke;
    case "VECTOR":
      return Ze;
    case "LINE":
      return Cn;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return jt;
    default:
      return we;
  }
}
function de(e, n) {
  if (Array.isArray(e))
    return Array.isArray(n) ? e.length !== n.length || e.some((o, i) => de(o, n[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof n == "object" && n !== null) {
      const o = Object.keys(e), i = Object.keys(n);
      return o.length !== i.length ? !0 : o.some(
        (a) => !(a in n) || de(e[a], n[a])
      );
    }
    return !0;
  }
  return e !== n;
}
const je = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, Le = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function Ve(e) {
  const n = e.trim(), i = n.replace(/_\d+$/, "").toLowerCase();
  return i === "themes" || i === "theme" ? Le.THEME : i === "token" || i === "tokens" ? Le.TOKENS : i === "layer" || i === "layers" ? Le.LAYER : n;
}
function ze(e) {
  const n = Ve(e);
  return n === Le.LAYER || n === Le.TOKENS || n === Le.THEME;
}
function dt(e) {
  const n = Ve(e);
  if (n === Le.LAYER)
    return je.LAYER;
  if (n === Le.TOKENS)
    return je.TOKENS;
  if (n === Le.THEME)
    return je.THEME;
}
class gt {
  constructor() {
    Oe(this, "collectionMap");
    // collectionId -> index
    Oe(this, "collections");
    // index -> collection data
    Oe(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    Oe(this, "nextIndex");
    this.collectionMap = /* @__PURE__ */ new Map(), this.collections = [], this.normalizedNameMap = /* @__PURE__ */ new Map(), this.nextIndex = 0;
  }
  /**
   * Finds a collection by normalized name (for standard collections)
   * Returns the index if found, -1 otherwise
   */
  findCollectionByNormalizedName(n) {
    return this.normalizedNameMap.get(n);
  }
  /**
   * Merges modes from a new collection into an existing collection entry
   * Ensures all unique modes are present
   */
  mergeModes(n, o) {
    const i = new Set(n);
    for (const a of o)
      i.add(a);
    return Array.from(i);
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * For standard collections (Layer, Tokens, Theme), merges by normalized name
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(n) {
    const o = n.collectionId;
    if (this.collectionMap.has(o))
      return this.collectionMap.get(o);
    const i = Ve(
      n.collectionName
    );
    if (ze(n.collectionName)) {
      const r = this.findCollectionByNormalizedName(i);
      if (r !== void 0) {
        const d = this.collections[r];
        return d.modes = this.mergeModes(
          d.modes,
          n.modes
        ), this.collectionMap.set(o, r), r;
      }
    }
    const a = this.nextIndex++;
    this.collectionMap.set(o, a);
    const s = Ie(re({}, n), {
      collectionName: i
    });
    if (ze(n.collectionName)) {
      const r = dt(
        n.collectionName
      );
      r && (s.collectionGuid = r), this.normalizedNameMap.set(i, a);
    }
    return this.collections[a] = s, a;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(n) {
    var o;
    return (o = this.collectionMap.get(n)) != null ? o : -1;
  }
  /**
   * Gets a collection entry by index
   */
  getCollectionByIndex(n) {
    return this.collections[n];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for internal operations (includes all fields)
   */
  getTable() {
    const n = {};
    for (let o = 0; o < this.collections.length; o++)
      n[String(o)] = this.collections[o];
    return n;
  }
  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: collectionId, isLocal (internal-only fields)
   * Keeps: collectionName, collectionGuid, modes
   */
  getSerializedTable() {
    const n = {};
    for (let o = 0; o < this.collections.length; o++) {
      const i = this.collections[o], a = re({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
      n[String(o)] = a;
    }
    return n;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(n) {
    var a;
    const o = new gt(), i = Object.entries(n).sort(
      (s, r) => parseInt(s[0], 10) - parseInt(r[0], 10)
    );
    for (const [s, r] of i) {
      const d = parseInt(s, 10), g = (a = r.isLocal) != null ? a : !0, y = Ve(
        r.collectionName || ""
      ), u = r.collectionId || r.collectionGuid || `temp:${d}:${y}`, S = re({
        collectionName: y,
        collectionId: u,
        isLocal: g,
        modes: r.modes || []
      }, r.collectionGuid && {
        collectionGuid: r.collectionGuid
      });
      o.collectionMap.set(u, d), o.collections[d] = S, ze(y) && o.normalizedNameMap.set(y, d), o.nextIndex = Math.max(
        o.nextIndex,
        d + 1
      );
    }
    return o;
  }
  /**
   * Gets the total number of collections in the table
   */
  getSize() {
    return this.collections.length;
  }
}
const In = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, wn = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function An(e) {
  var o;
  const n = e.toUpperCase();
  return (o = In[n]) != null ? o : e;
}
function Pn(e) {
  var n;
  return typeof e == "number" ? (n = wn[e]) != null ? n : e.toString() : e;
}
class ft {
  constructor() {
    Oe(this, "variableMap");
    // variableKey -> index
    Oe(this, "variables");
    // index -> variable data
    Oe(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(n) {
    const o = n.variableKey;
    if (!o)
      return -1;
    if (this.variableMap.has(o))
      return this.variableMap.get(o);
    const i = this.nextIndex++;
    return this.variableMap.set(o, i), this.variables[i] = n, i;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(n) {
    var o;
    return (o = this.variableMap.get(n)) != null ? o : -1;
  }
  /**
   * Gets a variable entry by index
   */
  getVariableByIndex(n) {
    return this.variables[n];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   * Includes all fields (for backward compatibility)
   */
  getTable() {
    const n = {};
    for (let o = 0; o < this.variables.length; o++)
      n[String(o)] = this.variables[o];
    return n;
  }
  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  serializeValuesByMode(n) {
    if (!n)
      return;
    const o = {};
    for (const [i, a] of Object.entries(n))
      typeof a == "object" && a !== null && "_varRef" in a && typeof a._varRef == "number" ? o[i] = {
        _varRef: a._varRef
      } : o[i] = a;
    return o;
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
    const n = {};
    for (let o = 0; o < this.variables.length; o++) {
      const i = this.variables[o], a = this.serializeValuesByMode(
        i.valuesByMode
      ), s = re(re({
        variableName: i.variableName,
        variableType: An(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), a && { valuesByMode: a });
      n[String(o)] = s;
    }
    return n;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(n) {
    const o = new ft(), i = Object.entries(n).sort(
      (a, s) => parseInt(a[0], 10) - parseInt(s[0], 10)
    );
    for (const [a, s] of i) {
      const r = parseInt(a, 10), d = Pn(s.variableType), g = Ie(re({}, s), {
        variableType: d
        // Always a string after expansion
      });
      o.variables[r] = g, o.nextIndex = Math.max(o.nextIndex, r + 1);
    }
    return o;
  }
  /**
   * Gets the total number of variables in the table
   */
  getSize() {
    return this.variables.length;
  }
}
function Tn(e) {
  return {
    _varRef: e
  };
}
function Je(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let On = 0;
const ot = /* @__PURE__ */ new Map();
function Rn(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const n = ot.get(e.requestId);
  n && (ot.delete(e.requestId), e.error || !e.guid ? n.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : n.resolve(e.guid));
}
function wt() {
  return new Promise((e, n) => {
    const o = `guid_${Date.now()}_${++On}`;
    ot.set(o, { resolve: e, reject: n }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: o
    }), setTimeout(() => {
      ot.has(o) && (ot.delete(o), n(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const Ke = [], t = {
  clear: () => {
    console.clear(), Ke.length = 0;
  },
  log: (e) => {
    console.log(e), Ke.push({
      type: "log",
      message: e
    });
  },
  warning: (e) => {
    console.warn(e), Ke.push({
      type: "warning",
      message: e
    });
  },
  error: (e) => {
    console.error(e), Ke.push({
      type: "error",
      message: e
    });
  },
  /**
   * Get all collected logs without clearing the buffer
   */
  getLogs: () => [...Ke],
  /**
   * Get all collected logs and clear the buffer
   */
  flush: () => {
    const e = [...Ke];
    return Ke.length = 0, e;
  }
};
function xn(e, n) {
  const o = n.modes.find((i) => i.modeId === e);
  return o ? o.name : e;
}
async function Jt(e, n, o, i, a = /* @__PURE__ */ new Set()) {
  const s = {};
  for (const [r, d] of Object.entries(e)) {
    const g = xn(r, i);
    if (d == null) {
      s[g] = d;
      continue;
    }
    if (typeof d == "string" || typeof d == "number" || typeof d == "boolean") {
      s[g] = d;
      continue;
    }
    if (typeof d == "object" && d !== null && "type" in d && d.type === "VARIABLE_ALIAS" && "id" in d) {
      const y = d.id;
      if (a.has(y)) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: y
        };
        continue;
      }
      const u = await figma.variables.getVariableByIdAsync(y);
      if (!u) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: y
        };
        continue;
      }
      const S = new Set(a);
      S.add(y);
      const $ = await figma.variables.getVariableCollectionByIdAsync(
        u.variableCollectionId
      ), v = u.key;
      if (!v) {
        s[g] = {
          type: "VARIABLE_ALIAS",
          id: y
        };
        continue;
      }
      const w = {
        variableName: u.name,
        variableType: u.resolvedType,
        collectionName: $ == null ? void 0 : $.name,
        collectionId: u.variableCollectionId,
        variableKey: v,
        id: y,
        isLocal: !u.remote
      };
      if ($) {
        const N = await Dt(
          $,
          o
        );
        w._colRef = N, u.valuesByMode && (w.valuesByMode = await Jt(
          u.valuesByMode,
          n,
          o,
          $,
          // Pass collection for mode ID to name conversion
          S
        ));
      }
      const l = n.addVariable(w);
      s[g] = {
        type: "VARIABLE_ALIAS",
        id: y,
        _varRef: l
      };
    } else
      s[g] = d;
  }
  return s;
}
const at = "recursica:collectionId";
async function Vn(e) {
  if (e.remote === !0) {
    const o = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(o)) {
      const a = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw t.error(a), new Error(a);
    }
    return e.id;
  } else {
    if (ze(e.name)) {
      const a = dt(e.name);
      if (a) {
        const s = e.getSharedPluginData(
          "recursica",
          at
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
          "recursica",
          at,
          a
        ), a;
      }
    }
    const o = e.getSharedPluginData(
      "recursica",
      at
    );
    if (o && o.trim() !== "")
      return o;
    const i = await wt();
    return e.setSharedPluginData("recursica", at, i), i;
  }
}
function Mn(e, n) {
  if (n)
    return;
  const o = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(o))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Dt(e, n) {
  const o = !e.remote, i = n.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  Mn(e.name, o);
  const a = await Vn(e), s = e.modes.map((y) => y.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: o,
    modes: s,
    collectionGuid: a
  }, d = n.addCollection(r), g = o ? "local" : "remote";
  return t.log(
    `  Added ${g} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), d;
}
async function vt(e, n, o) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const i = await figma.variables.getVariableByIdAsync(e.id);
    if (!i)
      return console.log("Could not resolve variable alias:", e.id), null;
    const a = await figma.variables.getVariableCollectionByIdAsync(
      i.variableCollectionId
    );
    if (!a)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const s = i.key;
    if (!s)
      return console.log("Variable missing key:", e.id), null;
    const r = await Dt(
      a,
      o
    ), d = {
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
    i.valuesByMode && (d.valuesByMode = await Jt(
      i.valuesByMode,
      n,
      o,
      a,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const g = n.addVariable(d);
    return Tn(g);
  } catch (i) {
    const a = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${a}`
    );
  }
}
async function We(e, n, o) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const a in e)
    if (Object.prototype.hasOwnProperty.call(e, a)) {
      const s = e[a];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const r = await vt(
            s,
            n,
            o
          );
          r && (i[a] = r);
        } else
          i[a] = await We(
            s,
            n,
            o
          );
      else Array.isArray(s) ? i[a] = await Promise.all(
        s.map(async (r) => (r == null ? void 0 : r.type) === "VARIABLE_ALIAS" ? await vt(
          r,
          n,
          o
        ) || r : r && typeof r == "object" ? await We(
          r,
          n,
          o
        ) : r)
      ) : i[a] = s;
    }
  return i;
}
async function Ht(e, n, o) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const a = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? a[s] = await We(
          i[s],
          n,
          o
        ) : a[s] = i[s]);
      return a;
    })
  );
}
async function Kt(e, n, o) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const a = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? a[s] = await We(
          i[s],
          n,
          o
        ) : a[s] = i[s]);
      return a;
    })
  );
}
const Ye = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: We,
  resolveVariableAliasMetadata: vt,
  serializeBackgrounds: Kt,
  serializeFills: Ht
}, Symbol.toStringTag, { value: "Module" }));
async function Wt(e, n) {
  var g, y;
  const o = {}, i = /* @__PURE__ */ new Set();
  e.type && (o.type = e.type, i.add("type")), e.id && (o.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (o.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (o.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (o.y = e.y, i.add("y")), e.width !== void 0 && (o.width = e.width, i.add("width")), e.height !== void 0 && (o.height = e.height, i.add("height"));
  const a = e.name || "Unnamed";
  e.preserveRatio !== void 0 && t.log(
    `[ISSUE #3 EXPORT DEBUG] "${a}" has preserveRatio: ${e.preserveRatio} (NOT being exported - needs to be added!)`
  );
  const s = e.type;
  if (s === "FRAME" || s === "COMPONENT" || s === "INSTANCE" || s === "GROUP" || s === "BOOLEAN_OPERATION" || s === "VECTOR" || s === "STAR" || s === "LINE" || s === "ELLIPSE" || s === "POLYGON" || s === "RECTANGLE" || s === "TEXT") {
    const u = e.constraintHorizontal !== void 0 ? e.constraintHorizontal : (g = e.constraints) == null ? void 0 : g.horizontal, S = e.constraintVertical !== void 0 ? e.constraintVertical : (y = e.constraints) == null ? void 0 : y.vertical;
    u !== void 0 && de(
      u,
      we.constraintHorizontal
    ) && (o.constraintHorizontal = u, i.add("constraintHorizontal")), S !== void 0 && de(
      S,
      we.constraintVertical
    ) && (o.constraintVertical = S, i.add("constraintVertical"));
  }
  if (e.visible !== void 0 && de(e.visible, we.visible) && (o.visible = e.visible, i.add("visible")), e.locked !== void 0 && de(e.locked, we.locked) && (o.locked = e.locked, i.add("locked")), e.opacity !== void 0 && de(e.opacity, we.opacity) && (o.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && de(e.rotation, we.rotation) && (o.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && de(e.blendMode, we.blendMode) && (o.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && de(e.effects, we.effects) && (o.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const u = await Ht(
      e.fills,
      n.variableTable,
      n.collectionTable
    );
    de(u, we.fills) && (o.fills = u), i.add("fills");
  }
  if (e.strokes !== void 0 && de(e.strokes, we.strokes) && (o.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && de(e.strokeWeight, we.strokeWeight) && (o.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && de(e.strokeAlign, we.strokeAlign) && (o.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const u = e.name || "Unnamed", S = Object.keys(e.boundVariables);
    S.length > 0 ? t.log(
      `[ISSUE #2 EXPORT DEBUG] "${u}" (${e.type}) has boundVariables for: ${S.join(", ")}`
    ) : t.log(
      `[ISSUE #2 EXPORT DEBUG] "${u}" (${e.type}) has no boundVariables`
    );
    const $ = await We(
      e.boundVariables,
      n.variableTable,
      n.collectionTable
    ), v = Object.keys($);
    v.length > 0 && t.log(
      `[ISSUE #2 EXPORT DEBUG] "${u}" extracted boundVariables: ${v.join(", ")}`
    ), Object.keys($).length > 0 && (o.boundVariables = $), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const u = await Kt(
      e.backgrounds,
      n.variableTable,
      n.collectionTable
    );
    u && Array.isArray(u) && u.length > 0 && (o.backgrounds = u), i.add("backgrounds");
  }
  const d = e.selectionColor;
  return d !== void 0 && (o.selectionColor = d, i.add("selectionColor")), o;
}
const kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: Wt
}, Symbol.toStringTag, { value: "Module" }));
async function Nt(e, n) {
  const o = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (o.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (a) {
    }
  return e.layoutMode !== void 0 && de(e.layoutMode, Te.layoutMode) && (o.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && de(
    e.primaryAxisSizingMode,
    Te.primaryAxisSizingMode
  ) && (o.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && de(
    e.counterAxisSizingMode,
    Te.counterAxisSizingMode
  ) && (o.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && de(
    e.primaryAxisAlignItems,
    Te.primaryAxisAlignItems
  ) && (o.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && de(
    e.counterAxisAlignItems,
    Te.counterAxisAlignItems
  ) && (o.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && de(e.paddingLeft, Te.paddingLeft) && (o.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && de(e.paddingRight, Te.paddingRight) && (o.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && de(e.paddingTop, Te.paddingTop) && (o.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && de(e.paddingBottom, Te.paddingBottom) && (o.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && de(e.itemSpacing, Te.itemSpacing) && (o.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.counterAxisSpacing !== void 0 && de(
    e.counterAxisSpacing,
    Te.counterAxisSpacing
  ) && (o.counterAxisSpacing = e.counterAxisSpacing, i.add("counterAxisSpacing")), e.cornerRadius !== void 0 && de(e.cornerRadius, Te.cornerRadius) && (o.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && de(e.clipsContent, Te.clipsContent) && (o.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && de(e.layoutWrap, Te.layoutWrap) && (o.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && de(e.layoutGrow, Te.layoutGrow) && (o.layoutGrow = e.layoutGrow, i.add("layoutGrow")), o;
}
const Un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: Nt
}, Symbol.toStringTag, { value: "Module" })), _e = {
  fontSize: 12,
  fontName: { family: "Roboto", style: "Regular" },
  letterSpacing: { value: 0, unit: "PIXELS" },
  lineHeight: { unit: "AUTO" },
  textCase: "ORIGINAL",
  textDecoration: "NONE",
  paragraphSpacing: 0,
  paragraphIndent: 0
};
async function Ln(e, n) {
  const o = {};
  if (e.fontSize !== _e.fontSize && (o.fontSize = e.fontSize), (e.fontName.family !== _e.fontName.family || e.fontName.style !== _e.fontName.style) && (o.fontName = e.fontName), JSON.stringify(e.letterSpacing) !== JSON.stringify(_e.letterSpacing) && (o.letterSpacing = e.letterSpacing), JSON.stringify(e.lineHeight) !== JSON.stringify(_e.lineHeight) && (o.lineHeight = e.lineHeight), e.textCase !== _e.textCase && (o.textCase = e.textCase), e.textDecoration !== _e.textDecoration && (o.textDecoration = e.textDecoration), e.paragraphSpacing !== _e.paragraphSpacing && (o.paragraphSpacing = e.paragraphSpacing), e.paragraphIndent !== _e.paragraphIndent && (o.paragraphIndent = e.paragraphIndent), e.boundVariables) {
    const i = await We(
      e.boundVariables,
      n.variableTable,
      n.collectionTable
    );
    Object.keys(i).length > 0 && (o.boundVariables = i);
  }
  return o;
}
async function Fn(e, n) {
  const o = {}, i = /* @__PURE__ */ new Set();
  if (e.textStyleId !== void 0 && e.textStyleId !== "")
    try {
      const a = await figma.getStyleByIdAsync(e.textStyleId);
      if (a && a.type === "TEXT") {
        let s = n.styleTable.getStyleIndex(a.key);
        if (s < 0) {
          const r = await Ln(a, n);
          s = n.styleTable.addStyle({
            type: "TEXT",
            name: a.name,
            styleKey: a.key,
            textStyle: r,
            boundVariables: r.boundVariables
          }), t.log(
            `  [EXPORT] Added text style "${a.name}" to style table at index ${s} for text node "${e.name || "Unnamed"}"`
          );
        } else
          t.log(
            `  [EXPORT] Reusing existing text style "${a.name}" from style table at index ${s} for text node "${e.name || "Unnamed"}"`
          );
        o._styleRef = s, i.add("_styleRef"), i.add("textStyleId"), t.log(
          `  [EXPORT] ✓ Exported text node "${e.name || "Unnamed"}" with _styleRef=${s} (style: "${a.name}")`
        );
      } else
        t.warning(
          `  [EXPORT] Text node "${e.name || "Unnamed"}" has textStyleId but style lookup returned null or wrong type`
        );
    } catch (a) {
      t.warning(
        `  [EXPORT] Could not look up text style for node "${e.name || "Unnamed"}": ${a}`
      );
    }
  else
    t.log(
      `  [EXPORT] Text node "${e.name || "Unnamed"}" has no textStyleId (textStyleId=${e.textStyleId})`
    );
  return e.characters !== void 0 && e.characters !== "" && (o.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (o.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (o.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && de(
    e.textAlignHorizontal,
    ke.textAlignHorizontal
  ) && (o.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && de(
    e.textAlignVertical,
    ke.textAlignVertical
  ) && (o.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && de(e.letterSpacing, ke.letterSpacing) && (o.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && de(e.lineHeight, ke.lineHeight) && (o.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && de(e.textCase, ke.textCase) && (o.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && de(e.textDecoration, ke.textDecoration) && (o.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && de(e.textAutoResize, ke.textAutoResize) && (o.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && de(
    e.paragraphSpacing,
    ke.paragraphSpacing
  ) && (o.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && de(e.paragraphIndent, ke.paragraphIndent) && (o.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && de(e.listOptions, ke.listOptions) && (o.listOptions = e.listOptions, i.add("listOptions")), o;
}
function Gn(e) {
  const n = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (n) {
    const o = parseFloat(n[1]), i = parseInt(n[2]), a = o * Math.pow(10, i);
    return Math.abs(a) < 1e-10 ? "0" : a.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function Xt(e) {
  if (!e || typeof e != "string")
    return e;
  let n = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (o) => Gn(o));
  return n = n.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (o) => {
      const i = parseFloat(o);
      return Math.abs(i) < 1e-10 ? "0" : i.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), n = n.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (o, i, a) => `${i} ${a}`
  ), n = n.replace(/\s+/g, " ").trim(), n;
}
function Ct(e) {
  return Array.isArray(e) ? e.map((n) => ({
    data: Xt(n.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: n.windRule || n.windingRule || "NONZERO"
  })) : e;
}
const Bn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: Xt,
  normalizeVectorGeometry: Ct
}, Symbol.toStringTag, { value: "Module" }));
async function _n(e, n) {
  const o = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && de(e.fillGeometry, Ze.fillGeometry) && (o.fillGeometry = Ct(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && de(e.strokeGeometry, Ze.strokeGeometry) && (o.strokeGeometry = Ct(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && de(e.strokeCap, Ze.strokeCap) && (o.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && de(e.strokeJoin, Ze.strokeJoin) && (o.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && de(e.dashPattern, Ze.dashPattern) && (o.dashPattern = e.dashPattern, i.add("dashPattern")), o;
}
async function zn(e, n) {
  const o = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && de(e.cornerRadius, jt.cornerRadius) && (o.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (o.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (o.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (o.pointCount = e.pointCount, i.add("pointCount")), o;
}
const st = /* @__PURE__ */ new Map();
let jn = 0;
function Jn() {
  return `prompt_${Date.now()}_${++jn}`;
}
const nt = {
  /**
   * Prompt the user with a message and wait for OK or Cancel response
   * @param message - The message to display to the user
   * @param optionsOrTimeout - Optional configuration object or timeout in milliseconds (for backwards compatibility)
   * @param optionsOrTimeout.timeoutMs - Timeout in milliseconds. Defaults to 300000 (5 minutes). Set to -1 for no timeout.
   * @param optionsOrTimeout.okLabel - Custom label for the OK button. Defaults to "OK".
   * @param optionsOrTimeout.cancelLabel - Custom label for the cancel button. Defaults to "Cancel".
   * @returns Promise that resolves on OK, rejects on Cancel or timeout
   */
  prompt: (e, n) => {
    var d;
    const o = typeof n == "number" ? { timeoutMs: n } : n, i = (d = o == null ? void 0 : o.timeoutMs) != null ? d : 3e5, a = o == null ? void 0 : o.okLabel, s = o == null ? void 0 : o.cancelLabel, r = Jn();
    return new Promise((g, y) => {
      const u = i === -1 ? null : setTimeout(() => {
        st.delete(r), y(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      st.set(r, {
        resolve: g,
        reject: y,
        timeout: u
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: re(re({
          message: e,
          requestId: r
        }, a && { okLabel: a }), s && { cancelLabel: s })
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
    const { requestId: n, action: o } = e, i = st.get(n);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${n}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), st.delete(n), o === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
}, Dn = "RecursicaPublishedMetadata";
function St(e) {
  let n = e, o = !1;
  try {
    if (o = n.parent !== null && n.parent !== void 0, !o)
      return { page: null, reason: "detached" };
  } catch (i) {
    return { page: null, reason: "detached" };
  }
  for (; n; ) {
    if (n.type === "PAGE")
      return { page: n, reason: "found" };
    try {
      const i = n.parent;
      if (!i)
        return { page: null, reason: "broken_chain" };
      n = i;
    } catch (i) {
      return { page: null, reason: "access_error" };
    }
  }
  return { page: null, reason: "broken_chain" };
}
function Ut(e) {
  try {
    const n = e.getPluginData(Dn);
    if (!n || n.trim() === "")
      return null;
    const o = JSON.parse(n);
    return {
      id: o.id,
      version: o.version
    };
  } catch (n) {
    return null;
  }
}
async function Hn(e, n) {
  var a, s;
  const o = {}, i = /* @__PURE__ */ new Set();
  if (o._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const r = await e.getMainComponentAsync();
    if (!r) {
      const E = e.name || "(unnamed)", U = e.id;
      if (n.detachedComponentsHandled.has(U))
        t.log(
          `Treating detached instance "${E}" as internal instance (already prompted)`
        );
      else {
        t.warning(
          `Found detached instance: "${E}" (main component is missing)`
        );
        const O = `Found detached instance "${E}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await nt.prompt(O, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), n.detachedComponentsHandled.add(U), t.log(
            `Treating detached instance "${E}" as internal instance`
          );
        } catch (k) {
          if (k instanceof Error && k.message === "User cancelled") {
            const Y = `Export cancelled: Detached instance "${E}" found. Please fix the instance before exporting.`;
            t.error(Y);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (ie) {
              console.warn("Could not scroll to instance:", ie);
            }
            throw new Error(Y);
          } else
            throw k;
        }
      }
      if (!St(e).page) {
        const O = `Detached instance "${E}" is not on any page. Cannot export.`;
        throw t.error(O), new Error(O);
      }
      let p, f;
      try {
        e.variantProperties && (p = e.variantProperties), e.componentProperties && (f = e.componentProperties);
      } catch (O) {
      }
      const b = re(re({
        instanceType: "internal",
        componentName: E,
        componentNodeId: e.id
      }, p && { variantProperties: p }), f && { componentProperties: f }), I = n.instanceTable.addInstance(b);
      return o._instanceRef = I, i.add("_instanceRef"), t.log(
        `  Exported detached INSTANCE: "${E}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), o;
    }
    const d = e.name || "(unnamed)", g = r.name || "(unnamed)", y = r.remote === !0, S = St(e).page, $ = St(r);
    let v = $.page;
    if (!v && y)
      try {
        await figma.loadAllPagesAsync();
        const E = figma.root.children;
        let U = null;
        for (const L of E)
          try {
            if (L.findOne(
              (p) => p.id === r.id
            )) {
              U = L;
              break;
            }
          } catch (R) {
          }
        if (!U) {
          const L = r.id.split(":")[0];
          for (const R of E) {
            const p = R.id.split(":")[0];
            if (L === p) {
              U = R;
              break;
            }
          }
        }
        U && (v = U);
      } catch (E) {
      }
    let w, l = v;
    if (y)
      if (v) {
        const E = Ut(v);
        w = "normal", l = v, E != null && E.id ? t.log(
          `  Component "${g}" is from library but also exists on local page "${v.name}" with metadata. Treating as "normal" instance.`
        ) : t.log(
          `  Component "${g}" is from library and exists on local page "${v.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        w = "remote", t.log(
          `  Component "${g}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (v && S && v.id === S.id)
      w = "internal";
    else if (v && S && v.id !== S.id)
      w = "normal";
    else if (v && !S)
      w = "normal";
    else if (!y && $.reason === "detached") {
      const E = r.id;
      if (n.detachedComponentsHandled.has(E))
        w = "remote", t.log(
          `Treating detached instance "${d}" -> component "${g}" as remote instance (already prompted)`
        );
      else {
        t.warning(
          `Found detached instance: "${d}" -> component "${g}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (L) {
          console.warn("Could not scroll to component:", L);
        }
        const U = `Found detached instance "${d}" attached to component "${g}". This should be fixed. Continue to publish?`;
        try {
          await nt.prompt(U, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), n.detachedComponentsHandled.add(E), w = "remote", t.log(
            `Treating detached instance "${d}" as remote instance (will be created on REMOTES page)`
          );
        } catch (L) {
          if (L instanceof Error && L.message === "User cancelled") {
            const R = `Export cancelled: Detached instance "${d}" found. The component "${g}" is not on any page. Please fix the instance before exporting.`;
            throw t.error(R), new Error(R);
          } else
            throw L;
        }
      }
    } else
      y || t.warning(
        `  Instance "${d}" -> component "${g}": componentPage is null but component is not remote. Reason: ${$.reason}. Cannot determine instance type.`
      ), w = "normal";
    let N, m;
    try {
      if (e.variantProperties && (N = e.variantProperties, t.log(
        `  Instance "${d}" -> variantProperties from instance: ${JSON.stringify(N)}`
      )), typeof e.getProperties == "function")
        try {
          const E = await e.getProperties();
          E && E.variantProperties && (t.log(
            `  Instance "${d}" -> variantProperties from getProperties(): ${JSON.stringify(E.variantProperties)}`
          ), E.variantProperties && Object.keys(E.variantProperties).length > 0 && (N = E.variantProperties));
        } catch (E) {
          t.log(
            `  Instance "${d}" -> getProperties() not available or failed: ${E}`
          );
        }
      if (e.componentProperties && (m = e.componentProperties), r.parent && r.parent.type === "COMPONENT_SET") {
        const E = r.parent;
        try {
          const U = E.componentPropertyDefinitions;
          U && t.log(
            `  Component set "${E.name}" has property definitions: ${JSON.stringify(Object.keys(U))}`
          );
          const L = {}, R = g.split(",").map((p) => p.trim());
          for (const p of R) {
            const f = p.split("=").map((b) => b.trim());
            if (f.length >= 2) {
              const b = f[0], I = f.slice(1).join("=").trim();
              U && U[b] && (L[b] = I);
            }
          }
          if (Object.keys(L).length > 0 && t.log(
            `  Parsed variant properties from component name "${g}": ${JSON.stringify(L)}`
          ), N && Object.keys(N).length > 0)
            t.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(N)}`
            );
          else if (Object.keys(L).length > 0)
            N = L, t.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(N)}`
            );
          else if (r.variantProperties) {
            const p = r.variantProperties;
            t.log(
              `  Main component "${g}" has variantProperties: ${JSON.stringify(p)}`
            ), N = p;
          }
        } catch (U) {
          t.warning(
            `  Could not get variant properties from component set: ${U}`
          );
        }
      }
    } catch (E) {
    }
    let c, V;
    try {
      let E = r.parent;
      const U = [];
      let L = 0;
      const R = 20;
      for (; E && L < R; )
        try {
          const p = E.type, f = E.name;
          if (p === "COMPONENT_SET" && !V && (V = f), p === "PAGE")
            break;
          const b = f || "";
          U.unshift(b), (V === "arrow-top-right-on-square" || g === "arrow-top-right-on-square") && t.log(
            `  [PATH BUILD] Added segment: "${b}" (type: ${p}) to path for component "${g}"`
          ), E = E.parent, L++;
        } catch (p) {
          (V === "arrow-top-right-on-square" || g === "arrow-top-right-on-square") && t.warning(
            `  [PATH BUILD] Error building path for "${g}": ${p}`
          );
          break;
        }
      c = U, (V === "arrow-top-right-on-square" || g === "arrow-top-right-on-square") && t.log(
        `  [PATH BUILD] Final path for component "${g}": [${U.join(" → ")}]`
      );
    } catch (E) {
    }
    const G = re(re(re(re({
      instanceType: w,
      componentName: g
    }, V && { componentSetName: V }), N && { variantProperties: N }), m && { componentProperties: m }), w === "normal" ? { path: c || [] } : c && c.length > 0 && {
      path: c
    });
    if (w === "internal") {
      G.componentNodeId = r.id, t.log(
        `  Found INSTANCE: "${d}" -> INTERNAL component "${g}" (ID: ${r.id.substring(0, 8)}...)`
      );
      const E = e.boundVariables, U = r.boundVariables;
      if (E && typeof E == "object") {
        const b = Object.keys(E);
        t.log(
          `  DEBUG: Internal instance "${d}" -> boundVariables keys: ${b.length > 0 ? b.join(", ") : "none"}`
        );
        for (const O of b) {
          const k = E[O], Y = (k == null ? void 0 : k.type) || typeof k;
          t.log(
            `  DEBUG:   boundVariables.${O}: type=${Y}, value=${JSON.stringify(k)}`
          );
        }
        const I = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const O of I)
          E[O] !== void 0 && t.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${O} = ${JSON.stringify(E[O])}`
          );
      } else
        t.log(
          `  DEBUG: Internal instance "${d}" -> No boundVariables found on instance node`
        );
      if (U && typeof U == "object") {
        const b = Object.keys(U);
        t.log(
          `  DEBUG: Main component "${g}" -> boundVariables keys: ${b.length > 0 ? b.join(", ") : "none"}`
        );
      }
      const L = e.backgrounds;
      if (L && Array.isArray(L)) {
        t.log(
          `  DEBUG: Internal instance "${d}" -> backgrounds array length: ${L.length}`
        );
        for (let b = 0; b < L.length; b++) {
          const I = L[b];
          if (I && typeof I == "object") {
            if (t.log(
              `  DEBUG:   backgrounds[${b}] structure: ${JSON.stringify(Object.keys(I))}`
            ), I.boundVariables) {
              const O = Object.keys(I.boundVariables);
              t.log(
                `  DEBUG:   backgrounds[${b}].boundVariables keys: ${O.length > 0 ? O.join(", ") : "none"}`
              );
              for (const k of O) {
                const Y = I.boundVariables[k];
                t.log(
                  `  DEBUG:     backgrounds[${b}].boundVariables.${k}: ${JSON.stringify(Y)}`
                );
              }
            }
            I.color && t.log(
              `  DEBUG:   backgrounds[${b}].color: ${JSON.stringify(I.color)}`
            );
          }
        }
      }
      const R = Object.keys(e).filter(
        (b) => !b.startsWith("_") && b !== "parent" && b !== "removed" && typeof e[b] != "function" && b !== "type" && b !== "id" && b !== "name" && b !== "boundVariables" && b !== "backgrounds" && b !== "fills"
      ), p = Object.keys(r).filter(
        (b) => !b.startsWith("_") && b !== "parent" && b !== "removed" && typeof r[b] != "function" && b !== "type" && b !== "id" && b !== "name" && b !== "boundVariables" && b !== "backgrounds" && b !== "fills"
      ), f = [
        .../* @__PURE__ */ new Set([...R, ...p])
      ].filter(
        (b) => b.toLowerCase().includes("selection") || b.toLowerCase().includes("select") || b.toLowerCase().includes("color") && !b.toLowerCase().includes("fill") && !b.toLowerCase().includes("stroke")
      );
      if (f.length > 0) {
        t.log(
          `  DEBUG: Found selection/color-related properties: ${f.join(", ")}`
        );
        for (const b of f)
          try {
            if (R.includes(b)) {
              const I = e[b];
              t.log(
                `  DEBUG:   Instance.${b}: ${JSON.stringify(I)}`
              );
            }
            if (p.includes(b)) {
              const I = r[b];
              t.log(
                `  DEBUG:   MainComponent.${b}: ${JSON.stringify(I)}`
              );
            }
          } catch (I) {
          }
      } else
        t.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (w === "normal") {
      const E = l || v;
      if (E) {
        G.componentPageName = E.name;
        const L = Ut(E);
        L != null && L.id && L.version !== void 0 ? (G.componentGuid = L.id, G.componentVersion = L.version, t.log(
          `  Found INSTANCE: "${d}" -> NORMAL component "${g}" (ID: ${r.id.substring(0, 8)}...) at path [${(c || []).join(" → ")}]`
        )) : t.warning(
          `  Instance "${d}" -> component "${g}" is classified as normal but page "${E.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const L = r.id;
        let R = "", p = "";
        switch ($.reason) {
          case "broken_chain":
            R = "The component's parent chain is broken and cannot be traversed to find the page", p = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            R = "Cannot access the component's parent chain (access error)", p = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            R = "Cannot determine which page the component is on", p = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (I) {
          console.warn("Could not scroll to component:", I);
        }
        const f = `Normal instance "${d}" -> component "${g}" (ID: ${L}) has no componentPage. ${R}. ${p} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", f), t.error(f);
        const b = new Error(f);
        throw console.error("Throwing error:", b), b;
      }
      c === void 0 && console.warn(
        `Failed to build path for normal instance "${d}" -> component "${g}". Path is required for resolution.`
      );
      const U = c && c.length > 0 ? ` at path [${c.join(" → ")}]` : " at page root";
      t.log(
        `  Found INSTANCE: "${d}" -> NORMAL component "${g}" (ID: ${r.id.substring(0, 8)}...)${U}`
      );
    } else if (w === "remote") {
      let E, U;
      const L = n.detachedComponentsHandled.has(
        r.id
      );
      if (!L)
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const p = await r.getPublishStatusAsync();
              p && typeof p == "object" && (p.libraryName && (E = p.libraryName), p.libraryKey && (U = p.libraryKey));
            } catch (p) {
            }
          try {
            const p = figma.teamLibrary;
            if (typeof (p == null ? void 0 : p.getAvailableLibraryComponentSetsAsync) == "function") {
              const f = await p.getAvailableLibraryComponentSetsAsync();
              if (f && Array.isArray(f)) {
                for (const b of f)
                  if (b.key === r.key || b.name === r.name) {
                    b.libraryName && (E = b.libraryName), b.libraryKey && (U = b.libraryKey);
                    break;
                  }
              }
            }
          } catch (p) {
          }
        } catch (p) {
          console.warn(
            `Error getting library info for remote component "${g}":`,
            p
          );
        }
      if (E && (G.remoteLibraryName = E), U && (G.remoteLibraryKey = U), L && (G.componentNodeId = r.id), n.instanceTable.getInstanceIndex(G) !== -1)
        t.log(
          `  Found INSTANCE: "${d}" -> REMOTE component "${g}" (ID: ${r.id.substring(0, 8)}...)${L ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: p } = await Promise.resolve().then(() => kn), f = await p(e, n), { parseFrameProperties: b } = await Promise.resolve().then(() => Un), I = await b(e, n), O = Ie(re(re({}, f), I), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const k = Ie(re({}, n), {
              depth: (n.depth || 0) + 1
            }), { extractNodeData: Y } = await Promise.resolve().then(() => Zn), ie = [];
            for (const Z of e.children)
              try {
                let j;
                if (Z.type === "INSTANCE")
                  try {
                    const ee = await Z.getMainComponentAsync();
                    if (ee) {
                      const te = await p(
                        Z,
                        n
                      ), W = await b(
                        Z,
                        n
                      ), oe = await Y(
                        ee,
                        /* @__PURE__ */ new WeakSet(),
                        k
                      );
                      j = Ie(re(re(re({}, oe), te), W), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      j = await Y(
                        Z,
                        /* @__PURE__ */ new WeakSet(),
                        k
                      ), j.type === "INSTANCE" && (j.type = "COMPONENT"), delete j._instanceRef;
                  } catch (ee) {
                    j = await Y(
                      Z,
                      /* @__PURE__ */ new WeakSet(),
                      k
                    ), j.type === "INSTANCE" && (j.type = "COMPONENT"), delete j._instanceRef;
                  }
                else {
                  j = await Y(
                    Z,
                    /* @__PURE__ */ new WeakSet(),
                    k
                  );
                  const ee = Z.boundVariables;
                  if (ee && typeof ee == "object") {
                    const te = Object.keys(ee);
                    te.length > 0 && (t.log(
                      `  DEBUG: Child "${Z.name || "Unnamed"}" -> boundVariables keys: ${te.join(", ")}`
                    ), ee.backgrounds !== void 0 && t.log(
                      `  DEBUG:   Child "${Z.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(ee.backgrounds)}`
                    ));
                  }
                  if (r.children && Array.isArray(r.children)) {
                    const te = r.children.find(
                      (W) => W.name === Z.name
                    );
                    if (te) {
                      const W = te.boundVariables;
                      if (W && typeof W == "object") {
                        const oe = Object.keys(W);
                        if (oe.length > 0 && (t.log(
                          `  DEBUG: Main component child "${te.name || "Unnamed"}" -> boundVariables keys: ${oe.join(", ")}`
                        ), W.backgrounds !== void 0 && (t.log(
                          `  DEBUG:   Main component child "${te.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(W.backgrounds)}`
                        ), !ee || !ee.backgrounds))) {
                          t.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: ae } = await Promise.resolve().then(() => Ye), X = await ae(
                            W,
                            n.variableTable,
                            n.collectionTable
                          );
                          j.boundVariables || (j.boundVariables = {}), X.backgrounds && (j.boundVariables.backgrounds = X.backgrounds, t.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                ie.push(j);
              } catch (j) {
                console.warn(
                  `Failed to extract child "${Z.name || "Unnamed"}" for remote component "${g}":`,
                  j
                );
              }
            O.children = ie;
          }
          if (!O)
            throw new Error("Failed to build structure for remote instance");
          try {
            const k = e.boundVariables;
            if (k && typeof k == "object") {
              const x = Object.keys(k);
              t.log(
                `  DEBUG: Instance "${d}" -> boundVariables keys: ${x.length > 0 ? x.join(", ") : "none"}`
              );
              for (const z of x) {
                const D = k[z], fe = (D == null ? void 0 : D.type) || typeof D;
                if (t.log(
                  `  DEBUG:   boundVariables.${z}: type=${fe}, value=${JSON.stringify(D)}`
                ), D && typeof D == "object" && !Array.isArray(D)) {
                  const se = Object.keys(D);
                  if (se.length > 0) {
                    t.log(
                      `  DEBUG:     boundVariables.${z} has nested keys: ${se.join(", ")}`
                    );
                    for (const ge of se) {
                      const pe = D[ge];
                      pe && typeof pe == "object" && pe.type === "VARIABLE_ALIAS" && t.log(
                        `  DEBUG:       boundVariables.${z}.${ge}: VARIABLE_ALIAS id=${pe.id}`
                      );
                    }
                  }
                }
              }
              const H = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const z of H)
                k[z] !== void 0 && t.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${z} = ${JSON.stringify(k[z])}`
                );
            } else
              t.log(
                `  DEBUG: Instance "${d}" -> No boundVariables found on instance node`
              );
            const Y = k && k.fills !== void 0 && k.fills !== null, ie = O.fills !== void 0 && Array.isArray(O.fills) && O.fills.length > 0, Z = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, j = r.fills !== void 0 && Array.isArray(r.fills) && r.fills.length > 0;
            if (t.log(
              `  DEBUG: Instance "${d}" -> fills check: instanceHasFills=${Z}, structureHasFills=${ie}, mainComponentHasFills=${j}, hasInstanceFillsBoundVar=${!!Y}`
            ), Y && !ie) {
              t.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (Z) {
                  const { serializeFills: x } = await Promise.resolve().then(() => Ye), H = await x(
                    e.fills,
                    n.variableTable,
                    n.collectionTable
                  );
                  O.fills = H, t.log(
                    `  DEBUG: Got ${H.length} fill(s) from instance node`
                  );
                } else if (j) {
                  const { serializeFills: x } = await Promise.resolve().then(() => Ye), H = await x(
                    r.fills,
                    n.variableTable,
                    n.collectionTable
                  );
                  O.fills = H, t.log(
                    `  DEBUG: Got ${H.length} fill(s) from main component`
                  );
                } else
                  t.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (x) {
                t.warning(`  Failed to get fills: ${x}`);
              }
            }
            const ee = e.selectionColor, te = r.selectionColor;
            ee !== void 0 && t.log(
              `  DEBUG: Instance "${d}" -> selectionColor: ${JSON.stringify(ee)}`
            ), te !== void 0 && t.log(
              `  DEBUG: Main component "${g}" -> selectionColor: ${JSON.stringify(te)}`
            );
            const W = Object.keys(e).filter(
              (x) => !x.startsWith("_") && x !== "parent" && x !== "removed" && typeof e[x] != "function" && x !== "type" && x !== "id" && x !== "name"
            ), oe = Object.keys(r).filter(
              (x) => !x.startsWith("_") && x !== "parent" && x !== "removed" && typeof r[x] != "function" && x !== "type" && x !== "id" && x !== "name"
            ), ae = [
              .../* @__PURE__ */ new Set([...W, ...oe])
            ].filter(
              (x) => x.toLowerCase().includes("selection") || x.toLowerCase().includes("select") || x.toLowerCase().includes("color") && !x.toLowerCase().includes("fill") && !x.toLowerCase().includes("stroke")
            );
            if (ae.length > 0) {
              t.log(
                `  DEBUG: Found selection/color-related properties: ${ae.join(", ")}`
              );
              for (const x of ae)
                try {
                  if (W.includes(x)) {
                    const H = e[x];
                    t.log(
                      `  DEBUG:   Instance.${x}: ${JSON.stringify(H)}`
                    );
                  }
                  if (oe.includes(x)) {
                    const H = r[x];
                    t.log(
                      `  DEBUG:   MainComponent.${x}: ${JSON.stringify(H)}`
                    );
                  }
                } catch (H) {
                }
            } else
              t.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const X = r.boundVariables;
            if (X && typeof X == "object") {
              const x = Object.keys(X);
              if (x.length > 0) {
                t.log(
                  `  DEBUG: Main component "${g}" -> boundVariables keys: ${x.join(", ")}`
                ), x.includes("selectionColor") ? t.log(
                  `[ISSUE #2 EXPORT] Main component "${g}" HAS selectionColor in boundVariables: ${JSON.stringify(X.selectionColor)}`
                ) : t.log(
                  `[ISSUE #2 EXPORT] Main component "${g}" does NOT have selectionColor in boundVariables (has: ${x.join(", ")})`
                );
                for (const H of x) {
                  const z = X[H], D = (z == null ? void 0 : z.type) || typeof z;
                  t.log(
                    `  DEBUG:   Main component boundVariables.${H}: type=${D}, value=${JSON.stringify(z)}`
                  );
                }
              } else
                t.log(
                  `[ISSUE #2 EXPORT] Main component "${g}" has no boundVariables`
                );
            } else
              t.log(
                `[ISSUE #2 EXPORT] Main component "${g}" boundVariables is null/undefined`
              );
            if (k && Object.keys(k).length > 0) {
              t.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(k).length} key(s))`
              );
              const { extractBoundVariables: x } = await Promise.resolve().then(() => Ye), H = await x(
                k,
                n.variableTable,
                n.collectionTable
              );
              O.boundVariables || (O.boundVariables = {});
              for (const [z, D] of Object.entries(
                H
              ))
                D !== void 0 && (O.boundVariables[z] !== void 0 && t.log(
                  `  DEBUG: Structure already has boundVariables.${z} from baseProps, but instance also has it - using instance's boundVariables.${z}`
                ), O.boundVariables[z] = D, t.log(
                  `  DEBUG: Set boundVariables.${z} in structure: ${JSON.stringify(D)}`
                ));
              H.fills !== void 0 ? t.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : Y && t.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), H.backgrounds !== void 0 ? t.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(H.backgrounds)}`
              ) : k && k.backgrounds !== void 0 && t.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (X && Object.keys(X).length > 0) {
              t.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(X).length} key(s))`
              );
              const { extractBoundVariables: x } = await Promise.resolve().then(() => Ye), H = await x(
                X,
                n.variableTable,
                n.collectionTable
              );
              O.boundVariables || (O.boundVariables = {});
              for (const [z, D] of Object.entries(
                H
              ))
                D !== void 0 && (O.boundVariables[z] === void 0 ? (O.boundVariables[z] = D, z === "selectionColor" ? t.log(
                  `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${g}" to instance "${d}": ${JSON.stringify(D)}`
                ) : t.log(
                  `  DEBUG: Added boundVariables.${z} from main component (not in instance): ${JSON.stringify(D)}`
                )) : z === "selectionColor" ? t.log(
                  `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${g}" (instance "${d}" already has it)`
                ) : t.log(
                  `  DEBUG: Skipped boundVariables.${z} from main component (instance already has it)`
                ));
            }
            t.log(
              `  DEBUG: Final structure for "${g}": hasFills=${!!O.fills}, fillsCount=${((a = O.fills) == null ? void 0 : a.length) || 0}, hasBoundVars=${!!O.boundVariables}, boundVarsKeys=${O.boundVariables ? Object.keys(O.boundVariables).join(", ") : "none"}`
            ), (s = O.boundVariables) != null && s.fills && t.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(O.boundVariables.fills)}`
            );
          } catch (k) {
            t.warning(
              `  Failed to handle bound variables for fills: ${k}`
            );
          }
          G.structure = O, L ? t.log(
            `  Extracted structure for detached component "${g}" (ID: ${r.id.substring(0, 8)}...)`
          ) : t.log(
            `  Extracted structure from instance for remote component "${g}" (preserving size overrides: ${e.width}x${e.height})`
          ), t.log(
            `  Found INSTANCE: "${d}" -> REMOTE component "${g}" (ID: ${r.id.substring(0, 8)}...)${L ? " [DETACHED]" : ""}`
          );
        } catch (p) {
          const f = `Failed to extract structure for remote component "${g}": ${p instanceof Error ? p.message : String(p)}`;
          console.error(f, p), t.error(f);
        }
    }
    if (w === "normal" && r) {
      if (e.children && Array.isArray(e.children) && e.children.length > 0) {
        t.log(
          `[DEBUG] Normal instance "${d}" has ${e.children.length} child(ren) (unexpected for normal instance):`
        );
        for (let E = 0; E < Math.min(e.children.length, 5); E++) {
          const U = e.children[E];
          if (U) {
            const L = U.name || `Child ${E}`, R = U.type || "UNKNOWN", p = U.boundVariables, f = U.fills;
            if (t.log(
              `[DEBUG]   Child ${E}: "${L}" (${R}) - hasBoundVars=${!!p}, hasFills=${!!f}`
            ), p) {
              const b = Object.keys(p);
              t.log(
                `[DEBUG]     boundVariables: ${b.join(", ")}`
              );
            }
          }
        }
      }
      if (r.children && Array.isArray(r.children) && r.children.length > 0) {
        t.log(
          `[DEBUG] Main component "${g}" has ${r.children.length} child(ren):`
        );
        for (let E = 0; E < Math.min(r.children.length, 5); E++) {
          const U = r.children[E];
          if (U) {
            const L = U.name || `Child ${E}`, R = U.type || "UNKNOWN", p = U.boundVariables, f = U.fills;
            if (t.log(
              `[DEBUG]   Main component child ${E}: "${L}" (${R}) - hasBoundVars=${!!p}, hasFills=${!!f}`
            ), p) {
              const b = Object.keys(p);
              t.log(
                `[DEBUG]     boundVariables: ${b.join(", ")}`
              ), p.fills && t.log(
                `[DEBUG]     boundVariables.fills: ${JSON.stringify(p.fills)}`
              );
            }
            if (f && Array.isArray(f) && f.length > 0) {
              const b = f[0];
              b && typeof b == "object" && t.log(
                `[DEBUG]     fills[0]: type=${b.type}, color=${JSON.stringify(b.color)}`
              );
            }
            if (e.children && Array.isArray(e.children) && E < e.children.length) {
              const b = e.children[E];
              if (b && b.name === L) {
                const I = b.boundVariables, O = I ? Object.keys(I) : [], k = p ? Object.keys(p) : [], Y = O.filter(
                  (ie) => !k.includes(ie)
                );
                if (Y.length > 0) {
                  t.log(
                    `[DEBUG] Instance "${d}" child "${L}" has instance override bound variables: ${Y.join(", ")} (will be exported with instance children)`
                  );
                  for (const ie of Y)
                    t.log(
                      `[DEBUG]   Instance child boundVariables.${ie}: ${JSON.stringify(I[ie])}`
                    );
                }
              }
            }
          }
        }
      }
      try {
        const E = r.boundVariables;
        if (E && typeof E == "object") {
          const U = Object.keys(E);
          if (U.length > 0) {
            t.log(
              `[ISSUE #2 EXPORT] Normal instance "${d}" -> checking main component "${g}" boundVariables (${U.length} key(s))`
            ), U.includes("selectionColor") ? t.log(
              `[ISSUE #2 EXPORT] Main component "${g}" HAS selectionColor in boundVariables: ${JSON.stringify(E.selectionColor)}`
            ) : t.log(
              `[ISSUE #2 EXPORT] Main component "${g}" does NOT have selectionColor in boundVariables (has: ${U.join(", ")})`
            );
            const { extractBoundVariables: L } = await Promise.resolve().then(() => Ye), R = await L(
              E,
              n.variableTable,
              n.collectionTable
            );
            o.boundVariables || (o.boundVariables = {});
            for (const [p, f] of Object.entries(
              R
            ))
              f !== void 0 && (o.boundVariables[p] === void 0 ? (o.boundVariables[p] = f, p === "selectionColor" ? t.log(
                `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${g}" to normal instance "${d}": ${JSON.stringify(f)}`
              ) : t.log(
                `  DEBUG: Added boundVariables.${p} from main component to normal instance: ${JSON.stringify(f)}`
              )) : p === "selectionColor" && t.log(
                `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${g}" (normal instance "${d}" already has it)`
              ));
          } else
            t.log(
              `[ISSUE #2 EXPORT] Main component "${g}" has no boundVariables`
            );
        } else
          t.log(
            `[ISSUE #2 EXPORT] Main component "${g}" boundVariables is null/undefined`
          );
      } catch (E) {
        t.warning(
          `[ISSUE #2 EXPORT] Error checking main component boundVariables for normal instance "${d}": ${E}`
        );
      }
    }
    const F = n.instanceTable.addInstance(G);
    o._instanceRef = F, i.add("_instanceRef");
  }
  return o;
}
class it {
  constructor() {
    Oe(this, "instanceMap");
    // unique key -> index
    Oe(this, "instances");
    // index -> instance data
    Oe(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(n) {
    if (n.instanceType === "internal" && n.componentNodeId) {
      const o = n.variantProperties ? `:${JSON.stringify(n.variantProperties)}` : "";
      return `internal:${n.componentNodeId}${o}`;
    } else {
      if (n.instanceType === "normal" && n.componentGuid && n.componentVersion !== void 0)
        return `normal:${n.componentGuid}:${n.componentVersion}`;
      if (n.instanceType === "remote" && n.remoteLibraryKey)
        return `remote:${n.remoteLibraryKey}:${n.componentName}`;
      if (n.instanceType === "remote" && n.componentNodeId)
        return `remote:detached:${n.componentNodeId}`;
    }
    return n.instanceType === "remote" ? `remote:${n.componentName}:COMPONENT` : `${n.instanceType}:${n.componentName}:COMPONENT`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(n) {
    const o = this.generateKey(n);
    if (this.instanceMap.has(o))
      return this.instanceMap.get(o);
    const i = this.nextIndex++;
    return this.instanceMap.set(o, i), this.instances[i] = n, i;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(n) {
    var i;
    const o = this.generateKey(n);
    return (i = this.instanceMap.get(o)) != null ? i : -1;
  }
  /**
   * Gets an instance entry by index
   */
  getInstanceByIndex(n) {
    return this.instances[n];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   */
  getSerializedTable() {
    const n = {};
    for (let o = 0; o < this.instances.length; o++)
      n[String(o)] = this.instances[o];
    return n;
  }
  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(n) {
    const o = new it(), i = Object.entries(n).sort(
      (a, s) => parseInt(a[0], 10) - parseInt(s[0], 10)
    );
    for (const [a, s] of i) {
      const r = parseInt(a, 10), d = o.generateKey(s);
      o.instanceMap.set(d, r), o.instances[r] = s, o.nextIndex = Math.max(o.nextIndex, r + 1);
    }
    return o;
  }
  /**
   * Gets the total number of instances in the table
   */
  getSize() {
    return this.instances.length;
  }
}
class pt {
  constructor() {
    Oe(this, "styles", /* @__PURE__ */ new Map());
    Oe(this, "styleKeyToIndex", /* @__PURE__ */ new Map());
    Oe(this, "nextIndex", 0);
  }
  /**
   * Add a style to the table and return its index
   * If the style already exists (by styleKey), returns the existing index
   */
  addStyle(n) {
    const o = n.styleKey || `${n.type}:${n.name}:${JSON.stringify(n.textStyle || n.paintStyle || n.effectStyle || n.gridStyle)}`, i = this.styleKeyToIndex.get(o);
    if (i !== void 0)
      return i;
    const a = this.nextIndex++;
    return this.styles.set(a, Ie(re({}, n), { styleKey: o })), this.styleKeyToIndex.set(o, a), a;
  }
  /**
   * Get the index of a style by its styleKey (used during export)
   */
  getStyleIndex(n) {
    var o;
    return (o = this.styleKeyToIndex.get(n)) != null ? o : -1;
  }
  /**
   * Get a style by index
   */
  getStyleByIndex(n) {
    return this.styles.get(n);
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
    const n = {};
    for (const [i, a] of this.styles.entries()) {
      const o = a, { styleKey: s } = o, r = $t(o, ["styleKey"]);
      n[String(i)] = r;
    }
    return n;
  }
  /**
   * Get the full table with styleKey (for internal use)
   */
  getTable() {
    const n = {};
    for (const [o, i] of this.styles.entries())
      n[String(o)] = i;
    return n;
  }
  /**
   * Reconstruct StyleTable from serialized data
   */
  static fromTable(n) {
    const o = new pt();
    for (const [i, a] of Object.entries(n)) {
      const s = parseInt(i, 10), r = a.styleKey || `${a.type}:${a.name}:${JSON.stringify(a.textStyle || a.paintStyle || a.effectStyle || a.gridStyle)}`;
      o.styles.set(s, Ie(re({}, a), { styleKey: r })), o.styleKeyToIndex.set(r, s), s >= o.nextIndex && (o.nextIndex = s + 1);
    }
    return o;
  }
}
const qt = {
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
  PASS_THROUGH: 31,
  // Style types
  TEXT_STYLE: 32,
  PAINT_STYLE: 33,
  EFFECT_STYLE: 34,
  GRID_STYLE: 35
};
function Kn() {
  const e = {};
  for (const [n, o] of Object.entries(qt))
    e[o] = n;
  return e;
}
function Lt(e) {
  var n;
  return (n = qt[e]) != null ? n : e;
}
function Wn(e) {
  var n;
  return typeof e == "number" ? (n = Kn()[e]) != null ? n : e.toString() : e;
}
const Yt = {
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
  _styleRef: "_stlRef",
  // Style reference
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
  constraintVertical: "cnsVr",
  // Constraint vertical (5 chars)
  // Style-related keys
  textStyle: "txtSt",
  paintStyle: "pntSt",
  effectStyle: "effSt",
  gridStyle: "grdSt",
  styleKey: "stlKy"
}, Et = {};
for (const [e, n] of Object.entries(Yt))
  Et[n] = e;
class mt {
  constructor() {
    Oe(this, "shortToLong");
    Oe(this, "longToShort");
    this.shortToLong = re({}, Et), this.longToShort = re({}, Yt);
  }
  /**
   * Gets the short name for a long property name
   * Returns the short name if mapped, otherwise returns the original
   */
  getShortName(n) {
    return this.longToShort[n] || n;
  }
  /**
   * Gets the long name for a short property name
   * Returns the long name if mapped, otherwise returns the original
   */
  getLongName(n) {
    return this.shortToLong[n] || n;
  }
  /**
   * Recursively replaces all keys in an object with their short names
   * Handles nested objects and arrays
   * Collision detection: if a short name already exists as a key, keep the original key
   * Also compresses special values: node "type" field values and variable "type" field values
   */
  compressObject(n) {
    if (n == null)
      return n;
    if (Array.isArray(n))
      return n.map((o) => this.compressObject(o));
    if (typeof n == "object") {
      const o = {}, i = /* @__PURE__ */ new Set();
      for (const a of Object.keys(n))
        i.add(a);
      for (const [a, s] of Object.entries(n)) {
        const r = this.getShortName(a);
        if (r !== a && !i.has(r)) {
          let d = this.compressObject(s);
          r === "type" && typeof d == "string" && (d = Lt(d)), o[r] = d;
        } else {
          let d = this.compressObject(s);
          a === "type" && typeof d == "string" && (d = Lt(d)), o[a] = d;
        }
      }
      return o;
    }
    return n;
  }
  /**
   * Recursively replaces all keys in an object with their long names
   * Handles nested objects and arrays
   * Also expands special values: node "type" field values and variable "type" field values
   */
  expandObject(n) {
    if (n == null)
      return n;
    if (Array.isArray(n))
      return n.map((o) => this.expandObject(o));
    if (typeof n == "object") {
      const o = {};
      for (const [i, a] of Object.entries(n)) {
        const s = this.getLongName(i);
        let r = this.expandObject(a);
        (s === "type" || i === "type") && (typeof r == "number" || typeof r == "string") && (r = Wn(r)), o[s] = r;
      }
      return o;
    }
    return n;
  }
  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable() {
    return re({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(n) {
    const o = new mt();
    o.shortToLong = re(re({}, Et), n), o.longToShort = {};
    for (const [i, a] of Object.entries(
      o.shortToLong
    ))
      o.longToShort[a] = i;
    return o;
  }
}
class At extends Error {
  constructor(n) {
    super(n), this.name = "OperationCancelledError", Error.captureStackTrace && Error.captureStackTrace(this, At);
  }
}
const Pt = /* @__PURE__ */ new Set();
function Xn(e) {
  Pt.add(e);
}
function Ae(e) {
  if (e && Pt.has(e))
    throw new At(`Operation cancelled: ${e}`);
}
function Ft(e) {
  Pt.delete(e);
}
function qn(e, n) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const o = {};
  e.metadata && (o.metadata = e.metadata);
  for (const [i, a] of Object.entries(e))
    i !== "metadata" && (o[i] = n.compressObject(a));
  return o;
}
function Yn(e, n) {
  return n.expandObject(e);
}
function ct(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function ut(e) {
  let n = 1;
  return e.children && e.children.length > 0 && e.children.forEach((o) => {
    n += ut(o);
  }), n;
}
function Zt(e) {
  let n = 0;
  if ((e.cnsHr !== void 0 || e.cnsVr !== void 0) && (n = 1), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && n === 0 && (n = 1), e.children && Array.isArray(e.children))
    for (const o of e.children)
      o && typeof o == "object" && (n += Zt(o));
  return n;
}
async function ht(e, n = /* @__PURE__ */ new WeakSet(), o = {}) {
  var S, $, v, w, l, N, m;
  if (!e || typeof e != "object")
    return e;
  const i = (S = o.maxNodes) != null ? S : 1e4, a = ($ = o.nodeCount) != null ? $ : 0;
  if (a >= i)
    return t.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: a
    };
  const s = {
    visited: (v = o.visited) != null ? v : /* @__PURE__ */ new WeakSet(),
    depth: (w = o.depth) != null ? w : 0,
    maxDepth: (l = o.maxDepth) != null ? l : 100,
    nodeCount: a + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: o.variableTable,
    collectionTable: o.collectionTable,
    instanceTable: o.instanceTable,
    styleTable: o.styleTable,
    detachedComponentsHandled: (N = o.detachedComponentsHandled) != null ? N : /* @__PURE__ */ new Set(),
    exportedIds: (m = o.exportedIds) != null ? m : /* @__PURE__ */ new Map()
  };
  if (n.has(e))
    return "[Circular Reference]";
  n.add(e), s.visited = n;
  const r = {}, d = await Wt(e, s);
  if (Object.assign(r, d), r.id && s.exportedIds) {
    const c = s.exportedIds.get(r.id);
    if (c !== void 0) {
      const V = r.name || "Unnamed";
      if (c !== V) {
        const G = `Duplicate ID detected during export: ID "${r.id.substring(0, 8)}..." is used by both "${c}" and "${V}". Each node must have a unique ID.`;
        throw t.error(G), new Error(G);
      }
      t.warning(
        `Node "${V}" (ID: ${r.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      s.exportedIds.set(r.id, r.name || "Unnamed");
  }
  const g = e.type;
  if (g)
    switch (g) {
      case "FRAME":
      case "COMPONENT": {
        const c = await Nt(e);
        Object.assign(r, c);
        break;
      }
      case "INSTANCE": {
        const c = await Hn(
          e,
          s
        );
        Object.assign(r, c);
        const V = await Nt(
          e
        );
        Object.assign(r, V);
        break;
      }
      case "TEXT": {
        const c = await Fn(e, s);
        Object.assign(r, c);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const c = await _n(e);
        Object.assign(r, c);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const c = await zn(e);
        Object.assign(r, c);
        break;
      }
      default:
        s.unhandledKeys.add("_unknownType");
        break;
    }
  const y = Object.getOwnPropertyNames(e), u = /* @__PURE__ */ new Set([
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
  for (const c of y)
    typeof e[c] != "function" && (u.has(c) || s.unhandledKeys.add(c));
  if (s.unhandledKeys.size > 0 && (r._unhandledKeys = Array.from(s.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const c = s.maxDepth;
    if (s.depth >= c)
      r.children = {
        _truncated: !0,
        _reason: `Maximum depth (${c}) reached`,
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
      const V = Ie(re({}, s), {
        depth: s.depth + 1
      }), G = [];
      let F = !1;
      for (const E of e.children) {
        if (V.nodeCount >= i) {
          r.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: G.length,
            _total: e.children.length,
            children: G
          }, F = !0;
          break;
        }
        const U = await ht(E, n, V);
        G.push(U), V.nodeCount && (s.nodeCount = V.nodeCount);
      }
      F || (r.children = G);
    }
  }
  return r;
}
async function Qe(e, n = /* @__PURE__ */ new Set(), o = !1, i = /* @__PURE__ */ new Set(), a) {
  Ae(a), e.clearConsole !== !1 && !o ? (t.clear(), t.log("=== Starting Page Export ===")) : o || t.log("=== Starting Page Export ===");
  try {
    const r = e.pageIndex;
    if (r === void 0 || typeof r != "number")
      return t.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    Ae(a), t.log("Loading all pages..."), await figma.loadAllPagesAsync(), Ae(a);
    const d = figma.root.children;
    if (t.log(`Loaded ${d.length} page(s)`), r < 0 || r >= d.length)
      return t.error(
        `Invalid page index: ${r} (valid range: 0-${d.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const g = d[r], y = g.id;
    if (e.skipPrompts) {
      if (i.has(y))
        return t.log(
          `Page "${g.name}" already discovered, skipping discovery...`
        ), {
          type: "exportPage",
          success: !0,
          error: !1,
          message: "Page already discovered",
          data: {
            filename: "",
            pageData: {},
            pageName: g.name,
            additionalPages: [],
            discoveredReferencedPages: []
          }
        };
      i.add(y);
    } else {
      if (n.has(y))
        return t.log(
          `Page "${g.name}" has already been processed, skipping...`
        ), {
          type: "exportPage",
          success: !1,
          error: !0,
          message: "Page already processed",
          data: {}
        };
      n.add(y);
    }
    t.log(
      `Selected page: "${g.name}" (index: ${r})`
    ), t.log(
      "Initializing variable, collection, and instance tables..."
    );
    const u = new ft(), S = new gt(), $ = new it(), v = new pt();
    t.log("Extracting node data from page..."), t.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), t.log(
      "Collections will be discovered as variables are processed:"
    );
    const w = await ht(
      g,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: u,
        collectionTable: S,
        instanceTable: $,
        styleTable: v
      }
    );
    Ae(a), t.log("Node extraction finished");
    const l = ut(w), N = u.getSize(), m = S.getSize(), c = $.getSize(), V = Zt(w);
    t.log("Extraction complete:"), t.log(`  - Total nodes: ${l}`), t.log(`  - Unique variables: ${N}`), t.log(`  - Unique collections: ${m}`), t.log(`  - Unique instances: ${c}`), t.log(
      `  - Nodes with constraints exported: ${V}`
    );
    const G = $.getSerializedTable(), F = /* @__PURE__ */ new Map();
    for (const [x, H] of Object.entries(G))
      if (H.instanceType === "remote") {
        const z = parseInt(x, 10);
        F.set(z, H);
      }
    if (e.validateOnly) {
      t.log("=== Validation Mode ===");
      const x = await figma.variables.getLocalVariableCollectionsAsync(), H = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new Set();
      for (const le of x)
        H.add(le.id), z.add(le.name);
      z.add("Token"), z.add("Tokens"), z.add("Theme"), z.add("Themes");
      const D = [], fe = [];
      for (const le of F.values()) {
        const ce = le.componentName || "(unnamed)";
        D.push({
          componentName: ce,
          pageName: g.name
        }), fe.push({
          type: "externalReference",
          message: `External reference found: "${ce}" references a component from another file`,
          componentName: ce,
          pageName: g.name
        });
      }
      const se = [], ge = S.getTable();
      for (const le of Object.values(ge))
        le.isLocal ? H.has(le.collectionId) || (se.push({
          collectionName: le.collectionName,
          collectionId: le.collectionId,
          pageName: g.name
        }), fe.push({
          type: "unknownCollection",
          message: `Unknown local collection: "${le.collectionName}"`,
          collectionName: le.collectionName,
          pageName: g.name
        })) : z.has(le.collectionName) || (se.push({
          collectionName: le.collectionName,
          collectionId: le.collectionId,
          pageName: g.name
        }), fe.push({
          type: "unknownCollection",
          message: `Unknown remote collection: "${le.collectionName}". Remote collections must be named "Token", "Tokens", "Theme", or "Themes"`,
          collectionName: le.collectionName,
          pageName: g.name
        }));
      const pe = Object.values(ge).map(
        (le) => le.collectionName
      ), ue = {
        hasErrors: fe.length > 0,
        errors: fe,
        externalReferences: D,
        unknownCollections: se,
        discoveredCollections: pe
      };
      return t.log("Validation complete:"), t.log(`  - External references: ${D.length}`), t.log(`  - Unknown collections: ${se.length}`), t.log(`  - Has errors: ${ue.hasErrors}`), {
        type: "exportPage",
        success: !0,
        error: !1,
        message: "Validation complete",
        data: {
          filename: "",
          pageData: {},
          pageName: g.name,
          additionalPages: [],
          validationResult: ue
        }
      };
    }
    if (F.size > 0) {
      t.error(
        `Found ${F.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const x = (fe, se, ge = [], pe = !1) => {
        const ue = [];
        if (!fe || typeof fe != "object")
          return ue;
        if (pe || fe.type === "PAGE") {
          const he = fe.children || fe.child;
          if (Array.isArray(he))
            for (const Ce of he)
              Ce && typeof Ce == "object" && ue.push(
                ...x(
                  Ce,
                  se,
                  [],
                  !1
                )
              );
          return ue;
        }
        const le = fe.name || "";
        if (typeof fe._instanceRef == "number" && fe._instanceRef === se) {
          const he = le || "(unnamed)", Ce = ge.length > 0 ? [...ge, he] : [he];
          return ue.push({
            path: Ce,
            nodeName: he
          }), ue;
        }
        const ce = le ? [...ge, le] : ge, be = fe.children || fe.child;
        if (Array.isArray(be))
          for (const he of be)
            he && typeof he == "object" && ue.push(
              ...x(
                he,
                se,
                ce,
                !1
              )
            );
        return ue;
      }, H = [];
      let z = 1;
      for (const [fe, se] of F.entries()) {
        const ge = se.componentName || "(unnamed)", pe = se.componentSetName, ue = x(
          w,
          fe,
          [],
          !0
        );
        let le = "";
        ue.length > 0 ? le = `
   Location(s): ${ue.map((Ce) => {
          const Be = Ce.path.length > 0 ? Ce.path.join(" → ") : "page root";
          return `"${Ce.nodeName}" at ${Be}`;
        }).join(", ")}` : le = `
   Location: (unable to determine - instance may be deeply nested)`;
        const ce = pe ? `Component: "${ge}" (from component set "${pe}")` : `Component: "${ge}"`, be = se.remoteLibraryName ? `
   Library: ${se.remoteLibraryName}` : "";
        H.push(
          `${z}. ${ce}${be}${le}`
        ), z++;
      }
      const D = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${F.size} remote instance(s):
${H.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw t.error(D), new Error(D);
    }
    if (m > 0) {
      t.log("Collections found:");
      const x = S.getTable();
      for (const [H, z] of Object.values(x).entries()) {
        const D = z.collectionGuid ? ` (GUID: ${z.collectionGuid.substring(0, 8)}...)` : "";
        t.log(
          `  ${H}: ${z.collectionName}${D} - ${z.modes.length} mode(s)`
        );
      }
    }
    let E;
    if (e.skipPrompts) {
      t.log("Running validation on main page...");
      try {
        Ae(a);
        const x = await Qe(
          {
            pageIndex: r,
            validateOnly: !0
          },
          n,
          !0,
          // Mark as recursive call
          i,
          a
          // Pass requestId for cancellation
        );
        if (x.success && x.data) {
          const H = x.data;
          H.validationResult && (E = H.validationResult, t.log(
            `Main page validation: ${E.hasErrors ? "FAILED" : "PASSED"}`
          ), E.hasErrors && t.warning(
            `Found ${E.errors.length} validation error(s) in main page`
          ));
        }
      } catch (x) {
        t.warning(
          `Could not validate main page: ${x instanceof Error ? x.message : String(x)}`
        );
      }
    }
    t.log("Checking for referenced component pages...");
    const U = [], L = [], R = Object.values(G).filter(
      (x) => x.instanceType === "normal"
    );
    if (R.length > 0) {
      t.log(
        `Found ${R.length} normal instance(s) to check`
      );
      const x = /* @__PURE__ */ new Map();
      for (const H of R)
        if (H.componentPageName) {
          const z = d.find((D) => D.name === H.componentPageName);
          if (z && !n.has(z.id))
            x.has(z.id) || x.set(z.id, z);
          else if (!z) {
            const D = `Normal instance references component "${H.componentName || "(unnamed)"}" on page "${H.componentPageName}", but that page was not found. Cannot export.`;
            throw t.error(D), new Error(D);
          }
        } else {
          const z = `Normal instance references component "${H.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw t.error(z), new Error(z);
        }
      t.log(
        `Found ${x.size} unique referenced page(s)`
      );
      for (const [H, z] of x.entries()) {
        Ae(a);
        const D = z.name;
        if (n.has(H)) {
          t.log(`Skipping "${D}" - already processed`);
          continue;
        }
        const fe = z.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let se = !1, ge = 0;
        if (fe)
          try {
            const ce = JSON.parse(fe);
            se = !!(ce.id && ce.version !== void 0), ge = ce.version || 0;
          } catch (ce) {
          }
        const pe = d.findIndex(
          (ce) => ce.id === z.id
        );
        if (pe === -1)
          throw t.error(`Could not find page index for "${D}"`), new Error(`Could not find page index for "${D}"`);
        const ue = Array.from(R).find(
          (ce) => ce.componentPageName === D
        ), le = ue == null ? void 0 : ue.componentName;
        if (e.skipPrompts) {
          H === y ? t.log(
            `Skipping "${D}" - this is the original page being published`
          ) : L.find(
            (be) => be.pageId === H
          ) || (L.push({
            pageId: H,
            pageName: D,
            pageIndex: pe,
            hasMetadata: se,
            componentName: le,
            localVersion: ge
          }), t.log(
            `Discovered referenced page: "${D}" (local version: ${ge}) (will be handled by wizard)`
          )), t.log(
            `Validating "${D}" for external references and unknown collections...`
          );
          try {
            Ae(a);
            const ce = await Qe(
              {
                pageIndex: pe,
                validateOnly: !0
                // Run validation only
              },
              n,
              !0,
              // Mark as recursive call
              i,
              a
              // Pass requestId for cancellation
            );
            if (ce.success && ce.data) {
              const be = ce.data;
              if (be.validationResult) {
                E || (E = {
                  hasErrors: !1,
                  errors: [],
                  externalReferences: [],
                  unknownCollections: [],
                  discoveredCollections: []
                }), E.errors.push(
                  ...be.validationResult.errors
                ), E.externalReferences.push(
                  ...be.validationResult.externalReferences
                ), E.unknownCollections.push(
                  ...be.validationResult.unknownCollections
                );
                for (const he of be.validationResult.discoveredCollections)
                  E.discoveredCollections.includes(
                    he
                  ) || E.discoveredCollections.push(
                    he
                  );
                E.hasErrors = E.errors.length > 0, t.log(
                  `  Validation for "${D}": ${be.validationResult.hasErrors ? "FAILED" : "PASSED"}`
                ), be.validationResult.hasErrors && t.warning(
                  `  Found ${be.validationResult.errors.length} validation error(s) in "${D}"`
                );
              }
            }
          } catch (ce) {
            t.warning(
              `Could not validate "${D}": ${ce instanceof Error ? ce.message : String(ce)}`
            );
          }
          t.log(
            `Checking dependencies of "${D}" for transitive dependencies...`
          );
          try {
            Ae(a);
            const ce = await Qe(
              {
                pageIndex: pe,
                skipPrompts: !0
                // Keep skipPrompts true to just discover, not export
              },
              n,
              // Pass the same set (won't be used during discovery)
              !0,
              // Mark as recursive call
              i,
              // Pass the same discoveredPages set to avoid infinite loops
              a
              // Pass requestId for cancellation
            );
            if (ce.success && ce.data) {
              const be = ce.data;
              if (be.discoveredReferencedPages)
                for (const he of be.discoveredReferencedPages) {
                  if (he.pageId === y) {
                    t.log(
                      `  Skipping "${he.pageName}" - this is the original page being published`
                    );
                    continue;
                  }
                  L.find(
                    (Be) => Be.pageId === he.pageId
                  ) || (L.push(he), t.log(
                    `  Discovered transitive dependency: "${he.pageName}" (from ${D})`
                  ));
                }
            }
          } catch (ce) {
            t.warning(
              `Could not discover dependencies of "${D}": ${ce instanceof Error ? ce.message : String(ce)}`
            );
          }
        } else {
          const ce = `Do you want to also publish referenced component "${D}"?`;
          try {
            await nt.prompt(ce, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 3e5
              // 5 minutes
            }), t.log(`Exporting referenced page: "${D}"`);
            const be = d.findIndex(
              (Ce) => Ce.id === z.id
            );
            if (be === -1)
              throw t.error(`Could not find page index for "${D}"`), new Error(`Could not find page index for "${D}"`);
            Ae(a);
            const he = await Qe(
              {
                pageIndex: be
              },
              n,
              // Pass the same set to track all processed pages
              !0,
              // Mark as recursive call
              i,
              // Pass discovered pages set (empty during actual export)
              a
              // Pass requestId for cancellation
            );
            if (he.success && he.data) {
              const Ce = he.data;
              U.push(Ce), t.log(
                `Successfully exported referenced page: "${D}"`
              );
            } else
              throw new Error(
                `Failed to export referenced page "${D}": ${he.message}`
              );
          } catch (be) {
            if (be instanceof Error && be.message === "User cancelled")
              if (se)
                t.log(
                  `User declined to publish "${D}", but page has existing metadata. Continuing with existing metadata.`
                );
              else
                throw t.error(
                  `Export cancelled: Referenced page "${D}" has no metadata and user declined to publish it.`
                ), new Error(
                  `Cannot continue export: Referenced component "${D}" has no metadata. Please publish it first or choose to publish it now.`
                );
            else
              throw be;
          }
        }
      }
    }
    t.log("Creating string table...");
    const p = new mt();
    t.log("Getting page metadata...");
    const f = g.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let b = "", I = 0, O, k;
    if (f)
      try {
        const x = JSON.parse(f);
        b = x.id || "", I = x.version || 0, O = x.description, k = x.url;
      } catch (x) {
        t.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!b) {
      t.log("Generating new GUID for page..."), b = await wt();
      const x = {
        _ver: 1,
        id: b,
        name: g.name,
        version: I,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      g.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(x)
      );
    }
    t.log("Creating export data structure...");
    const Y = {
      metadata: re(re({
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: b,
        version: I,
        name: g.name,
        pluginVersion: "1.0.0"
      }, O !== void 0 && { description: O }), k !== void 0 && { url: k }),
      stringTable: p.getSerializedTable(),
      collections: S.getSerializedTable(),
      variables: u.getSerializedTable(),
      instances: $.getSerializedTable(),
      styles: v.getSerializedTable(),
      pageData: w
    };
    t.log("Compressing JSON data...");
    const ie = qn(Y, p);
    t.log("Serializing to JSON...");
    const Z = JSON.stringify(ie, null, 2), j = (Z.length / 1024).toFixed(2), te = ct(g.name).trim().replace(/\s+/g, "_") + ".figma.json";
    t.log(`JSON serialization complete: ${j} KB`), t.log(`Export file: ${te}`), t.log("=== Export Complete ===");
    const W = JSON.parse(Z), oe = {
      filename: te,
      pageData: W,
      pageName: g.name,
      additionalPages: U,
      // Populated with referenced component pages
      discoveredReferencedPages: L.length > 0 ? (
        // Filter out the original page - it shouldn't be in the discovered list since it's the one being published
        L.filter((x) => x.pageId !== y)
      ) : void 0,
      // Only include if there are discovered pages
      validationResult: E
      // Include aggregated validation results if in discovery mode
    }, ae = t.getLogs();
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: re(re({}, oe), ae.length > 0 && { debugLogs: ae })
    };
  } catch (r) {
    const d = r instanceof Error ? r.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", r), console.error("Error message:", d), t.error(`Export failed: ${d}`), r instanceof Error && r.stack && (console.error("Stack trace:", r.stack), t.error(`Stack trace: ${r.stack}`));
    const g = t.getLogs(), y = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: d,
      data: re({}, g.length > 0 && { debugLogs: g })
    };
    return console.error("Returning error response:", y), y;
  }
}
const Zn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: ut,
  exportPage: Qe,
  extractNodeData: ht
}, Symbol.toStringTag, { value: "Module" }));
function ve(e) {
  return e.replace(/[^a-zA-Z0-9]/g, "");
}
function Qt(e) {
  const i = e, { logs: n } = i;
  return $t(i, ["logs"]);
}
const en = /* @__PURE__ */ new Map();
async function Xe(e, n) {
  if (n.length === 0)
    return;
  const o = e.modes.find(
    (i) => i.name === "Mode 1" || i.name === "Default"
  );
  if (o && !n.includes(o.name)) {
    const i = n[0];
    try {
      const a = o.name;
      e.renameMode(o.modeId, i), en.set(`${e.id}:${a}`, i), t.log(
        `  Renamed default mode "${a}" to "${i}"`
      );
    } catch (a) {
      t.warning(
        `  Failed to rename default mode "${o.name}" to "${i}": ${a}`
      );
    }
  }
  for (const i of n)
    e.modes.find((s) => s.name === i) || e.addMode(i);
}
const Ue = "recursica:collectionId";
async function lt(e) {
  if (e.remote === !0) {
    const o = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(o)) {
      const a = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw t.error(a), new Error(a);
    }
    return e.id;
  } else {
    const o = e.getSharedPluginData(
      "recursica",
      Ue
    );
    if (o && o.trim() !== "")
      return o;
    const i = await wt();
    return e.setSharedPluginData("recursica", Ue, i), i;
  }
}
function Qn(e, n) {
  const o = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(o))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function eo(e) {
  let n;
  const o = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], a = e.isLocal;
  if (a === !1 || a === void 0 && i.includes(o))
    try {
      const d = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((g) => g.name.trim().toLowerCase() === o);
      if (d) {
        Qn(e.collectionName, !1);
        const g = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          d.key
        );
        if (g.length > 0) {
          const y = await figma.variables.importVariableByKeyAsync(g[0].key), u = await figma.variables.getVariableCollectionByIdAsync(
            y.variableCollectionId
          );
          if (u) {
            if (n = u, e.collectionGuid) {
              const S = n.getSharedPluginData(
                "recursica",
                Ue
              );
              (!S || S.trim() === "") && n.setSharedPluginData(
                "recursica",
                Ue,
                e.collectionGuid
              );
            } else
              await lt(n);
            return await Xe(n, e.modes), { collection: n };
          }
        }
      }
    } catch (r) {
      if (a === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", r);
    }
  if (a !== !1) {
    const r = await figma.variables.getLocalVariableCollectionsAsync();
    let d;
    if (e.collectionGuid && (d = r.find((g) => g.getSharedPluginData("recursica", Ue) === e.collectionGuid)), d || (d = r.find(
      (g) => g.name === e.collectionName
    )), d)
      if (n = d, e.collectionGuid) {
        const g = n.getSharedPluginData(
          "recursica",
          Ue
        );
        (!g || g.trim() === "") && n.setSharedPluginData(
          "recursica",
          Ue,
          e.collectionGuid
        );
      } else
        await lt(n);
    else
      n = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? n.setSharedPluginData(
        "recursica",
        Ue,
        e.collectionGuid
      ) : await lt(n);
  } else {
    const r = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), d = e.collectionName.trim().toLowerCase(), g = r.find(($) => $.name.trim().toLowerCase() === d);
    if (!g)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const y = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      g.key
    );
    if (y.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const u = await figma.variables.importVariableByKeyAsync(
      y[0].key
    ), S = await figma.variables.getVariableCollectionByIdAsync(
      u.variableCollectionId
    );
    if (!S)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (n = S, e.collectionGuid) {
      const $ = n.getSharedPluginData(
        "recursica",
        Ue
      );
      (!$ || $.trim() === "") && n.setSharedPluginData(
        "recursica",
        Ue,
        e.collectionGuid
      );
    } else
      lt(n);
  }
  return await Xe(n, e.modes), { collection: n };
}
async function Tt(e, n) {
  for (const o of e.variableIds)
    try {
      const i = await figma.variables.getVariableByIdAsync(o);
      if (i && i.name === n)
        return i;
    } catch (i) {
      continue;
    }
  return null;
}
async function to(e, n, o, i, a) {
  t.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), t.log(
    `  valuesByMode keys: ${Object.keys(n).join(", ")}`
  );
  for (const [s, r] of Object.entries(n)) {
    const d = en.get(`${i.id}:${s}`) || s;
    let g = i.modes.find((u) => u.name === d);
    if (g || (g = i.modes.find((u) => u.name === s)), !g) {
      t.warning(
        `Mode "${s}" (mapped: "${d}") not found in collection "${i.name}" for variable "${e.name}". Available modes: ${i.modes.map((u) => u.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const y = g.modeId;
    try {
      if (r == null) {
        t.log(
          `  Mode "${s}": value is null/undefined, skipping`
        );
        continue;
      }
      if (t.log(
        `  Mode "${s}": value type=${typeof r}, value=${JSON.stringify(r)}`
      ), typeof r == "string" || typeof r == "number" || typeof r == "boolean") {
        e.setValueForMode(y, r);
        continue;
      }
      if (typeof r == "object" && r !== null && "r" in r && "g" in r && "b" in r && typeof r.r == "number" && typeof r.g == "number" && typeof r.b == "number") {
        const u = r, S = {
          r: u.r,
          g: u.g,
          b: u.b
        };
        u.a !== void 0 && (S.a = u.a), e.setValueForMode(y, S);
        const $ = e.valuesByMode[y];
        if (t.log(
          `  Set color value for "${e.name}" mode "${s}": r=${S.r.toFixed(3)}, g=${S.g.toFixed(3)}, b=${S.b.toFixed(3)}${S.a !== void 0 ? `, a=${S.a.toFixed(3)}` : ""}`
        ), t.log(`  Read back value: ${JSON.stringify($)}`), typeof $ == "object" && $ !== null && "r" in $ && "g" in $ && "b" in $) {
          const v = $, w = Math.abs(v.r - S.r) < 1e-3, l = Math.abs(v.g - S.g) < 1e-3, N = Math.abs(v.b - S.b) < 1e-3;
          !w || !l || !N ? t.warning(
            `  ⚠️ Value mismatch! Set: r=${S.r}, g=${S.g}, b=${S.b}, Read back: r=${v.r}, g=${v.g}, b=${v.b}`
          ) : t.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          t.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify($)}`
          );
        continue;
      }
      if (typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number") {
        const u = r;
        let S = null;
        const $ = o.getVariableByIndex(
          u._varRef
        );
        if ($) {
          let v = null;
          if (a && $._colRef !== void 0) {
            const w = a.getCollectionByIndex(
              $._colRef
            );
            w && (v = (await eo(w)).collection);
          }
          v && (S = await Tt(
            v,
            $.variableName
          ));
        }
        if (S) {
          const v = {
            type: "VARIABLE_ALIAS",
            id: S.id
          };
          e.setValueForMode(y, v);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${s}" in variable "${e.name}". Variable reference index: ${u._varRef}`
          );
      }
    } catch (u) {
      typeof r == "object" && r !== null && !("_varRef" in r) && !("r" in r && "g" in r && "b" in r) && t.warning(
        `Unhandled value type for mode "${s}" in variable "${e.name}": ${JSON.stringify(r)}`
      ), console.warn(
        `Error setting value for mode "${s}" in variable "${e.name}":`,
        u
      );
    }
  }
}
async function It(e, n, o, i) {
  if (t.log(
    `Creating variable "${e.variableName}" (type: ${e.variableType})`
  ), e.valuesByMode) {
    t.log(
      `  valuesByMode has ${Object.keys(e.valuesByMode).length} mode(s): ${Object.keys(e.valuesByMode).join(", ")}`
    );
    for (const [s, r] of Object.entries(e.valuesByMode))
      t.log(
        `  Mode "${s}": ${JSON.stringify(r)} (type: ${typeof r})`
      );
  } else
    t.log(
      `  No valuesByMode found for variable "${e.variableName}"`
    );
  const a = figma.variables.createVariable(
    e.variableName,
    n,
    e.variableType
  );
  if (e.valuesByMode && await to(
    a,
    e.valuesByMode,
    o,
    n,
    // Pass collection to look up modes by name
    i
  ), e.valuesByMode && a.valuesByMode) {
    t.log(`  Verifying values for "${e.variableName}":`);
    for (const [s, r] of Object.entries(
      e.valuesByMode
    )) {
      const d = n.modes.find((g) => g.name === s);
      if (d) {
        const g = a.valuesByMode[d.modeId];
        t.log(
          `    Mode "${s}": expected=${JSON.stringify(r)}, actual=${JSON.stringify(g)}`
        );
      }
    }
  }
  return a;
}
async function no(e, n, o, i) {
  const a = n.getVariableByIndex(e);
  if (!a || a._colRef === void 0)
    return null;
  const s = i.get(String(a._colRef));
  if (!s)
    return null;
  const r = await Tt(
    s,
    a.variableName
  );
  if (r) {
    let d;
    if (typeof a.variableType == "number" ? d = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[a.variableType] || String(a.variableType) : d = a.variableType, on(r, d))
      return r;
  }
  return await It(
    a,
    s,
    n,
    o
  );
}
async function tn(e, n, o, i) {
  if (!(!n || typeof n != "object"))
    try {
      const a = e[o];
      if (!a || !Array.isArray(a))
        return;
      const s = n[o];
      if (Array.isArray(s))
        for (let r = 0; r < s.length && r < a.length; r++) {
          const d = s[r];
          if (d && typeof d == "object") {
            if (a[r].boundVariables || (a[r].boundVariables = {}), Je(d)) {
              const g = d._varRef;
              if (g !== void 0) {
                const y = i.get(String(g));
                y && (a[r].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: y.id
                });
              }
            } else
              for (const [g, y] of Object.entries(
                d
              ))
                if (Je(y)) {
                  const u = y._varRef;
                  if (u !== void 0) {
                    const S = i.get(String(u));
                    S && (a[r].boundVariables[g] = {
                      type: "VARIABLE_ALIAS",
                      id: S.id
                    });
                  }
                }
          }
        }
    } catch (a) {
      console.log(`Error restoring bound variables for ${o}:`, a);
    }
}
function nn(e) {
  if (!e || typeof e != "object")
    return !1;
  if (e._styleRef !== void 0 || e._fillStyleRef !== void 0 || e._effectStyleRef !== void 0 || e._gridStyleRef !== void 0)
    return !0;
  if (Array.isArray(e.fills)) {
    for (const n of e.fills)
      if (n && typeof n == "object" && n._styleRef !== void 0)
        return !0;
  }
  if (Array.isArray(e.backgrounds)) {
    for (const n of e.backgrounds)
      if (n && typeof n == "object" && n._styleRef !== void 0)
        return !0;
  }
  if (Array.isArray(e.children)) {
    for (const n of e.children)
      if (nn(n))
        return !0;
  }
  return !1;
}
async function oo(e, n) {
  const o = /* @__PURE__ */ new Map(), i = [];
  t.log(`Importing ${Object.keys(e).length} styles...`);
  const a = Object.entries(e).sort(
    (s, r) => parseInt(s[0], 10) - parseInt(r[0], 10)
  );
  for (const [s, r] of a) {
    const d = parseInt(s, 10), g = r.name || "Unnamed Style", y = r.type;
    let u = null;
    switch (y) {
      case "TEXT":
        u = (await figma.getLocalTextStylesAsync()).find(
          ($) => $.name === g
        ) || null;
        break;
      case "PAINT":
        u = (await figma.getLocalPaintStylesAsync()).find(
          ($) => $.name === g
        ) || null;
        break;
      case "EFFECT":
        u = (await figma.getLocalEffectStylesAsync()).find(
          ($) => $.name === g
        ) || null;
        break;
      case "GRID":
        u = (await figma.getLocalGridStylesAsync()).find(
          ($) => $.name === g
        ) || null;
        break;
    }
    if (u) {
      t.log(
        `  Skipping creation of style "${g}" (type: ${y}) as it already exists. Reusing existing style.`
      ), o.set(d, u);
      continue;
    }
    let S = null;
    try {
      switch (y) {
        case "TEXT":
          S = await io(r, n);
          break;
        case "PAINT":
          S = await ro(r, n);
          break;
        case "EFFECT":
          S = await ao(r, n);
          break;
        case "GRID":
          S = await so(r, n);
          break;
        default:
          t.warning(
            `  Unknown style type "${y}" for style "${g}". Skipping.`
          );
          break;
      }
      S && (o.set(d, S), i.push(S), t.log(
        `  ✓ Created style "${g}" (type: ${y})`
      ));
    } catch ($) {
      t.warning(
        `  Failed to create style "${g}" (type: ${y}): ${$}`
      );
    }
  }
  return { styleMapping: o, newlyCreatedStyles: i };
}
async function io(e, n) {
  var i, a, s, r, d, g, y, u;
  const o = figma.createTextStyle();
  if (o.name = e.name, e.textStyle && (e.textStyle.fontName !== void 0 && !((i = e.textStyle.boundVariables) != null && i.fontName) && (await figma.loadFontAsync(e.textStyle.fontName), o.fontName = e.textStyle.fontName), e.textStyle.fontSize !== void 0 && !((a = e.textStyle.boundVariables) != null && a.fontSize) && (o.fontSize = e.textStyle.fontSize), e.textStyle.letterSpacing !== void 0 && !((s = e.textStyle.boundVariables) != null && s.letterSpacing) && (o.letterSpacing = e.textStyle.letterSpacing), e.textStyle.lineHeight !== void 0 && !((r = e.textStyle.boundVariables) != null && r.lineHeight) && (o.lineHeight = e.textStyle.lineHeight), e.textStyle.textCase !== void 0 && !((d = e.textStyle.boundVariables) != null && d.textCase) && (o.textCase = e.textStyle.textCase), e.textStyle.textDecoration !== void 0 && !((g = e.textStyle.boundVariables) != null && g.textDecoration) && (o.textDecoration = e.textStyle.textDecoration), e.textStyle.paragraphSpacing !== void 0 && !((y = e.textStyle.boundVariables) != null && y.paragraphSpacing) && (o.paragraphSpacing = e.textStyle.paragraphSpacing), e.textStyle.paragraphIndent !== void 0 && !((u = e.textStyle.boundVariables) != null && u.paragraphIndent) && (o.paragraphIndent = e.textStyle.paragraphIndent), e.textStyle.boundVariables))
    for (const [S, $] of Object.entries(
      e.textStyle.boundVariables
    )) {
      let v;
      if (typeof $ == "object" && $ !== null && "_varRef" in $) {
        const w = $._varRef;
        v = n.get(String(w));
      } else {
        const w = typeof $ == "string" ? $ : String($);
        v = n.get(w);
      }
      if (v)
        try {
          o.setBoundVariable(S, v);
        } catch (w) {
          t.warning(
            `Could not bind variable to text style property "${S}": ${w}`
          );
        }
    }
  return o;
}
async function ro(e, n) {
  const o = figma.createPaintStyle();
  return o.name = e.name, e.paintStyle && e.paintStyle.paints && (o.paints = e.paintStyle.paints), o;
}
async function ao(e, n) {
  const o = figma.createEffectStyle();
  return o.name = e.name, e.effectStyle && e.effectStyle.effects && (o.effects = e.effectStyle.effects), o;
}
async function so(e, n) {
  const o = figma.createGridStyle();
  return o.name = e.name, e.gridStyle && e.gridStyle.layoutGrids && (o.layoutGrids = e.gridStyle.layoutGrids), o;
}
function lo(e, n, o = !1) {
  const i = En(n);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), n === "FRAME" || n === "COMPONENT" || n === "INSTANCE") {
    const a = Te;
    e.layoutMode === void 0 && (e.layoutMode = a.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = a.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = a.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = a.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = a.counterAxisAlignItems), o || (e.paddingLeft === void 0 && (e.paddingLeft = a.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = a.paddingRight), e.paddingTop === void 0 && (e.paddingTop = a.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = a.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = a.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = a.counterAxisSpacing));
  }
  if (n === "TEXT") {
    const a = ke;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = a.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = a.textAlignVertical), e.textCase === void 0 && (e.textCase = a.textCase), e.textDecoration === void 0 && (e.textDecoration = a.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = a.textAutoResize);
  }
}
async function qe(e, n, o = null, i = null, a = null, s = null, r = null, d = !1, g = null, y = null, u = null, S = null, $ = null, v, w = null) {
  var p, f, b, I, O, k, Y, ie, Z, j, ee, te, W, oe, ae, X, x, H, z, D, fe, se, ge, pe, ue, le, ce, be, he, Ce, Be, De, T, me, Q;
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
        l = r.get(e.id), t.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (l = figma.createComponent(), t.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const C = e.componentPropertyDefinitions;
        let P = 0, h = 0;
        for (const [A, B] of Object.entries(C))
          try {
            const _ = B.type;
            let M = null;
            if (typeof _ == "string" ? (_ === "TEXT" || _ === "BOOLEAN" || _ === "INSTANCE_SWAP" || _ === "VARIANT") && (M = _) : typeof _ == "number" && (M = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[_] || null), !M) {
              t.warning(
                `  Unknown property type ${_} (${typeof _}) for property "${A}" in component "${e.name || "Unnamed"}"`
              ), h++;
              continue;
            }
            const J = B.defaultValue, q = A.split("#")[0];
            l.addComponentProperty(
              q,
              M,
              J
            ), P++;
          } catch (_) {
            t.warning(
              `  Failed to add component property "${A}" to "${e.name || "Unnamed"}": ${_}`
            ), h++;
          }
        P > 0 && t.log(
          `  Added ${P} component property definition(s) to "${e.name || "Unnamed"}"${h > 0 ? ` (${h} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const C = e.children ? e.children.filter((A) => A.type === "COMPONENT").length : 0;
      t.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${C} component variant(s)`
      );
      const P = [];
      let h = null;
      if (e.children && Array.isArray(e.children)) {
        h = figma.createFrame(), h.name = `_temp_${e.name || "COMPONENT_SET"}`, h.visible = !1, ((n == null ? void 0 : n.type) === "PAGE" ? n : figma.currentPage).appendChild(h);
        for (const B of e.children)
          if (B.type === "COMPONENT" && !B._truncated)
            try {
              const _ = await qe(
                B,
                h,
                // Use temp parent for now
                o,
                i,
                a,
                s,
                r,
                d,
                g,
                y,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                S,
                $,
                // Pass placeholderFrameIds through for component set creation
                void 0,
                // currentPlaceholderId - component set creation is not inside a placeholder
                w
                // Pass styleMapping to apply styles
              );
              _ && _.type === "COMPONENT" && (P.push(_), t.log(
                `  Created component variant: "${_.name || "Unnamed"}"`
              ));
            } catch (_) {
              t.warning(
                `  Failed to create component variant "${B.name || "Unnamed"}": ${_}`
              );
            }
      }
      if (P.length > 0)
        try {
          const A = n || figma.currentPage, B = figma.combineAsVariants(
            P,
            A
          );
          e.name && (B.name = e.name), e.x !== void 0 && (B.x = e.x), e.y !== void 0 && (B.y = e.y), h && h.parent && h.remove(), t.log(
            `  ✓ Successfully created COMPONENT_SET "${B.name}" with ${P.length} variant(s)`
          ), l = B;
        } catch (A) {
          if (t.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${A}. Falling back to frame.`
          ), l = figma.createFrame(), e.name && (l.name = e.name), h && h.children.length > 0) {
            for (const B of h.children)
              l.appendChild(B);
            h.remove();
          }
        }
      else
        t.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), l = figma.createFrame(), e.name && (l.name = e.name), h && h.remove();
      break;
    }
    case "INSTANCE":
      if (d)
        l = figma.createFrame(), e.name && (l.name = e.name);
      else if (e._instanceRef !== void 0 && a && r) {
        const C = a.getInstanceByIndex(
          e._instanceRef
        );
        if (C && C.instanceType === "internal")
          if (C.componentNodeId)
            if (C.componentNodeId === e.id)
              t.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), l = figma.createFrame(), e.name && (l.name = e.name);
            else {
              const P = r.get(
                C.componentNodeId
              );
              if (!P) {
                const h = Array.from(r.keys()).slice(
                  0,
                  20
                );
                t.error(
                  `Component not found for internal instance "${e.name}" (ID: ${C.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), t.error(
                  `Looking for component ID: ${C.componentNodeId}`
                ), t.error(
                  `Available IDs in mapping (first 20): ${h.map((J) => J.substring(0, 8) + "...").join(", ")}`
                );
                const A = (J, q) => {
                  if (J.type === "COMPONENT" && J.id === q)
                    return !0;
                  if (J.children && Array.isArray(J.children)) {
                    for (const K of J.children)
                      if (!K._truncated && A(K, q))
                        return !0;
                  }
                  return !1;
                }, B = A(
                  e,
                  C.componentNodeId
                );
                t.error(
                  `Component ID ${C.componentNodeId.substring(0, 8)}... exists in current node tree: ${B}`
                ), t.error(
                  `WARNING: Component ID ${C.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), t.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), t.error(
                  "  2. The component wasn't collected in the first pass"
                ), t.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const _ = h.filter(
                  (J) => J.startsWith(C.componentNodeId.substring(0, 8))
                );
                _.length > 0 && t.error(
                  `Found IDs with matching prefix: ${_.map((J) => J.substring(0, 8) + "...").join(", ")}`
                );
                const M = `Component not found for internal instance "${e.name}" (ID: ${C.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${h.map((J) => J.substring(0, 8) + "...").join(", ")}`;
                throw new Error(M);
              }
              if (P && P.type === "COMPONENT") {
                if (l = P.createInstance(), t.log(
                  `✓ Created internal instance "${e.name}" from component "${C.componentName}"`
                ), C.variantProperties && Object.keys(C.variantProperties).length > 0)
                  try {
                    let h = null;
                    if (P.parent && P.parent.type === "COMPONENT_SET")
                      h = P.parent.componentPropertyDefinitions, t.log(
                        `  DEBUG: Component "${C.componentName}" is inside component set "${P.parent.name}" with ${Object.keys(h || {}).length} property definitions`
                      );
                    else {
                      const A = await l.getMainComponentAsync();
                      if (A) {
                        const B = A.type;
                        t.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${P.parent ? P.parent.type : "N/A"}, mainComponent type: ${B}, mainComponent parent: ${A.parent ? A.parent.type : "N/A"}`
                        ), B === "COMPONENT_SET" ? h = A.componentPropertyDefinitions : B === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? (h = A.parent.componentPropertyDefinitions, t.log(
                          `  DEBUG: Found component set parent "${A.parent.name}" with ${Object.keys(h || {}).length} property definitions`
                        )) : t.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${C.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (h) {
                      const A = {};
                      for (const [B, _] of Object.entries(
                        C.variantProperties
                      )) {
                        const M = B.split("#")[0];
                        h[M] && (A[M] = _);
                      }
                      Object.keys(A).length > 0 && l.setProperties(A);
                    }
                  } catch (h) {
                    const A = `Failed to set variant properties for instance "${e.name}": ${h}`;
                    throw t.error(A), new Error(A);
                  }
                if (C.componentProperties && Object.keys(C.componentProperties).length > 0)
                  try {
                    const h = await l.getMainComponentAsync();
                    if (h) {
                      let A = null;
                      const B = h.type;
                      if (B === "COMPONENT_SET" ? A = h.componentPropertyDefinitions : B === "COMPONENT" && h.parent && h.parent.type === "COMPONENT_SET" ? A = h.parent.componentPropertyDefinitions : B === "COMPONENT" && (A = h.componentPropertyDefinitions), A)
                        for (const [_, M] of Object.entries(
                          C.componentProperties
                        )) {
                          const J = _.split("#")[0];
                          if (A[J])
                            try {
                              let q = M;
                              M && typeof M == "object" && "value" in M && (q = M.value), l.setProperties({
                                [J]: q
                              });
                            } catch (q) {
                              const K = `Failed to set component property "${J}" for internal instance "${e.name}": ${q}`;
                              throw t.error(K), new Error(K);
                            }
                        }
                    } else
                      t.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (h) {
                    if (h instanceof Error)
                      throw h;
                    const A = `Failed to set component properties for instance "${e.name}": ${h}`;
                    throw t.error(A), new Error(A);
                  }
              } else if (!l && P) {
                const h = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${C.componentNodeId.substring(0, 8)}...).`;
                throw t.error(h), new Error(h);
              }
            }
          else {
            const P = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw t.error(P), new Error(P);
          }
        else if (C && C.instanceType === "remote")
          if (g) {
            const P = g.get(
              e._instanceRef
            );
            if (P) {
              if (l = P.createInstance(), t.log(
                `✓ Created remote instance "${e.name}" from component "${C.componentName}" on REMOTES page`
              ), C.variantProperties && Object.keys(C.variantProperties).length > 0)
                try {
                  const h = await l.getMainComponentAsync();
                  if (h) {
                    let A = null;
                    const B = h.type;
                    if (B === "COMPONENT_SET" ? A = h.componentPropertyDefinitions : B === "COMPONENT" && h.parent && h.parent.type === "COMPONENT_SET" ? A = h.parent.componentPropertyDefinitions : t.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), A) {
                      const _ = {};
                      for (const [M, J] of Object.entries(
                        C.variantProperties
                      )) {
                        const q = M.split("#")[0];
                        A[q] && (_[q] = J);
                      }
                      Object.keys(_).length > 0 && l.setProperties(_);
                    }
                  } else
                    t.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (h) {
                  const A = `Failed to set variant properties for remote instance "${e.name}": ${h}`;
                  throw t.error(A), new Error(A);
                }
              if (C.componentProperties && Object.keys(C.componentProperties).length > 0)
                try {
                  const h = await l.getMainComponentAsync();
                  if (h) {
                    let A = null;
                    const B = h.type;
                    if (B === "COMPONENT_SET" ? A = h.componentPropertyDefinitions : B === "COMPONENT" && h.parent && h.parent.type === "COMPONENT_SET" ? A = h.parent.componentPropertyDefinitions : B === "COMPONENT" && (A = h.componentPropertyDefinitions), A)
                      for (const [_, M] of Object.entries(
                        C.componentProperties
                      )) {
                        const J = _.split("#")[0];
                        if (A[J])
                          try {
                            let q = M;
                            M && typeof M == "object" && "value" in M && (q = M.value), l.setProperties({
                              [J]: q
                            });
                          } catch (q) {
                            const K = `Failed to set component property "${J}" for remote instance "${e.name}": ${q}`;
                            throw t.error(K), new Error(K);
                          }
                      }
                  } else
                    t.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (h) {
                  if (h instanceof Error)
                    throw h;
                  const A = `Failed to set component properties for remote instance "${e.name}": ${h}`;
                  throw t.error(A), new Error(A);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  l.resize(e.width, e.height);
                } catch (h) {
                  t.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const h = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw t.error(h), new Error(h);
            }
          } else {
            const P = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw t.error(P), new Error(P);
          }
        else if ((C == null ? void 0 : C.instanceType) === "normal") {
          if (!C.componentPageName) {
            const M = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw t.error(M), new Error(M);
          }
          await figma.loadAllPagesAsync();
          const P = figma.root.children.find(
            (M) => M.name === C.componentPageName
          );
          if (!P) {
            t.log(
              `  Deferring normal instance "${e.name}" - referenced page "${C.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const M = figma.createFrame();
            if (M.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (M.x = e.x), e.y !== void 0 && (M.y = e.y), e.width !== void 0 && e.height !== void 0 ? M.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && M.resize(e.w, e.h), $ && $.add(M.id), y) {
              const J = v;
              J ? t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${J.substring(0, 8)}... (immediate parent: "${n.name}" ${n.id.substring(0, 8)}...)`
              ) : t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${n.name}" (${n.id.substring(0, 8)}...)`
              );
              let q = n.id;
              if (J)
                try {
                  const ne = await figma.getNodeByIdAsync(J);
                  ne && ne.parent && (q = ne.parent.id);
                } catch (ne) {
                  q = n.id;
                }
              const K = {
                placeholderFrameId: M.id,
                instanceEntry: C,
                nodeData: e,
                parentNodeId: q,
                parentPlaceholderId: J,
                instanceIndex: e._instanceRef
              };
              y.push(K);
            }
            l = M;
            break;
          }
          let h = null;
          const A = (M, J, q, K, ne) => {
            if (J.length === 0) {
              let $e = null;
              for (const Ne of M.children || [])
                if (Ne.type === "COMPONENT") {
                  if (Ne.name === q)
                    if ($e || ($e = Ne), K)
                      try {
                        const Ee = Ne.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (Ee && JSON.parse(Ee).id === K)
                          return Ne;
                      } catch (Ee) {
                      }
                    else
                      return Ne;
                } else if (Ne.type === "COMPONENT_SET") {
                  if (ne && Ne.name !== ne)
                    continue;
                  for (const Ee of Ne.children || [])
                    if (Ee.type === "COMPONENT" && Ee.name === q)
                      if ($e || ($e = Ee), K)
                        try {
                          const He = Ee.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (He && JSON.parse(He).id === K)
                            return Ee;
                        } catch (He) {
                        }
                      else
                        return Ee;
                }
              return $e;
            }
            const [Se, ...ye] = J;
            for (const $e of M.children || [])
              if ($e.name === Se) {
                if (ye.length === 0 && $e.type === "COMPONENT_SET") {
                  if (ne && $e.name !== ne)
                    continue;
                  for (const Ne of $e.children || [])
                    if (Ne.type === "COMPONENT" && Ne.name === q) {
                      if (K)
                        try {
                          const Ee = Ne.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Ee && JSON.parse(Ee).id === K)
                            return Ne;
                        } catch (Ee) {
                        }
                      return Ne;
                    }
                  return null;
                }
                return A(
                  $e,
                  ye,
                  q,
                  K,
                  ne
                );
              }
            return null;
          };
          t.log(
            `  Looking for component "${C.componentName}" on page "${C.componentPageName}"${C.path && C.path.length > 0 ? ` at path [${C.path.join(" → ")}]` : " at page root"}${C.componentGuid ? ` (GUID: ${C.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const B = [], _ = (M, J = 0) => {
            const q = "  ".repeat(J);
            if (M.type === "COMPONENT")
              B.push(`${q}COMPONENT: "${M.name}"`);
            else if (M.type === "COMPONENT_SET") {
              B.push(
                `${q}COMPONENT_SET: "${M.name}"`
              );
              for (const K of M.children || [])
                K.type === "COMPONENT" && B.push(
                  `${q}  └─ COMPONENT: "${K.name}"`
                );
            }
            for (const K of M.children || [])
              _(K, J + 1);
          };
          if (_(P), B.length > 0 ? t.log(
            `  Available components on page "${C.componentPageName}":
${B.slice(0, 20).join(`
`)}${B.length > 20 ? `
  ... and ${B.length - 20} more` : ""}`
          ) : t.warning(
            `  No components found on page "${C.componentPageName}"`
          ), h = A(
            P,
            C.path || [],
            C.componentName,
            C.componentGuid,
            C.componentSetName
          ), h && C.componentGuid)
            try {
              const M = h.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (M) {
                const J = JSON.parse(M);
                J.id !== C.componentGuid ? t.warning(
                  `  Found component "${C.componentName}" by name but GUID verification failed (expected ${C.componentGuid.substring(0, 8)}..., got ${J.id ? J.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : t.log(
                  `  Found component "${C.componentName}" with matching GUID ${C.componentGuid.substring(0, 8)}...`
                );
              } else
                t.warning(
                  `  Found component "${C.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (M) {
              t.warning(
                `  Found component "${C.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!h) {
            t.log(
              `  Deferring normal instance "${e.name}" - component "${C.componentName}" not found on page "${C.componentPageName}" (may not be created yet due to circular reference)`
            );
            const M = figma.createFrame();
            if (M.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (M.x = e.x), e.y !== void 0 && (M.y = e.y), e.width !== void 0 && e.height !== void 0 ? M.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && M.resize(e.w, e.h), $ && $.add(M.id), y) {
              const J = v;
              J ? t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${J.substring(0, 8)}... (immediate parent: "${n.name}" ${n.id.substring(0, 8)}...)`
              ) : t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${n.name}" (${n.id.substring(0, 8)}...)`
              );
              let q = n.id;
              if (J)
                try {
                  const ne = await figma.getNodeByIdAsync(J);
                  ne && ne.parent && (q = ne.parent.id);
                } catch (ne) {
                  q = n.id;
                }
              const K = {
                placeholderFrameId: M.id,
                instanceEntry: C,
                nodeData: e,
                parentNodeId: q,
                parentPlaceholderId: J,
                instanceIndex: e._instanceRef
              };
              y.push(K);
            }
            l = M;
            break;
          }
          if (l = h.createInstance(), t.log(
            `  Created normal instance "${e.name}" from component "${C.componentName}" on page "${C.componentPageName}"`
          ), C.variantProperties && Object.keys(C.variantProperties).length > 0)
            try {
              const M = await l.getMainComponentAsync();
              if (M) {
                let J = null;
                const q = M.type;
                if (q === "COMPONENT_SET" ? J = M.componentPropertyDefinitions : q === "COMPONENT" && M.parent && M.parent.type === "COMPONENT_SET" ? J = M.parent.componentPropertyDefinitions : t.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), J) {
                  const K = {};
                  for (const [ne, Se] of Object.entries(
                    C.variantProperties
                  )) {
                    const ye = ne.split("#")[0];
                    J[ye] && (K[ye] = Se);
                  }
                  Object.keys(K).length > 0 && l.setProperties(K);
                }
              }
            } catch (M) {
              t.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${M}`
              );
            }
          if (C.componentProperties && Object.keys(C.componentProperties).length > 0)
            try {
              const M = await l.getMainComponentAsync();
              if (M) {
                let J = null;
                const q = M.type;
                if (q === "COMPONENT_SET" ? J = M.componentPropertyDefinitions : q === "COMPONENT" && M.parent && M.parent.type === "COMPONENT_SET" ? J = M.parent.componentPropertyDefinitions : q === "COMPONENT" && (J = M.componentPropertyDefinitions), J) {
                  const K = {};
                  for (const [ne, Se] of Object.entries(
                    C.componentProperties
                  )) {
                    const ye = ne.split("#")[0];
                    let $e;
                    if (J[ne] ? $e = ne : J[ye] ? $e = ye : $e = Object.keys(J).find(
                      (Ne) => Ne.split("#")[0] === ye
                    ), $e) {
                      const Ne = Se && typeof Se == "object" && "value" in Se ? Se.value : Se;
                      K[$e] = Ne;
                    } else
                      t.warning(
                        `Component property "${ye}" (from "${ne}") does not exist on component "${C.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(J).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(K).length > 0)
                    try {
                      t.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(K).join(", ")}`
                      ), t.log(
                        `  Available component properties: ${Object.keys(J).join(", ")}`
                      ), l.setProperties(K), t.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(K).join(", ")}`
                      );
                    } catch (ne) {
                      t.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${ne}`
                      ), t.warning(
                        `  Properties attempted: ${JSON.stringify(K)}`
                      ), t.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(J))}`
                      );
                    }
                }
              } else
                t.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (M) {
              t.warning(
                `Failed to set component properties for normal instance "${e.name}": ${M}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              l.resize(e.width, e.height);
            } catch (M) {
              t.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const P = `Instance "${e.name}" has unknown or missing instance type: ${(C == null ? void 0 : C.instanceType) || "unknown"}`;
          throw t.error(P), new Error(P);
        }
      } else {
        const C = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw t.error(C), new Error(C);
      }
      break;
    case "GROUP":
      l = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      t.log(
        `Converting BOOLEAN_OPERATION "${e.name}" to VECTOR node (boolean operations cannot be created directly in Figma API)`
      ), l = figma.createVector();
      break;
    }
    case "POLYGON":
      l = figma.createPolygon();
      break;
    default: {
      const C = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw t.error(C), new Error(C);
    }
  }
  if (!l)
    return null;
  e.id && r && (r.set(e.id, l), l.type === "COMPONENT" && t.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && l.type === "INSTANCE" ? (r._instanceTableMap || (r._instanceTableMap = /* @__PURE__ */ new Map()), r._instanceTableMap.set(
    l.id,
    e._instanceRef
  ), t.log(
    `  Stored instance table mapping: instance "${l.name}" (ID: ${l.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : l.type === "INSTANCE" && t.log(
    `  WARNING: Instance "${l.name}" (ID: ${l.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const N = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  lo(
    l,
    e.type || "FRAME",
    N
  ), e.name !== void 0 && (l.name = e.name || "Unnamed Node");
  const m = u && u.layoutMode !== void 0 && u.layoutMode !== "NONE", c = n && "layoutMode" in n && n.layoutMode !== "NONE";
  m || c || (e.x !== void 0 && (l.x = e.x), e.y !== void 0 && (l.y = e.y));
  const G = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height), F = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && t.log(
    `  [ISSUE #3 DEBUG] "${F}" has preserveRatio in nodeData: ${e.preserveRatio}`
  ), e.constraints !== void 0 && t.log(
    `  [ISSUE #4 DEBUG] "${F}" has constraints in nodeData: ${JSON.stringify(e.constraints)}`
  ), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && t.log(
    `  [ISSUE #4 DEBUG] "${F}" has constraintHorizontal: ${e.constraintHorizontal}, constraintVertical: ${e.constraintVertical}`
  ), e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && e.width !== void 0 && e.height !== void 0 && !G) {
    const C = l.preserveRatio;
    C !== void 0 && t.log(
      `  [ISSUE #3 DEBUG] "${F}" preserveRatio before resize: ${C}`
    ), l.resize(e.width, e.height);
    const P = l.preserveRatio;
    P !== void 0 ? t.log(
      `  [ISSUE #3 DEBUG] "${F}" preserveRatio after resize: ${P}`
    ) : e.preserveRatio !== void 0 && t.warning(
      `  ⚠️ ISSUE #3: "${F}" preserveRatio was in nodeData (${e.preserveRatio}) but not set on node!`
    );
    const h = e.constraintHorizontal || ((p = e.constraints) == null ? void 0 : p.horizontal), A = e.constraintVertical || ((f = e.constraints) == null ? void 0 : f.vertical);
    (h !== void 0 || A !== void 0) && t.log(
      `  [ISSUE #4] "${F}" (${e.type}) - Expected constraints from JSON: H=${h || "undefined"}, V=${A || "undefined"}`
    );
    const B = (b = l.constraints) == null ? void 0 : b.horizontal, _ = (I = l.constraints) == null ? void 0 : I.vertical;
    (h !== void 0 || A !== void 0) && t.log(
      `  [ISSUE #4] "${F}" (${e.type}) - Constraints after resize (before setting): H=${B || "undefined"}, V=${_ || "undefined"}`
    );
    const M = e.constraintHorizontal !== void 0 || ((O = e.constraints) == null ? void 0 : O.horizontal) !== void 0, J = e.constraintVertical !== void 0 || ((k = e.constraints) == null ? void 0 : k.vertical) !== void 0;
    if (M || J) {
      const ne = e.constraintHorizontal || ((Y = e.constraints) == null ? void 0 : Y.horizontal), Se = e.constraintVertical || ((ie = e.constraints) == null ? void 0 : ie.vertical), ye = ne || B || "MIN", $e = Se || _ || "MIN";
      try {
        t.log(
          `  [ISSUE #4] Setting constraints for "${F}" (${e.type}): H=${ye} (from ${ne || "default"}), V=${$e} (from ${Se || "default"})`
        ), l.constraints = {
          horizontal: ye,
          vertical: $e
        };
        const Ne = (Z = l.constraints) == null ? void 0 : Z.horizontal, Ee = (j = l.constraints) == null ? void 0 : j.vertical;
        Ne === ye && Ee === $e ? t.log(
          `  [ISSUE #4] ✓ Constraints set successfully: H=${Ne}, V=${Ee} for "${F}"`
        ) : t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${ye}, V=${$e}, got H=${Ne || "undefined"}, V=${Ee || "undefined"} for "${F}"`
        );
      } catch (Ne) {
        t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${F}" (${e.type}): ${Ne instanceof Error ? Ne.message : String(Ne)}`
        );
      }
    }
    const q = l.constraintHorizontal, K = l.constraintVertical;
    (h !== void 0 || A !== void 0) && (t.log(
      `  [ISSUE #4] "${F}" (${e.type}) - Final constraints: H=${q || "undefined"}, V=${K || "undefined"}`
    ), h !== void 0 && q !== h && t.warning(
      `  ⚠️ ISSUE #4: "${F}" constraintHorizontal mismatch! Expected: ${h}, Got: ${q || "undefined"}`
    ), A !== void 0 && K !== A && t.warning(
      `  ⚠️ ISSUE #4: "${F}" constraintVertical mismatch! Expected: ${A}, Got: ${K || "undefined"}`
    ), h !== void 0 && A !== void 0 && q === h && K === A && t.log(
      `  ✓ ISSUE #4: "${F}" constraints correctly set: H=${q}, V=${K}`
    ));
  } else {
    const C = e.constraintHorizontal || ((ee = e.constraints) == null ? void 0 : ee.horizontal), P = e.constraintVertical || ((te = e.constraints) == null ? void 0 : te.vertical);
    if ((C !== void 0 || P !== void 0) && (e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" ? t.log(
      `  [ISSUE #4] "${F}" (VECTOR) - Constraints already set earlier (skipping "no resize" path)`
    ) : t.log(
      `  [ISSUE #4] "${F}" (${e.type}) - Setting constraints (no resize): Expected H=${C || "undefined"}, V=${P || "undefined"}`
    )), e.type !== "VECTOR") {
      const h = e.constraintHorizontal !== void 0 || ((W = e.constraints) == null ? void 0 : W.horizontal) !== void 0, A = e.constraintVertical !== void 0 || ((oe = e.constraints) == null ? void 0 : oe.vertical) !== void 0;
      if (h || A) {
        const B = e.constraintHorizontal || ((ae = e.constraints) == null ? void 0 : ae.horizontal), _ = e.constraintVertical || ((X = e.constraints) == null ? void 0 : X.vertical), M = l.constraints || {}, J = M.horizontal || "MIN", q = M.vertical || "MIN", K = B || J, ne = _ || q;
        try {
          t.log(
            `  [ISSUE #4] Setting constraints for "${F}" (${e.type}) (no resize): H=${K} (from ${B || "current"}), V=${ne} (from ${_ || "current"})`
          ), l.constraints = {
            horizontal: K,
            vertical: ne
          };
          const Se = (x = l.constraints) == null ? void 0 : x.horizontal, ye = (H = l.constraints) == null ? void 0 : H.vertical;
          Se === K && ye === ne ? t.log(
            `  [ISSUE #4] ✓ Constraints set successfully (no resize): H=${Se}, V=${ye} for "${F}"`
          ) : t.warning(
            `  [ISSUE #4] ⚠️ Constraints set but verification failed (no resize)! Expected H=${K}, V=${ne}, got H=${Se || "undefined"}, V=${ye || "undefined"} for "${F}"`
          );
        } catch (Se) {
          t.warning(
            `  [ISSUE #4] ✗ Failed to set constraints for "${F}" (${e.type}) (no resize): ${Se instanceof Error ? Se.message : String(Se)}`
          );
        }
      }
    }
    if (e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && (C !== void 0 || P !== void 0)) {
      const h = (z = l.constraints) == null ? void 0 : z.horizontal, A = (D = l.constraints) == null ? void 0 : D.vertical;
      t.log(
        `  [ISSUE #4] "${F}" (${e.type}) - Final constraints (no resize): H=${h || "undefined"}, V=${A || "undefined"}`
      ), C !== void 0 && h !== C && t.warning(
        `  ⚠️ ISSUE #4: "${F}" constraintHorizontal mismatch! Expected: ${C}, Got: ${h || "undefined"}`
      ), P !== void 0 && A !== P && t.warning(
        `  ⚠️ ISSUE #4: "${F}" constraintVertical mismatch! Expected: ${P}, Got: ${A || "undefined"}`
      ), C !== void 0 && P !== void 0 && h === C && A === P && t.log(
        `  ✓ ISSUE #4: "${F}" constraints correctly set (no resize): H=${h}, V=${A}`
      );
    }
  }
  const E = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (l.visible = e.visible), e.locked !== void 0 && (l.locked = e.locked), e.opacity !== void 0 && (!E || !e.boundVariables.opacity) && (l.opacity = e.opacity), e.rotation !== void 0 && (!E || !e.boundVariables.rotation) && (l.rotation = e.rotation), e.blendMode !== void 0 && (!E || !e.boundVariables.blendMode) && (l.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (t.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((fe = e.id) == null ? void 0 : fe.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && t.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let C = e.fills;
        const P = e.name || "Unnamed";
        if (Array.isArray(C))
          for (let h = 0; h < C.length; h++) {
            const A = C[h];
            A && typeof A == "object" && A.selectionColor !== void 0 && t.log(
              `  [ISSUE #2 DEBUG] "${P}" fill[${h}] has selectionColor: ${JSON.stringify(A.selectionColor)}`
            );
          }
        if (Array.isArray(C)) {
          const h = e.name || "Unnamed";
          for (let A = 0; A < C.length; A++) {
            const B = C[A];
            B && typeof B == "object" && B.selectionColor !== void 0 && t.warning(
              `  ⚠️ ISSUE #2: "${h}" fill[${A}] has selectionColor that will be preserved: ${JSON.stringify(B.selectionColor)}`
            );
          }
          C = C.map((A) => {
            if (A && typeof A == "object") {
              const B = re({}, A);
              return delete B.boundVariables, B;
            }
            return A;
          });
        }
        if (e.fills && Array.isArray(e.fills) && s) {
          if (e.type === "VECTOR") {
            t.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let _ = 0; _ < e.fills.length; _++) {
              const M = e.fills[_];
              if (M && typeof M == "object") {
                const J = M.boundVariables || M.bndVar;
                J ? t.log(
                  `  DEBUG:   fill[${_}] has boundVariables: ${JSON.stringify(J)}`
                ) : t.log(
                  `  DEBUG:   fill[${_}] has no boundVariables`
                );
              }
            }
          }
          const h = [];
          for (let _ = 0; _ < C.length; _++) {
            const M = C[_], J = e.fills[_];
            if (!J || typeof J != "object") {
              h.push(M);
              continue;
            }
            const q = J.boundVariables || J.bndVar;
            if (!q) {
              h.push(M);
              continue;
            }
            const K = re({}, M);
            K.boundVariables = {};
            for (const [ne, Se] of Object.entries(q))
              if (e.type === "VECTOR" && t.log(
                `  DEBUG: Processing fill[${_}].${ne} on VECTOR "${l.name || "Unnamed"}": varInfo=${JSON.stringify(Se)}`
              ), Je(Se)) {
                const ye = Se._varRef;
                if (ye !== void 0) {
                  if (e.type === "VECTOR") {
                    t.log(
                      `  DEBUG: Looking up variable reference ${ye} in recognizedVariables (map has ${s.size} entries)`
                    );
                    const Ne = Array.from(
                      s.keys()
                    ).slice(0, 10);
                    t.log(
                      `  DEBUG: Available variable references (first 10): ${Ne.join(", ")}`
                    );
                    const Ee = s.has(String(ye));
                    if (t.log(
                      `  DEBUG: Variable reference ${ye} ${Ee ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !Ee) {
                      const He = Array.from(
                        s.keys()
                      ).sort((Vt, yn) => parseInt(Vt) - parseInt(yn));
                      t.log(
                        `  DEBUG: All available variable references: ${He.join(", ")}`
                      );
                    }
                  }
                  let $e = s.get(String(ye));
                  $e || (e.type === "VECTOR" && t.log(
                    `  DEBUG: Variable ${ye} not in recognizedVariables. variableTable=${!!o}, collectionTable=${!!i}, recognizedCollections=${!!S}`
                  ), o && i && S ? (t.log(
                    `  Variable reference ${ye} not in recognizedVariables, attempting to resolve from variable table...`
                  ), $e = await no(
                    ye,
                    o,
                    i,
                    S
                  ) || void 0, $e ? (s.set(String(ye), $e), t.log(
                    `  ✓ Resolved variable ${$e.name} from variable table and added to recognizedVariables`
                  )) : t.warning(
                    `  Failed to resolve variable ${ye} from variable table`
                  )) : e.type === "VECTOR" && t.warning(
                    `  Cannot resolve variable ${ye} from table - missing required parameters`
                  )), $e ? (K.boundVariables[ne] = {
                    type: "VARIABLE_ALIAS",
                    id: $e.id
                  }, t.log(
                    `  ✓ Restored bound variable for fill[${_}].${ne} on "${l.name || "Unnamed"}" (${e.type}): variable ${$e.name} (ID: ${$e.id.substring(0, 8)}...)`
                  )) : t.warning(
                    `  Variable reference ${ye} not found in recognizedVariables for fill[${_}].${ne} on "${l.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && t.warning(
                    `  DEBUG: Variable reference ${ye} is undefined for fill[${_}].${ne} on VECTOR "${l.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && t.warning(
                  `  DEBUG: fill[${_}].${ne} on VECTOR "${l.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(Se)}`
                );
            h.push(K);
          }
          l.fills = h, t.log(
            `  ✓ Set fills with boundVariables on "${l.name || "Unnamed"}" (${e.type})`
          );
          const A = l.fills, B = e.name || "Unnamed";
          if (Array.isArray(A))
            for (let _ = 0; _ < A.length; _++) {
              const M = A[_];
              M && typeof M == "object" && M.selectionColor !== void 0 && t.warning(
                `  ⚠️ ISSUE #2: "${B}" fill[${_}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify(M.selectionColor)}`
              );
            }
        } else {
          l.fills = C;
          const h = l.fills, A = e.name || "Unnamed";
          if (Array.isArray(h))
            for (let B = 0; B < h.length; B++) {
              const _ = h[B];
              _ && typeof _ == "object" && _.selectionColor !== void 0 && t.warning(
                `  ⚠️ ISSUE #2: "${A}" fill[${B}] has selectionColor AFTER setting: ${JSON.stringify(_.selectionColor)}`
              );
            }
        }
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && t.log(
          `  Node "${l.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (C) {
        console.log("Error setting fills:", C);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        l.fills = [];
      } catch (C) {
        console.log("Error clearing fills:", C);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? l.strokes = e.strokes : l.strokes = [];
    } catch (C) {
      console.log("Error setting strokes:", C);
    }
  else if (e.type === "VECTOR")
    try {
      l.strokes = [];
    } catch (C) {
    }
  const U = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!U || !e.boundVariables.strokeWeight) && (l.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!U || !e.boundVariables.strokeWeight) && (l.strokeWeight = 0), e.strokeAlign !== void 0 && (!U || !e.boundVariables.strokeAlign) && (l.strokeAlign = e.strokeAlign);
  const L = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!L || !e.boundVariables.cornerRadius) && (l.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (l.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? l.layoutMode = e.layoutMode : t.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && s) {
      const P = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const h of P) {
        const A = e.boundVariables[h];
        if (A && Je(A)) {
          const B = A._varRef;
          if (B !== void 0) {
            const _ = s.get(String(B));
            if (_) {
              const M = {
                type: "VARIABLE_ALIAS",
                id: _.id
              };
              l.boundVariables || (l.boundVariables = {});
              const J = l[h], q = (se = l.boundVariables) == null ? void 0 : se[h];
              t.log(
                `  DEBUG: Attempting to set bound variable for ${h} on "${e.name || "Unnamed"}": current value=${J}, current boundVar=${JSON.stringify(q)}`
              );
              try {
                l.setBoundVariable(h, null);
              } catch (ne) {
              }
              try {
                l.setBoundVariable(h, _);
                const ne = (ge = l.boundVariables) == null ? void 0 : ge[h];
                t.log(
                  `  DEBUG: Immediately after setting ${h} bound variable: ${JSON.stringify(ne)}`
                );
              } catch (ne) {
                t.warning(
                  `  Error setting bound variable for ${h}: ${ne instanceof Error ? ne.message : String(ne)}`
                );
              }
              const K = (pe = l.boundVariables) == null ? void 0 : pe[h];
              if (h === "itemSpacing") {
                const ne = l[h], Se = (ue = l.boundVariables) == null ? void 0 : ue[h];
                t.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${e.name || "Unnamed"}":`
                ), t.log(`    - Expected variable ref: ${B}`), t.log(
                  `    - Final itemSpacing value: ${ne}`
                ), t.log(
                  `    - Final boundVariable: ${JSON.stringify(Se)}`
                ), t.log(
                  `    - Variable found: ${_ ? `Yes (ID: ${_.id})` : "No"}`
                ), !K || !K.id ? t.warning(
                  "    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!"
                ) : t.log(
                  "    ✓ itemSpacing variable binding SUCCESS"
                );
              }
              K && typeof K == "object" && K.type === "VARIABLE_ALIAS" && K.id === _.id ? t.log(
                `  ✓ Set bound variable for ${h} on "${e.name || "Unnamed"}" (${e.type}): variable ${_.name} (ID: ${_.id.substring(0, 8)}...)`
              ) : t.warning(
                `  Failed to set bound variable for ${h} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(M)}, Got: ${JSON.stringify(K)}`
              );
            }
          }
        }
      }
    }
    e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0 ? e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing ? t.log(
      `  Skipping itemSpacing (bound to variable) for "${e.name || "Unnamed"}"`
    ) : (t.log(
      `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (${e.type})`
    ), l.itemSpacing = e.itemSpacing, t.log(
      `  ✓ Set itemSpacing to ${l.itemSpacing} (verified)`
    )) : (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && t.log(
      `  DEBUG: Not setting itemSpacing for "${e.name || "Unnamed"}": layoutMode=${e.layoutMode}, itemSpacing=${e.itemSpacing}`
    ), e.layoutWrap !== void 0 && (l.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? l.primaryAxisSizingMode = e.primaryAxisSizingMode : l.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? l.counterAxisSizingMode = e.counterAxisSizingMode : l.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (l.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (l.counterAxisAlignItems = e.counterAxisAlignItems);
    const C = e.boundVariables && typeof e.boundVariables == "object";
    if (C) {
      const P = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((h) => e.boundVariables[h]);
      P.length > 0 && t.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${P.join(", ")}`
      );
    }
    if (e.paddingLeft !== void 0 && (!C || !e.boundVariables.paddingLeft) && (l.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!C || !e.boundVariables.paddingRight) && (l.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!C || !e.boundVariables.paddingTop) && (l.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!C || !e.boundVariables.paddingBottom) && (l.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && l.layoutMode !== void 0 && l.layoutMode !== "NONE") {
      const P = ((le = l.boundVariables) == null ? void 0 : le.itemSpacing) !== void 0;
      !P && (!C || !e.boundVariables.itemSpacing) ? l.itemSpacing !== e.itemSpacing && (t.log(
        `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
      ), l.itemSpacing = e.itemSpacing) : P && t.log(
        `  Skipping late setting of itemSpacing for "${e.name || "Unnamed"}" - already bound to variable`
      );
    }
    e.counterAxisSpacing !== void 0 && (!C || !e.boundVariables.counterAxisSpacing) && l.layoutMode !== void 0 && l.layoutMode !== "NONE" && (l.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (l.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" || e.type === "LINE") && (e.strokeCap !== void 0 && (l.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (l.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (l.dashPattern = e.dashPattern), e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: A } = await Promise.resolve().then(() => Bn), B = e.fillGeometry.map((_) => {
          const M = _.data;
          return {
            data: A(M),
            windingRule: _.windingRule || _.windRule || "NONZERO"
          };
        });
        for (let _ = 0; _ < e.fillGeometry.length; _++) {
          const M = e.fillGeometry[_].data, J = B[_].data;
          M !== J && t.log(
            `  Normalized path ${_ + 1} for "${e.name || "Unnamed"}": ${M.substring(0, 50)}... -> ${J.substring(0, 50)}...`
          );
        }
        l.vectorPaths = B, t.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${B.length} path(s))`
        );
      } catch (A) {
        t.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        l.strokeGeometry = e.strokeGeometry;
      } catch (A) {
        t.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    const C = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !C)
      try {
        l.resize(e.width, e.height), t.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (A) {
        t.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    const P = e.constraintHorizontal || ((ce = e.constraints) == null ? void 0 : ce.horizontal), h = e.constraintVertical || ((be = e.constraints) == null ? void 0 : be.vertical);
    if (P !== void 0 || h !== void 0) {
      t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Setting constraints immediately after size: Expected H=${P || "undefined"}, V=${h || "undefined"}`
      );
      const A = l.constraints || {}, B = A.horizontal || "MIN", _ = A.vertical || "MIN", M = P || B, J = h || _;
      try {
        l.constraints = {
          horizontal: M,
          vertical: J
        };
        const ne = (he = l.constraints) == null ? void 0 : he.horizontal, Se = (Ce = l.constraints) == null ? void 0 : Ce.vertical;
        ne === M && Se === J ? t.log(
          `  [ISSUE #4] ✓ Constraints set successfully for "${e.name || "Unnamed"}" (VECTOR): H=${ne}, V=${Se}`
        ) : t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${M}, V=${J}, got H=${ne || "undefined"}, V=${Se || "undefined"} for "${e.name || "Unnamed"}"`
        );
      } catch (ne) {
        t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${e.name || "Unnamed"}" (VECTOR): ${ne instanceof Error ? ne.message : String(ne)}`
        );
      }
      const q = (Be = l.constraints) == null ? void 0 : Be.horizontal, K = (De = l.constraints) == null ? void 0 : De.vertical;
      t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Final constraints after immediate setting: H=${q || "undefined"}, V=${K || "undefined"}`
      ), P !== void 0 && q !== P && t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintHorizontal mismatch! Expected: ${P}, Got: ${q || "undefined"}`
      ), h !== void 0 && K !== h && t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintVertical mismatch! Expected: ${h}, Got: ${K || "undefined"}`
      ), P !== void 0 && h !== void 0 && q === P && K === h && t.log(
        `  ✓ ISSUE #4: "${e.name || "Unnamed"}" (VECTOR) constraints correctly set: H=${q}, V=${K}`
      );
    }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      let C = !1;
      if (t.log(
        `  Processing TEXT node "${e.name || "Unnamed"}": has _styleRef=${e._styleRef !== void 0}, has styleMapping=${w != null}`
      ), e._styleRef !== void 0)
        if (!w)
          t.warning(
            `Text node "${e.name || "Unnamed"}" has _styleRef but styles table was not imported. Using individual properties instead.`
          );
        else {
          const P = w.get(e._styleRef);
          if (P && P.type === "TEXT")
            try {
              const h = P;
              t.log(
                `  Applying text style "${P.name}" to text node "${e.name || "Unnamed"}" (font: ${h.fontName.family} ${h.fontName.style})`
              );
              try {
                await figma.loadFontAsync(h.fontName), t.log(
                  `  ✓ Loaded font "${h.fontName.family} ${h.fontName.style}" for style "${P.name}"`
                );
              } catch (A) {
                t.warning(
                  `  Could not load font "${h.fontName.family} ${h.fontName.style}" for style "${P.name}": ${A}. Trying fallback font.`
                );
                try {
                  await figma.loadFontAsync({
                    family: "Roboto",
                    style: "Regular"
                  }), t.log('  ✓ Loaded fallback font "Roboto Regular"');
                } catch (B) {
                  t.warning(
                    `  Could not load fallback font for style "${P.name}" on text node "${e.name || "Unnamed"}"`
                  );
                }
              }
              await l.setTextStyleIdAsync(P.id), t.log(
                `  ✓ Set textStyleId to "${P.id}" for style "${P.name}"`
              ), l.characters = e.characters, t.log(
                `  ✓ Set characters: "${e.characters.substring(0, 50)}${e.characters.length > 50 ? "..." : ""}"`
              ), C = !0, e.textAlignHorizontal !== void 0 && (l.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (l.textAlignVertical = e.textAlignVertical), e.textAutoResize !== void 0 && (l.textAutoResize = e.textAutoResize), e.listOptions !== void 0 && (l.listOptions = e.listOptions);
            } catch (h) {
              t.warning(
                `Failed to apply style "${P.name}" on text node "${e.name || "Unnamed"}": ${h}. Falling back to individual properties.`
              );
            }
          else
            t.warning(
              `Text node "${e.name || "Unnamed"}" has invalid _styleRef (${e._styleRef}). Using individual properties instead.`
            );
        }
      if (!C) {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), l.fontName = e.fontName;
          } catch (h) {
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
        const P = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
        e.fontSize !== void 0 && (!P || !e.boundVariables.fontSize) && (l.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (l.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (l.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!P || !e.boundVariables.letterSpacing) && (l.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!P || !e.boundVariables.lineHeight) && (l.lineHeight = e.lineHeight), e.textCase !== void 0 && (l.textCase = e.textCase), e.textDecoration !== void 0 && (l.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (l.textAutoResize = e.textAutoResize);
      }
    } catch (C) {
      console.log("Error setting text properties: " + C);
      try {
        l.characters = e.characters;
      } catch (P) {
        console.log("Could not set text characters: " + P);
      }
    }
  if (e.selectionColor !== void 0) {
    const C = e.name || "Unnamed";
    if (e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.selectionColor !== void 0)
      t.log(
        `  [ISSUE #2] Skipping direct selectionColor value for "${C}" - will be set via bound variable`
      );
    else
      try {
        l.selectionColor = e.selectionColor, t.log(
          `  [ISSUE #2] Set selectionColor (direct value) on "${C}": ${JSON.stringify(e.selectionColor)}`
        );
      } catch (h) {
        t.warning(
          `  [ISSUE #2] Failed to set selectionColor on "${C}": ${h instanceof Error ? h.message : String(h)}`
        );
      }
  }
  if (e.boundVariables && s) {
    const C = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [P, h] of Object.entries(
      e.boundVariables
    ))
      if (P !== "fills" && !C.includes(P)) {
        if (P === "selectionColor") {
          const A = e.name || "Unnamed";
          t.log(
            `  [ISSUE #2] Restoring bound variable for selectionColor on "${A}"`
          );
        }
        if (Je(h) && o && s) {
          const A = h._varRef;
          if (A !== void 0) {
            const B = s.get(String(A));
            if (B)
              try {
                const _ = {
                  type: "VARIABLE_ALIAS",
                  id: B.id
                };
                l.boundVariables || (l.boundVariables = {});
                const M = l[P];
                M !== void 0 && l.boundVariables[P] === void 0 && t.warning(
                  `  Property ${P} has direct value ${M} which may prevent bound variable from being set`
                ), l.boundVariables[P] = _;
                const q = (T = l.boundVariables) == null ? void 0 : T[P];
                if (q && typeof q == "object" && q.type === "VARIABLE_ALIAS" && q.id === B.id)
                  t.log(
                    `  ✓ Set bound variable for ${P} on "${e.name || "Unnamed"}" (${e.type}): variable ${B.name} (ID: ${B.id.substring(0, 8)}...)`
                  );
                else {
                  const K = (me = l.boundVariables) == null ? void 0 : me[P];
                  t.warning(
                    `  Failed to set bound variable for ${P} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${M}, Expected: ${JSON.stringify(_)}, Got: ${JSON.stringify(K)}`
                  );
                }
              } catch (_) {
                t.warning(
                  `  Error setting bound variable for ${P} on "${e.name || "Unnamed"}": ${_}`
                );
              }
            else
              t.warning(
                `  Variable reference ${A} not found in recognizedVariables for ${P} on "${e.name || "Unnamed"}"`
              );
          }
        }
      }
  }
  if (e.boundVariables && s && (e.boundVariables.width || e.boundVariables.height)) {
    const C = e.boundVariables.width, P = e.boundVariables.height;
    if (C && Je(C)) {
      const h = C._varRef;
      if (h !== void 0) {
        const A = s.get(String(h));
        if (A) {
          const B = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          l.boundVariables || (l.boundVariables = {}), l.boundVariables.width = B;
        }
      }
    }
    if (P && Je(P)) {
      const h = P._varRef;
      if (h !== void 0) {
        const A = s.get(String(h));
        if (A) {
          const B = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          l.boundVariables || (l.boundVariables = {}), l.boundVariables.height = B;
        }
      }
    }
  }
  const R = e.id && r && r.has(e.id) && l.type === "COMPONENT" && l.children && l.children.length > 0;
  if (e.children && Array.isArray(e.children) && l.type !== "INSTANCE" && !R) {
    const C = (h) => {
      const A = [];
      for (const B of h)
        B._truncated || (B.type === "COMPONENT" ? (A.push(B), B.children && Array.isArray(B.children) && A.push(...C(B.children))) : B.children && Array.isArray(B.children) && A.push(...C(B.children)));
      return A;
    };
    for (const h of e.children) {
      if (h._truncated) {
        console.log(
          `Skipping truncated children: ${h._reason || "Unknown"}`
        );
        continue;
      }
      h.type;
    }
    const P = C(e.children);
    t.log(
      `  First pass: Creating ${P.length} COMPONENT node(s) (without children)...`
    );
    for (const h of P)
      t.log(
        `  Collected COMPONENT "${h.name || "Unnamed"}" (ID: ${h.id ? h.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const h of P)
      if (h.id && r && !r.has(h.id)) {
        const A = figma.createComponent();
        if (h.name !== void 0 && (A.name = h.name || "Unnamed Node"), h.componentPropertyDefinitions) {
          const B = h.componentPropertyDefinitions;
          let _ = 0, M = 0;
          for (const [J, q] of Object.entries(B))
            try {
              const ne = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[q.type];
              if (!ne) {
                t.warning(
                  `  Unknown property type ${q.type} for property "${J}" in component "${h.name || "Unnamed"}"`
                ), M++;
                continue;
              }
              const Se = q.defaultValue, ye = J.split("#")[0];
              A.addComponentProperty(
                ye,
                ne,
                Se
              ), _++;
            } catch (K) {
              t.warning(
                `  Failed to add component property "${J}" to "${h.name || "Unnamed"}" in first pass: ${K}`
              ), M++;
            }
          _ > 0 && t.log(
            `  Added ${_} component property definition(s) to "${h.name || "Unnamed"}" in first pass${M > 0 ? ` (${M} failed)` : ""}`
          );
        }
        r.set(h.id, A), t.log(
          `  Created COMPONENT "${h.name || "Unnamed"}" (ID: ${h.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const h of e.children) {
      if (h._truncated)
        continue;
      const A = l && $ && $.has(l.id) ? l.id : v, B = await qe(
        h,
        l,
        o,
        i,
        a,
        s,
        r,
        d,
        g,
        y,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        S,
        $,
        // Pass placeholderFrameIds through for recursive calls
        A,
        // Pass currentPlaceholderId down (or placeholder ID if newNode is a placeholder)
        w
        // Pass styleMapping to apply styles
      );
      if (B && B.parent !== l) {
        if (B.parent && typeof B.parent.removeChild == "function")
          try {
            B.parent.removeChild(B);
          } catch (_) {
            t.warning(
              `Failed to remove child "${B.name || "Unnamed"}" from parent "${B.parent.name || "Unnamed"}": ${_}`
            );
          }
        l.appendChild(B);
      }
    }
  }
  if (n && l.parent !== n) {
    if (l.parent && typeof l.parent.removeChild == "function")
      try {
        l.parent.removeChild(l);
      } catch (C) {
        t.warning(
          `Failed to remove node "${l.name || "Unnamed"}" from parent "${l.parent.name || "Unnamed"}": ${C}`
        );
      }
    n.appendChild(l);
  }
  if ((l.type === "FRAME" || l.type === "COMPONENT" || l.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0) {
    const C = ((Q = l.boundVariables) == null ? void 0 : Q.itemSpacing) !== void 0, P = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing;
    if (C)
      t.log(
        `  FINAL CHECK: itemSpacing is bound to variable for "${e.name || "Unnamed"}" - skipping direct value fix`
      );
    else if (P)
      t.warning(
        `  FINAL CHECK: itemSpacing should be bound to variable for "${e.name || "Unnamed"}" but binding is missing!`
      );
    else {
      const h = l.itemSpacing;
      h !== e.itemSpacing ? (t.log(
        `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${h})`
      ), l.itemSpacing = e.itemSpacing, t.log(
        `  FINAL FIX: Verified itemSpacing is now ${l.itemSpacing}`
      )) : t.log(
        `  FINAL CHECK: itemSpacing is already correct (${h}) for "${e.name || "Unnamed"}"`
      );
    }
  }
  return l;
}
async function co(e, n, o) {
  let i = 0, a = 0, s = 0;
  const r = (g) => {
    const y = [];
    if (g.type === "INSTANCE" && y.push(g), "children" in g && g.children)
      for (const u of g.children)
        y.push(...r(u));
    return y;
  }, d = r(e);
  t.log(
    `  Found ${d.length} instance(s) to process for variant properties`
  );
  for (const g of d)
    try {
      const y = await g.getMainComponentAsync();
      if (!y) {
        a++;
        continue;
      }
      const u = n.getSerializedTable();
      let S = null, $;
      if (o._instanceTableMap ? ($ = o._instanceTableMap.get(
        g.id
      ), $ !== void 0 ? (S = u[$], t.log(
        `  Found instance table index ${$} for instance "${g.name}" (ID: ${g.id.substring(0, 8)}...)`
      )) : t.log(
        `  No instance table index mapping found for instance "${g.name}" (ID: ${g.id.substring(0, 8)}...), using fallback matching`
      )) : t.log(
        `  No instance table map found, using fallback matching for instance "${g.name}"`
      ), !S) {
        for (const [w, l] of Object.entries(u))
          if (l.instanceType === "internal" && l.componentNodeId && o.has(l.componentNodeId)) {
            const N = o.get(l.componentNodeId);
            if (N && N.id === y.id) {
              S = l, t.log(
                `  Matched instance "${g.name}" to instance table entry ${w} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!S) {
        t.log(
          `  No matching entry found for instance "${g.name}" (main component: ${y.name}, ID: ${y.id.substring(0, 8)}...)`
        ), a++;
        continue;
      }
      if (!S.variantProperties) {
        t.log(
          `  Instance table entry for "${g.name}" has no variant properties`
        ), a++;
        continue;
      }
      t.log(
        `  Instance "${g.name}" matched to entry with variant properties: ${JSON.stringify(S.variantProperties)}`
      );
      let v = null;
      if (y.parent && y.parent.type === "COMPONENT_SET" && (v = y.parent.componentPropertyDefinitions), v) {
        const w = {};
        for (const [l, N] of Object.entries(
          S.variantProperties
        )) {
          const m = l.split("#")[0];
          v[m] && (w[m] = N);
        }
        Object.keys(w).length > 0 ? (g.setProperties(w), i++, t.log(
          `  ✓ Set variant properties on instance "${g.name}": ${JSON.stringify(w)}`
        )) : a++;
      } else
        a++;
    } catch (y) {
      s++, t.warning(
        `  Failed to set variant properties on instance "${g.name}": ${y}`
      );
    }
  t.log(
    `  Variant properties set: ${i} processed, ${a} skipped, ${s} errors`
  );
}
async function Gt(e) {
  await figma.loadAllPagesAsync();
  const n = figma.root.children, o = new Set(n.map((s) => s.name));
  if (!o.has(e))
    return e;
  let i = 1, a = `${e}_${i}`;
  for (; o.has(a); )
    i++, a = `${e}_${i}`;
  return a;
}
async function go(e) {
  const n = await figma.variables.getLocalVariableCollectionsAsync(), o = new Set(n.map((s) => s.name));
  if (!o.has(e))
    return e;
  let i = 1, a = `${e}_${i}`;
  for (; o.has(a); )
    i++, a = `${e}_${i}`;
  return a;
}
async function fo(e, n) {
  const o = /* @__PURE__ */ new Set();
  for (const s of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(s);
      r && o.add(r.name);
    } catch (r) {
      continue;
    }
  if (!o.has(n))
    return n;
  let i = 1, a = `${n}_${i}`;
  for (; o.has(a); )
    i++, a = `${n}_${i}`;
  return a;
}
function on(e, n) {
  const o = e.resolvedType.toUpperCase(), i = n.toUpperCase();
  return o === i;
}
async function po(e) {
  const n = await figma.variables.getLocalVariableCollectionsAsync(), o = Ve(e.collectionName);
  if (ze(e.collectionName)) {
    for (const i of n)
      if (Ve(i.name) === o)
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
    for (const i of n)
      if (i.getSharedPluginData(
        "recursica",
        Ue
      ) === e.collectionGuid)
        return {
          collection: i,
          matchType: "recognized"
        };
  }
  for (const i of n)
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
function Bt(e) {
  if (!e.metadata)
    return {
      success: !1,
      error: "Invalid JSON format. Expected metadata."
    };
  const n = e.metadata;
  return !n.guid || typeof n.guid != "string" ? {
    success: !1,
    error: "Invalid metadata. Missing or invalid 'guid' field."
  } : !n.name || typeof n.name != "string" ? {
    success: !1,
    error: "Invalid metadata. Missing or invalid 'name' field."
  } : {
    success: !0,
    metadata: {
      guid: n.guid,
      name: n.name,
      version: n.version,
      description: n.description,
      url: n.url
    }
  };
}
function Ot(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let n;
  try {
    n = mt.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const o = Yn(e, n);
  return {
    success: !0,
    stringTable: n,
    expandedJsonData: o
  };
}
function rn(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: gt.fromTable(
        e.collections
      )
    };
  } catch (n) {
    return {
      success: !1,
      error: `Failed to load collections table: ${n instanceof Error ? n.message : "Unknown error"}`
    };
  }
}
async function mo(e, n) {
  const o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), s = e.getTable();
  for (const [r, d] of Object.entries(s)) {
    if (d.isLocal === !1) {
      t.log(
        `Skipping remote collection: "${d.collectionName}" (index ${r})`
      );
      continue;
    }
    const g = Ve(d.collectionName), y = n == null ? void 0 : n.get(g);
    if (y) {
      t.log(
        `✓ Using pre-created collection: "${g}" (index ${r})`
      ), o.set(r, y);
      continue;
    }
    const u = await po(d);
    u.matchType === "recognized" ? (t.log(
      `✓ Recognized collection by GUID: "${d.collectionName}" (index ${r})`
    ), o.set(r, u.collection)) : u.matchType === "potential" ? (t.log(
      `? Potential match by name: "${d.collectionName}" (index ${r})`
    ), i.set(r, {
      entry: d,
      collection: u.collection
    })) : (t.log(
      `✗ No match found for collection: "${d.collectionName}" (index ${r}) - will create new`
    ), a.set(r, d));
  }
  return t.log(
    `Collection matching complete: ${o.size} recognized, ${i.size} potential matches, ${a.size} to create`
  ), {
    recognizedCollections: o,
    potentialMatches: i,
    collectionsToCreate: a
  };
}
async function uo(e, n, o, i) {
  if (e.size !== 0) {
    if (i) {
      t.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [a, { entry: s, collection: r }] of e.entries()) {
        const d = Ve(
          s.collectionName
        ).toLowerCase();
        let g = !1;
        d === "tokens" || d === "token" ? g = i.tokens === "existing" : d === "theme" || d === "themes" ? g = i.theme === "existing" : (d === "layer" || d === "layers") && (g = i.layers === "existing");
        const y = ze(s.collectionName) ? Ve(s.collectionName) : r.name;
        g ? (t.log(
          `✓ Wizard selection: Using existing collection "${y}" (index ${a})`
        ), n.set(a, r), await Xe(r, s.modes), t.log(
          `  ✓ Ensured modes for collection "${y}" (${s.modes.length} mode(s))`
        )) : (t.log(
          `✗ Wizard selection: Will create new collection for "${s.collectionName}" (index ${a})`
        ), o.set(a, s));
      }
      return;
    }
    t.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [a, { entry: s, collection: r }] of e.entries())
      try {
        const d = ze(s.collectionName) ? Ve(s.collectionName) : r.name, g = `Found existing "${d}" variable collection. Should I use it?`;
        t.log(
          `Prompting user about potential match: "${d}"`
        ), await nt.prompt(g, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), t.log(
          `✓ User confirmed: Using existing collection "${d}" (index ${a})`
        ), n.set(a, r), await Xe(r, s.modes), t.log(
          `  ✓ Ensured modes for collection "${d}" (${s.modes.length} mode(s))`
        );
      } catch (d) {
        t.log(
          `✗ User rejected: Will create new collection for "${s.collectionName}" (index ${a})`
        ), o.set(a, s);
      }
  }
}
async function ho(e, n, o) {
  if (e.size === 0)
    return;
  t.log("Ensuring modes exist for recognized collections...");
  const i = n.getTable();
  for (const [a, s] of e.entries()) {
    const r = i[a];
    r && (o.has(a) || (await Xe(s, r.modes), t.log(
      `  ✓ Ensured modes for collection "${s.name}" (${r.modes.length} mode(s))`
    )));
  }
}
async function yo(e, n, o, i) {
  if (e.size !== 0) {
    t.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [a, s] of e.entries()) {
      const r = Ve(s.collectionName), d = i == null ? void 0 : i.get(r);
      if (d) {
        t.log(
          `Reusing pre-created collection: "${r}" (index ${a}, id: ${d.id.substring(0, 8)}...)`
        ), n.set(a, d), await Xe(d, s.modes), o.push(d);
        continue;
      }
      const g = await go(r);
      g !== r ? t.log(
        `Creating collection: "${g}" (normalized: "${r}" - name conflict resolved)`
      ) : t.log(`Creating collection: "${g}"`);
      const y = figma.variables.createVariableCollection(g);
      o.push(y);
      let u;
      if (ze(s.collectionName)) {
        const S = dt(s.collectionName);
        S && (u = S);
      } else s.collectionGuid && (u = s.collectionGuid);
      u && (y.setSharedPluginData(
        "recursica",
        Ue,
        u
      ), t.log(`  Stored GUID: ${u.substring(0, 8)}...`)), await Xe(y, s.modes), t.log(
        `  ✓ Created collection "${g}" with ${s.modes.length} mode(s)`
      ), n.set(a, y);
    }
    t.log("Collection creation complete");
  }
}
function an(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: ft.fromTable(e.variables)
    };
  } catch (n) {
    return {
      success: !1,
      error: `Failed to load variables table: ${n instanceof Error ? n.message : "Unknown error"}`
    };
  }
}
async function sn(e, n, o, i) {
  const a = /* @__PURE__ */ new Map(), s = [];
  t.log("Matching and creating variables in collections...");
  const r = e.getTable(), d = /* @__PURE__ */ new Map();
  for (const [u, S] of Object.entries(r)) {
    if (S._colRef === void 0)
      continue;
    const $ = o.get(String(S._colRef));
    if (!$)
      continue;
    d.has($.id) || d.set($.id, {
      collectionName: $.name,
      existing: 0,
      created: 0
    });
    const v = d.get($.id);
    let w;
    typeof S.variableType == "number" ? w = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[S.variableType] || String(S.variableType) : w = S.variableType;
    const l = await Tt(
      $,
      S.variableName
    );
    if (l)
      if (on(l, w))
        a.set(u, l), v.existing++;
      else {
        t.warning(
          `Type mismatch for variable "${S.variableName}" in collection "${$.name}": expected ${w}, found ${l.resolvedType}. Creating new variable with incremented name.`
        );
        const N = await fo(
          $,
          S.variableName
        ), m = await It(
          Ie(re({}, S), {
            variableName: N,
            variableType: w
          }),
          $,
          e,
          n
        );
        s.push(m), a.set(u, m), v.created++;
      }
    else {
      const N = await It(
        Ie(re({}, S), {
          variableType: w
        }),
        $,
        e,
        n
      );
      s.push(N), a.set(u, N), v.created++;
    }
  }
  t.log("Variable processing complete:");
  for (const u of d.values())
    t.log(
      `  "${u.collectionName}": ${u.existing} existing, ${u.created} created`
    );
  t.log("Final verification: Reading back all COLOR variables...");
  let g = 0, y = 0;
  for (const u of s)
    if (u.resolvedType === "COLOR") {
      const S = await figma.variables.getVariableCollectionByIdAsync(
        u.variableCollectionId
      );
      if (!S) {
        t.warning(
          `  ⚠️ Variable "${u.name}" has no variableCollection (ID: ${u.variableCollectionId})`
        );
        continue;
      }
      const $ = S.modes;
      if (!$ || $.length === 0) {
        t.warning(
          `  ⚠️ Variable "${u.name}" collection has no modes`
        );
        continue;
      }
      for (const v of $) {
        const w = u.valuesByMode[v.modeId];
        if (w && typeof w == "object" && "r" in w) {
          const l = w;
          Math.abs(l.r - 1) < 0.01 && Math.abs(l.g - 1) < 0.01 && Math.abs(l.b - 1) < 0.01 ? (y++, t.warning(
            `  ⚠️ Variable "${u.name}" mode "${v.name}" is WHITE: r=${l.r.toFixed(3)}, g=${l.g.toFixed(3)}, b=${l.b.toFixed(3)}`
          )) : (g++, t.log(
            `  ✓ Variable "${u.name}" mode "${v.name}" has color: r=${l.r.toFixed(3)}, g=${l.g.toFixed(3)}, b=${l.b.toFixed(3)}`
          ));
        } else w && typeof w == "object" && "type" in w || t.warning(
          `  ⚠️ Variable "${u.name}" mode "${v.name}" has unexpected value type: ${JSON.stringify(w)}`
        );
      }
    }
  return t.log(
    `Final verification complete: ${g} color variables verified, ${y} white variables found`
  ), {
    recognizedVariables: a,
    newlyCreatedVariables: s
  };
}
function bo(e) {
  if (!e.instances)
    return null;
  try {
    return it.fromTable(e.instances);
  } catch (n) {
    return null;
  }
}
function $o(e) {
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
  e.type !== void 0 && (e.type = $o(e.type));
  const n = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (n && (n === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const o of e.children)
      yt(o);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function So(e, n) {
  const o = /* @__PURE__ */ new Set();
  for (const s of e.children)
    (s.type === "FRAME" || s.type === "COMPONENT") && o.add(s.name);
  if (!o.has(n))
    return n;
  let i = 1, a = `${n}_${i}`;
  for (; o.has(a); )
    i++, a = `${n}_${i}`;
  return a;
}
async function vo(e, n, o, i, a, s = "", r = null) {
  var N;
  const d = e.getSerializedTable(), g = Object.values(d).filter(
    (m) => m.instanceType === "remote"
  ), y = /* @__PURE__ */ new Map(), u = [];
  if (g.length === 0)
    return t.log("No remote instances found"), { remoteComponentMap: y, dependentComponents: u };
  t.log(
    `Processing ${g.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const S = figma.root.children, $ = s ? `${s} REMOTES` : "REMOTES";
  let v = S.find(
    (m) => m.name === "REMOTES" || m.name === $
  );
  if (v ? (t.log("Found existing REMOTES page"), s && !v.name.startsWith(s) && (v.name = $)) : (v = figma.createPage(), v.name = $, t.log("Created REMOTES page")), g.length > 0 && t.log("Marked REMOTES page as under review"), !v.children.some(
    (m) => m.type === "FRAME" && m.name === "Title"
  )) {
    const m = { family: "Inter", style: "Bold" }, c = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(m), await figma.loadFontAsync(c);
    const V = figma.createFrame();
    V.name = "Title", V.layoutMode = "VERTICAL", V.paddingTop = 20, V.paddingBottom = 20, V.paddingLeft = 20, V.paddingRight = 20, V.fills = [];
    const G = figma.createText();
    G.fontName = m, G.characters = "REMOTE INSTANCES", G.fontSize = 24, G.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], V.appendChild(G);
    const F = figma.createText();
    F.fontName = c, F.characters = "These are remotely connected component instances found in our different component pages.", F.fontSize = 14, F.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], V.appendChild(F), v.appendChild(V), t.log("Created title and description on REMOTES page");
  }
  const l = /* @__PURE__ */ new Map();
  for (const [m, c] of Object.entries(d)) {
    if (c.instanceType !== "remote")
      continue;
    const V = parseInt(m, 10);
    if (t.log(
      `Processing remote instance ${V}: "${c.componentName}"`
    ), !c.structure) {
      t.warning(
        `Remote instance "${c.componentName}" missing structure data, skipping`
      );
      continue;
    }
    yt(c.structure);
    const G = c.structure.children !== void 0, F = c.structure.child !== void 0, E = c.structure.children ? c.structure.children.length : c.structure.child ? c.structure.child.length : 0;
    t.log(
      `  Structure type: ${c.structure.type || "unknown"}, has children: ${E} (children key: ${G}, child key: ${F})`
    );
    let U = c.componentName;
    if (c.path && c.path.length > 0) {
      const R = c.path.filter((p) => p !== "").join(" / ");
      R && (U = `${R} / ${c.componentName}`);
    }
    const L = await So(
      v,
      U
    );
    L !== U && t.log(
      `Component name conflict: "${U}" -> "${L}"`
    );
    try {
      if (c.structure.type !== "COMPONENT") {
        t.warning(
          `Remote instance "${c.componentName}" structure is not a COMPONENT (type: ${c.structure.type}), creating frame fallback`
        );
        const p = figma.createFrame();
        p.name = L;
        const f = await qe(
          c.structure,
          p,
          n,
          o,
          null,
          i,
          l,
          !0,
          // isRemoteStructure: true
          null,
          // remoteComponentMap - not needed here
          null,
          // deferredInstances - not needed for remote instances
          null,
          // parentNodeData - not available for remote structures
          a,
          null,
          // placeholderFrameIds - not needed for remote instances
          void 0,
          // currentPlaceholderId - remote instances are not inside placeholders
          r
          // Pass styleMapping to apply styles
        );
        f ? (p.appendChild(f), v.appendChild(p), t.log(
          `✓ Created remote instance frame fallback: "${L}"`
        )) : p.remove();
        continue;
      }
      const R = figma.createComponent();
      R.name = L, v.appendChild(R), t.log(`  Created component node: "${L}"`);
      try {
        if (c.structure.componentPropertyDefinitions) {
          const Z = c.structure.componentPropertyDefinitions;
          let j = 0, ee = 0;
          for (const [te, W] of Object.entries(Z))
            try {
              const ae = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[W.type];
              if (!ae) {
                t.warning(
                  `  Unknown property type ${W.type} for property "${te}" in component "${c.componentName}"`
                ), ee++;
                continue;
              }
              const X = W.defaultValue, x = te.split("#")[0];
              R.addComponentProperty(
                x,
                ae,
                X
              ), j++;
            } catch (oe) {
              t.warning(
                `  Failed to add component property "${te}" to "${c.componentName}": ${oe}`
              ), ee++;
            }
          j > 0 && t.log(
            `  Added ${j} component property definition(s) to "${c.componentName}"${ee > 0 ? ` (${ee} failed)` : ""}`
          );
        }
        c.structure.name !== void 0 && (R.name = c.structure.name);
        const p = c.structure.boundVariables && typeof c.structure.boundVariables == "object" && (c.structure.boundVariables.width || c.structure.boundVariables.height);
        c.structure.width !== void 0 && c.structure.height !== void 0 && !p && R.resize(c.structure.width, c.structure.height), c.structure.x !== void 0 && (R.x = c.structure.x), c.structure.y !== void 0 && (R.y = c.structure.y);
        const f = c.structure.boundVariables && typeof c.structure.boundVariables == "object";
        if (c.structure.visible !== void 0 && (R.visible = c.structure.visible), c.structure.opacity !== void 0 && (!f || !c.structure.boundVariables.opacity) && (R.opacity = c.structure.opacity), c.structure.rotation !== void 0 && (!f || !c.structure.boundVariables.rotation) && (R.rotation = c.structure.rotation), c.structure.blendMode !== void 0 && (!f || !c.structure.boundVariables.blendMode) && (R.blendMode = c.structure.blendMode), c.structure.fills !== void 0)
          try {
            let Z = c.structure.fills;
            Array.isArray(Z) && (Z = Z.map((j) => {
              if (j && typeof j == "object") {
                const ee = re({}, j);
                return delete ee.boundVariables, ee;
              }
              return j;
            })), R.fills = Z, (N = c.structure.boundVariables) != null && N.fills && i && await tn(
              R,
              c.structure.boundVariables,
              "fills",
              i
            );
          } catch (Z) {
            t.warning(
              `Error setting fills for remote component "${c.componentName}": ${Z}`
            );
          }
        if (c.structure.strokes !== void 0)
          try {
            R.strokes = c.structure.strokes;
          } catch (Z) {
            t.warning(
              `Error setting strokes for remote component "${c.componentName}": ${Z}`
            );
          }
        const b = c.structure.boundVariables && typeof c.structure.boundVariables == "object" && (c.structure.boundVariables.strokeWeight || c.structure.boundVariables.strokeAlign);
        c.structure.strokeWeight !== void 0 && (!b || !c.structure.boundVariables.strokeWeight) && (R.strokeWeight = c.structure.strokeWeight), c.structure.strokeAlign !== void 0 && (!b || !c.structure.boundVariables.strokeAlign) && (R.strokeAlign = c.structure.strokeAlign), c.structure.layoutMode !== void 0 && (R.layoutMode = c.structure.layoutMode), c.structure.primaryAxisSizingMode !== void 0 && (R.primaryAxisSizingMode = c.structure.primaryAxisSizingMode), c.structure.counterAxisSizingMode !== void 0 && (R.counterAxisSizingMode = c.structure.counterAxisSizingMode);
        const I = c.structure.boundVariables && typeof c.structure.boundVariables == "object";
        c.structure.paddingLeft !== void 0 && (!I || !c.structure.boundVariables.paddingLeft) && (R.paddingLeft = c.structure.paddingLeft), c.structure.paddingRight !== void 0 && (!I || !c.structure.boundVariables.paddingRight) && (R.paddingRight = c.structure.paddingRight), c.structure.paddingTop !== void 0 && (!I || !c.structure.boundVariables.paddingTop) && (R.paddingTop = c.structure.paddingTop), c.structure.paddingBottom !== void 0 && (!I || !c.structure.boundVariables.paddingBottom) && (R.paddingBottom = c.structure.paddingBottom), c.structure.itemSpacing !== void 0 && (!I || !c.structure.boundVariables.itemSpacing) && (R.itemSpacing = c.structure.itemSpacing);
        const O = c.structure.boundVariables && typeof c.structure.boundVariables == "object" && (c.structure.boundVariables.cornerRadius || c.structure.boundVariables.topLeftRadius || c.structure.boundVariables.topRightRadius || c.structure.boundVariables.bottomLeftRadius || c.structure.boundVariables.bottomRightRadius);
        if (c.structure.cornerRadius !== void 0 && (!O || !c.structure.boundVariables.cornerRadius) && (R.cornerRadius = c.structure.cornerRadius), c.structure.boundVariables && i) {
          const Z = c.structure.boundVariables, j = [
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
          for (const ee of j)
            if (Z[ee] && Je(Z[ee])) {
              const te = Z[ee]._varRef;
              if (te !== void 0) {
                const W = i.get(String(te));
                if (W) {
                  const oe = {
                    type: "VARIABLE_ALIAS",
                    id: W.id
                  };
                  R.boundVariables || (R.boundVariables = {}), R.boundVariables[ee] = oe;
                }
              }
            }
        }
        t.log(
          `  DEBUG: Structure keys: ${Object.keys(c.structure).join(", ")}, has children: ${!!c.structure.children}, has child: ${!!c.structure.child}`
        );
        const k = c.structure.children || (c.structure.child ? c.structure.child : null);
        if (t.log(
          `  DEBUG: childrenArray exists: ${!!k}, isArray: ${Array.isArray(k)}, length: ${k ? k.length : 0}`
        ), k && Array.isArray(k) && k.length > 0) {
          t.log(
            `  Recreating ${k.length} child(ren) for component "${c.componentName}"`
          );
          for (let Z = 0; Z < k.length; Z++) {
            const j = k[Z];
            if (t.log(
              `  DEBUG: Processing child ${Z + 1}/${k.length}: ${JSON.stringify({ name: j == null ? void 0 : j.name, type: j == null ? void 0 : j.type, hasTruncated: !!(j != null && j._truncated) })}`
            ), j._truncated) {
              t.log(
                `  Skipping truncated child: ${j._reason || "Unknown"}`
              );
              continue;
            }
            t.log(
              `  Recreating child: "${j.name || "Unnamed"}" (type: ${j.type})`
            );
            const ee = await qe(
              j,
              R,
              n,
              o,
              null,
              i,
              l,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              c.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              a,
              null,
              // placeholderFrameIds - not needed for remote instances
              void 0,
              // currentPlaceholderId - remote instances are not inside placeholders
              r
              // Pass styleMapping to apply styles
            );
            ee ? (R.appendChild(ee), t.log(
              `  ✓ Appended child "${j.name || "Unnamed"}" to component "${c.componentName}"`
            )) : t.warning(
              `  ✗ Failed to create child "${j.name || "Unnamed"}" (type: ${j.type})`
            );
          }
        }
        y.set(V, R);
        const Y = c.componentGuid || "", ie = c.componentVersion;
        Y && u.push({
          guid: Y,
          version: ie,
          pageId: v.id
        }), t.log(
          `✓ Created remote component: "${L}" (index ${V})`
        );
      } catch (p) {
        t.warning(
          `Error populating remote component "${c.componentName}": ${p instanceof Error ? p.message : "Unknown error"}`
        ), R.remove();
      }
    } catch (R) {
      t.warning(
        `Error recreating remote instance "${c.componentName}": ${R instanceof Error ? R.message : "Unknown error"}`
      );
    }
  }
  return t.log(
    `Remote instance processing complete: ${y.size} component(s) created`
  ), { remoteComponentMap: y, dependentComponents: u };
}
async function No(e, n, o, i, a, s, r = null, d = null, g = null, y = !1, u = null, S = !1, $ = !1, v = "", w = null) {
  t.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const l = figma.root.children, N = "RecursicaPublishedMetadata";
  let m = null;
  for (const f of l) {
    const b = f.getPluginData(N);
    if (b)
      try {
        if (JSON.parse(b).id === e.guid) {
          m = f;
          break;
        }
      } catch (I) {
        continue;
      }
  }
  let c = !1;
  if (m && !y && !S) {
    let f;
    try {
      const O = m.getPluginData(N);
      O && (f = JSON.parse(O).version);
    } catch (O) {
    }
    const b = f !== void 0 ? ` v${f}` : "", I = `Found existing component "${m.name}${b}". Should I use it or create a copy?`;
    t.log(
      `Found existing page with same GUID: "${m.name}". Prompting user...`
    );
    try {
      await nt.prompt(I, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), c = !0, t.log(
        `User chose to use existing page: "${m.name}"`
      );
    } catch (O) {
      t.log("User chose to create a copy. Will create new page.");
    }
  }
  if (c && m)
    return await figma.setCurrentPageAsync(m), t.log(
      `Using existing page: "${m.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), t.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${m.name}"`
    ), {
      success: !0,
      page: m,
      // Include pageId so it can be tracked in importedPages
      pageId: m.id
    };
  const V = l.find((f) => f.name === e.name);
  V && t.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let G;
  if (m || V) {
    const f = `__${e.name}`;
    G = await Gt(f), t.log(
      `Creating scratch page: "${G}" (will be renamed to "${e.name}" on success)`
    );
  } else
    G = e.name, t.log(`Creating page: "${G}"`);
  const F = figma.createPage();
  if (F.name = G, await figma.setCurrentPageAsync(F), t.log(`Switched to page: "${G}"`), !n.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  t.log("Recreating page structure...");
  const E = n.pageData;
  if (E.backgrounds !== void 0)
    try {
      F.backgrounds = E.backgrounds, t.log(
        `Set page background: ${JSON.stringify(E.backgrounds)}`
      );
    } catch (f) {
      t.warning(`Failed to set page background: ${f}`);
    }
  yt(E);
  const U = /* @__PURE__ */ new Map(), L = (f, b = []) => {
    if (f.type === "COMPONENT" && f.id && b.push(f.id), f.children && Array.isArray(f.children))
      for (const I of f.children)
        I._truncated || L(I, b);
    return b;
  }, R = L(E);
  if (t.log(
    `Found ${R.length} COMPONENT node(s) in page data`
  ), R.length > 0 && (t.log(
    `Component IDs in page data (first 20): ${R.slice(0, 20).map((f) => f.substring(0, 8) + "...").join(", ")}`
  ), E._allComponentIds = R), E.children && Array.isArray(E.children))
    for (const f of E.children) {
      const b = await qe(
        f,
        F,
        o,
        i,
        a,
        s,
        U,
        !1,
        // isRemoteStructure: false - we're creating the main page
        r,
        d,
        E,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        u,
        g,
        void 0,
        // currentPlaceholderId - page root is not inside a placeholder
        w
        // Pass styleMapping to apply styles
      );
      b && F.appendChild(b);
    }
  t.log("Page structure recreated successfully"), a && (t.log("Third pass: Setting variant properties on instances..."), await co(
    F,
    a,
    U
  ));
  const p = re(re({
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  }, e.description !== void 0 && {
    description: e.description
  }), e.url !== void 0 && { url: e.url });
  if (F.setPluginData(N, JSON.stringify(p)), t.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), G.startsWith("__")) {
    let f;
    $ ? f = v ? `${v} ${e.name}` : e.name : f = await Gt(e.name), F.name = f, t.log(`Renamed page from "${G}" to "${f}"`);
  } else $ && v && (F.name.startsWith(v) || (F.name = `${v} ${F.name}`));
  return {
    success: !0,
    page: F,
    deferredInstances: d || void 0
  };
}
async function Rt(e, n) {
  var g, y, u;
  const o = (/* @__PURE__ */ new Date()).toISOString();
  Ae(n), e.clearConsole !== !1 && t.clear(), t.log("=== Starting Page Import ===");
  const a = [];
  let s = [], r = [], d = [];
  try {
    const S = e.jsonData;
    if (!S)
      return t.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    t.log("Validating metadata...");
    const $ = Bt(S);
    if (!$.success)
      return t.error($.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: $.error,
        data: {}
      };
    const v = $.metadata;
    t.log(
      `Metadata validated: guid=${v.guid}, name=${v.name}`
    ), Ae(n), t.log("Loading string table...");
    const w = Ot(S);
    if (!w.success)
      return t.error(w.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: w.error,
        data: {}
      };
    t.log("String table loaded successfully"), t.log("Expanding JSON data...");
    const l = w.expandedJsonData;
    t.log("JSON expanded successfully"), Ae(n), t.log("Loading collections table...");
    const N = rn(l);
    if (!N.success)
      return N.error === "No collections table found in JSON" ? (t.log(N.error), t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: v.name }
      }) : (t.error(N.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: N.error,
        data: {}
      });
    const m = N.collectionTable;
    t.log(
      `Loaded collections table with ${m.getSize()} collection(s)`
    ), Ae(n), t.log("Matching collections with existing local collections...");
    const { recognizedCollections: c, potentialMatches: V, collectionsToCreate: G } = await mo(m, e.preCreatedCollections);
    await uo(
      V,
      c,
      G,
      e.collectionChoices
    ), await ho(
      c,
      m,
      V
    ), await yo(
      G,
      c,
      a,
      e.preCreatedCollections
    ), Ae(n), t.log("Loading variables table...");
    const F = an(l);
    if (!F.success)
      return F.error === "No variables table found in JSON" ? (t.log(F.error), t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: v.name }
      }) : (t.error(F.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: F.error,
        data: {}
      });
    const E = F.variableTable;
    t.log(
      `Loaded variables table with ${E.getSize()} variable(s)`
    ), Ae(n);
    const U = await sn(
      E,
      m,
      c,
      a
    ), L = U.recognizedVariables;
    s = U.newlyCreatedVariables, t.log("Checking for styles table...");
    const R = l.styles !== void 0 && l.styles !== null;
    if (!R) {
      if (nn(
        l.pageData
      )) {
        const D = "Style references found in page data but styles table is missing from JSON. Cannot import styles.";
        return t.error(D), {
          type: "importPage",
          success: !1,
          error: !0,
          message: D,
          data: {}
        };
      }
      t.log(
        "No styles table found in JSON (and no style references detected)"
      );
    }
    let p = null;
    if (R) {
      t.log("Loading styles table...");
      const z = pt.fromTable(l.styles);
      t.log(
        `Loaded styles table with ${z.getSize()} style(s)`
      );
      const D = await oo(
        z.getTable(),
        L
      );
      p = D.styleMapping, r = D.newlyCreatedStyles, t.log(
        `Imported ${p.size} style(s) (some may have been skipped if they already exist)`
      );
    }
    Ae(n), t.log("Loading instance table...");
    const f = bo(l);
    if (f) {
      const z = f.getSerializedTable(), D = Object.values(z).filter(
        (se) => se.instanceType === "internal"
      ), fe = Object.values(z).filter(
        (se) => se.instanceType === "remote"
      );
      t.log(
        `Loaded instance table with ${f.getSize()} instance(s) (${D.length} internal, ${fe.length} remote)`
      );
    } else
      t.log("No instance table found in JSON");
    Ae(n);
    const b = [], I = /* @__PURE__ */ new Set(), O = (g = e.isMainPage) != null ? g : !0, k = (y = e.alwaysCreateCopy) != null ? y : !1, Y = (u = e.skipUniqueNaming) != null ? u : !1, ie = e.constructionIcon || "";
    let Z = null;
    if (f) {
      const z = await vo(
        f,
        E,
        m,
        L,
        c,
        ie,
        p
        // Pass styleMapping to apply styles
      );
      Z = z.remoteComponentMap, d = z.dependentComponents;
    }
    const j = await No(
      v,
      l,
      E,
      m,
      f,
      L,
      Z,
      b,
      I,
      O,
      c,
      k,
      Y,
      ie,
      p
      // Pass styleMapping to apply styles
    );
    if (!j.success)
      return t.error(j.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: j.error,
        data: {}
      };
    const ee = j.page, te = L.size + s.length, W = j.deferredInstances || b, oe = (W == null ? void 0 : W.length) || 0;
    if (t.log("=== Import Complete ==="), t.log(
      `Successfully processed ${c.size} collection(s), ${te} variable(s), and created page "${ee.name}"${oe > 0 ? ` (${oe} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), oe > 0)
      for (const z of W)
        t.log(
          `    - "${z.nodeData.name}" from page "${z.instanceEntry.componentPageName}"`
        );
    const ae = j.pageId || ee.id, X = t.getLogs(), x = {
      componentGuid: v.guid,
      componentPage: v.name,
      branch: e.branch,
      importedAt: o,
      logs: X,
      createdPageIds: [ee.id],
      createdCollectionIds: a.map((z) => z.id),
      createdVariableIds: s.map((z) => z.id),
      createdStyleIds: r.map((z) => z.id),
      dependentComponents: d
    };
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: re({
        pageName: ee.name,
        pageId: ae,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: oe > 0 ? W : void 0,
        importResult: x
      }, X.length > 0 && { debugLogs: X })
    };
  } catch (S) {
    const $ = S instanceof Error ? S.message : "Unknown error occurred";
    t.error(`Import failed: ${$}`), S instanceof Error && S.stack && t.error(`Stack trace: ${S.stack}`), console.error("Error importing page:", S);
    const v = t.getLogs();
    let w = "", l = "";
    try {
      const m = e.jsonData;
      if (m) {
        const c = Bt(m);
        c.success && c.metadata && (w = c.metadata.guid, l = c.metadata.name);
      }
    } catch (m) {
    }
    const N = {
      componentGuid: w,
      componentPage: l,
      branch: e.branch,
      importedAt: o,
      error: $,
      logs: v,
      createdPageIds: [],
      createdCollectionIds: a.map((m) => m.id),
      createdVariableIds: s.map((m) => m.id),
      createdStyleIds: r.map((m) => m.id),
      dependentComponents: d
    };
    return {
      type: "importPage",
      success: !1,
      error: !0,
      message: $,
      data: re({
        importResult: N
      }, v.length > 0 && { debugLogs: v })
    };
  }
}
async function _t(e, n, o) {
  var i, a;
  if (!(!o || !n.children || !Array.isArray(n.children) || !e.children || e.children.length === 0)) {
    t.log(
      `[FILL-BOUND] Applying fill bound variables to instance "${e.name}" children. Instance has ${e.children.length} child(ren), JSON has ${((i = n.children) == null ? void 0 : i.length) || 0} child(ren)`
    );
    for (const s of e.children) {
      if (!("fills" in s) || !Array.isArray(s.fills)) {
        t.log(
          `[FILL-BOUND] Skipping child "${s.name}" - no fills property`
        );
        continue;
      }
      const r = n.children.find(
        (d) => d.name === s.name
      );
      if (!r) {
        t.log(
          `[FILL-BOUND] No JSON data found for child "${s.name}" in instance "${e.name}"`
        );
        continue;
      }
      if (!((a = r.boundVariables) != null && a.fills)) {
        t.log(
          `[FILL-BOUND] Child "${s.name}" in instance "${e.name}" has no fill bound variables in JSON`
        );
        continue;
      }
      t.log(
        `[FILL-BOUND] Found fill bound variables for child "${s.name}" in instance "${e.name}"`
      );
      try {
        if (!o) {
          t.warning(
            "[FILL-BOUND] Cannot apply fill bound variables: recognizedVariables is null"
          );
          continue;
        }
        const d = r.boundVariables.fills;
        if (!Array.isArray(d))
          continue;
        const g = [];
        for (let y = 0; y < s.fills.length && y < d.length; y++) {
          const u = s.fills[y], S = d[y];
          if (S && typeof S == "object") {
            let $ = null;
            if (S._varRef !== void 0) {
              const v = S._varRef;
              $ = o.get(String(v)) || null;
            } else if (S.color) {
              const v = S.color;
              v._varRef !== void 0 ? $ = o.get(String(v._varRef)) || null : v.type === "VARIABLE_ALIAS" && v.id && ($ = await figma.variables.getVariableByIdAsync(
                v.id
              ));
            } else S.type === "VARIABLE_ALIAS" && S.id && ($ = await figma.variables.getVariableByIdAsync(
              S.id
            ));
            if ($ && u.type === "SOLID") {
              const v = u, w = {
                type: "SOLID",
                visible: v.visible,
                opacity: v.opacity,
                blendMode: v.blendMode,
                color: re({}, v.color)
                // This will be overridden by the variable
              }, l = figma.variables.setBoundVariableForPaint(
                w,
                "color",
                $
              );
              g.push(l), t.log(
                `[FILL-BOUND] ✓ Bound variable "${$.name}" (${$.id}) to fill[${y}].color on child "${s.name}"`
              );
            } else $ ? (g.push(u), $ ? u.type !== "SOLID" && t.log(
              `[FILL-BOUND] Fill[${y}] on child "${s.name}" is type "${u.type}" - variable binding for non-solid fills not yet implemented`
            ) : t.warning(
              `[FILL-BOUND] Could not resolve variable for fill[${y}] on child "${s.name}"`
            )) : g.push(u);
          } else
            g.push(u);
        }
        s.fills = g, t.log(
          `[FILL-BOUND] ✓ Applied fill bound variables to child "${s.name}" in instance "${e.name}" (${g.length} fill(s))`
        );
      } catch (d) {
        t.warning(
          `Error applying fill bound variables to instance child "${s.name}": ${d instanceof Error ? d.message : String(d)}`
        );
      }
    }
    t.log(
      `[FILL-BOUND] Finished applying fill bound variables to instance "${e.name}" children`
    );
  }
}
async function zt(e, n) {
  if (!n.children || !Array.isArray(n.children) || !e.children || e.children.length === 0)
    return;
  const o = (s, r) => {
    if ("children" in s && Array.isArray(s.children))
      for (const d of s.children) {
        if (d.name === r)
          return d;
        const g = o(d, r);
        if (g)
          return g;
      }
    return null;
  };
  for (const s of n.children) {
    if (!s || !s.name)
      continue;
    o(
      e,
      s.name
    ) || t.warning(
      `Child "${s.name}" in JSON does not exist in instance "${e.name}" - skipping (instance override or Figma limitation)`
    );
  }
  const i = new Set(
    (n.children || []).map((s) => s == null ? void 0 : s.name).filter(Boolean)
  ), a = e.children.filter(
    (s) => !i.has(s.name)
  );
  a.length > 0 && t.log(
    `Instance "${e.name}" has ${a.length} child(ren) not in JSON - keeping default children: ${a.map((s) => s.name).join(", ")}`
  );
}
async function xt(e, n = "", o = null, i = null, a = null, s = null) {
  var $;
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  t.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let r = 0, d = 0;
  const g = [];
  await figma.loadAllPagesAsync();
  const y = (v, w, l = /* @__PURE__ */ new Set()) => {
    if (!v.parentPlaceholderId || l.has(v.placeholderFrameId))
      return 0;
    l.add(v.placeholderFrameId);
    const N = w.find(
      (m) => m.placeholderFrameId === v.parentPlaceholderId
    );
    return N ? 1 + y(N, w, l) : 0;
  }, u = e.map((v) => ({
    deferred: v,
    depth: y(v, e)
  }));
  if (u.sort((v, w) => w.depth - v.depth), t.log(
    `[BOTTOM-UP] Sorted ${e.length} deferred instance(s) by depth (deepest first)`
  ), u.length > 0) {
    const v = Math.max(...u.map((w) => w.depth));
    t.log(
      `[BOTTOM-UP] Depth range: 0 (root) to ${v} (deepest)`
    );
  }
  const S = /* @__PURE__ */ new Set();
  for (const v of e)
    v.parentPlaceholderId && (S.add(v.placeholderFrameId), t.log(
      `[NESTED] Pre-marked child deferred instance "${v.nodeData.name}" (placeholder: ${v.placeholderFrameId.substring(0, 8)}..., parent placeholder: ${v.parentPlaceholderId.substring(0, 8)}...)`
    ));
  t.log(
    `[NESTED] Pre-marked ${S.size} child deferred instance(s) to skip in main loop`
  );
  for (const { deferred: v } of u) {
    if (S.has(v.placeholderFrameId)) {
      t.log(
        `[NESTED] Skipping child deferred instance "${v.nodeData.name}" (placeholder: ${v.placeholderFrameId.substring(0, 8)}...) - will be resolved when parent is resolved`
      );
      continue;
    }
    try {
      const { placeholderFrameId: w, instanceEntry: l, nodeData: N, parentNodeId: m } = v, c = await figma.getNodeByIdAsync(
        w
      ), V = await figma.getNodeByIdAsync(
        m
      );
      if (!c || !V) {
        const f = v.parentPlaceholderId !== void 0, b = S.has(w), I = `Deferred instance "${N.name}" - could not find placeholder frame (${w.substring(0, 8)}...) or parent node (${m.substring(0, 8)}...). Was child deferred: ${f}, Was marked: ${b}`;
        t.error(I), f && !b && t.error(
          `[NESTED] BUG: Child deferred instance "${N.name}" was not properly marked! parentPlaceholderId: ${($ = v.parentPlaceholderId) == null ? void 0 : $.substring(0, 8)}...`
        ), g.push(I), d++;
        continue;
      }
      let G = figma.root.children.find((f) => {
        const b = f.name === l.componentPageName, I = n && f.name === `${n} ${l.componentPageName}`;
        return b || I;
      });
      if (!G) {
        const f = ve(
          l.componentPageName
        );
        G = figma.root.children.find((b) => ve(b.name) === f);
      }
      if (!G) {
        const f = n ? `"${l.componentPageName}" or "${n} ${l.componentPageName}"` : `"${l.componentPageName}"`, b = `Deferred instance "${N.name}" still cannot find referenced page (tried: ${f}, and clean name matching)`;
        t.error(b), g.push(b), d++;
        continue;
      }
      const F = (f, b, I, O, k) => {
        if (b.length === 0) {
          let j = null;
          const ee = ve(I);
          for (const te of f.children || [])
            if (te.type === "COMPONENT") {
              const W = te.name === I, oe = ve(te.name) === ee;
              if (W || oe) {
                if (j || (j = te), W && O)
                  try {
                    const ae = te.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (ae && JSON.parse(ae).id === O)
                      return te;
                  } catch (ae) {
                  }
                else if (W)
                  return te;
              }
            } else if (te.type === "COMPONENT_SET") {
              if (k) {
                const W = te.name === k, oe = ve(te.name) === ve(k);
                if (!W && !oe)
                  continue;
              }
              for (const W of te.children || [])
                if (W.type === "COMPONENT") {
                  const oe = W.name === I, ae = ve(W.name) === ee;
                  if (oe || ae) {
                    if (j || (j = W), oe && O)
                      try {
                        const X = W.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (X && JSON.parse(X).id === O)
                          return W;
                      } catch (X) {
                      }
                    else if (oe)
                      return W;
                  }
                }
            }
          return j;
        }
        const [Y, ...ie] = b, Z = ve(Y);
        for (const j of f.children || []) {
          const ee = j.name === Y, te = ve(j.name) === Z;
          if (ee || te) {
            if (ie.length === 0) {
              if (j.type === "COMPONENT_SET") {
                if (k) {
                  const ae = j.name === k, X = ve(j.name) === ve(k);
                  if (!ae && !X)
                    continue;
                }
                const W = ve(I);
                let oe = null;
                for (const ae of j.children || [])
                  if (ae.type === "COMPONENT") {
                    const X = ae.name === I, x = ve(ae.name) === W;
                    if (X || x) {
                      if (oe || (oe = ae), O)
                        try {
                          const H = ae.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (H && JSON.parse(H).id === O)
                            return ae;
                        } catch (H) {
                        }
                      if (X)
                        return ae;
                    }
                  }
                return oe || null;
              }
              return null;
            }
            return ie.length > 0 ? F(
              j,
              ie,
              I,
              O,
              k
            ) : null;
          }
        }
        return null;
      };
      let E = F(
        G,
        l.path || [],
        l.componentName,
        l.componentGuid,
        l.componentSetName
      );
      if (!E && l.componentSetName) {
        const f = (b, I = 0) => {
          if (I > 5) return null;
          for (const O of b.children || []) {
            if (O.type === "COMPONENT_SET") {
              const k = O.name === l.componentSetName, Y = ve(O.name) === ve(l.componentSetName || "");
              if (k || Y) {
                const ie = ve(
                  l.componentName
                );
                for (const Z of O.children || [])
                  if (Z.type === "COMPONENT") {
                    const j = Z.name === l.componentName, ee = ve(Z.name) === ie;
                    if (j || ee) {
                      if (l.componentGuid)
                        try {
                          const te = Z.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (te && JSON.parse(te).id === l.componentGuid)
                            return Z;
                        } catch (te) {
                        }
                      return Z;
                    }
                  }
              }
            }
            if (O.type === "FRAME" || O.type === "GROUP") {
              const k = f(O, I + 1);
              if (k) return k;
            }
          }
          return null;
        };
        E = f(G);
      }
      if (!E) {
        const f = l.path && l.path.length > 0 ? ` at path [${l.path.join(" → ")}]` : " at page root", b = [], I = (k, Y = 0) => {
          if (!(Y > 3) && ((k.type === "COMPONENT" || k.type === "COMPONENT_SET") && b.push(
            `${k.type}: "${k.name}"${k.type === "COMPONENT_SET" ? ` (${k.children.length} variants)` : ""}`
          ), k.children && Array.isArray(k.children)))
            for (const ie of k.children.slice(0, 10))
              I(ie, Y + 1);
        };
        I(G);
        const O = `Deferred instance "${N.name}" still cannot find component "${l.componentName}" on page "${l.componentPageName}"${f}`;
        t.error(O), g.push(O), d++;
        continue;
      }
      const U = E.createInstance();
      if (U.name = N.name || c.name.replace("[Deferred: ", "").replace("]", ""), U.x = c.x, U.y = c.y, c.width !== void 0 && c.height !== void 0 && U.resize(c.width, c.height), l.variantProperties && Object.keys(l.variantProperties).length > 0)
        try {
          const f = await U.getMainComponentAsync();
          if (f) {
            let b = null;
            const I = f.type;
            if (I === "COMPONENT_SET" ? b = f.componentPropertyDefinitions : I === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? b = f.parent.componentPropertyDefinitions : t.warning(
              `Cannot set variant properties for resolved instance "${N.name}" - main component is not a COMPONENT_SET or variant`
            ), b) {
              const O = {};
              for (const [k, Y] of Object.entries(
                l.variantProperties
              )) {
                const ie = k.split("#")[0];
                b[ie] && (O[ie] = Y);
              }
              Object.keys(O).length > 0 && U.setProperties(O);
            }
          }
        } catch (f) {
          t.warning(
            `Failed to set variant properties for resolved instance "${N.name}": ${f}`
          );
        }
      if (l.componentProperties && Object.keys(l.componentProperties).length > 0)
        try {
          const f = await U.getMainComponentAsync();
          if (f) {
            let b = null;
            const I = f.type;
            if (I === "COMPONENT_SET" ? b = f.componentPropertyDefinitions : I === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? b = f.parent.componentPropertyDefinitions : I === "COMPONENT" && (b = f.componentPropertyDefinitions), b)
              for (const [O, k] of Object.entries(
                l.componentProperties
              )) {
                const Y = O.split("#")[0];
                if (b[Y])
                  try {
                    U.setProperties({
                      [Y]: k
                    });
                  } catch (ie) {
                    t.warning(
                      `Failed to set component property "${Y}" for resolved instance "${N.name}": ${ie}`
                    );
                  }
              }
          }
        } catch (f) {
          t.warning(
            `Failed to set component properties for resolved instance "${N.name}": ${f}`
          );
        }
      await _t(
        U,
        N,
        o
      ), await zt(U, N), t.log(
        `[NESTED] Extracting child deferred instances for placeholder "${N.name}" (${w.substring(0, 8)}...). Total deferred instances: ${e.length}`
      );
      const L = async (f) => {
        try {
          const b = await figma.getNodeByIdAsync(f);
          if (!b || !b.parent) return !1;
          let I = b.parent;
          for (; I; ) {
            if (I.id === w)
              return !0;
            if (I.type === "PAGE")
              break;
            I = I.parent;
          }
          return !1;
        } catch (b) {
          return !1;
        }
      }, R = [];
      for (const f of e)
        f.parentPlaceholderId === w ? (R.push(f), t.log(
          `[NESTED]   - Found child by parentPlaceholderId: "${f.nodeData.name}" (placeholder: ${f.placeholderFrameId.substring(0, 8)}...)`
        )) : await L(
          f.placeholderFrameId
        ) && (R.push(f), t.log(
          `[NESTED]   - Found child by structural check: "${f.nodeData.name}" (placeholder: ${f.placeholderFrameId.substring(0, 8)}...) - placeholder is inside current placeholder`
        ));
      t.log(
        `[NESTED] Found ${R.length} child deferred instance(s) for placeholder "${N.name}"`
      );
      for (const f of R)
        S.add(f.placeholderFrameId);
      if ("children" in V && "insertChild" in V) {
        const f = V.children.indexOf(c);
        V.insertChild(f, U), c.remove();
      } else {
        const f = `Parent node does not support children operations for deferred instance "${N.name}"`;
        t.error(f), g.push(f);
        continue;
      }
      const p = (f, b) => {
        const I = [];
        if (f.name === b && I.push(f), "children" in f)
          for (const O of f.children)
            I.push(...p(O, b));
        return I;
      };
      for (const f of R)
        try {
          const b = p(
            U,
            f.nodeData.name
          );
          if (b.length === 0) {
            t.warning(
              `  Could not find matching child "${f.nodeData.name}" in resolved instance "${N.name}" - child may not exist in component`
            );
            continue;
          }
          if (b.length > 1) {
            const X = `Cannot resolve child deferred instance "${f.nodeData.name}": multiple children with same name in instance "${N.name}"`;
            t.error(X), g.push(X), d++;
            continue;
          }
          const I = b[0], O = f.instanceEntry;
          let k = figma.root.children.find((X) => {
            const x = X.name === O.componentPageName, H = n && X.name === `${n} ${O.componentPageName}`;
            return x || H;
          });
          if (!k) {
            const X = ve(
              O.componentPageName
            );
            k = figma.root.children.find((x) => ve(x.name) === X);
          }
          if (!k) {
            t.warning(
              `  Could not find referenced page for child deferred instance "${f.nodeData.name}"`
            );
            continue;
          }
          const Y = (X, x, H, z, D) => {
            if (x.length === 0) {
              let se = null;
              for (const ge of X.children || [])
                if (ge.type === "COMPONENT") {
                  const pe = ve(ge.name), ue = ve(H);
                  if (pe === ue)
                    if (se || (se = ge), z)
                      try {
                        const le = ge.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (le && JSON.parse(le).id === z)
                          return ge;
                      } catch (le) {
                      }
                    else
                      return ge;
                } else if (ge.type === "COMPONENT_SET" && D) {
                  const pe = ve(ge.name), ue = ve(D);
                  if (pe === ue) {
                    for (const le of ge.children)
                      if (le.type === "COMPONENT") {
                        const ce = ve(
                          le.name
                        ), be = ve(H);
                        if (ce === be)
                          if (se || (se = le), z)
                            try {
                              const he = le.getPluginData(
                                "RecursicaPublishedMetadata"
                              );
                              if (he && JSON.parse(he).id === z)
                                return le;
                            } catch (he) {
                            }
                          else
                            return le;
                      }
                  }
                }
              return se;
            }
            let fe = X;
            for (const se of x) {
              const ge = ve(se), pe = (fe.children || []).find(
                (ue) => ve(ue.name) === ge
              );
              if (!pe) return null;
              fe = pe;
            }
            if (fe.type === "COMPONENT") {
              const se = ve(fe.name), ge = ve(H);
              if (se === ge)
                if (z)
                  try {
                    const pe = fe.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (pe && JSON.parse(pe).id === z)
                      return fe;
                  } catch (pe) {
                    return null;
                  }
                else
                  return fe;
            } else if (fe.type === "COMPONENT_SET" && D) {
              for (const se of fe.children)
                if (se.type === "COMPONENT") {
                  const ge = ve(se.name), pe = ve(H);
                  if (ge === pe)
                    if (z)
                      try {
                        const ue = se.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (ue && JSON.parse(ue).id === z)
                          return se;
                      } catch (ue) {
                        continue;
                      }
                    else
                      return se;
                }
            }
            return null;
          };
          let ie = O.componentSetName;
          !ie && f.nodeData.name && (ie = f.nodeData.name, t.log(
            `  [NESTED] componentSetName not provided, using child name "${ie}" as fallback`
          )), t.log(
            `  [NESTED] Looking for component: page="${k.name}", componentSet="${ie}", component="${O.componentName}", path=[${(O.path || []).join(", ")}]`
          );
          const Z = (X) => {
            const x = [];
            if (X.type === "COMPONENT_SET" && x.push(X), "children" in X && Array.isArray(X.children))
              for (const H of X.children)
                x.push(...Z(H));
            return x;
          }, j = Z(k);
          t.log(
            `  [NESTED] Found ${j.length} component set(s) on page "${k.name}" (recursive search): ${j.map((X) => X.name).join(", ")}`
          );
          const ee = k.children.map(
            (X) => `${X.type}:${X.name}`
          );
          t.log(
            `  [NESTED] Direct children of page "${k.name}" (${ee.length}): ${ee.slice(0, 10).join(", ")}${ee.length > 10 ? "..." : ""}`
          );
          const te = Y(
            k,
            O.path || [],
            O.componentName,
            O.componentGuid,
            ie
          );
          if (!te) {
            if (t.warning(
              `  Could not find component "${O.componentName}" (componentSet: "${ie}") for child deferred instance "${f.nodeData.name}" on page "${k.name}"`
            ), ie) {
              const X = ve(ie), x = j.filter((H) => ve(H.name) === X);
              if (x.length > 0) {
                t.log(
                  `  [NESTED] Found ${x.length} component set(s) with matching clean name "${X}": ${x.map((H) => H.name).join(", ")}`
                );
                for (const H of x) {
                  const z = H.children.filter(
                    (D) => D.type === "COMPONENT"
                  );
                  t.log(
                    `  [NESTED] Component set "${H.name}" has ${z.length} variant(s): ${z.map((D) => D.name).join(", ")}`
                  );
                }
              }
            }
            continue;
          }
          const W = te.createInstance();
          W.name = f.nodeData.name || I.name, W.x = I.x, W.y = I.y, I.width !== void 0 && I.height !== void 0 && W.resize(I.width, I.height), await _t(
            W,
            f.nodeData,
            o
          ), await zt(
            W,
            f.nodeData
          );
          const oe = I.parent;
          if (!oe || !("children" in oe)) {
            const X = `Cannot replace child "${f.nodeData.name}": parent does not support children`;
            t.error(X), g.push(X), d++;
            continue;
          }
          const ae = oe.children.indexOf(I);
          oe.insertChild(ae, W), I.remove(), t.log(
            `  ✓ Resolved nested child deferred instance "${f.nodeData.name}" in "${N.name}"`
          );
        } catch (b) {
          t.warning(
            `  Error resolving child deferred instance "${f.nodeData.name}": ${b instanceof Error ? b.message : String(b)}`
          );
        }
      t.log(
        `  ✓ Resolved deferred instance "${N.name}" from component "${l.componentName}" on page "${l.componentPageName}"`
      ), r++;
    } catch (w) {
      const l = w instanceof Error ? w.message : String(w), N = `Failed to resolve deferred instance "${v.nodeData.name}": ${l}`;
      t.error(N), g.push(N), d++;
    }
  }
  return t.log(
    `=== Deferred Resolution Complete: ${r} resolved, ${d} failed ===`
  ), { resolved: r, failed: d, errors: g };
}
async function ln(e) {
  t.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: n, collectionIds: o, variableIds: i } = e;
    let a = 0;
    for (const r of i)
      try {
        const d = await figma.variables.getVariableByIdAsync(r);
        d && (d.remove(), a++);
      } catch (d) {
        t.warning(
          `Could not delete variable ${r.substring(0, 8)}...: ${d}`
        );
      }
    t.log(
      `Skipping deletion of ${o.length} collection(s) - collections are never deleted`
    ), await figma.loadAllPagesAsync();
    let s = 0;
    for (const r of n)
      try {
        const d = await figma.getNodeByIdAsync(r);
        d && d.type === "PAGE" && (d.remove(), s++);
      } catch (d) {
        t.warning(
          `Could not delete page ${r.substring(0, 8)}...: ${d}`
        );
      }
    return t.log(
      `Cleanup complete: Deleted ${s} page(s), ${a} variable(s) (collections are never deleted)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: s,
        deletedCollections: 0,
        // Never delete collections
        deletedVariables: a
      }
    };
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Cleanup failed: ${o}`), {
      type: "cleanupCreatedEntities",
      success: !1,
      error: !0,
      message: o,
      data: {}
    };
  }
}
const Co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cleanupCreatedEntities: ln,
  importPage: Rt,
  loadAndExpandJson: Ot,
  loadCollectionTable: rn,
  loadVariableTable: an,
  matchAndCreateVariables: sn,
  normalizeStructureTypes: yt,
  recreateNodeFromData: qe,
  resolveDeferredNormalInstances: xt,
  restoreBoundVariablesForFills: tn,
  sanitizeImportResult: Qt
}, Symbol.toStringTag, { value: "Module" }));
async function cn(e) {
  const n = [];
  for (const { fileName: o, jsonData: i } of e)
    try {
      const a = Ot(i);
      if (!a.success || !a.expandedJsonData) {
        t.warning(
          `Skipping ${o} - failed to expand JSON: ${a.error || "Unknown error"}`
        );
        continue;
      }
      const s = a.expandedJsonData, r = s.metadata;
      if (!r || !r.name || !r.guid) {
        t.warning(
          `Skipping ${o} - missing or invalid metadata`
        );
        continue;
      }
      const d = [];
      if (s.instances) {
        const y = it.fromTable(
          s.instances
        ).getSerializedTable();
        for (const u of Object.values(y))
          u.instanceType === "normal" && u.componentPageName && (d.includes(u.componentPageName) || d.push(u.componentPageName));
      }
      n.push({
        fileName: o,
        pageName: r.name,
        pageGuid: r.guid,
        dependencies: d,
        jsonData: i
        // Store original JSON data for import
      }), t.log(
        `  ${o}: "${r.name}" depends on: ${d.length > 0 ? d.join(", ") : "none"}`
      );
    } catch (a) {
      t.error(
        `Error processing ${o}: ${a instanceof Error ? a.message : String(a)}`
      );
    }
  return n;
}
function dn(e) {
  const n = [], o = [], i = [], a = /* @__PURE__ */ new Map();
  for (const y of e)
    a.set(y.pageName, y);
  const s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), d = [], g = (y) => {
    if (s.has(y.pageName))
      return !1;
    if (r.has(y.pageName)) {
      const u = d.findIndex(
        (S) => S.pageName === y.pageName
      );
      if (u !== -1) {
        const S = d.slice(u).concat([y]);
        return o.push(S), !0;
      }
      return !1;
    }
    r.add(y.pageName), d.push(y);
    for (const u of y.dependencies) {
      const S = a.get(u);
      S && g(S);
    }
    return r.delete(y.pageName), d.pop(), s.add(y.pageName), n.push(y), !1;
  };
  for (const y of e)
    s.has(y.pageName) || g(y);
  for (const y of e)
    for (const u of y.dependencies)
      a.has(u) || i.push(
        `Page "${y.pageName}" (${y.fileName}) depends on "${u}" which is not in the import set`
      );
  return { order: n, cycles: o, errors: i };
}
async function gn(e) {
  t.log("=== Building Dependency Graph ===");
  const n = await cn(e);
  t.log("=== Resolving Import Order ===");
  const o = dn(n);
  if (o.cycles.length > 0) {
    t.log(
      `Detected ${o.cycles.length} circular dependency cycle(s):`
    );
    for (const i of o.cycles) {
      const a = i.map((s) => `"${s.pageName}"`).join(" → ");
      t.log(`  Cycle: ${a} → (back to start)`);
    }
    t.log(
      "  Circular dependencies will be handled with deferred instance resolution"
    );
  }
  if (o.errors.length > 0) {
    t.warning(
      `Found ${o.errors.length} missing dependency warning(s):`
    );
    for (const i of o.errors)
      t.warning(`  ${i}`);
  }
  t.log(`Import order determined: ${o.order.length} page(s)`);
  for (let i = 0; i < o.order.length; i++) {
    const a = o.order[i];
    t.log(`  ${i + 1}. ${a.fileName} ("${a.pageName}")`);
  }
  return o;
}
async function fn(e) {
  var V, G, F, E, U, L;
  const { jsonFiles: n } = e;
  if (!n || !Array.isArray(n))
    return {
      type: "importPagesInOrder",
      success: !1,
      error: !0,
      message: "jsonFiles must be an array",
      data: {}
    };
  t.log("=== Determining Import Order ===");
  const {
    order: o,
    cycles: i,
    errors: a
  } = await gn(n);
  a.length > 0 && t.warning(
    `Found ${a.length} dependency warning(s) - some dependencies may be missing`
  ), i.length > 0 && t.log(
    `Detected ${i.length} circular dependency cycle(s) - will use deferred resolution`
  );
  const s = /* @__PURE__ */ new Map();
  if (t.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    t.log("=== Pre-creating Collections ==="), t.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const R = "recursica:collectionId", p = async (b) => {
      const I = await figma.variables.getLocalVariableCollectionsAsync(), O = new Set(I.map((ie) => ie.name));
      if (!O.has(b))
        return b;
      let k = 1, Y = `${b}_${k}`;
      for (; O.has(Y); )
        k++, Y = `${b}_${k}`;
      return Y;
    }, f = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: b, normalizedName: I } of f)
      if (b === "new") {
        t.log(
          `Processing collection type: "${I}" (choice: "new") - will create new collection`
        );
        const O = await p(I), k = figma.variables.createVariableCollection(O);
        if (ze(I)) {
          const Y = dt(I);
          Y && (k.setSharedPluginData(
            "recursica",
            R,
            Y
          ), t.log(
            `  Stored fixed GUID: ${Y.substring(0, 8)}...`
          ));
        }
        s.set(I, k), t.log(
          `✓ Pre-created collection: "${O}" (normalized: "${I}", id: ${k.id.substring(0, 8)}...)`
        );
      } else
        t.log(
          `Skipping collection type: "${I}" (choice: "existing")`
        );
    s.size > 0 && t.log(
      `Pre-created ${s.size} collection(s) for reuse across all imports`
    );
  }
  t.log("=== Importing Pages in Order ===");
  let r = 0, d = 0;
  const g = [...a], y = [], u = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, S = [], $ = [];
  if (s.size > 0)
    for (const R of s.values())
      u.collectionIds.push(R.id), t.log(
        `Tracking pre-created collection: "${R.name}" (${R.id.substring(0, 8)}...)`
      );
  const v = e.mainFileName;
  for (let R = 0; R < o.length; R++) {
    const p = o[R], f = v ? p.fileName === v : R === o.length - 1;
    t.log(
      `[${R + 1}/${o.length}] Importing ${p.fileName} ("${p.pageName}")${f ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const b = R === 0, I = await Rt({
        jsonData: p.jsonData,
        isMainPage: f,
        clearConsole: b,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (V = e.skipUniqueNaming) != null ? V : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: s
        // Pass pre-created collections for reuse
      });
      if (I.success) {
        if (r++, (G = I.data) != null && G.deferredInstances) {
          const O = I.data.deferredInstances;
          Array.isArray(O) && (t.log(
            `  [DEBUG] Collected ${O.length} deferred instance(s) from ${p.fileName}`
          ), y.push(...O));
        } else
          t.log(
            `  [DEBUG] No deferred instances in response for ${p.fileName}`
          );
        if ((F = I.data) != null && F.importResult) {
          const O = I.data.importResult;
          $.push(O), O.createdPageIds && u.pageIds.push(...O.createdPageIds), O.createdCollectionIds && u.collectionIds.push(
            ...O.createdCollectionIds
          ), O.createdVariableIds && u.variableIds.push(
            ...O.createdVariableIds
          );
          const k = ((E = O.createdPageIds) == null ? void 0 : E[0]) || ((U = I.data) == null ? void 0 : U.pageId);
          (L = I.data) != null && L.pageName && k && S.push({
            name: I.data.pageName,
            pageId: k
          });
        }
      } else
        d++, g.push(
          `Failed to import ${p.fileName}: ${I.message || "Unknown error"}`
        );
    } catch (b) {
      d++;
      const I = b instanceof Error ? b.message : String(b);
      g.push(`Failed to import ${p.fileName}: ${I}`);
    }
  }
  let w = 0;
  if (y.length > 0) {
    t.log(
      `=== Resolving ${y.length} Deferred Instance(s) ===`
    );
    try {
      t.log(
        "  Rebuilding variable and collection tables from imported JSON files..."
      );
      const {
        loadAndExpandJson: R,
        loadCollectionTable: p,
        loadVariableTable: f,
        matchAndCreateVariables: b
      } = await Promise.resolve().then(() => Co), I = [], O = [];
      for (const ee of o)
        try {
          const te = R(ee.jsonData);
          if (te.success && te.expandedJsonData) {
            const W = te.expandedJsonData, oe = p(W);
            oe.success && oe.collectionTable && O.push(oe.collectionTable);
            const ae = f(W);
            ae.success && ae.variableTable && I.push(ae.variableTable);
          }
        } catch (te) {
          t.warning(
            `  Could not load tables from ${ee.fileName}: ${te}`
          );
        }
      let k = null, Y = null;
      I.length > 0 && (k = I[I.length - 1], t.log(
        `  Using variable table with ${k.getSize()} variable(s)`
      )), O.length > 0 && (Y = O[O.length - 1], t.log(
        `  Using collection table with ${Y.getSize()} collection(s)`
      ));
      const ie = /* @__PURE__ */ new Map();
      if (Y) {
        const ee = await figma.variables.getLocalVariableCollectionsAsync(), te = /* @__PURE__ */ new Map();
        for (const oe of ee) {
          const ae = Ve(oe.name);
          te.set(ae, oe);
        }
        const W = Y.getTable();
        for (const [oe, ae] of Object.entries(
          W
        )) {
          const X = ae, x = Ve(
            X.collectionName
          ), H = te.get(x);
          H ? (ie.set(oe, H), t.log(
            `  Matched collection table index ${oe} ("${X.collectionName}") to collection "${H.name}"`
          )) : t.warning(
            `  Could not find collection for table index ${oe} ("${X.collectionName}")`
          );
        }
      }
      let Z = /* @__PURE__ */ new Map();
      if (k && Y) {
        const { recognizedVariables: ee } = await b(
          k,
          Y,
          ie,
          []
          // newlyCreatedCollections - empty since they're already created
        );
        Z = ee, t.log(
          `  Built recognizedVariables map with ${Z.size} variable(s)`
        );
      } else
        t.warning(
          "  Could not build recognizedVariables map - variable or collection table missing"
        );
      const j = await xt(
        y,
        e.constructionIcon || "",
        Z,
        k || null,
        Y || null,
        ie
      );
      t.log(
        `  Resolved: ${j.resolved}, Failed: ${j.failed}`
      ), j.errors.length > 0 && (g.push(...j.errors), w = j.failed);
    } catch (R) {
      const p = `Failed to resolve deferred instances: ${R instanceof Error ? R.message : String(R)}`;
      g.push(p), w = y.length;
    }
  }
  const l = [...new Set(u.collectionIds)];
  if (t.log("=== Import Summary ==="), t.log(
    `  Imported: ${r}, Failed: ${d}, Deferred instances: ${y.length}, Deferred resolution failed: ${w}`
  ), t.log(
    `  Collections in allCreatedEntityIds: ${u.collectionIds.length}, Unique: ${l.length}`
  ), l.length > 0) {
    t.log(`  Created ${l.length} collection(s)`);
    for (const R of l)
      try {
        const p = await figma.variables.getVariableCollectionByIdAsync(R);
        p && t.log(
          `    - "${p.name}" (${R.substring(0, 8)}...)`
        );
      } catch (p) {
      }
  }
  const N = d === 0 && w === 0, m = N ? `Successfully imported ${r} page(s)${y.length > 0 ? ` (${y.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${d} failure(s). ${g.join("; ")}`, c = "RecursicaImportResult";
  if ($.length > 0) {
    const R = $.map(
      (p) => Qt(p)
    );
    figma.root.setPluginData(
      c,
      JSON.stringify(R)
    ), t.log(
      `Stored ${R.length} sanitized importResult object(s) globally for cleanup/delete operations`
    );
  }
  return {
    type: "importPagesInOrder",
    success: N,
    error: !N,
    message: m,
    data: {
      imported: r,
      failed: d,
      deferred: y.length,
      errors: g,
      importedPages: S
    }
  };
}
async function Eo(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children;
    console.log("Found " + n.length + " pages in the document");
    const o = 11, i = n[o];
    if (!i)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const a = await ht(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + o + ")"
    );
    const s = JSON.stringify(a, null, 2), r = JSON.parse(s), d = "Copy - " + r.name, g = figma.createPage();
    if (g.name = d, figma.root.appendChild(g), r.children && r.children.length > 0) {
      let S = function(v) {
        v.forEach((w) => {
          const l = (w.x || 0) + (w.width || 0);
          l > $ && ($ = l), w.children && w.children.length > 0 && S(w.children);
        });
      };
      console.log(
        "Recreating " + r.children.length + " top-level children..."
      );
      let $ = 0;
      S(r.children), console.log("Original content rightmost edge: " + $);
      for (const v of r.children)
        await qe(v, g, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const y = ut(r);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: r.name,
        newPageName: d,
        totalNodes: y
      }
    };
  } catch (n) {
    return console.error("Error performing quick copy:", n), {
      type: "quickCopy",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Io(e) {
  try {
    const n = e.accessToken, o = e.selectedRepo;
    return n ? (await figma.clientStorage.setAsync("accessToken", n), o && await figma.clientStorage.setAsync("selectedRepo", o), e.hasWriteAccess !== void 0 && await figma.clientStorage.setAsync("hasWriteAccess", e.hasWriteAccess), {
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
  } catch (n) {
    return {
      type: "storeAuthData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function wo(e) {
  try {
    const n = await figma.clientStorage.getAsync("accessToken"), o = await figma.clientStorage.getAsync("selectedRepo"), i = await figma.clientStorage.getAsync("hasWriteAccess");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: n || void 0,
        selectedRepo: o || void 0,
        hasWriteAccess: i != null ? i : void 0
      }
    };
  } catch (n) {
    return {
      type: "loadAuthData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ao(e) {
  try {
    return await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), await figma.clientStorage.deleteAsync("hasWriteAccess"), {
      type: "clearAuthData",
      success: !0,
      error: !1,
      message: "Auth data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (n) {
    return {
      type: "clearAuthData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Po(e) {
  try {
    return await figma.clientStorage.setAsync("importData", e.importData), {
      type: "storeImportData",
      success: !0,
      error: !1,
      message: "Import data stored successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (n) {
    return {
      type: "storeImportData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function To(e) {
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
  } catch (n) {
    return {
      type: "loadImportData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Oo(e) {
  try {
    return await figma.clientStorage.deleteAsync("importData"), {
      type: "clearImportData",
      success: !0,
      error: !1,
      message: "Import data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (n) {
    return {
      type: "clearImportData",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ro(e) {
  try {
    const n = e.selectedRepo;
    return n ? (await figma.clientStorage.setAsync("selectedRepo", n), {
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
  } catch (n) {
    return {
      type: "storeSelectedRepo",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
function Pe(e, n = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: n
  };
}
function Me(e, n, o = {}) {
  const i = n instanceof Error ? n.message : n;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: o
  };
}
const pn = "RecursicaPublishedMetadata";
async function xo(e) {
  try {
    const n = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (d) => d.id === n.id
    ), a = n.getPluginData(pn);
    if (!a) {
      const y = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: ct(n.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return Pe("getComponentMetadata", y);
    }
    const r = {
      componentMetadata: JSON.parse(a),
      currentPageIndex: i
    };
    return Pe("getComponentMetadata", r);
  } catch (n) {
    return console.error("Error getting component metadata:", n), Me(
      "getComponentMetadata",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function Vo(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children, o = [];
    for (const a of n) {
      if (a.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${a.name} (type: ${a.type})`
        );
        continue;
      }
      const s = a, r = s.getPluginData(pn);
      if (r)
        try {
          const d = JSON.parse(r);
          o.push(d);
        } catch (d) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            d
          );
          const y = {
            _ver: 1,
            id: "",
            name: ct(s.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          o.push(y);
        }
      else {
        const g = {
          _ver: 1,
          id: "",
          name: ct(s.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        o.push(g);
      }
    }
    return Pe("getAllComponents", {
      components: o
    });
  } catch (n) {
    return console.error("Error getting all components:", n), Me(
      "getAllComponents",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function Mo(e) {
  try {
    const n = e.requestId, o = e.action;
    return !n || !o ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (nt.handleResponse({ requestId: n, action: o }), {
      type: "pluginPromptResponse",
      success: !0,
      error: !1,
      message: "Prompt response handled successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    });
  } catch (n) {
    return {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function ko(e) {
  try {
    const { pageId: n } = e;
    await figma.loadAllPagesAsync();
    const o = await figma.getNodeByIdAsync(n);
    return !o || o.type !== "PAGE" ? {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: `Page with ID ${n.substring(0, 8)}... not found`,
      data: {}
    } : (await figma.setCurrentPageAsync(o), {
      type: "switchToPage",
      success: !0,
      error: !1,
      message: `Switched to page "${o.name}"`,
      data: {
        pageName: o.name
      }
    });
  } catch (n) {
    return {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: n instanceof Error ? n.message : "Unknown error occurred",
      data: {}
    };
  }
}
const xe = "RecursicaPrimaryImport", Ge = "RecursicaImportResult", mn = "---", un = "---", Re = "RecursicaImportDivider", et = "start", tt = "end", Fe = "⚠️";
async function Uo(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children;
    for (const i of n) {
      if (i.type !== "PAGE")
        continue;
      const a = i.getPluginData(xe);
      if (a)
        try {
          const r = JSON.parse(a), d = {
            exists: !0,
            pageId: i.id,
            metadata: r
          };
          return Pe(
            "checkForExistingPrimaryImport",
            d
          );
        } catch (r) {
          t.warning(
            `Failed to parse primary import metadata on page "${i.name}": ${r}`
          );
          continue;
        }
      if (figma.root.getPluginData(Ge)) {
        const r = i.getPluginData(xe);
        if (r)
          try {
            const d = JSON.parse(r), g = {
              exists: !0,
              pageId: i.id,
              metadata: d
            };
            return Pe(
              "checkForExistingPrimaryImport",
              g
            );
          } catch (d) {
          }
      }
    }
    return Pe("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (n) {
    return console.error("Error checking for existing primary import:", n), Me(
      "checkForExistingPrimaryImport",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function Lo(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children.find(
      (d) => d.type === "PAGE" && d.getPluginData(Re) === et
    ), o = figma.root.children.find(
      (d) => d.type === "PAGE" && d.getPluginData(Re) === tt
    );
    if (n && o) {
      const d = {
        startDividerId: n.id,
        endDividerId: o.id
      };
      return Pe("createImportDividers", d);
    }
    const i = figma.createPage();
    i.name = mn, i.setPluginData(Re, et);
    const a = figma.createPage();
    a.name = un, a.setPluginData(Re, tt);
    const s = figma.root.children.indexOf(i);
    figma.root.insertChild(s + 1, a), t.log("Created import dividers");
    const r = {
      startDividerId: i.id,
      endDividerId: a.id
    };
    return Pe("createImportDividers", r);
  } catch (n) {
    return console.error("Error creating import dividers:", n), Me(
      "createImportDividers",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function Fo(e) {
  try {
    t.log("=== Starting Single Component Import ==="), t.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let n = figma.root.children.find(
      (p) => p.type === "PAGE" && p.getPluginData(Re) === et
    );
    n || (n = figma.createPage(), n.name = mn, n.setPluginData(Re, et), t.log("Created start divider"));
    const i = [
      ...e.dependencies.filter(
        (p) => !p.useExisting
      ).map((p) => ({
        fileName: `${p.name}.json`,
        jsonData: p.jsonData
      })),
      {
        fileName: `${e.mainComponent.name}.json`,
        jsonData: e.mainComponent.jsonData
      }
    ];
    t.log(
      `Importing ${i.length} file(s) in dependency order...`
    );
    const a = await fn({
      jsonFiles: i,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: Fe
      // Add construction icon to page names
    });
    if (!a.success)
      throw new Error(
        a.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const s = figma.root.children;
    let r = s.find(
      (p) => p.type === "PAGE" && p.getPluginData(Re) === tt
    );
    if (!r) {
      r = figma.createPage(), r.name = un, r.setPluginData(
        Re,
        tt
      );
      let p = s.length;
      for (let f = s.length - 1; f >= 0; f--) {
        const b = s[f];
        if (b.type === "PAGE" && b.getPluginData(Re) !== et && b.getPluginData(Re) !== tt) {
          p = f + 1;
          break;
        }
      }
      figma.root.insertChild(p, r), t.log("Created end divider");
    }
    const d = figma.root.getPluginData(Ge);
    if (d)
      try {
        const p = JSON.parse(
          d
        ), f = [];
        if (n && f.push(n.id), r && f.push(r.id), f.length > 0) {
          for (const b of p) {
            b.createdPageIds || (b.createdPageIds = []);
            const I = new Set(b.createdPageIds);
            for (const O of f)
              I.has(O) || b.createdPageIds.push(O);
          }
          figma.root.setPluginData(
            Ge,
            JSON.stringify(p)
          ), t.log(
            `Added ${f.length} divider ID(s) to global importResult: ${f.map((b) => b.substring(0, 8) + "...").join(", ")}`
          );
        }
      } catch (p) {
        t.warning(
          `Failed to add divider IDs to importResult: ${p}`
        );
      }
    else
      t.warning(
        "No global importResult found - dividers will not be tracked for cleanup"
      );
    t.log(
      `Import result data structure: ${JSON.stringify(Object.keys(a.data || {}))}`
    );
    const g = a.data;
    if (t.log(
      "Import completed. ImportResult objects are stored globally for cleanup/delete operations."
    ), !(g != null && g.importedPages) || g.importedPages.length === 0)
      throw new Error("No pages were imported");
    const y = "RecursicaPublishedMetadata", u = e.mainComponent.guid;
    t.log(
      `Looking for main page by GUID: ${u.substring(0, 8)}...`
    );
    let S, $ = null;
    for (const p of g.importedPages)
      try {
        const f = await figma.getNodeByIdAsync(
          p.pageId
        );
        if (f && f.type === "PAGE") {
          const b = f.getPluginData(y);
          if (b)
            try {
              if (JSON.parse(b).id === u) {
                S = p.pageId, $ = f, t.log(
                  `Found main page by GUID: "${f.name}" (ID: ${p.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (I) {
            }
        }
      } catch (f) {
        t.warning(
          `Error checking page ${p.pageId}: ${f}`
        );
      }
    if (!S) {
      t.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const p = figma.root.children;
      for (const f of p)
        if (f.type === "PAGE") {
          const b = f.getPluginData(y);
          if (b)
            try {
              if (JSON.parse(b).id === u) {
                S = f.id, $ = f, t.log(
                  `Found main page by GUID in all pages: "${f.name}" (ID: ${f.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (I) {
            }
        }
    }
    if (!S || !$) {
      t.error(
        `Failed to find imported main page by GUID: ${u.substring(0, 8)}...`
      ), t.log("Imported pages were:");
      for (const p of g.importedPages)
        t.log(
          `  - "${p.name}" (ID: ${p.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!$ || $.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const p of g.importedPages)
      try {
        const f = await figma.getNodeByIdAsync(
          p.pageId
        );
        if (f && f.type === "PAGE") {
          const b = f.name.replace(/_\d+$/, "");
          if (!b.startsWith(Fe))
            f.name = `${Fe} ${b}`;
          else {
            const I = b.replace(Fe, "").trim();
            f.name = `${Fe} ${I}`;
          }
        }
      } catch (f) {
        t.warning(
          `Failed to process page ${p.pageId}: ${f}`
        );
      }
    await figma.loadAllPagesAsync();
    const v = figma.root.children, w = v.find(
      (p) => p.type === "PAGE" && (p.name === "REMOTES" || p.name === `${Fe} REMOTES`)
    );
    w && (w.name.startsWith(Fe) || (w.name = `${Fe} REMOTES`), t.log("Ensured construction icon on REMOTES page"));
    const l = v.find(
      (p) => p.type === "PAGE" && p.getPluginData(Re) === et
    ), N = v.find(
      (p) => p.type === "PAGE" && p.getPluginData(Re) === tt
    );
    if (l && N) {
      const p = v.indexOf(l), f = v.indexOf(N);
      for (let b = p + 1; b < f; b++) {
        const I = v[b];
        I.type === "PAGE" && t.log(
          `Found page "${I.name}" between dividers (will be identified by importResult)`
        );
      }
    }
    const m = [], c = [], V = figma.root.getPluginData(Ge), G = [], F = [];
    if (V)
      try {
        const p = JSON.parse(
          V
        );
        for (const f of p)
          f.createdCollectionIds && G.push(...f.createdCollectionIds), f.createdVariableIds && F.push(...f.createdVariableIds);
      } catch (p) {
        t.warning(
          `[EXTRACTION] Failed to parse global importResult: ${p}`
        );
      }
    if (t.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs from global importResult: ${G.length}`
    ), G.length > 0) {
      t.log(
        `[EXTRACTION] Collection IDs to process: ${G.map((p) => p.substring(0, 8) + "...").join(", ")}`
      );
      for (const p of G)
        try {
          const f = await figma.variables.getVariableCollectionByIdAsync(p);
          f ? (m.push({
            collectionId: f.id,
            collectionName: f.name
          }), t.log(
            `[EXTRACTION] ✓ Extracted collection: "${f.name}" (${p.substring(0, 8)}...)`
          )) : (m.push({
            collectionId: p,
            collectionName: `Unknown (${p.substring(0, 8)}...)`
          }), t.warning(
            `[EXTRACTION] Collection ${p.substring(0, 8)}... not found - will still track for cleanup`
          ));
        } catch (f) {
          m.push({
            collectionId: p,
            collectionName: `Unknown (${p.substring(0, 8)}...)`
          }), t.warning(
            `[EXTRACTION] Failed to get collection ${p.substring(0, 8)}...: ${f} - will still track for cleanup`
          );
        }
    } else
      t.warning(
        "[EXTRACTION] No collectionIds found in global importResult"
      );
    if (t.log(
      `[EXTRACTION] Total collections extracted: ${m.length}`
    ), m.length > 0 && t.log(
      `[EXTRACTION] Extracted collections: ${m.map((p) => `"${p.collectionName}" (${p.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), F.length > 0) {
      t.log(
        `[EXTRACTION] Processing ${F.length} variable ID(s)...`
      );
      for (const p of F)
        try {
          const f = await figma.variables.getVariableByIdAsync(p);
          if (f && f.resolvedType) {
            const b = await figma.variables.getVariableCollectionByIdAsync(
              f.variableCollectionId
            );
            b ? c.push({
              variableId: f.id,
              variableName: f.name,
              collectionId: f.variableCollectionId,
              collectionName: b.name
            }) : c.push({
              variableId: f.id,
              variableName: f.name,
              collectionId: f.variableCollectionId,
              collectionName: `Unknown (${f.variableCollectionId.substring(0, 8)}...)`
            });
          }
        } catch (f) {
          t.warning(
            `Failed to get variable ${p}: ${f}`
          );
        }
      t.log(
        `[EXTRACTION] Total variables extracted: ${c.length}`
      );
    } else
      t.warning(
        "[EXTRACTION] No variableIds found in global importResult"
      );
    if (m.length === 0 && G.length > 0) {
      t.warning(
        "[EXTRACTION] Collection extraction failed, but IDs are available in global importResult - creating fallback entries"
      );
      for (const p of G)
        m.push({
          collectionId: p,
          collectionName: `Unknown (${p.substring(0, 8)}...)`
        });
    }
    if (c.length === 0 && F.length > 0) {
      t.warning(
        "[EXTRACTION] Variable extraction failed, but IDs are available in global importResult - creating fallback entries"
      );
      for (const p of F)
        c.push({
          variableId: p,
          variableName: `Unknown (${p.substring(0, 8)}...)`,
          collectionId: "unknown",
          collectionName: "Unknown"
        });
    }
    const E = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: m,
      createdVariables: c,
      importError: void 0
      // No error yet
    };
    t.log(
      `Storing metadata with ${m.length} collection(s) and ${c.length} variable(s)`
    ), $.setPluginData(
      xe,
      JSON.stringify(E)
    ), t.log("Stored primary import metadata on main page");
    const U = [];
    g.importedPages && U.push(
      ...g.importedPages.map((p) => p.pageId)
    ), t.log("=== Single Component Import Complete ==="), E.importError = void 0, t.log(
      `[METADATA] About to store metadata with ${m.length} collection(s) and ${c.length} variable(s)`
    ), m.length > 0 && t.log(
      `[METADATA] Collections to store: ${m.map((p) => `"${p.collectionName}" (${p.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), $.setPluginData(
      xe,
      JSON.stringify(E)
    ), t.log(
      `[METADATA] Stored metadata: ${m.length} collection(s), ${c.length} variable(s)`
    );
    const L = $.getPluginData(xe);
    if (L)
      try {
        const p = JSON.parse(L);
        t.log(
          `[METADATA] Verification: Stored metadata has ${p.createdCollections.length} collection(s) and ${p.createdVariables.length} variable(s)`
        );
      } catch (p) {
        t.warning("[METADATA] Failed to verify stored metadata");
      }
    const R = {
      success: !0,
      mainPageId: $.id,
      importedPageIds: U,
      createdCollections: m,
      createdVariables: c
    };
    return Pe("importSingleComponentWithWizard", R);
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    t.error(`Import failed: ${o}`);
    try {
      await figma.loadAllPagesAsync();
      const i = figma.root.children;
      let a = null;
      for (const s of i) {
        if (s.type !== "PAGE") continue;
        const r = s.getPluginData(xe);
        if (r)
          try {
            if (JSON.parse(r).componentGuid === e.mainComponent.guid) {
              a = s;
              break;
            }
          } catch (d) {
          }
      }
      if (a) {
        const s = a.getPluginData(xe);
        if (s)
          try {
            const r = JSON.parse(s);
            t.log(
              `[CATCH] Found existing metadata with ${r.createdCollections.length} collection(s) and ${r.createdVariables.length} variable(s)`
            ), r.importError = o, a.setPluginData(
              xe,
              JSON.stringify(r)
            ), t.log(
              `[CATCH] Updated existing metadata with error. Collections: ${r.createdCollections.length}, Variables: ${r.createdVariables.length}`
            );
          } catch (r) {
            t.warning(`[CATCH] Failed to update metadata: ${r}`);
          }
      } else {
        t.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const s = [], r = "RecursicaPublishedMetadata", d = figma.root.getPluginData(Ge), g = [];
        if (d)
          try {
            const S = JSON.parse(
              d
            );
            for (const $ of S)
              $.createdPageIds && g.push(...$.createdPageIds);
          } catch (S) {
          }
        for (const S of i) {
          if (S.type !== "PAGE") continue;
          const $ = !!S.getPluginData(r), v = g.includes(S.id);
          ($ || v) && s.push(S);
        }
        const y = [];
        if (e.wizardSelections) {
          const S = await figma.variables.getLocalVariableCollectionsAsync(), $ = [
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
          for (const { choice: v, normalizedName: w } of $)
            if (v === "new") {
              const l = S.filter((N) => Ve(N.name) === w);
              if (l.length > 0) {
                const N = l[0];
                y.push({
                  collectionId: N.id,
                  collectionName: N.name
                }), t.log(
                  `Found created collection: "${N.name}" (${N.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const u = [];
        if (s.length > 0) {
          const S = s[0], $ = {
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
            createdCollections: y,
            createdVariables: u,
            importError: o
          };
          S.setPluginData(
            xe,
            JSON.stringify($)
          ), t.log(
            `Created fallback metadata with ${y.length} collection(s) and error information`
          );
        }
      }
    } catch (i) {
      t.warning(
        `Failed to store error metadata: ${i instanceof Error ? i.message : String(i)}`
      );
    }
    return Me(
      "importSingleComponentWithWizard",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function hn(e) {
  try {
    t.log("=== Starting Import Group Deletion ==="), await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!n || n.type !== "PAGE")
      throw new Error("Main page not found");
    const o = n.getPluginData(xe);
    if (!o)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(o);
    t.log(
      `Found metadata: ${i.createdCollections.length} collection(s), ${i.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const a = figma.root.children, s = [], r = "RecursicaPublishedMetadata", d = figma.root.getPluginData(Ge), g = [];
    if (d)
      try {
        const N = JSON.parse(d);
        for (const m of N)
          m.createdPageIds && g.push(...m.createdPageIds);
        t.log(
          `Found ${g.length} page ID(s) in global importResult (includes dividers)`
        );
      } catch (N) {
        t.warning(`Failed to parse global importResult: ${N}`);
      }
    if (g.length > 0)
      for (const N of g)
        try {
          const m = await figma.getNodeByIdAsync(
            N
          );
          m && m.type === "PAGE" && (s.push(m), t.log(
            `Found page to delete from importResult: "${m.name}" (${N.substring(0, 8)}...)`
          ));
        } catch (m) {
          t.warning(
            `Could not get page ${N.substring(0, 8)}...: ${m}`
          );
        }
    else {
      t.log(
        "No importResult found, falling back to PAGE_METADATA_KEY for page identification"
      );
      for (const N of a) {
        if (N.type !== "PAGE")
          continue;
        !!N.getPluginData(r) && (s.push(N), t.log(`Found page to delete (legacy): "${N.name}"`));
      }
    }
    t.log(
      `Deleting ${i.createdVariables.length} variable(s) we created...`
    );
    let y = 0;
    for (const N of i.createdVariables)
      try {
        const m = await figma.variables.getVariableByIdAsync(
          N.variableId
        );
        m ? (m.remove(), y++, t.log(
          `Deleted variable: ${N.variableName} from collection ${N.collectionName}`
        )) : t.warning(
          `Variable ${N.variableName} (${N.variableId}) not found - may have already been deleted`
        );
      } catch (m) {
        t.warning(
          `Failed to delete variable ${N.variableName}: ${m instanceof Error ? m.message : String(m)}`
        );
      }
    t.log("Deleting created styles...");
    let u = 0;
    const S = figma.root.getPluginData(Ge);
    if (S)
      try {
        const N = JSON.parse(
          S
        ), m = /* @__PURE__ */ new Set();
        for (const c of N)
          if (c.createdStyleIds)
            for (const V of c.createdStyleIds)
              m.add(V);
        t.log(
          `Found ${m.size} style(s) to delete from global importResult`
        );
        for (const c of m)
          try {
            const V = await figma.getStyleByIdAsync(c);
            V && (V.remove(), u++, t.log(
              `Deleted style: ${V.name} (${c.substring(0, 8)}...)`
            ));
          } catch (V) {
            t.warning(
              `Failed to delete style ${c.substring(0, 8)}...: ${V instanceof Error ? V.message : String(V)}`
            );
          }
      } catch (N) {
        t.warning(
          `Failed to parse global importResult for styles: ${N instanceof Error ? N.message : String(N)}`
        );
      }
    t.log(
      `Skipping deletion of ${i.createdCollections.length} collection(s) - collections are never deleted`
    );
    const $ = s.map((N) => ({
      page: N,
      name: N.name,
      id: N.id
    })), v = figma.currentPage;
    if ($.some(
      (N) => N.id === v.id
    )) {
      await figma.loadAllPagesAsync();
      const m = figma.root.children.find(
        (c) => c.type === "PAGE" && !$.some((V) => V.id === c.id)
      );
      m ? (await figma.setCurrentPageAsync(m), t.log(
        `Switched away from page "${v.name}" before deletion`
      )) : t.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: N, name: m } of $)
      try {
        let c = !1;
        try {
          await figma.loadAllPagesAsync(), c = figma.root.children.some((G) => G.id === N.id);
        } catch (V) {
          c = !1;
        }
        if (!c) {
          t.log(`Page "${m}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === N.id) {
          await figma.loadAllPagesAsync();
          const G = figma.root.children.find(
            (F) => F.type === "PAGE" && F.id !== N.id && !$.some((E) => E.id === F.id)
          );
          G && await figma.setCurrentPageAsync(G);
        }
        N.remove(), t.log(`Deleted page: "${m}"`);
      } catch (c) {
        t.warning(
          `Failed to delete page "${m}": ${c instanceof Error ? c.message : String(c)}`
        );
      }
    t.log("=== Import Group Deletion Complete ===");
    const l = {
      success: !0,
      deletedPages: s.length,
      deletedCollections: 0,
      // Never delete collections
      deletedVariables: y,
      deletedStyles: u
    };
    return Pe("deleteImportGroup", l);
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Delete failed: ${o}`), Me(
      "deleteImportGroup",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Go(e) {
  try {
    t.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const n = figma.root.children, o = "RecursicaPublishedMetadata", i = "RecursicaCreatedEntities", a = figma.root.getPluginData(Ge), s = !!a;
    let r = !1;
    for (const m of n) {
      if (m.type !== "PAGE")
        continue;
      if (m.getPluginData(i)) {
        r = !0;
        break;
      }
    }
    if (s)
      t.log(
        "Found global RecursicaImportResult, using importResult-based cleanup logic"
      );
    else if (r)
      t.log(
        "Found pages with RecursicaCreatedEntities (legacy), using createdEntities-based cleanup logic"
      );
    else {
      let m = null;
      for (const c of n) {
        if (c.type !== "PAGE")
          continue;
        if (c.getPluginData(xe)) {
          m = c;
          break;
        }
      }
      if (m)
        return t.log(
          "Found page with PRIMARY_IMPORT_KEY (old system), using deleteImportGroup"
        ), await hn({ pageId: m.id });
      t.log(
        "No primary metadata found, looking for pages using global importResult or PAGE_METADATA_KEY"
      );
    }
    const d = [], g = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set();
    let u = [];
    if (s)
      try {
        u = JSON.parse(a), t.log(
          `Found ${u.length} importResult object(s) in global storage`
        );
        for (const m of u) {
          if (m.createdCollectionIds)
            for (const c of m.createdCollectionIds)
              g.add(c);
          if (m.createdVariableIds)
            for (const c of m.createdVariableIds)
              y.add(c);
        }
        t.log(
          `Extracted ${g.size} collection ID(s) and ${y.size} variable ID(s) from global importResult`
        );
      } catch (m) {
        t.warning(`Failed to parse global importResult: ${m}`);
      }
    else if (r) {
      t.log(
        `Scanning ${n.length} page(s) for legacy created entities...`
      );
      for (const m of n) {
        if (m.type !== "PAGE")
          continue;
        const c = m.getPluginData(i);
        if (c)
          try {
            const V = JSON.parse(c);
            if (V.collectionIds)
              for (const G of V.collectionIds)
                g.add(G);
            if (V.variableIds)
              for (const G of V.variableIds)
                y.add(G);
          } catch (V) {
            t.warning(
              `Failed to parse created entities from page "${m.name}": ${V}`
            );
          }
      }
    }
    t.log(
      `Scanning ${n.length} page(s) for pages to delete...`
    );
    for (const m of n) {
      if (m.type !== "PAGE")
        continue;
      const c = m.getPluginData(o), V = m.getPluginData(i), G = s && u.some((F) => {
        var E;
        return (E = F.createdPageIds) == null ? void 0 : E.includes(m.id);
      });
      t.log(
        `  Checking page "${m.name}": hasMetadata=${!!c}, isInImportResult=${G}, hasLegacyCreatedEntities=${!!V}`
      ), (G || c) && (d.push({ id: m.id, name: m.name }), t.log(
        `Found page to delete: "${m.name}" (isInImportResult: ${G}, hasMetadata: ${!!c})`
      ));
    }
    if (s && u.length > 0) {
      t.log(
        "Checking global importResult for additional pages to delete..."
      );
      for (const m of u)
        if (m.createdPageIds) {
          for (const c of m.createdPageIds)
            if (!d.some((V) => V.id === c))
              try {
                const V = await figma.getNodeByIdAsync(
                  c
                );
                V && V.type === "PAGE" && (d.push({
                  id: V.id,
                  name: V.name
                }), t.log(
                  `  Added additional page from global importResult.createdPageIds: "${V.name}"`
                ));
              } catch (V) {
                t.warning(
                  `  Could not get page ${c.substring(0, 8)}...: ${V}`
                );
              }
        }
    } else if (r)
      for (const m of n) {
        if (m.type !== "PAGE")
          continue;
        const c = m.getPluginData(i);
        if (c)
          try {
            const V = JSON.parse(c);
            if (V.pageIds) {
              for (const G of V.pageIds)
                if (!d.some((F) => F.id === G))
                  try {
                    const F = await figma.getNodeByIdAsync(
                      G
                    );
                    F && F.type === "PAGE" && (d.push({
                      id: F.id,
                      name: F.name
                    }), t.log(
                      `  Added additional page from legacy createdEntities.pageIds: "${F.name}"`
                    ));
                  } catch (F) {
                    t.warning(
                      `  Could not get page ${G.substring(0, 8)}...: ${F}`
                    );
                  }
            }
          } catch (V) {
            t.warning(
              `  Failed to parse legacy createdEntities from page "${m.name}": ${V}`
            );
          }
      }
    t.log(
      `Cleanup summary: Found ${d.length} page(s) to delete, ${g.size} collection(s) to delete, ${y.size} variable(s) to delete`
    );
    const S = figma.currentPage;
    if (d.some(
      (m) => m.id === S.id
    )) {
      await figma.loadAllPagesAsync();
      const c = figma.root.children.find(
        (V) => V.type === "PAGE" && !d.some((G) => G.id === V.id)
      );
      c && (await figma.setCurrentPageAsync(c), t.log(
        `Switched away from page "${S.name}" before deletion`
      ));
    }
    let v = 0;
    for (const m of d)
      try {
        await figma.loadAllPagesAsync();
        const c = await figma.getNodeByIdAsync(
          m.id
        );
        if (!c || c.type !== "PAGE")
          continue;
        if (figma.currentPage.id === c.id) {
          await figma.loadAllPagesAsync();
          const G = figma.root.children.find(
            (F) => F.type === "PAGE" && F.id !== c.id && !d.some((E) => E.id === F.id)
          );
          G && await figma.setCurrentPageAsync(G);
        }
        c.remove(), v++, t.log(`Deleted page: "${m.name}"`);
      } catch (c) {
        t.warning(
          `Failed to delete page "${m.name}" (${m.id.substring(0, 8)}...): ${c instanceof Error ? c.message : String(c)}`
        );
      }
    let w = 0, l = 0;
    for (const m of y)
      try {
        const c = await figma.variables.getVariableByIdAsync(m);
        c && (c.remove(), w++, t.log(
          `Deleted variable: ${c.name} (${m.substring(0, 8)}...)`
        ));
      } catch (c) {
        t.warning(
          `Could not delete variable ${m.substring(0, 8)}...: ${c instanceof Error ? c.message : String(c)}`
        );
      }
    if (s)
      try {
        const m = JSON.parse(a), c = /* @__PURE__ */ new Set();
        for (const V of m)
          if (V.createdStyleIds)
            for (const G of V.createdStyleIds)
              c.add(G);
        t.log(
          `Found ${c.size} style(s) to delete from global importResult`
        );
        for (const V of c)
          try {
            const G = await figma.getStyleByIdAsync(V);
            G && (G.remove(), l++, t.log(
              `Deleted style: ${G.name} (${V.substring(0, 8)}...)`
            ));
          } catch (G) {
            t.warning(
              `Failed to delete style ${V.substring(0, 8)}...: ${G instanceof Error ? G.message : String(G)}`
            );
          }
      } catch (m) {
        t.warning(
          `Failed to parse global importResult for styles: ${m instanceof Error ? m.message : String(m)}`
        );
      }
    return t.log(
      `Skipping deletion of ${g.size} collection(s) - collections are never deleted`
    ), s && (figma.root.setPluginData(Ge, ""), t.log("Cleared global importResult after cleanup")), t.log("=== Failed Import Cleanup Complete ==="), Pe("cleanupFailedImport", {
      success: !0,
      deletedPages: v,
      deletedCollections: 0,
      // Never delete collections
      deletedVariables: w,
      deletedStyles: l
    });
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Cleanup failed: ${o}`), Me(
      "cleanupFailedImport",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Bo(e) {
  try {
    t.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!n || n.type !== "PAGE")
      throw new Error("Page not found");
    return n.setPluginData(xe, ""), figma.root.setPluginData(Ge, ""), t.log("Cleared global importResult after clearing metadata"), t.log("Cleared import metadata from page and related pages"), Pe("clearImportMetadata", {
      success: !0
    });
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Clear metadata failed: ${o}`), Me(
      "clearImportMetadata",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function _o(e) {
  try {
    const n = "recursica:collectionId", i = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((a) => {
        const s = a.getSharedPluginData("recursica", n);
        return {
          id: a.id,
          name: a.name,
          guid: s || void 0
        };
      })
    };
    return Pe(
      "getLocalVariableCollections",
      i
    );
  } catch (n) {
    return Me(
      "getLocalVariableCollections",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function zo(e) {
  try {
    const n = "recursica:collectionId", o = [];
    for (const a of e.collectionIds)
      try {
        const s = await figma.variables.getVariableCollectionByIdAsync(a);
        if (s) {
          const r = s.getSharedPluginData(
            "recursica",
            n
          );
          o.push({
            collectionId: a,
            guid: r || null
          });
        } else
          o.push({
            collectionId: a,
            guid: null
          });
      } catch (s) {
        t.warning(
          `Failed to get GUID for collection ${a}: ${s instanceof Error ? s.message : String(s)}`
        ), o.push({
          collectionId: a,
          guid: null
        });
      }
    return Pe(
      "getCollectionGuids",
      {
        collectionGuids: o
      }
    );
  } catch (n) {
    return Me(
      "getCollectionGuids",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function jo(e) {
  try {
    t.log("=== Starting Import Group Merge ==="), await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!n || n.type !== "PAGE")
      throw new Error("Main page not found");
    const o = n.getPluginData(xe);
    if (!o)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(o);
    t.log(
      `Found metadata for component: ${i.componentName} (Version: ${i.componentVersion})`
    );
    let a = 0, s = 0;
    const r = "recursica:collectionId";
    for (const N of e.collectionChoices)
      if (N.choice === "merge")
        try {
          const m = await figma.variables.getVariableCollectionByIdAsync(
            N.newCollectionId
          );
          if (!m) {
            t.warning(
              `New collection ${N.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let c = null;
          if (N.existingCollectionId)
            c = await figma.variables.getVariableCollectionByIdAsync(
              N.existingCollectionId
            );
          else {
            const L = m.getSharedPluginData(
              "recursica",
              r
            );
            if (L) {
              const R = await figma.variables.getLocalVariableCollectionsAsync();
              for (const p of R)
                if (p.getSharedPluginData(
                  "recursica",
                  r
                ) === L && p.id !== N.newCollectionId) {
                  c = p;
                  break;
                }
              if (!c && (L === je.LAYER || L === je.TOKENS || L === je.THEME)) {
                let p;
                L === je.LAYER ? p = Le.LAYER : L === je.TOKENS ? p = Le.TOKENS : p = Le.THEME;
                for (const f of R)
                  if (f.getSharedPluginData(
                    "recursica",
                    r
                  ) === L && f.name === p && f.id !== N.newCollectionId) {
                    c = f;
                    break;
                  }
                c || (c = figma.variables.createVariableCollection(p), c.setSharedPluginData(
                  "recursica",
                  r,
                  L
                ), t.log(
                  `Created new standard collection: "${p}"`
                ));
              }
            }
          }
          if (!c) {
            t.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          t.log(
            `Merging collection "${m.name}" (${N.newCollectionId.substring(0, 8)}...) into "${c.name}" (${c.id.substring(0, 8)}...)`
          );
          const V = m.variableIds.map(
            (L) => figma.variables.getVariableByIdAsync(L)
          ), G = await Promise.all(V), F = c.variableIds.map(
            (L) => figma.variables.getVariableByIdAsync(L)
          ), E = await Promise.all(F), U = new Set(
            E.filter((L) => L !== null).map((L) => L.name)
          );
          for (const L of G)
            if (L)
              try {
                if (U.has(L.name)) {
                  t.warning(
                    `Variable "${L.name}" already exists in collection "${c.name}", skipping`
                  );
                  continue;
                }
                const R = figma.variables.createVariable(
                  L.name,
                  c,
                  L.resolvedType
                );
                for (const p of c.modes) {
                  const f = p.modeId;
                  let b = L.valuesByMode[f];
                  if (b === void 0 && m.modes.length > 0) {
                    const I = m.modes[0].modeId;
                    b = L.valuesByMode[I];
                  }
                  b !== void 0 && R.setValueForMode(f, b);
                }
                t.log(
                  `  ✓ Copied variable "${L.name}" to collection "${c.name}"`
                );
              } catch (R) {
                t.warning(
                  `Failed to copy variable "${L.name}": ${R instanceof Error ? R.message : String(R)}`
                );
              }
          m.remove(), a++, t.log(
            `✓ Merged and deleted collection: ${m.name}`
          );
        } catch (m) {
          t.warning(
            `Failed to merge collection: ${m instanceof Error ? m.message : String(m)}`
          );
        }
      else
        s++, t.log(`Kept collection: ${N.newCollectionId}`);
    t.log("Removing dividers...");
    const d = figma.root.children, g = [];
    for (const N of d) {
      if (N.type !== "PAGE") continue;
      const m = N.getPluginData(Re);
      (m === "start" || m === "end") && g.push(N);
    }
    const y = figma.currentPage;
    if (g.some((N) => N.id === y.id))
      if (n && n.id !== y.id)
        figma.currentPage = n;
      else {
        const N = d.find(
          (m) => m.type === "PAGE" && !g.some((c) => c.id === m.id)
        );
        N && (figma.currentPage = N);
      }
    const u = g.map((N) => N.name);
    for (const N of g)
      try {
        N.remove();
      } catch (m) {
        t.warning(
          `Failed to delete divider: ${m instanceof Error ? m.message : String(m)}`
        );
      }
    for (const N of u)
      t.log(`Deleted divider: ${N}`);
    t.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const S = figma.root.children;
    let $ = 0;
    const v = "RecursicaPublishedMetadata", w = [];
    for (const N of S)
      if (N.type === "PAGE")
        try {
          const m = N.getPluginData(v), c = !!m, V = figma.root.getPluginData(
            "RecursicaImportResult"
          );
          let G = !1;
          if (V)
            try {
              G = JSON.parse(V).some(
                (E) => {
                  var U;
                  return (U = E.createdPageIds) == null ? void 0 : U.includes(N.id);
                }
              );
            } catch (F) {
            }
          if (c || G) {
            let F = {};
            if (m)
              try {
                F = JSON.parse(m);
              } catch (E) {
              }
            w.push({
              pageId: N.id,
              pageName: N.name,
              pageMetadata: F
            });
          }
        } catch (m) {
          t.warning(
            `Failed to process page: ${m instanceof Error ? m.message : String(m)}`
          );
        }
    for (const N of w)
      try {
        const m = await figma.getNodeByIdAsync(
          N.pageId
        );
        if (!m || m.type !== "PAGE") {
          t.warning(
            `Page ${N.pageId} not found, skipping rename`
          );
          continue;
        }
        let c = m.name;
        if (c.startsWith(Fe) && (c = c.substring(Fe.length).trim()), c === "REMOTES" || c.includes("REMOTES")) {
          m.name = "REMOTES", $++, t.log(`Renamed page: "${m.name}" -> "REMOTES"`);
          continue;
        }
        const G = N.pageMetadata.name && N.pageMetadata.name.length > 0 && !N.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? N.pageMetadata.name : i.componentName || c, F = N.pageMetadata.version !== void 0 ? N.pageMetadata.version : i.componentVersion, E = `${G} (VERSION: ${F})`;
        m.name = E, $++, t.log(`Renamed page: "${c}" -> "${E}"`);
      } catch (m) {
        t.warning(
          `Failed to rename page ${N.pageId}: ${m instanceof Error ? m.message : String(m)}`
        );
      }
    if (t.log("Clearing import metadata..."), n)
      try {
        n.setPluginData(xe, "");
      } catch (N) {
        t.warning(
          `Failed to clear primary import metadata: ${N instanceof Error ? N.message : String(N)}`
        );
      }
    for (const N of w)
      ;
    const l = {
      mergedCollections: a,
      keptCollections: s,
      pagesRenamed: $
    };
    return t.log(
      `=== Merge Complete ===
  Merged: ${a} collection(s)
  Kept: ${s} collection(s)
  Renamed: ${$} page(s)`
    ), Pe(
      "mergeImportGroup",
      l
    );
  } catch (n) {
    return t.error(
      `Merge failed: ${n instanceof Error ? n.message : String(n)}`
    ), Me(
      "mergeImportGroup",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Jo(e) {
  try {
    const o = figma.root.getPluginData("RecursicaImportResult");
    if (!o)
      return Pe("getImportSummary", {
        summary: {
          pagesCreated: [],
          pagesExisting: [],
          totalVariablesCreated: 0,
          totalStylesCreated: 0
        }
      });
    const i = JSON.parse(
      o
    ), a = [], s = [];
    let r = 0, d = 0;
    for (const v of i) {
      v.createdVariableIds && (r += v.createdVariableIds.length), v.createdStyleIds && (d += v.createdStyleIds.length);
      const w = v.createdPageIds || [], l = v.componentGuid, N = v.componentPage;
      for (const m of w)
        try {
          const c = await figma.getNodeByIdAsync(
            m
          );
          if (c && c.type === "PAGE") {
            if (c.getPluginData(Re))
              continue;
            a.push({
              pageId: m,
              pageName: c.name,
              componentGuid: l,
              componentPage: N
            });
          }
        } catch (c) {
        }
    }
    const g = "RecursicaPublishedMetadata";
    await figma.loadAllPagesAsync();
    const y = figma.root.children.filter(
      (v) => v.type === "PAGE"
    ), u = new Set(a.map((v) => v.pageId)), S = new Set(
      i.map((v) => v.componentGuid)
    );
    for (const v of y)
      try {
        const w = v.getPluginData(g);
        if (w) {
          const l = JSON.parse(w);
          if (l.id && S.has(l.id) && !u.has(v.id)) {
            const N = i.find(
              (m) => m.componentGuid === l.id
            );
            N && s.push({
              pageId: v.id,
              pageName: v.name,
              componentGuid: N.componentGuid,
              componentPage: N.componentPage
            });
          }
        }
      } catch (w) {
      }
    return Pe("getImportSummary", {
      summary: {
        pagesCreated: a,
        pagesExisting: s,
        totalVariablesCreated: r,
        totalStylesCreated: d
      }
    });
  } catch (n) {
    return Me(
      "getImportSummary",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Do(e) {
  var n, o;
  try {
    t.log("=== Test: Instance Children and Overrides Behavior ===");
    const i = await figma.getNodeByIdAsync(e);
    if (!i || i.type !== "PAGE")
      throw new Error("Test page not found");
    const a = i.children.find(
      (T) => T.type === "FRAME" && T.name === "Test"
    );
    if (!a)
      throw new Error("Test frame container not found on page");
    const s = [];
    t.log(
      `
--- Test 1: Component with children → Create instance ---`
    );
    const r = figma.createComponent();
    r.name = "Test Component - With Children", r.resize(200, 200), a.appendChild(r);
    const d = figma.createFrame();
    d.name = "Child 1", d.resize(50, 50), d.x = 10, d.y = 10, r.appendChild(d);
    const g = figma.createFrame();
    g.name = "Child 2", g.resize(50, 50), g.x = 70, g.y = 10, r.appendChild(g), t.log(
      `  Created component "${r.name}" with ${r.children.length} children`
    ), t.log(
      `  Component children: ${r.children.map((T) => T.name).join(", ")}`
    );
    const y = r.createInstance();
    y.name = "Instance 1 - From Component", a.appendChild(y), t.log(`  Created instance "${y.name}" from component`);
    const u = y.children.length;
    if (t.log(
      `  Instance children count immediately after creation: ${u}`
    ), u > 0) {
      t.log(
        `  Instance children: ${y.children.map((Q) => Q.name).join(", ")}`
      ), t.log(
        `  Instance child types: ${y.children.map((Q) => Q.type).join(", ")}`
      );
      const T = y.children[0];
      if (t.log(
        `  First child: name="${T.name}", type="${T.type}", id="${T.id}"`
      ), t.log(
        `  First child parent: ${(n = T.parent) == null ? void 0 : n.name} (id: ${(o = T.parent) == null ? void 0 : o.id})`
      ), "mainComponent" in T) {
        const Q = await T.getMainComponentAsync();
        t.log(
          `  First child mainComponent: ${(Q == null ? void 0 : Q.name) || "none"}`
        );
      }
      t.log(
        `  Component children IDs: ${r.children.map((Q) => Q.id).join(", ")}`
      ), t.log(
        `  Instance children IDs: ${y.children.map((Q) => Q.id).join(", ")}`
      );
      const me = y.children[0].id !== r.children[0].id;
      t.log(
        `  Are instance children different nodes from component children? ${me}`
      );
    } else
      t.log(
        "  ⚠️ Instance has NO children immediately after creation"
      );
    if (s.push({
      test: "Instance has children immediately",
      success: u > 0,
      details: {
        instanceChildrenCount: u,
        componentChildrenCount: r.children.length,
        instanceChildren: y.children.map((T) => ({
          name: T.name,
          type: T.type,
          id: T.id
        }))
      }
    }), t.log(
      `
--- Test 2: Create instance override by replacing child ---`
    ), u > 0) {
      const T = y.children[0];
      t.log(
        `  Original child to replace: "${T.name}" (id: ${T.id})`
      );
      const me = figma.createFrame();
      me.name = "Override Child", me.resize(60, 60), me.x = T.x, me.y = T.y, a.appendChild(me), t.log(
        `  Created override child "${me.name}" as child of Test frame`
      );
      let Q = !1, C;
      try {
        const P = y.children.indexOf(T);
        y.insertChild(P, me), T.remove(), Q = !0, t.log(
          `  ✓ Successfully replaced child at index ${P}`
        );
      } catch (P) {
        C = P instanceof Error ? P.message : String(P), t.log(
          `  ✗ Cannot move node into instance: ${C}`
        ), t.log(
          "  → This means we cannot directly move placeholder children into instances"
        ), t.log(
          "  → We must create NEW nodes and copy properties instead"
        ), me.remove();
      }
      if (Q) {
        t.log(
          `  Instance children after override: ${y.children.map((h) => h.name).join(", ")}`
        ), t.log(
          `  Instance children count after override: ${y.children.length}`
        ), t.log(
          `  Component children after override: ${r.children.map((h) => h.name).join(", ")}`
        ), t.log(
          `  Component children count after override: ${r.children.length}`
        );
        const P = r.children.length === 2 && r.children[0].name === "Child 1" && r.children[1].name === "Child 2";
        s.push({
          test: "Instance override doesn't affect component",
          success: P,
          details: {
            instanceChildrenAfterOverride: y.children.map((h) => ({
              name: h.name,
              type: h.type,
              id: h.id
            })),
            componentChildrenAfterOverride: r.children.map((h) => ({
              name: h.name,
              type: h.type,
              id: h.id
            }))
          }
        });
      } else
        t.log(
          "  → Cannot move nodes into instances - must create new nodes instead"
        ), s.push({
          test: "Instance override doesn't affect component",
          success: !0,
          // This is expected behavior
          details: {
            overrideAttempted: !0,
            overrideError: C,
            note: "Cannot move nodes into instances - must create new nodes and copy properties"
          }
        });
    } else
      t.log(
        "  ⚠️ Skipping override test - instance has no children"
      ), s.push({
        test: "Instance override doesn't affect component",
        success: !1,
        details: { reason: "Instance has no children to override" }
      });
    t.log(
      `
--- Test 3: Merge placeholder children into instance ---`
    );
    const S = r.createInstance();
    S.name = "Instance 2 - For Placeholder Merge", S.x = 250, a.appendChild(S), t.log(
      `  Created instance "${S.name}" with ${S.children.length} children`
    );
    const $ = figma.createFrame();
    $.name = "[Deferred: Placeholder]", $.resize(200, 200), a.appendChild($);
    const v = figma.createFrame();
    v.name = "Child 1", v.resize(60, 60), v.x = 10, v.y = 10, $.appendChild(v);
    const w = figma.createFrame();
    w.name = "Placeholder Only Child", w.resize(50, 50), w.x = 80, w.y = 10, $.appendChild(w), t.log(
      `  Created placeholder with ${$.children.length} children: ${$.children.map((T) => T.name).join(", ")}`
    ), t.log(
      `  Instance has ${S.children.length} children: ${S.children.map((T) => T.name).join(", ")}`
    );
    let l = !1, N = {}, m;
    if (S.children.length > 0 && $.children.length > 0) {
      t.log("  Attempting to merge placeholder children..."), t.log(
        "  → Since we cannot move nodes into instances, we'll test creating new nodes"
      );
      const T = [];
      for (const Q of $.children) {
        const C = S.children.find(
          (P) => P.name === Q.name
        );
        if (C) {
          t.log(
            `  Found matching child "${Q.name}" in instance - attempting to replace`
          );
          try {
            const P = S.children.indexOf(C);
            S.insertChild(P, Q), C.remove(), T.push({
              name: Q.name,
              source: "replaced existing"
            }), t.log(
              `    ✓ Successfully replaced "${Q.name}"`
            );
          } catch (P) {
            const h = P instanceof Error ? P.message : String(P);
            t.log(
              `    ✗ Cannot move "${Q.name}" into instance: ${h}`
            ), t.log(
              "    → Must create new node and copy properties instead"
            ), T.push({
              name: Q.name,
              source: "replaced existing (failed)",
              error: h
            }), m = h;
          }
        } else {
          t.log(
            `  No matching child for "${Q.name}" - attempting to append`
          );
          try {
            S.appendChild(Q), T.push({
              name: Q.name,
              source: "appended new"
            }), t.log(
              `    ✓ Successfully appended "${Q.name}"`
            );
          } catch (P) {
            const h = P instanceof Error ? P.message : String(P);
            t.log(
              `    ✗ Cannot append "${Q.name}" to instance: ${h}`
            ), t.log(
              "    → Must create new node and copy properties instead"
            ), T.push({
              name: Q.name,
              source: "appended new (failed)",
              error: h
            }), m = h;
          }
        }
      }
      t.log(
        `  After merge attempt, instance has ${S.children.length} children: ${S.children.map((Q) => Q.name).join(", ")}`
      );
      const me = T.filter(
        (Q) => !Q.error && Q.source !== "replaced existing (failed)" && Q.source !== "appended new (failed)"
      );
      m ? (t.log(
        "  → Merge failed: Cannot move nodes into instances (expected behavior)"
      ), t.log(
        "  → Solution: Must create NEW nodes and copy properties from placeholder children"
      ), l = !0) : l = me.length > 0, N = {
        mergedChildren: T,
        successfulMerges: me.length,
        failedMerges: T.length - me.length,
        mergeError: m,
        finalInstanceChildren: S.children.map((Q) => ({
          name: Q.name,
          type: Q.type,
          id: Q.id
        })),
        finalInstanceChildrenCount: S.children.length,
        note: m ? "Cannot move nodes into instances - must create new nodes and copy properties" : "Merge succeeded"
      };
    } else
      t.log(
        "  ⚠️ Cannot merge - instance or placeholder has no children"
      ), N = {
        instanceChildrenCount: S.children.length,
        placeholderChildrenCount: $.children.length
      };
    s.push({
      test: "Merge placeholder children into instance",
      success: l,
      details: N
    }), t.log(`
--- Test 4: getMainComponent behavior ---`);
    const c = await y.getMainComponentAsync();
    if (t.log(
      `  Instance mainComponent: ${(c == null ? void 0 : c.name) || "none"} (id: ${(c == null ? void 0 : c.id) || "none"})`
    ), t.log(`  MainComponent type: ${(c == null ? void 0 : c.type) || "none"}`), c) {
      t.log(
        `  MainComponent children: ${c.children.map((me) => me.name).join(", ")}`
      ), t.log(
        `  MainComponent children count: ${c.children.length}`
      ), t.log(
        `  Instance children count: ${y.children.length}`
      );
      const T = y.children.length === c.children.length && y.children.every(
        (me, Q) => me.name === c.children[Q].name
      );
      t.log(
        `  Do instance children match mainComponent children? ${T}`
      ), s.push({
        test: "getMainComponent returns component",
        success: c.id === r.id,
        details: {
          mainComponentId: c.id,
          componentId: r.id,
          childrenMatch: T,
          instanceChildrenCount: y.children.length,
          mainComponentChildrenCount: c.children.length
        }
      });
    } else
      s.push({
        test: "getMainComponent returns component",
        success: !1,
        details: { reason: "getMainComponentAsync returned null" }
      });
    t.log(
      `
--- Test 5: Recreate children from JSON (simulating deferred resolution) ---`
    );
    const V = figma.createComponent();
    V.name = "Test Component - For JSON Recreation", V.resize(300, 300), a.appendChild(V);
    const G = figma.createFrame();
    G.name = "Default Child 1", G.resize(50, 50), G.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }], V.appendChild(G);
    const F = figma.createFrame();
    F.name = "Default Child 2", F.resize(50, 50), F.fills = [{ type: "SOLID", color: { r: 0, g: 1, b: 0 } }], V.appendChild(F);
    const E = figma.createFrame();
    E.name = "Default Child 3", E.resize(50, 50), E.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 1 } }], V.appendChild(E), t.log(
      `  Created component "${V.name}" with ${V.children.length} default children`
    ), t.log(
      `  Default children: ${V.children.map((T) => T.name).join(", ")}`
    );
    const U = V.createInstance();
    U.name = "Instance 3 - For JSON Recreation", U.x = 350, a.appendChild(U), t.log(
      `  Created instance "${U.name}" with ${U.children.length} default children`
    ), t.log(
      `  Instance default children: ${U.children.map((T) => T.name).join(", ")}`
    );
    const L = [
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
    t.log(
      `  JSON children to recreate: ${L.map((T) => T.name).join(", ")}`
    ), t.log(
      "  Strategy: Match by name, update matches in place, cannot add new ones (Figma limitation), keep defaults not in JSON"
    );
    let R = !0;
    const p = {
      defaultChildrenBefore: U.children.map((T) => ({
        name: T.name,
        type: T.type,
        fills: "fills" in T ? T.fills : void 0
      })),
      jsonChildren: L.map((T) => ({ name: T.name, type: T.type }))
    }, f = [], b = [];
    for (const T of L) {
      const me = U.children.find(
        (Q) => Q.name === T.name
      );
      if (me) {
        t.log(
          `  Found matching child "${T.name}" - attempting to update in place`
        );
        try {
          if ("fills" in me && T.fills) {
            const Q = me.fills;
            t.log(
              `    Current fills before update: ${JSON.stringify(Q)}`
            ), me.fills = T.fills;
            const C = me.fills;
            t.log(
              `    Fills after update: ${JSON.stringify(C)}`
            ), Array.isArray(C) && C.length > 0 && C[0].type === "SOLID" && C[0].color.r === T.fills[0].color.r && C[0].color.g === T.fills[0].color.g && C[0].color.b === T.fills[0].color.b ? (t.log(
              `    ✓ Successfully updated "${T.name}" fills in place`
            ), f.push(T.name)) : (t.log(
              "    ✗ Update assignment succeeded but fills didn't change (read-only?)"
            ), R = !1);
          } else
            t.log(
              `    ⚠ Cannot update "${T.name}" - node type doesn't support fills`
            );
        } catch (Q) {
          const C = Q instanceof Error ? Q.message : String(Q);
          t.log(
            `    ✗ Cannot update "${T.name}": ${C}`
          ), R = !1;
        }
      } else
        t.log(
          `  No matching child for "${T.name}" - cannot add to instance (Figma limitation)`
        ), t.log(
          "    → Children that exist only in JSON cannot be added to instances"
        ), b.push(T.name);
    }
    t.log(
      "  Testing: Can we modify other properties (like name, size) of instance children?"
    );
    let I = !1;
    if (U.children.length > 0) {
      const T = U.children[0], me = T.name, Q = "width" in T ? T.width : void 0;
      try {
        T.name = "Modified Name", "resize" in T && Q && T.resize(Q + 10, T.height), I = !0, t.log(
          "    ✓ Can modify properties (name, size) of instance children"
        ), T.name = me, "resize" in T && Q && T.resize(Q, T.height);
      } catch (C) {
        const P = C instanceof Error ? C.message : String(C);
        t.log(
          `    ✗ Cannot modify properties of instance children: ${P}`
        );
      }
    }
    const O = U.children.filter(
      (T) => !L.some((me) => me.name === T.name)
    );
    t.log(
      `  Kept default children (not in JSON): ${O.map((T) => T.name).join(", ")}`
    ), t.log(
      `  Final instance children: ${U.children.map((T) => T.name).join(", ")}`
    ), t.log(
      `  Final instance children count: ${U.children.length}`
    ), p.finalChildren = U.children.map((T) => ({
      name: T.name,
      type: T.type
    })), p.keptDefaultChildren = O.map((T) => ({
      name: T.name,
      type: T.type
    })), p.finalChildrenCount = U.children.length, p.updatedChildren = f, p.skippedChildren = b, p.canModifyProperties = I;
    const k = U.children.some(
      (T) => T.name === "Default Child 1"
    ), Y = U.children.some(
      (T) => T.name === "JSON Only Child"
    ), ie = U.children.some(
      (T) => T.name === "Default Child 2"
    ), Z = U.children.some(
      (T) => T.name === "Default Child 3"
    ), j = U.children.find(
      (T) => T.name === "Default Child 1"
    );
    let ee = !1;
    if (j && "fills" in j) {
      const T = j.fills;
      Array.isArray(T) && T.length > 0 && T[0].type === "SOLID" && (ee = T[0].color.r === 1 && T[0].color.g === 1 && T[0].color.b === 0);
    }
    const te = k && ee && !Y && // Should NOT exist (Figma limitation)
    ie && Z && U.children.length === 3;
    t.log(`  Meets expectations: ${te}`), t.log(`    - "Default Child 1" updated: ${ee}`), t.log(
      `    - "JSON Only Child" added: ${Y} (expected: false - cannot add new children)`
    ), t.log(
      `    - Default children kept: ${ie && Z}`
    ), s.push({
      test: "Recreate children from JSON",
      success: R && te,
      details: Ie(re({}, p), {
        meetsExpectations: te,
        hasJsonChild1: k,
        child1Updated: ee,
        hasJsonOnlyChild: Y,
        hasDefaultChild2: ie,
        hasDefaultChild3: Z,
        note: R && te ? "Successfully updated existing children in place, kept defaults not in JSON. Cannot add new children to instances (Figma limitation)." : "Failed to update children or expectations not met"
      })
    }), t.log(
      `
--- Test 6: Bottom-up resolution order (nested deferred instances) ---`
    );
    const W = figma.createFrame();
    W.name = "[Deferred: Parent]", W.resize(200, 200), a.appendChild(W);
    const oe = figma.createFrame();
    oe.name = "[Deferred: Child]", oe.resize(100, 100), oe.x = 10, oe.y = 10, W.appendChild(oe);
    const ae = figma.createFrame();
    ae.name = "[Deferred: Grandchild]", ae.resize(50, 50), ae.x = 10, ae.y = 10, oe.appendChild(ae), t.log(
      "  Created nested structure: Parent -> Child -> Grandchild"
    ), t.log(
      `  Parent placeholder has ${W.children.length} child(ren)`
    ), t.log(
      `  Child placeholder has ${oe.children.length} child(ren)`
    );
    let X = !0;
    const x = {};
    t.log("  Step 1: Resolving grandchild (leaf node)...");
    const H = figma.createComponent();
    H.name = "Grandchild Component", H.resize(50, 50), a.appendChild(H);
    const z = H.createInstance();
    z.name = "Grandchild Instance", a.appendChild(z);
    const D = ae.parent;
    if (D && "children" in D) {
      const T = D.children.indexOf(
        ae
      );
      D.insertChild(T, z), ae.remove(), t.log(
        "    ✓ Resolved grandchild - replaced placeholder with instance"
      ), x.grandchildResolved = !0;
    } else
      t.log("    ✗ Could not resolve grandchild"), X = !1;
    t.log(
      "  Step 2: Resolving child (has resolved grandchild inside)..."
    );
    const fe = figma.createComponent();
    fe.name = "Child Component", fe.resize(100, 100), a.appendChild(fe);
    const se = fe.createInstance();
    se.name = "Child Instance", a.appendChild(se);
    const ge = W.children.find(
      (T) => T.name === "[Deferred: Child]"
    );
    if (!ge)
      t.log(
        "    ✗ Child placeholder lost after resolving grandchild"
      ), X = !1;
    else if (!("children" in ge))
      t.log("    ✗ Child placeholder does not support children"), X = !1;
    else {
      ge.children.find(
        (C) => C.name === "Grandchild Instance"
      ) ? (t.log(
        "    ✓ Grandchild still accessible inside child placeholder"
      ), x.grandchildStillAccessible = !0) : t.log(
        "    ⚠ Grandchild not found inside child placeholder (may have been moved)"
      );
      const me = ge.children.find(
        (C) => C.name === "Grandchild Instance"
      ), Q = ge.parent;
      if (Q && "children" in Q) {
        const C = Q.children.indexOf(
          ge
        );
        Q.insertChild(C, se), ge.remove(), t.log(
          "    ✓ Resolved child - replaced placeholder with instance"
        ), x.childResolved = !0, me && (t.log(
          "    ⚠ Grandchild instance was in child placeholder and is now lost"
        ), t.log(
          "    → This demonstrates the need to extract children before replacing placeholders"
        ), x.grandchildLost = !0);
      } else
        t.log("    ✗ Could not resolve child"), X = !1;
    }
    t.log(
      "  Step 3: Resolving parent (has resolved child inside)..."
    );
    const pe = figma.createComponent();
    pe.name = "Parent Component", pe.resize(200, 200), a.appendChild(pe);
    const ue = pe.createInstance();
    ue.name = "Parent Instance", a.appendChild(ue);
    const le = W.children.find(
      (T) => T.name === "Child Instance"
    );
    le ? (t.log(
      "    ✓ Child still accessible inside parent placeholder"
    ), x.childStillAccessible = !0, a.appendChild(le), t.log(
      "    ✓ Extracted child instance from parent placeholder"
    ), x.childExtracted = !0) : (t.log(
      "    ✗ Child not found inside parent placeholder - cannot extract"
    ), X = !1);
    const ce = W.parent;
    if (ce && "children" in ce) {
      const T = ce.children.indexOf(W);
      if (ce.insertChild(T, ue), W.remove(), t.log(
        "    ✓ Resolved parent - replaced placeholder with instance"
      ), x.parentResolved = !0, le)
        try {
          ue.appendChild(le), t.log("    ✓ Added child instance to parent instance"), x.childAddedToParent = !0;
        } catch (me) {
          const Q = me instanceof Error ? me.message : String(me);
          t.log(
            `    ✗ Cannot add child to parent instance: ${Q}`
          ), t.log(
            "    → This is the Figma limitation - cannot add children to instances"
          ), t.log(
            "    → Child instance remains in testFrame (not in final structure)"
          ), x.childAddedToParent = !1, x.childAddError = Q;
        }
    } else
      t.log("    ✗ Could not resolve parent"), X = !1;
    t.log("  Verifying bottom-up resolution worked...");
    const be = a.children.find(
      (T) => T.name === "Parent Instance"
    ), he = a.children.find(
      (T) => T.name === "Child Instance"
    );
    let Ce = !1;
    be && he ? (Ce = !0, t.log(
      "    ✓ Bottom-up resolution worked: Parent resolved, child extracted"
    ), t.log(
      "    ⚠ Child cannot be added to parent instance (Figma limitation)"
    )) : be ? t.log(
      "    ⚠ Parent resolved but child not found (may have been lost)"
    ) : t.log("    ✗ Parent not resolved"), x.bottomUpWorked = Ce, x.finalParentExists = !!be, x.childExtractedExists = !!he, x.note = "Bottom-up resolution works, but Figma limitation prevents adding children to instances. This demonstrates the need for a different approach (e.g., matching by name and replacing at parent level).", x.note = "Bottom-up resolution (leaf to root) ensures nested placeholders are resolved before their parents are replaced", s.push({
      test: "Bottom-up resolution order",
      success: X && Ce,
      details: x
    }), t.log(`
--- Test Summary ---`);
    const Be = s.every((T) => T.success), De = s.filter((T) => T.success).length;
    t.log(`  Tests passed: ${De}/${s.length}`);
    for (const T of s)
      t.log(
        `  ${T.success ? "✓" : "✗"} ${T.test}: ${T.success ? "PASS" : "FAIL"}`
      );
    return {
      success: Be,
      message: Be ? "All instance children and override tests passed" : `${De}/${s.length} tests passed - see details`,
      details: {
        testResults: s,
        summary: {
          total: s.length,
          passed: De,
          failed: s.length - De
        }
      }
    };
  } catch (i) {
    const a = i instanceof Error ? i.message : "Unknown error occurred";
    return t.error(`Test failed: ${a}`), {
      success: !1,
      message: `Test error: ${a}`
    };
  }
}
async function Ho(e) {
  try {
    t.log("=== Starting Test ==="), t.log('Cleaning up "Test" variable collection...');
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    for (const $ of n)
      if ($.name === "Test") {
        t.log(
          `  Found existing "Test" collection (ID: ${$.id.substring(0, 8)}...), deleting...`
        );
        const v = await figma.variables.getLocalVariablesAsync();
        for (const w of v)
          w.variableCollectionId === $.id && w.remove();
        $.remove(), t.log('  Deleted "Test" collection');
      }
    await figma.loadAllPagesAsync();
    let i = figma.root.children.find(
      ($) => $.type === "PAGE" && $.name === "Test"
    );
    i ? t.log('Found existing "Test" page') : (i = figma.createPage(), i.name = "Test", t.log('Created "Test" page')), await figma.setCurrentPageAsync(i);
    const a = i.children.find(
      ($) => $.type === "FRAME" && $.name === "Test"
    );
    a && (t.log(
      'Found existing "Test" frame, deleting it and all children...'
    ), a.remove(), t.log('Deleted existing "Test" frame'));
    const s = figma.createFrame();
    s.name = "Test", i.appendChild(s), t.log('Created new "Test" frame container');
    const r = [];
    t.log(`
` + "=".repeat(60)), t.log("TEST 9: Instance Children and Overrides Behavior"), t.log("=".repeat(60));
    const d = await Do(i.id);
    r.push({
      name: "Instance Children and Overrides",
      success: d.success,
      message: d.message,
      details: d.details
    }), t.log(`
` + "=".repeat(60)), t.log("=== ALL TESTS COMPLETE ==="), t.log("=".repeat(60));
    const g = r.filter(($) => $.success), y = r.filter(($) => !$.success);
    t.log(
      `Total: ${r.length} | Passed: ${g.length} | Failed: ${y.length}`
    );
    for (const $ of r)
      t.log(
        `  ${$.success ? "✓" : "✗"} ${$.name}: ${$.message}`
      );
    const S = {
      testResults: {
        success: d.success,
        message: `All tests completed: ${g.length}/${r.length} passed`,
        details: {
          summary: {
            total: r.length,
            passed: g.length,
            failed: y.length
          },
          tests: r
        }
      },
      allTests: r
    };
    return Pe("runTest", S);
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Test failed: ${o}`), Me("runTest", o);
  }
}
const Ko = {
  getCurrentUser: vn,
  loadPages: Nn,
  exportPage: Qe,
  importPage: Rt,
  cleanupCreatedEntities: ln,
  resolveDeferredNormalInstances: xt,
  determineImportOrder: gn,
  buildDependencyGraph: cn,
  resolveImportOrder: dn,
  importPagesInOrder: fn,
  quickCopy: Eo,
  storeAuthData: Io,
  loadAuthData: wo,
  clearAuthData: Ao,
  storeImportData: Po,
  loadImportData: To,
  clearImportData: Oo,
  storeSelectedRepo: Ro,
  getComponentMetadata: xo,
  getAllComponents: Vo,
  pluginPromptResponse: Mo,
  switchToPage: ko,
  checkForExistingPrimaryImport: Uo,
  createImportDividers: Lo,
  importSingleComponentWithWizard: Fo,
  deleteImportGroup: hn,
  clearImportMetadata: Bo,
  cleanupFailedImport: Go,
  getLocalVariableCollections: _o,
  getCollectionGuids: zo,
  mergeImportGroup: jo,
  getImportSummary: Jo,
  runTest: Ho
}, Wo = Ko;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  var o;
  if (console.log("Received message:", e), e.type === "cancelRequest") {
    const i = (o = e.data) == null ? void 0 : o.requestId;
    i && (Xn(i), console.log(`Request cancelled: ${i}`));
    return;
  }
  if (e.type === "GenerateGuidResponse") {
    Rn(e);
    return;
  }
  const n = e;
  try {
    const i = n.type, a = Wo[i];
    if (!a) {
      console.warn("Unknown message type:", n.type);
      const d = {
        type: n.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + n.type,
        data: {},
        requestId: n.requestId
      };
      figma.ui.postMessage(d);
      return;
    }
    n.requestId && Ae(n.requestId);
    let s;
    i === "exportPage" && n.requestId ? s = await a(
      n.data,
      /* @__PURE__ */ new Set(),
      !1,
      /* @__PURE__ */ new Set(),
      n.requestId
    ) : i === "importPage" && n.requestId ? s = await a(
      n.data,
      n.requestId
    ) : s = await a(n.data);
    const r = t.getLogs();
    r.length > 0 && (s.data = Ie(re({}, s.data), {
      debugLogs: r
    })), figma.ui.postMessage(Ie(re({}, s), {
      requestId: n.requestId
    })), n.requestId && Ft(n.requestId);
  } catch (i) {
    console.error("Error handling message:", i);
    const a = {
      type: n.type,
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {},
      requestId: n.requestId
    }, s = t.getLogs();
    s.length > 0 && (a.data.debugLogs = s), figma.ui.postMessage(a), n.requestId && Ft(n.requestId);
  }
};
