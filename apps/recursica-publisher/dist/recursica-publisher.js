var qt = Object.defineProperty, Xt = Object.defineProperties;
var Yt = Object.getOwnPropertyDescriptors;
var vt = Object.getOwnPropertySymbols;
var Zt = Object.prototype.hasOwnProperty, Qt = Object.prototype.propertyIsEnumerable;
var nt = (e, a, n) => a in e ? qt(e, a, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[a] = n, ne = (e, a) => {
  for (var n in a || (a = {}))
    Zt.call(a, n) && nt(e, n, a[n]);
  if (vt)
    for (var n of vt(a))
      Qt.call(a, n) && nt(e, n, a[n]);
  return e;
}, $e = (e, a) => Xt(e, Yt(a));
var Ee = (e, a, n) => nt(e, typeof a != "symbol" ? a + "" : a, n);
async function ea(e) {
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
async function ta(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((c, s) => ({
          name: c.name,
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
const he = {
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
}, ye = $e(ne({}, he), {
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
}), Ae = $e(ne({}, he), {
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
}), Le = $e(ne({}, he), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), At = $e(ne({}, he), {
  cornerRadius: 0
}), aa = $e(ne({}, he), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function na(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return ye;
    case "TEXT":
      return Ae;
    case "VECTOR":
      return Le;
    case "LINE":
      return aa;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return At;
    default:
      return he;
  }
}
function Q(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((n, i) => Q(n, a[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const n = Object.keys(e), i = Object.keys(a);
      return n.length !== i.length ? !0 : n.some(
        (c) => !(c in a) || Q(e[c], a[c])
      );
    }
    return !0;
  }
  return e !== a;
}
const Oe = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, Te = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function ve(e) {
  const a = e.trim(), i = a.replace(/_\d+$/, "").toLowerCase();
  return i === "themes" || i === "theme" ? Te.THEME : i === "token" || i === "tokens" ? Te.TOKENS : i === "layer" || i === "layers" ? Te.LAYER : a;
}
function Ve(e) {
  const a = ve(e);
  return a === Te.LAYER || a === Te.TOKENS || a === Te.THEME;
}
function Qe(e) {
  const a = ve(e);
  if (a === Te.LAYER)
    return Oe.LAYER;
  if (a === Te.TOKENS)
    return Oe.TOKENS;
  if (a === Te.THEME)
    return Oe.THEME;
}
class Je {
  constructor() {
    Ee(this, "collectionMap");
    // collectionId -> index
    Ee(this, "collections");
    // index -> collection data
    Ee(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    Ee(this, "nextIndex");
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
    for (const c of n)
      i.add(c);
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
    const i = ve(
      a.collectionName
    );
    if (Ve(a.collectionName)) {
      const o = this.findCollectionByNormalizedName(i);
      if (o !== void 0) {
        const l = this.collections[o];
        return l.modes = this.mergeModes(
          l.modes,
          a.modes
        ), this.collectionMap.set(n, o), o;
      }
    }
    const c = this.nextIndex++;
    this.collectionMap.set(n, c);
    const s = $e(ne({}, a), {
      collectionName: i
    });
    if (Ve(a.collectionName)) {
      const o = Qe(
        a.collectionName
      );
      o && (s.collectionGuid = o), this.normalizedNameMap.set(i, c);
    }
    return this.collections[c] = s, c;
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
      const i = this.collections[n], c = ne({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
      a[String(n)] = c;
    }
    return a;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(a) {
    var c;
    const n = new Je(), i = Object.entries(a).sort(
      (s, o) => parseInt(s[0], 10) - parseInt(o[0], 10)
    );
    for (const [s, o] of i) {
      const l = parseInt(s, 10), p = (c = o.isLocal) != null ? c : !0, f = ve(
        o.collectionName || ""
      ), m = o.collectionId || o.collectionGuid || `temp:${l}:${f}`, u = ne({
        collectionName: f,
        collectionId: m,
        isLocal: p,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      n.collectionMap.set(m, l), n.collections[l] = u, Ve(f) && n.normalizedNameMap.set(f, l), n.nextIndex = Math.max(
        n.nextIndex,
        l + 1
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
const ia = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, oa = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function ra(e) {
  var n;
  const a = e.toUpperCase();
  return (n = ia[a]) != null ? n : e;
}
function sa(e) {
  var a;
  return typeof e == "number" ? (a = oa[e]) != null ? a : e.toString() : e;
}
class De {
  constructor() {
    Ee(this, "variableMap");
    // variableKey -> index
    Ee(this, "variables");
    // index -> variable data
    Ee(this, "nextIndex");
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
    for (const [i, c] of Object.entries(a))
      typeof c == "object" && c !== null && "_varRef" in c && typeof c._varRef == "number" ? n[i] = {
        _varRef: c._varRef
      } : n[i] = c;
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
      const i = this.variables[n], c = this.serializeValuesByMode(
        i.valuesByMode
      ), s = ne(ne({
        variableName: i.variableName,
        variableType: ra(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), c && { valuesByMode: c });
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
    const n = new De(), i = Object.entries(a).sort(
      (c, s) => parseInt(c[0], 10) - parseInt(s[0], 10)
    );
    for (const [c, s] of i) {
      const o = parseInt(c, 10), l = sa(s.variableType), p = $e(ne({}, s), {
        variableType: l
        // Always a string after expansion
      });
      n.variables[o] = p, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
function ca(e) {
  return {
    _varRef: e
  };
}
function Me(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let la = 0;
const He = /* @__PURE__ */ new Map();
function da(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = He.get(e.requestId);
  a && (He.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function dt() {
  return new Promise((e, a) => {
    const n = `guid_${Date.now()}_${++la}`;
    He.set(n, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      He.has(n) && (He.delete(n), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function Ke() {
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
    }), await Ke();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await Ke();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await Ke();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await Ke();
  }
};
function ga(e, a) {
  const n = a.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function It(e, a, n, i, c = /* @__PURE__ */ new Set()) {
  const s = {};
  for (const [o, l] of Object.entries(e)) {
    const p = ga(o, i);
    if (l == null) {
      s[p] = l;
      continue;
    }
    if (typeof l == "string" || typeof l == "number" || typeof l == "boolean") {
      s[p] = l;
      continue;
    }
    if (typeof l == "object" && l !== null && "type" in l && l.type === "VARIABLE_ALIAS" && "id" in l) {
      const f = l.id;
      if (c.has(f)) {
        s[p] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const m = await figma.variables.getVariableByIdAsync(f);
      if (!m) {
        s[p] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const u = new Set(c);
      u.add(f);
      const r = await figma.variables.getVariableCollectionByIdAsync(
        m.variableCollectionId
      ), h = m.key;
      if (!h) {
        s[p] = {
          type: "VARIABLE_ALIAS",
          id: f
        };
        continue;
      }
      const d = {
        variableName: m.name,
        variableType: m.resolvedType,
        collectionName: r == null ? void 0 : r.name,
        collectionId: m.variableCollectionId,
        variableKey: h,
        id: f,
        isLocal: !m.remote
      };
      if (r) {
        const g = await Tt(
          r,
          n
        );
        d._colRef = g, m.valuesByMode && (d.valuesByMode = await It(
          m.valuesByMode,
          a,
          n,
          r,
          // Pass collection for mode ID to name conversion
          u
        ));
      }
      const y = a.addVariable(d);
      s[p] = {
        type: "VARIABLE_ALIAS",
        id: f,
        _varRef: y
      };
    } else
      s[p] = l;
  }
  return s;
}
const qe = "recursica:collectionId";
async function pa(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const c = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(c), new Error(c);
    }
    return e.id;
  } else {
    if (Ve(e.name)) {
      const c = Qe(e.name);
      if (c) {
        const s = e.getSharedPluginData(
          "recursica",
          qe
        );
        return (!s || s.trim() === "") && e.setSharedPluginData(
          "recursica",
          qe,
          c
        ), c;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      qe
    );
    if (n && n.trim() !== "")
      return n;
    const i = await dt();
    return e.setSharedPluginData("recursica", qe, i), i;
  }
}
function ma(e, a) {
  if (a)
    return;
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Tt(e, a) {
  const n = !e.remote, i = a.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  ma(e.name, n);
  const c = await pa(e), s = e.modes.map((f) => f.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: s,
    collectionGuid: c
  }, l = a.addCollection(o), p = n ? "local" : "remote";
  return await t.log(
    `  Added ${p} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), l;
}
async function ot(e, a, n) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const i = await figma.variables.getVariableByIdAsync(e.id);
    if (!i)
      return console.log("Could not resolve variable alias:", e.id), null;
    const c = await figma.variables.getVariableCollectionByIdAsync(
      i.variableCollectionId
    );
    if (!c)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const s = i.key;
    if (!s)
      return console.log("Variable missing key:", e.id), null;
    const o = await Tt(
      c,
      n
    ), l = {
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
    i.valuesByMode && (l.valuesByMode = await It(
      i.valuesByMode,
      a,
      n,
      c,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const p = a.addVariable(l);
    return ca(p);
  } catch (i) {
    const c = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${c}`
    );
  }
}
async function Ge(e, a, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const c in e)
    if (Object.prototype.hasOwnProperty.call(e, c)) {
      const s = e[c];
      if (s && typeof s == "object" && !Array.isArray(s))
        if (s.type === "VARIABLE_ALIAS") {
          const o = await ot(
            s,
            a,
            n
          );
          o && (i[c] = o);
        } else
          i[c] = await Ge(
            s,
            a,
            n
          );
      else Array.isArray(s) ? i[c] = await Promise.all(
        s.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await ot(
          o,
          a,
          n
        ) || o : o && typeof o == "object" ? await Ge(
          o,
          a,
          n
        ) : o)
      ) : i[c] = s;
    }
  return i;
}
async function Pt(e, a, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const c = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? c[s] = await Ge(
          i[s],
          a,
          n
        ) : c[s] = i[s]);
      return c;
    })
  );
}
async function Vt(e, a, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const c = {};
      for (const s in i)
        Object.prototype.hasOwnProperty.call(i, s) && (s === "boundVariables" ? c[s] = await Ge(
          i[s],
          a,
          n
        ) : c[s] = i[s]);
      return c;
    })
  );
}
const je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: Ge,
  resolveVariableAliasMetadata: ot,
  serializeBackgrounds: Vt,
  serializeFills: Pt
}, Symbol.toStringTag, { value: "Module" }));
async function Ot(e, a) {
  var f, m;
  const n = {}, i = /* @__PURE__ */ new Set();
  e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height"));
  const c = e.name || "Unnamed";
  e.preserveRatio !== void 0 && await t.log(
    `[ISSUE #3 EXPORT DEBUG] "${c}" has preserveRatio: ${e.preserveRatio} (NOT being exported - needs to be added!)`
  );
  const s = e.type;
  if (s === "FRAME" || s === "COMPONENT" || s === "INSTANCE" || s === "GROUP" || s === "BOOLEAN_OPERATION" || s === "VECTOR" || s === "STAR" || s === "LINE" || s === "ELLIPSE" || s === "POLYGON" || s === "RECTANGLE" || s === "TEXT") {
    const u = e.constraintHorizontal !== void 0 ? e.constraintHorizontal : (f = e.constraints) == null ? void 0 : f.horizontal, r = e.constraintVertical !== void 0 ? e.constraintVertical : (m = e.constraints) == null ? void 0 : m.vertical;
    u !== void 0 && Q(
      u,
      he.constraintHorizontal
    ) && (n.constraintHorizontal = u, i.add("constraintHorizontal")), r !== void 0 && Q(
      r,
      he.constraintVertical
    ) && (n.constraintVertical = r, i.add("constraintVertical"));
  }
  if (e.visible !== void 0 && Q(e.visible, he.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && Q(e.locked, he.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && Q(e.opacity, he.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && Q(e.rotation, he.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && Q(e.blendMode, he.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && Q(e.effects, he.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const u = await Pt(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    Q(u, he.fills) && (n.fills = u), i.add("fills");
  }
  if (e.strokes !== void 0 && Q(e.strokes, he.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && Q(e.strokeWeight, he.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && Q(e.strokeAlign, he.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const u = await Ge(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    );
    Object.keys(u).length > 0 && (n.boundVariables = u), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const u = await Vt(
      e.backgrounds,
      a.variableTable,
      a.collectionTable
    );
    u && Array.isArray(u) && u.length > 0 && (n.backgrounds = u), i.add("backgrounds");
  }
  const l = e.selectionColor, p = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.selectionColor !== void 0;
  if (l !== void 0) {
    n.selectionColor = l, i.add("selectionColor");
    const u = e.name || "Unnamed";
    console.log(
      p ? `[ISSUE #2 EXPORT] "${u}" exporting selectionColor (bound to variable, resolved value): ${JSON.stringify(l)}` : `[ISSUE #2 EXPORT] "${u}" exporting selectionColor (direct value): ${JSON.stringify(l)}`
    );
  } else if (p) {
    const u = e.name || "Unnamed";
    console.log(
      `[ISSUE #2 EXPORT] "${u}" has selectionColor bound to variable (no resolved value to export)`
    );
  }
  return n;
}
const fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: Ot
}, Symbol.toStringTag, { value: "Module" }));
async function rt(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (c) {
    }
  return e.layoutMode !== void 0 && Q(e.layoutMode, ye.layoutMode) && (n.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && Q(
    e.primaryAxisSizingMode,
    ye.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && Q(
    e.counterAxisSizingMode,
    ye.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && Q(
    e.primaryAxisAlignItems,
    ye.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && Q(
    e.counterAxisAlignItems,
    ye.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && Q(e.paddingLeft, ye.paddingLeft) && (n.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && Q(e.paddingRight, ye.paddingRight) && (n.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && Q(e.paddingTop, ye.paddingTop) && (n.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && Q(e.paddingBottom, ye.paddingBottom) && (n.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && Q(e.itemSpacing, ye.itemSpacing) && (n.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.counterAxisSpacing !== void 0 && Q(
    e.counterAxisSpacing,
    ye.counterAxisSpacing
  ) && (n.counterAxisSpacing = e.counterAxisSpacing, i.add("counterAxisSpacing")), e.cornerRadius !== void 0 && Q(e.cornerRadius, ye.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && Q(e.clipsContent, ye.clipsContent) && (n.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && Q(e.layoutWrap, ye.layoutWrap) && (n.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && Q(e.layoutGrow, ye.layoutGrow) && (n.layoutGrow = e.layoutGrow, i.add("layoutGrow")), n;
}
const ua = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: rt
}, Symbol.toStringTag, { value: "Module" }));
async function ha(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && Q(
    e.textAlignHorizontal,
    Ae.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && Q(
    e.textAlignVertical,
    Ae.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && Q(e.letterSpacing, Ae.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && Q(e.lineHeight, Ae.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && Q(e.textCase, Ae.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && Q(e.textDecoration, Ae.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && Q(e.textAutoResize, Ae.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && Q(
    e.paragraphSpacing,
    Ae.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && Q(e.paragraphIndent, Ae.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && Q(e.listOptions, Ae.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function ba(e) {
  const a = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (a) {
    const n = parseFloat(a[1]), i = parseInt(a[2]), c = n * Math.pow(10, i);
    return Math.abs(c) < 1e-10 ? "0" : c.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function Mt(e) {
  if (!e || typeof e != "string")
    return e;
  let a = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => ba(n));
  return a = a.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (n) => {
      const i = parseFloat(n);
      return Math.abs(i) < 1e-10 ? "0" : i.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), a = a.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (n, i, c) => `${i} ${c}`
  ), a = a.replace(/\s+/g, " ").trim(), a;
}
function st(e) {
  return Array.isArray(e) ? e.map((a) => ({
    data: Mt(a.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: a.windRule || a.windingRule || "NONZERO"
  })) : e;
}
const ya = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: Mt,
  normalizeVectorGeometry: st
}, Symbol.toStringTag, { value: "Module" }));
async function wa(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && Q(e.fillGeometry, Le.fillGeometry) && (n.fillGeometry = st(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && Q(e.strokeGeometry, Le.strokeGeometry) && (n.strokeGeometry = st(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && Q(e.strokeCap, Le.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && Q(e.strokeJoin, Le.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && Q(e.dashPattern, Le.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function $a(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && Q(e.cornerRadius, At.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const Xe = /* @__PURE__ */ new Map();
let Sa = 0;
function va() {
  return `prompt_${Date.now()}_${++Sa}`;
}
const ze = {
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
    var l;
    const n = typeof a == "number" ? { timeoutMs: a } : a, i = (l = n == null ? void 0 : n.timeoutMs) != null ? l : 3e5, c = n == null ? void 0 : n.okLabel, s = n == null ? void 0 : n.cancelLabel, o = va();
    return new Promise((p, f) => {
      const m = i === -1 ? null : setTimeout(() => {
        Xe.delete(o), f(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      Xe.set(o, {
        resolve: p,
        reject: f,
        timeout: m
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: ne(ne({
          message: e,
          requestId: o
        }, c && { okLabel: c }), s && { cancelLabel: s })
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
    const { requestId: a, action: n } = e, i = Xe.get(a);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${a}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), Xe.delete(a), n === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
}, Ea = "RecursicaPublishedMetadata";
function it(e) {
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
function Et(e) {
  try {
    const a = e.getPluginData(Ea);
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
async function Na(e, a) {
  var c, s;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const o = await e.getMainComponentAsync();
    if (!o) {
      const T = e.name || "(unnamed)", P = e.id;
      if (a.detachedComponentsHandled.has(P))
        await t.log(
          `Treating detached instance "${T}" as internal instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${T}" (main component is missing)`
        );
        const S = `Found detached instance "${T}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await ze.prompt(S, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(P), await t.log(
            `Treating detached instance "${T}" as internal instance`
          );
        } catch (N) {
          if (N instanceof Error && N.message === "User cancelled") {
            const U = `Export cancelled: Detached instance "${T}" found. Please fix the instance before exporting.`;
            await t.error(U);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (H) {
              console.warn("Could not scroll to instance:", H);
            }
            throw new Error(U);
          } else
            throw N;
        }
      }
      if (!it(e).page) {
        const S = `Detached instance "${T}" is not on any page. Cannot export.`;
        throw await t.error(S), new Error(S);
      }
      let O, R;
      try {
        e.variantProperties && (O = e.variantProperties), e.componentProperties && (R = e.componentProperties);
      } catch (S) {
      }
      const v = ne(ne({
        instanceType: "internal",
        componentName: T,
        componentNodeId: e.id
      }, O && { variantProperties: O }), R && { componentProperties: R }), G = a.instanceTable.addInstance(v);
      return n._instanceRef = G, i.add("_instanceRef"), await t.log(
        `  Exported detached INSTANCE: "${T}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const l = e.name || "(unnamed)", p = o.name || "(unnamed)", f = o.remote === !0, u = it(e).page, r = it(o);
    let h = r.page;
    if (!h && f)
      try {
        await figma.loadAllPagesAsync();
        const T = figma.root.children;
        let P = null;
        for (const E of T)
          try {
            if (E.findOne(
              (O) => O.id === o.id
            )) {
              P = E;
              break;
            }
          } catch (V) {
          }
        if (!P) {
          const E = o.id.split(":")[0];
          for (const V of T) {
            const O = V.id.split(":")[0];
            if (E === O) {
              P = V;
              break;
            }
          }
        }
        P && (h = P);
      } catch (T) {
      }
    let d, y = h;
    if (f)
      if (h) {
        const T = Et(h);
        d = "normal", y = h, T != null && T.id ? await t.log(
          `  Component "${p}" is from library but also exists on local page "${h.name}" with metadata. Treating as "normal" instance.`
        ) : await t.log(
          `  Component "${p}" is from library and exists on local page "${h.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        d = "remote", await t.log(
          `  Component "${p}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (h && u && h.id === u.id)
      d = "internal";
    else if (h && u && h.id !== u.id)
      d = "normal";
    else if (h && !u)
      d = "normal";
    else if (!f && r.reason === "detached") {
      const T = o.id;
      if (a.detachedComponentsHandled.has(T))
        d = "remote", await t.log(
          `Treating detached instance "${l}" -> component "${p}" as remote instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${l}" -> component "${p}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (E) {
          console.warn("Could not scroll to component:", E);
        }
        const P = `Found detached instance "${l}" attached to component "${p}". This should be fixed. Continue to publish?`;
        try {
          await ze.prompt(P, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(T), d = "remote", await t.log(
            `Treating detached instance "${l}" as remote instance (will be created on REMOTES page)`
          );
        } catch (E) {
          if (E instanceof Error && E.message === "User cancelled") {
            const V = `Export cancelled: Detached instance "${l}" found. The component "${p}" is not on any page. Please fix the instance before exporting.`;
            throw await t.error(V), new Error(V);
          } else
            throw E;
        }
      }
    } else
      f || await t.warning(
        `  Instance "${l}" -> component "${p}": componentPage is null but component is not remote. Reason: ${r.reason}. Cannot determine instance type.`
      ), d = "normal";
    let g, b;
    try {
      if (e.variantProperties && (g = e.variantProperties, await t.log(
        `  Instance "${l}" -> variantProperties from instance: ${JSON.stringify(g)}`
      )), typeof e.getProperties == "function")
        try {
          const T = await e.getProperties();
          T && T.variantProperties && (await t.log(
            `  Instance "${l}" -> variantProperties from getProperties(): ${JSON.stringify(T.variantProperties)}`
          ), T.variantProperties && Object.keys(T.variantProperties).length > 0 && (g = T.variantProperties));
        } catch (T) {
          await t.log(
            `  Instance "${l}" -> getProperties() not available or failed: ${T}`
          );
        }
      if (e.componentProperties && (b = e.componentProperties), o.parent && o.parent.type === "COMPONENT_SET") {
        const T = o.parent;
        try {
          const P = T.componentPropertyDefinitions;
          P && await t.log(
            `  Component set "${T.name}" has property definitions: ${JSON.stringify(Object.keys(P))}`
          );
          const E = {}, V = p.split(",").map((O) => O.trim());
          for (const O of V) {
            const R = O.split("=").map((v) => v.trim());
            if (R.length >= 2) {
              const v = R[0], G = R.slice(1).join("=").trim();
              P && P[v] && (E[v] = G);
            }
          }
          if (Object.keys(E).length > 0 && await t.log(
            `  Parsed variant properties from component name "${p}": ${JSON.stringify(E)}`
          ), g && Object.keys(g).length > 0)
            await t.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(g)}`
            );
          else if (Object.keys(E).length > 0)
            g = E, await t.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(g)}`
            );
          else if (o.variantProperties) {
            const O = o.variantProperties;
            await t.log(
              `  Main component "${p}" has variantProperties: ${JSON.stringify(O)}`
            ), g = O;
          }
        } catch (P) {
          await t.warning(
            `  Could not get variant properties from component set: ${P}`
          );
        }
      }
    } catch (T) {
    }
    let $, x;
    try {
      let T = o.parent;
      const P = [];
      let E = 0;
      const V = 20;
      for (; T && E < V; )
        try {
          const O = T.type, R = T.name;
          if (O === "COMPONENT_SET" && !x && (x = R), O === "PAGE")
            break;
          const v = R || "";
          P.unshift(v), (x === "arrow-top-right-on-square" || p === "arrow-top-right-on-square") && await t.log(
            `  [PATH BUILD] Added segment: "${v}" (type: ${O}) to path for component "${p}"`
          ), T = T.parent, E++;
        } catch (O) {
          (x === "arrow-top-right-on-square" || p === "arrow-top-right-on-square") && await t.warning(
            `  [PATH BUILD] Error building path for "${p}": ${O}`
          );
          break;
        }
      $ = P, (x === "arrow-top-right-on-square" || p === "arrow-top-right-on-square") && await t.log(
        `  [PATH BUILD] Final path for component "${p}": [${P.join(" → ")}]`
      );
    } catch (T) {
    }
    const I = ne(ne(ne(ne({
      instanceType: d,
      componentName: p
    }, x && { componentSetName: x }), g && { variantProperties: g }), b && { componentProperties: b }), d === "normal" ? { path: $ || [] } : $ && $.length > 0 && {
      path: $
    });
    if (d === "internal") {
      I.componentNodeId = o.id, await t.log(
        `  Found INSTANCE: "${l}" -> INTERNAL component "${p}" (ID: ${o.id.substring(0, 8)}...)`
      );
      const T = e.boundVariables, P = o.boundVariables;
      if (T && typeof T == "object") {
        const v = Object.keys(T);
        await t.log(
          `  DEBUG: Internal instance "${l}" -> boundVariables keys: ${v.length > 0 ? v.join(", ") : "none"}`
        );
        for (const S of v) {
          const N = T[S], U = (N == null ? void 0 : N.type) || typeof N;
          await t.log(
            `  DEBUG:   boundVariables.${S}: type=${U}, value=${JSON.stringify(N)}`
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
          T[S] !== void 0 && await t.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${S} = ${JSON.stringify(T[S])}`
          );
      } else
        await t.log(
          `  DEBUG: Internal instance "${l}" -> No boundVariables found on instance node`
        );
      if (P && typeof P == "object") {
        const v = Object.keys(P);
        await t.log(
          `  DEBUG: Main component "${p}" -> boundVariables keys: ${v.length > 0 ? v.join(", ") : "none"}`
        );
      }
      const E = e.backgrounds;
      if (E && Array.isArray(E)) {
        await t.log(
          `  DEBUG: Internal instance "${l}" -> backgrounds array length: ${E.length}`
        );
        for (let v = 0; v < E.length; v++) {
          const G = E[v];
          if (G && typeof G == "object") {
            if (await t.log(
              `  DEBUG:   backgrounds[${v}] structure: ${JSON.stringify(Object.keys(G))}`
            ), G.boundVariables) {
              const S = Object.keys(G.boundVariables);
              await t.log(
                `  DEBUG:   backgrounds[${v}].boundVariables keys: ${S.length > 0 ? S.join(", ") : "none"}`
              );
              for (const N of S) {
                const U = G.boundVariables[N];
                await t.log(
                  `  DEBUG:     backgrounds[${v}].boundVariables.${N}: ${JSON.stringify(U)}`
                );
              }
            }
            G.color && await t.log(
              `  DEBUG:   backgrounds[${v}].color: ${JSON.stringify(G.color)}`
            );
          }
        }
      }
      const V = Object.keys(e).filter(
        (v) => !v.startsWith("_") && v !== "parent" && v !== "removed" && typeof e[v] != "function" && v !== "type" && v !== "id" && v !== "name" && v !== "boundVariables" && v !== "backgrounds" && v !== "fills"
      ), O = Object.keys(o).filter(
        (v) => !v.startsWith("_") && v !== "parent" && v !== "removed" && typeof o[v] != "function" && v !== "type" && v !== "id" && v !== "name" && v !== "boundVariables" && v !== "backgrounds" && v !== "fills"
      ), R = [
        .../* @__PURE__ */ new Set([...V, ...O])
      ].filter(
        (v) => v.toLowerCase().includes("selection") || v.toLowerCase().includes("select") || v.toLowerCase().includes("color") && !v.toLowerCase().includes("fill") && !v.toLowerCase().includes("stroke")
      );
      if (R.length > 0) {
        await t.log(
          `  DEBUG: Found selection/color-related properties: ${R.join(", ")}`
        );
        for (const v of R)
          try {
            if (V.includes(v)) {
              const G = e[v];
              await t.log(
                `  DEBUG:   Instance.${v}: ${JSON.stringify(G)}`
              );
            }
            if (O.includes(v)) {
              const G = o[v];
              await t.log(
                `  DEBUG:   MainComponent.${v}: ${JSON.stringify(G)}`
              );
            }
          } catch (G) {
          }
      } else
        await t.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (d === "normal") {
      const T = y || h;
      if (T) {
        I.componentPageName = T.name;
        const E = Et(T);
        E != null && E.id && E.version !== void 0 ? (I.componentGuid = E.id, I.componentVersion = E.version, await t.log(
          `  Found INSTANCE: "${l}" -> NORMAL component "${p}" (ID: ${o.id.substring(0, 8)}...) at path [${($ || []).join(" → ")}]`
        )) : await t.warning(
          `  Instance "${l}" -> component "${p}" is classified as normal but page "${T.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const E = o.id;
        let V = "", O = "";
        switch (r.reason) {
          case "broken_chain":
            V = "The component's parent chain is broken and cannot be traversed to find the page", O = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            V = "Cannot access the component's parent chain (access error)", O = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            V = "Cannot determine which page the component is on", O = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (G) {
          console.warn("Could not scroll to component:", G);
        }
        const R = `Normal instance "${l}" -> component "${p}" (ID: ${E}) has no componentPage. ${V}. ${O} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", R), await t.error(R);
        const v = new Error(R);
        throw console.error("Throwing error:", v), v;
      }
      $ === void 0 && console.warn(
        `Failed to build path for normal instance "${l}" -> component "${p}". Path is required for resolution.`
      );
      const P = $ && $.length > 0 ? ` at path [${$.join(" → ")}]` : " at page root";
      await t.log(
        `  Found INSTANCE: "${l}" -> NORMAL component "${p}" (ID: ${o.id.substring(0, 8)}...)${P}`
      );
    } else if (d === "remote") {
      let T, P;
      const E = a.detachedComponentsHandled.has(
        o.id
      );
      if (!E)
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const O = await o.getPublishStatusAsync();
              O && typeof O == "object" && (O.libraryName && (T = O.libraryName), O.libraryKey && (P = O.libraryKey));
            } catch (O) {
            }
          try {
            const O = figma.teamLibrary;
            if (typeof (O == null ? void 0 : O.getAvailableLibraryComponentSetsAsync) == "function") {
              const R = await O.getAvailableLibraryComponentSetsAsync();
              if (R && Array.isArray(R)) {
                for (const v of R)
                  if (v.key === o.key || v.name === o.name) {
                    v.libraryName && (T = v.libraryName), v.libraryKey && (P = v.libraryKey);
                    break;
                  }
              }
            }
          } catch (O) {
          }
        } catch (O) {
          console.warn(
            `Error getting library info for remote component "${p}":`,
            O
          );
        }
      if (T && (I.remoteLibraryName = T), P && (I.remoteLibraryKey = P), E && (I.componentNodeId = o.id), a.instanceTable.getInstanceIndex(I) !== -1)
        await t.log(
          `  Found INSTANCE: "${l}" -> REMOTE component "${p}" (ID: ${o.id.substring(0, 8)}...)${E ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: O } = await Promise.resolve().then(() => fa), R = await O(e, a), { parseFrameProperties: v } = await Promise.resolve().then(() => ua), G = await v(e, a), S = $e(ne(ne({}, R), G), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const N = $e(ne({}, a), {
              depth: (a.depth || 0) + 1
            }), { extractNodeData: U } = await Promise.resolve().then(() => Pa), H = [];
            for (const ee of e.children)
              try {
                let Y;
                if (ee.type === "INSTANCE")
                  try {
                    const j = await ee.getMainComponentAsync();
                    if (j) {
                      const te = await O(
                        ee,
                        a
                      ), K = await v(
                        ee,
                        a
                      ), X = await U(
                        j,
                        /* @__PURE__ */ new WeakSet(),
                        N
                      );
                      Y = $e(ne(ne(ne({}, X), te), K), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      Y = await U(
                        ee,
                        /* @__PURE__ */ new WeakSet(),
                        N
                      ), Y.type === "INSTANCE" && (Y.type = "COMPONENT"), delete Y._instanceRef;
                  } catch (j) {
                    Y = await U(
                      ee,
                      /* @__PURE__ */ new WeakSet(),
                      N
                    ), Y.type === "INSTANCE" && (Y.type = "COMPONENT"), delete Y._instanceRef;
                  }
                else {
                  Y = await U(
                    ee,
                    /* @__PURE__ */ new WeakSet(),
                    N
                  );
                  const j = ee.boundVariables;
                  if (j && typeof j == "object") {
                    const te = Object.keys(j);
                    te.length > 0 && (await t.log(
                      `  DEBUG: Child "${ee.name || "Unnamed"}" -> boundVariables keys: ${te.join(", ")}`
                    ), j.backgrounds !== void 0 && await t.log(
                      `  DEBUG:   Child "${ee.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(j.backgrounds)}`
                    ));
                  }
                  if (o.children && Array.isArray(o.children)) {
                    const te = o.children.find(
                      (K) => K.name === ee.name
                    );
                    if (te) {
                      const K = te.boundVariables;
                      if (K && typeof K == "object") {
                        const X = Object.keys(K);
                        if (X.length > 0 && (await t.log(
                          `  DEBUG: Main component child "${te.name || "Unnamed"}" -> boundVariables keys: ${X.join(", ")}`
                        ), K.backgrounds !== void 0 && (await t.log(
                          `  DEBUG:   Main component child "${te.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(K.backgrounds)}`
                        ), !j || !j.backgrounds))) {
                          await t.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: ge } = await Promise.resolve().then(() => je), ce = await ge(
                            K,
                            a.variableTable,
                            a.collectionTable
                          );
                          Y.boundVariables || (Y.boundVariables = {}), ce.backgrounds && (Y.boundVariables.backgrounds = ce.backgrounds, await t.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                H.push(Y);
              } catch (Y) {
                console.warn(
                  `Failed to extract child "${ee.name || "Unnamed"}" for remote component "${p}":`,
                  Y
                );
              }
            S.children = H;
          }
          if (!S)
            throw new Error("Failed to build structure for remote instance");
          try {
            const N = e.boundVariables;
            if (N && typeof N == "object") {
              const J = Object.keys(N);
              await t.log(
                `  DEBUG: Instance "${l}" -> boundVariables keys: ${J.length > 0 ? J.join(", ") : "none"}`
              );
              for (const Z of J) {
                const W = N[Z], ae = (W == null ? void 0 : W.type) || typeof W;
                if (await t.log(
                  `  DEBUG:   boundVariables.${Z}: type=${ae}, value=${JSON.stringify(W)}`
                ), W && typeof W == "object" && !Array.isArray(W)) {
                  const le = Object.keys(W);
                  if (le.length > 0) {
                    await t.log(
                      `  DEBUG:     boundVariables.${Z} has nested keys: ${le.join(", ")}`
                    );
                    for (const de of le) {
                      const me = W[de];
                      me && typeof me == "object" && me.type === "VARIABLE_ALIAS" && await t.log(
                        `  DEBUG:       boundVariables.${Z}.${de}: VARIABLE_ALIAS id=${me.id}`
                      );
                    }
                  }
                }
              }
              const ie = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const Z of ie)
                N[Z] !== void 0 && await t.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${Z} = ${JSON.stringify(N[Z])}`
                );
            } else
              await t.log(
                `  DEBUG: Instance "${l}" -> No boundVariables found on instance node`
              );
            const U = N && N.fills !== void 0 && N.fills !== null, H = S.fills !== void 0 && Array.isArray(S.fills) && S.fills.length > 0, ee = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, Y = o.fills !== void 0 && Array.isArray(o.fills) && o.fills.length > 0;
            if (await t.log(
              `  DEBUG: Instance "${l}" -> fills check: instanceHasFills=${ee}, structureHasFills=${H}, mainComponentHasFills=${Y}, hasInstanceFillsBoundVar=${!!U}`
            ), U && !H) {
              await t.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (ee) {
                  const { serializeFills: J } = await Promise.resolve().then(() => je), ie = await J(
                    e.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  S.fills = ie, await t.log(
                    `  DEBUG: Got ${ie.length} fill(s) from instance node`
                  );
                } else if (Y) {
                  const { serializeFills: J } = await Promise.resolve().then(() => je), ie = await J(
                    o.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  S.fills = ie, await t.log(
                    `  DEBUG: Got ${ie.length} fill(s) from main component`
                  );
                } else
                  await t.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (J) {
                await t.warning(
                  `  Failed to get fills: ${J}`
                );
              }
            }
            const j = e.selectionColor, te = o.selectionColor;
            j !== void 0 && await t.log(
              `  DEBUG: Instance "${l}" -> selectionColor: ${JSON.stringify(j)}`
            ), te !== void 0 && await t.log(
              `  DEBUG: Main component "${p}" -> selectionColor: ${JSON.stringify(te)}`
            );
            const K = Object.keys(e).filter(
              (J) => !J.startsWith("_") && J !== "parent" && J !== "removed" && typeof e[J] != "function" && J !== "type" && J !== "id" && J !== "name"
            ), X = Object.keys(o).filter(
              (J) => !J.startsWith("_") && J !== "parent" && J !== "removed" && typeof o[J] != "function" && J !== "type" && J !== "id" && J !== "name"
            ), ge = [
              .../* @__PURE__ */ new Set([...K, ...X])
            ].filter(
              (J) => J.toLowerCase().includes("selection") || J.toLowerCase().includes("select") || J.toLowerCase().includes("color") && !J.toLowerCase().includes("fill") && !J.toLowerCase().includes("stroke")
            );
            if (ge.length > 0) {
              await t.log(
                `  DEBUG: Found selection/color-related properties: ${ge.join(", ")}`
              );
              for (const J of ge)
                try {
                  if (K.includes(J)) {
                    const ie = e[J];
                    await t.log(
                      `  DEBUG:   Instance.${J}: ${JSON.stringify(ie)}`
                    );
                  }
                  if (X.includes(J)) {
                    const ie = o[J];
                    await t.log(
                      `  DEBUG:   MainComponent.${J}: ${JSON.stringify(ie)}`
                    );
                  }
                } catch (ie) {
                }
            } else
              await t.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const ce = o.boundVariables;
            if (ce && typeof ce == "object") {
              const J = Object.keys(ce);
              if (J.length > 0) {
                await t.log(
                  `  DEBUG: Main component "${p}" -> boundVariables keys: ${J.join(", ")}`
                );
                for (const ie of J) {
                  const Z = ce[ie], W = (Z == null ? void 0 : Z.type) || typeof Z;
                  await t.log(
                    `  DEBUG:   Main component boundVariables.${ie}: type=${W}, value=${JSON.stringify(Z)}`
                  );
                }
              }
            }
            if (N && Object.keys(N).length > 0) {
              await t.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(N).length} key(s))`
              );
              const { extractBoundVariables: J } = await Promise.resolve().then(() => je), ie = await J(
                N,
                a.variableTable,
                a.collectionTable
              );
              S.boundVariables || (S.boundVariables = {});
              for (const [Z, W] of Object.entries(
                ie
              ))
                W !== void 0 && (S.boundVariables[Z] !== void 0 && await t.log(
                  `  DEBUG: Structure already has boundVariables.${Z} from baseProps, but instance also has it - using instance's boundVariables.${Z}`
                ), S.boundVariables[Z] = W, await t.log(
                  `  DEBUG: Set boundVariables.${Z} in structure: ${JSON.stringify(W)}`
                ));
              ie.fills !== void 0 ? await t.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : U && await t.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), ie.backgrounds !== void 0 ? await t.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(ie.backgrounds)}`
              ) : N && N.backgrounds !== void 0 && await t.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (ce && Object.keys(ce).length > 0) {
              await t.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(ce).length} key(s))`
              );
              const { extractBoundVariables: J } = await Promise.resolve().then(() => je), ie = await J(
                ce,
                a.variableTable,
                a.collectionTable
              );
              S.boundVariables || (S.boundVariables = {});
              for (const [Z, W] of Object.entries(
                ie
              ))
                W !== void 0 && (S.boundVariables[Z] === void 0 ? (S.boundVariables[Z] = W, await t.log(
                  `  DEBUG: Added boundVariables.${Z} from main component (not in instance): ${JSON.stringify(W)}`
                )) : await t.log(
                  `  DEBUG: Skipped boundVariables.${Z} from main component (instance already has it)`
                ));
            }
            await t.log(
              `  DEBUG: Final structure for "${p}": hasFills=${!!S.fills}, fillsCount=${((c = S.fills) == null ? void 0 : c.length) || 0}, hasBoundVars=${!!S.boundVariables}, boundVarsKeys=${S.boundVariables ? Object.keys(S.boundVariables).join(", ") : "none"}`
            ), (s = S.boundVariables) != null && s.fills && await t.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(S.boundVariables.fills)}`
            );
          } catch (N) {
            await t.warning(
              `  Failed to handle bound variables for fills: ${N}`
            );
          }
          I.structure = S, E ? await t.log(
            `  Extracted structure for detached component "${p}" (ID: ${o.id.substring(0, 8)}...)`
          ) : await t.log(
            `  Extracted structure from instance for remote component "${p}" (preserving size overrides: ${e.width}x${e.height})`
          ), await t.log(
            `  Found INSTANCE: "${l}" -> REMOTE component "${p}" (ID: ${o.id.substring(0, 8)}...)${E ? " [DETACHED]" : ""}`
          );
        } catch (O) {
          const R = `Failed to extract structure for remote component "${p}": ${O instanceof Error ? O.message : String(O)}`;
          console.error(R, O), await t.error(R);
        }
    }
    const B = a.instanceTable.addInstance(I);
    n._instanceRef = B, i.add("_instanceRef");
  }
  return n;
}
class We {
  constructor() {
    Ee(this, "instanceMap");
    // unique key -> index
    Ee(this, "instances");
    // index -> instance data
    Ee(this, "nextIndex");
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
    const n = new We(), i = Object.entries(a).sort(
      (c, s) => parseInt(c[0], 10) - parseInt(s[0], 10)
    );
    for (const [c, s] of i) {
      const o = parseInt(c, 10), l = n.generateKey(s);
      n.instanceMap.set(l, o), n.instances[o] = s, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
const Rt = {
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
function Ca() {
  const e = {};
  for (const [a, n] of Object.entries(Rt))
    e[n] = a;
  return e;
}
function Nt(e) {
  var a;
  return (a = Rt[e]) != null ? a : e;
}
function Aa(e) {
  var a;
  return typeof e == "number" ? (a = Ca()[e]) != null ? a : e.toString() : e;
}
const xt = {
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
}, ct = {};
for (const [e, a] of Object.entries(xt))
  ct[a] = e;
class et {
  constructor() {
    Ee(this, "shortToLong");
    Ee(this, "longToShort");
    this.shortToLong = ne({}, ct), this.longToShort = ne({}, xt);
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
      for (const c of Object.keys(a))
        i.add(c);
      for (const [c, s] of Object.entries(a)) {
        const o = this.getShortName(c);
        if (o !== c && !i.has(o)) {
          let l = this.compressObject(s);
          o === "type" && typeof l == "string" && (l = Nt(l)), n[o] = l;
        } else {
          let l = this.compressObject(s);
          c === "type" && typeof l == "string" && (l = Nt(l)), n[c] = l;
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
      for (const [i, c] of Object.entries(a)) {
        const s = this.getLongName(i);
        let o = this.expandObject(c);
        (s === "type" || i === "type") && (typeof o == "number" || typeof o == "string") && (o = Aa(o)), n[s] = o;
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
    return ne({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(a) {
    const n = new et();
    n.shortToLong = ne(ne({}, ct), a), n.longToShort = {};
    for (const [i, c] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[c] = i;
    return n;
  }
}
function Ia(e, a) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [i, c] of Object.entries(e))
    i !== "metadata" && (n[i] = a.compressObject(c));
  return n;
}
function Ta(e, a) {
  return a.expandObject(e);
}
function Ze(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function tt(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    a += tt(n);
  }), a;
}
function kt(e) {
  let a = 0;
  if ((e.cnsHr !== void 0 || e.cnsVr !== void 0) && (a = 1), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && a === 0 && (a = 1), e.children && Array.isArray(e.children))
    for (const n of e.children)
      n && typeof n == "object" && (a += kt(n));
  return a;
}
async function at(e, a = /* @__PURE__ */ new WeakSet(), n = {}) {
  var h, d, y, g, b, $, x;
  if (!e || typeof e != "object")
    return e;
  const i = (h = n.maxNodes) != null ? h : 1e4, c = (d = n.nodeCount) != null ? d : 0;
  if (c >= i)
    return await t.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: c
    };
  const s = {
    visited: (y = n.visited) != null ? y : /* @__PURE__ */ new WeakSet(),
    depth: (g = n.depth) != null ? g : 0,
    maxDepth: (b = n.maxDepth) != null ? b : 100,
    nodeCount: c + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: ($ = n.detachedComponentsHandled) != null ? $ : /* @__PURE__ */ new Set(),
    exportedIds: (x = n.exportedIds) != null ? x : /* @__PURE__ */ new Map()
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), s.visited = a;
  const o = {}, l = await Ot(e, s);
  if (Object.assign(o, l), o.id && s.exportedIds) {
    const I = s.exportedIds.get(o.id);
    if (I !== void 0) {
      const B = o.name || "Unnamed";
      if (I !== B) {
        const T = `Duplicate ID detected during export: ID "${o.id.substring(0, 8)}..." is used by both "${I}" and "${B}". Each node must have a unique ID.`;
        throw await t.error(T), new Error(T);
      }
      await t.warning(
        `Node "${B}" (ID: ${o.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      s.exportedIds.set(o.id, o.name || "Unnamed");
  }
  const p = e.type;
  if (p)
    switch (p) {
      case "FRAME":
      case "COMPONENT": {
        const I = await rt(e);
        Object.assign(o, I);
        break;
      }
      case "INSTANCE": {
        const I = await Na(
          e,
          s
        );
        Object.assign(o, I);
        const B = await rt(
          e
        );
        Object.assign(o, B);
        break;
      }
      case "TEXT": {
        const I = await ha(e);
        Object.assign(o, I);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const I = await wa(e);
        Object.assign(o, I);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const I = await $a(e);
        Object.assign(o, I);
        break;
      }
      default:
        s.unhandledKeys.add("_unknownType");
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
  for (const I of f)
    typeof e[I] != "function" && (m.has(I) || s.unhandledKeys.add(I));
  s.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(s.unhandledKeys).sort());
  const u = o._instanceRef !== void 0 && s.instanceTable && p === "INSTANCE";
  let r = !1;
  if (u) {
    const I = s.instanceTable.getInstanceByIndex(
      o._instanceRef
    );
    I && I.instanceType === "normal" && (r = !0, await t.log(
      `  Skipping children extraction for normal instance "${o.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!r && e.children && Array.isArray(e.children)) {
    const I = s.maxDepth;
    if (s.depth >= I)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${I}) reached`,
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
      const B = $e(ne({}, s), {
        depth: s.depth + 1
      }), T = [];
      let P = !1;
      for (const E of e.children) {
        if (B.nodeCount >= i) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: T.length,
            _total: e.children.length,
            children: T
          }, P = !0;
          break;
        }
        const V = await at(E, a, B);
        T.push(V), B.nodeCount && (s.nodeCount = B.nodeCount);
      }
      P || (o.children = T);
    }
  }
  return o;
}
async function Fe(e, a = /* @__PURE__ */ new Set(), n = !1, i = /* @__PURE__ */ new Set()) {
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
    const l = o[s], p = l.id;
    if (e.skipPrompts) {
      if (i.has(p))
        return await t.log(
          `Page "${l.name}" already discovered, skipping discovery...`
        ), {
          type: "exportPage",
          success: !0,
          error: !1,
          message: "Page already discovered",
          data: {
            filename: "",
            pageData: {},
            pageName: l.name,
            additionalPages: [],
            discoveredReferencedPages: []
          }
        };
      i.add(p);
    } else {
      if (a.has(p))
        return await t.log(
          `Page "${l.name}" has already been processed, skipping...`
        ), {
          type: "exportPage",
          success: !1,
          error: !0,
          message: "Page already processed",
          data: {}
        };
      a.add(p);
    }
    await t.log(
      `Selected page: "${l.name}" (index: ${s})`
    ), await t.log(
      "Initializing variable, collection, and instance tables..."
    );
    const f = new De(), m = new Je(), u = new We();
    await t.log("Extracting node data from page..."), await t.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await t.log(
      "Collections will be discovered as variables are processed:"
    );
    const r = await at(
      l,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: f,
        collectionTable: m,
        instanceTable: u
      }
    );
    await t.log("Node extraction finished");
    const h = tt(r), d = f.getSize(), y = m.getSize(), g = u.getSize(), b = kt(r);
    await t.log("Extraction complete:"), await t.log(`  - Total nodes: ${h}`), await t.log(`  - Unique variables: ${d}`), await t.log(`  - Unique collections: ${y}`), await t.log(`  - Unique instances: ${g}`), await t.log(
      `  - Nodes with constraints exported: ${b}`
    );
    const $ = u.getSerializedTable(), x = /* @__PURE__ */ new Map();
    for (const [j, te] of Object.entries($))
      if (te.instanceType === "remote") {
        const K = parseInt(j, 10);
        x.set(K, te);
      }
    if (e.validateOnly) {
      await t.log("=== Validation Mode ===");
      const j = await figma.variables.getLocalVariableCollectionsAsync(), te = /* @__PURE__ */ new Set(), K = /* @__PURE__ */ new Set();
      for (const W of j)
        te.add(W.id), K.add(W.name);
      K.add("Token"), K.add("Tokens"), K.add("Theme"), K.add("Themes");
      const X = [], ge = [];
      for (const W of x.values()) {
        const ae = W.componentName || "(unnamed)";
        X.push({
          componentName: ae,
          pageName: l.name
        }), ge.push({
          type: "externalReference",
          message: `External reference found: "${ae}" references a component from another file`,
          componentName: ae,
          pageName: l.name
        });
      }
      const ce = [], J = m.getTable();
      for (const W of Object.values(J))
        W.isLocal ? te.has(W.collectionId) || (ce.push({
          collectionName: W.collectionName,
          collectionId: W.collectionId,
          pageName: l.name
        }), ge.push({
          type: "unknownCollection",
          message: `Unknown local collection: "${W.collectionName}"`,
          collectionName: W.collectionName,
          pageName: l.name
        })) : K.has(W.collectionName) || (ce.push({
          collectionName: W.collectionName,
          collectionId: W.collectionId,
          pageName: l.name
        }), ge.push({
          type: "unknownCollection",
          message: `Unknown remote collection: "${W.collectionName}". Remote collections must be named "Token", "Tokens", "Theme", or "Themes"`,
          collectionName: W.collectionName,
          pageName: l.name
        }));
      const ie = Object.values(J).map(
        (W) => W.collectionName
      ), Z = {
        hasErrors: ge.length > 0,
        errors: ge,
        externalReferences: X,
        unknownCollections: ce,
        discoveredCollections: ie
      };
      return await t.log("Validation complete:"), await t.log(
        `  - External references: ${X.length}`
      ), await t.log(
        `  - Unknown collections: ${ce.length}`
      ), await t.log(`  - Has errors: ${Z.hasErrors}`), {
        type: "exportPage",
        success: !0,
        error: !1,
        message: "Validation complete",
        data: {
          filename: "",
          pageData: {},
          pageName: l.name,
          additionalPages: [],
          validationResult: Z
        }
      };
    }
    if (x.size > 0) {
      await t.error(
        `Found ${x.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const j = (ge, ce, J = [], ie = !1) => {
        const Z = [];
        if (!ge || typeof ge != "object")
          return Z;
        if (ie || ge.type === "PAGE") {
          const de = ge.children || ge.child;
          if (Array.isArray(de))
            for (const me of de)
              me && typeof me == "object" && Z.push(
                ...j(
                  me,
                  ce,
                  [],
                  !1
                )
              );
          return Z;
        }
        const W = ge.name || "";
        if (typeof ge._instanceRef == "number" && ge._instanceRef === ce) {
          const de = W || "(unnamed)", me = J.length > 0 ? [...J, de] : [de];
          return Z.push({
            path: me,
            nodeName: de
          }), Z;
        }
        const ae = W ? [...J, W] : J, le = ge.children || ge.child;
        if (Array.isArray(le))
          for (const de of le)
            de && typeof de == "object" && Z.push(
              ...j(
                de,
                ce,
                ae,
                !1
              )
            );
        return Z;
      }, te = [];
      let K = 1;
      for (const [ge, ce] of x.entries()) {
        const J = ce.componentName || "(unnamed)", ie = ce.componentSetName, Z = j(
          r,
          ge,
          [],
          !0
        );
        let W = "";
        Z.length > 0 ? W = `
   Location(s): ${Z.map((me) => {
          const ke = me.path.length > 0 ? me.path.join(" → ") : "page root";
          return `"${me.nodeName}" at ${ke}`;
        }).join(", ")}` : W = `
   Location: (unable to determine - instance may be deeply nested)`;
        const ae = ie ? `Component: "${J}" (from component set "${ie}")` : `Component: "${J}"`, le = ce.remoteLibraryName ? `
   Library: ${ce.remoteLibraryName}` : "";
        te.push(
          `${K}. ${ae}${le}${W}`
        ), K++;
      }
      const X = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${x.size} remote instance(s):
${te.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw await t.error(X), new Error(X);
    }
    if (y > 0) {
      await t.log("Collections found:");
      const j = m.getTable();
      for (const [te, K] of Object.values(j).entries()) {
        const X = K.collectionGuid ? ` (GUID: ${K.collectionGuid.substring(0, 8)}...)` : "";
        await t.log(
          `  ${te}: ${K.collectionName}${X} - ${K.modes.length} mode(s)`
        );
      }
    }
    let I;
    if (e.skipPrompts) {
      await t.log("Running validation on main page...");
      try {
        const j = await Fe(
          {
            pageIndex: s,
            validateOnly: !0
          },
          a,
          !0,
          // Mark as recursive call
          i
        );
        if (j.success && j.data) {
          const te = j.data;
          te.validationResult && (I = te.validationResult, await t.log(
            `Main page validation: ${I.hasErrors ? "FAILED" : "PASSED"}`
          ), I.hasErrors && await t.warning(
            `Found ${I.errors.length} validation error(s) in main page`
          ));
        }
      } catch (j) {
        await t.warning(
          `Could not validate main page: ${j instanceof Error ? j.message : String(j)}`
        );
      }
    }
    await t.log("Checking for referenced component pages...");
    const B = [], T = [], P = Object.values($).filter(
      (j) => j.instanceType === "normal"
    );
    if (P.length > 0) {
      await t.log(
        `Found ${P.length} normal instance(s) to check`
      );
      const j = /* @__PURE__ */ new Map();
      for (const te of P)
        if (te.componentPageName) {
          const K = o.find((X) => X.name === te.componentPageName);
          if (K && !a.has(K.id))
            j.has(K.id) || j.set(K.id, K);
          else if (!K) {
            const X = `Normal instance references component "${te.componentName || "(unnamed)"}" on page "${te.componentPageName}", but that page was not found. Cannot export.`;
            throw await t.error(X), new Error(X);
          }
        } else {
          const K = `Normal instance references component "${te.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await t.error(K), new Error(K);
        }
      await t.log(
        `Found ${j.size} unique referenced page(s)`
      );
      for (const [te, K] of j.entries()) {
        const X = K.name;
        if (a.has(te)) {
          await t.log(`Skipping "${X}" - already processed`);
          continue;
        }
        const ge = K.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let ce = !1, J = 0;
        if (ge)
          try {
            const ae = JSON.parse(ge);
            ce = !!(ae.id && ae.version !== void 0), J = ae.version || 0;
          } catch (ae) {
          }
        const ie = o.findIndex(
          (ae) => ae.id === K.id
        );
        if (ie === -1)
          throw await t.error(
            `Could not find page index for "${X}"`
          ), new Error(`Could not find page index for "${X}"`);
        const Z = Array.from(P).find(
          (ae) => ae.componentPageName === X
        ), W = Z == null ? void 0 : Z.componentName;
        if (e.skipPrompts) {
          te === p ? await t.log(
            `Skipping "${X}" - this is the original page being published`
          ) : T.find(
            (le) => le.pageId === te
          ) || (T.push({
            pageId: te,
            pageName: X,
            pageIndex: ie,
            hasMetadata: ce,
            componentName: W,
            localVersion: J
          }), await t.log(
            `Discovered referenced page: "${X}" (local version: ${J}) (will be handled by wizard)`
          )), await t.log(
            `Validating "${X}" for external references and unknown collections...`
          );
          try {
            const ae = await Fe(
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
            if (ae.success && ae.data) {
              const le = ae.data;
              if (le.validationResult) {
                I || (I = {
                  hasErrors: !1,
                  errors: [],
                  externalReferences: [],
                  unknownCollections: [],
                  discoveredCollections: []
                }), I.errors.push(
                  ...le.validationResult.errors
                ), I.externalReferences.push(
                  ...le.validationResult.externalReferences
                ), I.unknownCollections.push(
                  ...le.validationResult.unknownCollections
                );
                for (const de of le.validationResult.discoveredCollections)
                  I.discoveredCollections.includes(
                    de
                  ) || I.discoveredCollections.push(
                    de
                  );
                I.hasErrors = I.errors.length > 0, await t.log(
                  `  Validation for "${X}": ${le.validationResult.hasErrors ? "FAILED" : "PASSED"}`
                ), le.validationResult.hasErrors && await t.warning(
                  `  Found ${le.validationResult.errors.length} validation error(s) in "${X}"`
                );
              }
            }
          } catch (ae) {
            await t.warning(
              `Could not validate "${X}": ${ae instanceof Error ? ae.message : String(ae)}`
            );
          }
          await t.log(
            `Checking dependencies of "${X}" for transitive dependencies...`
          );
          try {
            const ae = await Fe(
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
            if (ae.success && ae.data) {
              const le = ae.data;
              if (le.discoveredReferencedPages)
                for (const de of le.discoveredReferencedPages) {
                  if (de.pageId === p) {
                    await t.log(
                      `  Skipping "${de.pageName}" - this is the original page being published`
                    );
                    continue;
                  }
                  T.find(
                    (ke) => ke.pageId === de.pageId
                  ) || (T.push(de), await t.log(
                    `  Discovered transitive dependency: "${de.pageName}" (from ${X})`
                  ));
                }
            }
          } catch (ae) {
            await t.warning(
              `Could not discover dependencies of "${X}": ${ae instanceof Error ? ae.message : String(ae)}`
            );
          }
        } else {
          const ae = `Do you want to also publish referenced component "${X}"?`;
          try {
            await ze.prompt(ae, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 3e5
              // 5 minutes
            }), await t.log(`Exporting referenced page: "${X}"`);
            const le = o.findIndex(
              (me) => me.id === K.id
            );
            if (le === -1)
              throw await t.error(
                `Could not find page index for "${X}"`
              ), new Error(`Could not find page index for "${X}"`);
            const de = await Fe(
              {
                pageIndex: le
              },
              a,
              // Pass the same set to track all processed pages
              !0,
              // Mark as recursive call
              i
              // Pass discovered pages set (empty during actual export)
            );
            if (de.success && de.data) {
              const me = de.data;
              B.push(me), await t.log(
                `Successfully exported referenced page: "${X}"`
              );
            } else
              throw new Error(
                `Failed to export referenced page "${X}": ${de.message}`
              );
          } catch (le) {
            if (le instanceof Error && le.message === "User cancelled")
              if (ce)
                await t.log(
                  `User declined to publish "${X}", but page has existing metadata. Continuing with existing metadata.`
                );
              else
                throw await t.error(
                  `Export cancelled: Referenced page "${X}" has no metadata and user declined to publish it.`
                ), new Error(
                  `Cannot continue export: Referenced component "${X}" has no metadata. Please publish it first or choose to publish it now.`
                );
            else
              throw le;
          }
        }
      }
    }
    await t.log("Creating string table...");
    const E = new et();
    await t.log("Getting page metadata...");
    const V = l.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let O = "", R = 0;
    if (V)
      try {
        const j = JSON.parse(V);
        O = j.id || "", R = j.version || 0;
      } catch (j) {
        await t.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!O) {
      await t.log("Generating new GUID for page..."), O = await dt();
      const j = {
        _ver: 1,
        id: O,
        name: l.name,
        version: R,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      l.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(j)
      );
    }
    await t.log("Creating export data structure...");
    const v = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: O,
        version: R,
        name: l.name,
        pluginVersion: "1.0.0"
      },
      stringTable: E.getSerializedTable(),
      collections: m.getSerializedTable(),
      variables: f.getSerializedTable(),
      instances: u.getSerializedTable(),
      pageData: r
    };
    await t.log("Compressing JSON data...");
    const G = Ia(v, E);
    await t.log("Serializing to JSON...");
    const S = JSON.stringify(G, null, 2), N = (S.length / 1024).toFixed(2), H = Ze(l.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await t.log(`JSON serialization complete: ${N} KB`), await t.log(`Export file: ${H}`), await t.log("=== Export Complete ===");
    const ee = JSON.parse(S);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: H,
        pageData: ee,
        pageName: l.name,
        additionalPages: B,
        // Populated with referenced component pages
        discoveredReferencedPages: T.length > 0 ? (
          // Filter out the original page - it shouldn't be in the discovered list since it's the one being published
          T.filter((j) => j.pageId !== p)
        ) : void 0,
        // Only include if there are discovered pages
        validationResult: I
        // Include aggregated validation results if in discovery mode
      }
    };
  } catch (s) {
    const o = s instanceof Error ? s.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", s), console.error("Error message:", o), await t.error(`Export failed: ${o}`), s instanceof Error && s.stack && (console.error("Stack trace:", s.stack), await t.error(`Stack trace: ${s.stack}`));
    const l = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: o,
      data: {}
    };
    return console.error("Returning error response:", l), l;
  }
}
const Pa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: tt,
  exportPage: Fe,
  extractNodeData: at
}, Symbol.toStringTag, { value: "Module" }));
function be(e) {
  return e.replace(/[^a-zA-Z0-9]/g, "");
}
const Lt = /* @__PURE__ */ new Map();
async function xe(e, a) {
  if (a.length === 0)
    return;
  const n = e.modes.find(
    (i) => i.name === "Mode 1" || i.name === "Default"
  );
  if (n && !a.includes(n.name)) {
    const i = a[0];
    try {
      const c = n.name;
      e.renameMode(n.modeId, i), Lt.set(`${e.id}:${c}`, i), await t.log(
        `  Renamed default mode "${c}" to "${i}"`
      );
    } catch (c) {
      await t.warning(
        `  Failed to rename default mode "${n.name}" to "${i}": ${c}`
      );
    }
  }
  for (const i of a)
    e.modes.find((s) => s.name === i) || e.addMode(i);
}
const Ie = "recursica:collectionId";
async function Ye(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const c = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(c), new Error(c);
    }
    return e.id;
  } else {
    const n = e.getSharedPluginData(
      "recursica",
      Ie
    );
    if (n && n.trim() !== "")
      return n;
    const i = await dt();
    return e.setSharedPluginData("recursica", Ie, i), i;
  }
}
function Va(e, a) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Oa(e) {
  let a;
  const n = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], c = e.isLocal;
  if (c === !1 || c === void 0 && i.includes(n))
    try {
      const l = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((p) => p.name.trim().toLowerCase() === n);
      if (l) {
        Va(e.collectionName, !1);
        const p = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          l.key
        );
        if (p.length > 0) {
          const f = await figma.variables.importVariableByKeyAsync(p[0].key), m = await figma.variables.getVariableCollectionByIdAsync(
            f.variableCollectionId
          );
          if (m) {
            if (a = m, e.collectionGuid) {
              const u = a.getSharedPluginData(
                "recursica",
                Ie
              );
              (!u || u.trim() === "") && a.setSharedPluginData(
                "recursica",
                Ie,
                e.collectionGuid
              );
            } else
              await Ye(a);
            return await xe(a, e.modes), { collection: a };
          }
        }
      }
    } catch (o) {
      if (c === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", o);
    }
  if (c !== !1) {
    const o = await figma.variables.getLocalVariableCollectionsAsync();
    let l;
    if (e.collectionGuid && (l = o.find((p) => p.getSharedPluginData("recursica", Ie) === e.collectionGuid)), l || (l = o.find(
      (p) => p.name === e.collectionName
    )), l)
      if (a = l, e.collectionGuid) {
        const p = a.getSharedPluginData(
          "recursica",
          Ie
        );
        (!p || p.trim() === "") && a.setSharedPluginData(
          "recursica",
          Ie,
          e.collectionGuid
        );
      } else
        await Ye(a);
    else
      a = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? a.setSharedPluginData(
        "recursica",
        Ie,
        e.collectionGuid
      ) : await Ye(a);
  } else {
    const o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), l = e.collectionName.trim().toLowerCase(), p = o.find((r) => r.name.trim().toLowerCase() === l);
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
    ), u = await figma.variables.getVariableCollectionByIdAsync(
      m.variableCollectionId
    );
    if (!u)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (a = u, e.collectionGuid) {
      const r = a.getSharedPluginData(
        "recursica",
        Ie
      );
      (!r || r.trim() === "") && a.setSharedPluginData(
        "recursica",
        Ie,
        e.collectionGuid
      );
    } else
      Ye(a);
  }
  return await xe(a, e.modes), { collection: a };
}
async function gt(e, a) {
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
async function Ma(e, a, n, i, c) {
  await t.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), await t.log(
    `  valuesByMode keys: ${Object.keys(a).join(", ")}`
  );
  for (const [s, o] of Object.entries(a)) {
    const l = Lt.get(`${i.id}:${s}`) || s;
    let p = i.modes.find((m) => m.name === l);
    if (p || (p = i.modes.find((m) => m.name === s)), !p) {
      await t.warning(
        `Mode "${s}" (mapped: "${l}") not found in collection "${i.name}" for variable "${e.name}". Available modes: ${i.modes.map((m) => m.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const f = p.modeId;
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
        e.setValueForMode(f, o);
        continue;
      }
      if (typeof o == "object" && o !== null && "r" in o && "g" in o && "b" in o && typeof o.r == "number" && typeof o.g == "number" && typeof o.b == "number") {
        const m = o, u = {
          r: m.r,
          g: m.g,
          b: m.b
        };
        m.a !== void 0 && (u.a = m.a), e.setValueForMode(f, u);
        const r = e.valuesByMode[f];
        if (await t.log(
          `  Set color value for "${e.name}" mode "${s}": r=${u.r.toFixed(3)}, g=${u.g.toFixed(3)}, b=${u.b.toFixed(3)}${u.a !== void 0 ? `, a=${u.a.toFixed(3)}` : ""}`
        ), await t.log(
          `  Read back value: ${JSON.stringify(r)}`
        ), typeof r == "object" && r !== null && "r" in r && "g" in r && "b" in r) {
          const h = r, d = Math.abs(h.r - u.r) < 1e-3, y = Math.abs(h.g - u.g) < 1e-3, g = Math.abs(h.b - u.b) < 1e-3;
          !d || !y || !g ? await t.warning(
            `  ⚠️ Value mismatch! Set: r=${u.r}, g=${u.g}, b=${u.b}, Read back: r=${h.r}, g=${h.g}, b=${h.b}`
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
        const m = o;
        let u = null;
        const r = n.getVariableByIndex(
          m._varRef
        );
        if (r) {
          let h = null;
          if (c && r._colRef !== void 0) {
            const d = c.getCollectionByIndex(
              r._colRef
            );
            d && (h = (await Oa(d)).collection);
          }
          h && (u = await gt(
            h,
            r.variableName
          ));
        }
        if (u) {
          const h = {
            type: "VARIABLE_ALIAS",
            id: u.id
          };
          e.setValueForMode(f, h);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${s}" in variable "${e.name}". Variable reference index: ${m._varRef}`
          );
      }
    } catch (m) {
      typeof o == "object" && o !== null && !("_varRef" in o) && !("r" in o && "g" in o && "b" in o) && await t.warning(
        `Unhandled value type for mode "${s}" in variable "${e.name}": ${JSON.stringify(o)}`
      ), console.warn(
        `Error setting value for mode "${s}" in variable "${e.name}":`,
        m
      );
    }
  }
}
async function lt(e, a, n, i) {
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
  const c = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  if (e.valuesByMode && await Ma(
    c,
    e.valuesByMode,
    n,
    a,
    // Pass collection to look up modes by name
    i
  ), e.valuesByMode && c.valuesByMode) {
    await t.log(`  Verifying values for "${e.variableName}":`);
    for (const [s, o] of Object.entries(
      e.valuesByMode
    )) {
      const l = a.modes.find((p) => p.name === s);
      if (l) {
        const p = c.valuesByMode[l.modeId];
        await t.log(
          `    Mode "${s}": expected=${JSON.stringify(o)}, actual=${JSON.stringify(p)}`
        );
      }
    }
  }
  return c;
}
async function Ra(e, a, n, i) {
  const c = a.getVariableByIndex(e);
  if (!c || c._colRef === void 0)
    return null;
  const s = i.get(String(c._colRef));
  if (!s)
    return null;
  const o = await gt(
    s,
    c.variableName
  );
  if (o) {
    let l;
    if (typeof c.variableType == "number" ? l = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[c.variableType] || String(c.variableType) : l = c.variableType, Ft(o, l))
      return o;
  }
  return await lt(
    c,
    s,
    a,
    n
  );
}
async function xa(e, a, n, i) {
  if (!(!a || typeof a != "object"))
    try {
      const c = e[n];
      if (!c || !Array.isArray(c))
        return;
      const s = a[n];
      if (Array.isArray(s))
        for (let o = 0; o < s.length && o < c.length; o++) {
          const l = s[o];
          if (l && typeof l == "object") {
            if (c[o].boundVariables || (c[o].boundVariables = {}), Me(l)) {
              const p = l._varRef;
              if (p !== void 0) {
                const f = i.get(String(p));
                f && (c[o].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: f.id
                });
              }
            } else
              for (const [p, f] of Object.entries(
                l
              ))
                if (Me(f)) {
                  const m = f._varRef;
                  if (m !== void 0) {
                    const u = i.get(String(m));
                    u && (c[o].boundVariables[p] = {
                      type: "VARIABLE_ALIAS",
                      id: u.id
                    });
                  }
                }
          }
        }
    } catch (c) {
      console.log(`Error restoring bound variables for ${n}:`, c);
    }
}
function ka(e, a, n = !1) {
  const i = na(a);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const c = ye;
    e.layoutMode === void 0 && (e.layoutMode = c.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = c.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = c.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = c.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = c.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = c.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = c.paddingRight), e.paddingTop === void 0 && (e.paddingTop = c.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = c.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = c.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = c.counterAxisSpacing));
  }
  if (a === "TEXT") {
    const c = Ae;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = c.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = c.textAlignVertical), e.textCase === void 0 && (e.textCase = c.textCase), e.textDecoration === void 0 && (e.textDecoration = c.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = c.textAutoResize);
  }
}
async function _e(e, a, n = null, i = null, c = null, s = null, o = null, l = !1, p = null, f = null, m = null, u = null) {
  var P, E, V, O, R, v, G, S, N, U, H, ee, Y, j, te, K, X, ge, ce, J, ie, Z, W, ae, le, de, me, ke, ft, ut, ht, bt, yt, wt, $t;
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
        const C = e.componentPropertyDefinitions;
        let L = 0, w = 0;
        for (const [A, F] of Object.entries(C))
          try {
            const k = F.type;
            let M = null;
            if (typeof k == "string" ? (k === "TEXT" || k === "BOOLEAN" || k === "INSTANCE_SWAP" || k === "VARIANT") && (M = k) : typeof k == "number" && (M = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[k] || null), !M) {
              await t.warning(
                `  Unknown property type ${k} (${typeof k}) for property "${A}" in component "${e.name || "Unnamed"}"`
              ), w++;
              continue;
            }
            const z = F.defaultValue, D = A.split("#")[0];
            r.addComponentProperty(
              D,
              M,
              z
            ), L++;
          } catch (k) {
            await t.warning(
              `  Failed to add component property "${A}" to "${e.name || "Unnamed"}": ${k}`
            ), w++;
          }
        L > 0 && await t.log(
          `  Added ${L} component property definition(s) to "${e.name || "Unnamed"}"${w > 0 ? ` (${w} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const C = e.children ? e.children.filter((A) => A.type === "COMPONENT").length : 0;
      await t.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${C} component variant(s)`
      );
      const L = [];
      let w = null;
      if (e.children && Array.isArray(e.children)) {
        w = figma.createFrame(), w.name = `_temp_${e.name || "COMPONENT_SET"}`, w.visible = !1, ((a == null ? void 0 : a.type) === "PAGE" ? a : figma.currentPage).appendChild(w);
        for (const F of e.children)
          if (F.type === "COMPONENT" && !F._truncated)
            try {
              const k = await _e(
                F,
                w,
                // Use temp parent for now
                n,
                i,
                c,
                s,
                o,
                l,
                p,
                f,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                u
              );
              k && k.type === "COMPONENT" && (L.push(k), await t.log(
                `  Created component variant: "${k.name || "Unnamed"}"`
              ));
            } catch (k) {
              await t.warning(
                `  Failed to create component variant "${F.name || "Unnamed"}": ${k}`
              );
            }
      }
      if (L.length > 0)
        try {
          const A = a || figma.currentPage, F = figma.combineAsVariants(
            L,
            A
          );
          e.name && (F.name = e.name), e.x !== void 0 && (F.x = e.x), e.y !== void 0 && (F.y = e.y), w && w.parent && w.remove(), await t.log(
            `  ✓ Successfully created COMPONENT_SET "${F.name}" with ${L.length} variant(s)`
          ), r = F;
        } catch (A) {
          if (await t.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${A}. Falling back to frame.`
          ), r = figma.createFrame(), e.name && (r.name = e.name), w && w.children.length > 0) {
            for (const F of w.children)
              r.appendChild(F);
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
      if (l)
        r = figma.createFrame(), e.name && (r.name = e.name);
      else if (e._instanceRef !== void 0 && c && o) {
        const C = c.getInstanceByIndex(
          e._instanceRef
        );
        if (C && C.instanceType === "internal")
          if (C.componentNodeId)
            if (C.componentNodeId === e.id)
              await t.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), r = figma.createFrame(), e.name && (r.name = e.name);
            else {
              const L = o.get(
                C.componentNodeId
              );
              if (!L) {
                const w = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await t.error(
                  `Component not found for internal instance "${e.name}" (ID: ${C.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await t.error(
                  `Looking for component ID: ${C.componentNodeId}`
                ), await t.error(
                  `Available IDs in mapping (first 20): ${w.map((z) => z.substring(0, 8) + "...").join(", ")}`
                );
                const A = (z, D) => {
                  if (z.type === "COMPONENT" && z.id === D)
                    return !0;
                  if (z.children && Array.isArray(z.children)) {
                    for (const _ of z.children)
                      if (!_._truncated && A(_, D))
                        return !0;
                  }
                  return !1;
                }, F = A(
                  e,
                  C.componentNodeId
                );
                await t.error(
                  `Component ID ${C.componentNodeId.substring(0, 8)}... exists in current node tree: ${F}`
                ), await t.error(
                  `WARNING: Component ID ${C.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await t.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await t.error(
                  "  2. The component wasn't collected in the first pass"
                ), await t.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const k = w.filter(
                  (z) => z.startsWith(C.componentNodeId.substring(0, 8))
                );
                k.length > 0 && await t.error(
                  `Found IDs with matching prefix: ${k.map((z) => z.substring(0, 8) + "...").join(", ")}`
                );
                const M = `Component not found for internal instance "${e.name}" (ID: ${C.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${w.map((z) => z.substring(0, 8) + "...").join(", ")}`;
                throw new Error(M);
              }
              if (L && L.type === "COMPONENT") {
                if (r = L.createInstance(), await t.log(
                  `✓ Created internal instance "${e.name}" from component "${C.componentName}"`
                ), C.variantProperties && Object.keys(C.variantProperties).length > 0)
                  try {
                    let w = null;
                    if (L.parent && L.parent.type === "COMPONENT_SET")
                      w = L.parent.componentPropertyDefinitions, await t.log(
                        `  DEBUG: Component "${C.componentName}" is inside component set "${L.parent.name}" with ${Object.keys(w || {}).length} property definitions`
                      );
                    else {
                      const A = await r.getMainComponentAsync();
                      if (A) {
                        const F = A.type;
                        await t.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${L.parent ? L.parent.type : "N/A"}, mainComponent type: ${F}, mainComponent parent: ${A.parent ? A.parent.type : "N/A"}`
                        ), F === "COMPONENT_SET" ? w = A.componentPropertyDefinitions : F === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? (w = A.parent.componentPropertyDefinitions, await t.log(
                          `  DEBUG: Found component set parent "${A.parent.name}" with ${Object.keys(w || {}).length} property definitions`
                        )) : await t.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${C.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (w) {
                      const A = {};
                      for (const [F, k] of Object.entries(
                        C.variantProperties
                      )) {
                        const M = F.split("#")[0];
                        w[M] && (A[M] = k);
                      }
                      Object.keys(A).length > 0 && r.setProperties(A);
                    }
                  } catch (w) {
                    const A = `Failed to set variant properties for instance "${e.name}": ${w}`;
                    throw await t.error(A), new Error(A);
                  }
                if (C.componentProperties && Object.keys(C.componentProperties).length > 0)
                  try {
                    const w = await r.getMainComponentAsync();
                    if (w) {
                      let A = null;
                      const F = w.type;
                      if (F === "COMPONENT_SET" ? A = w.componentPropertyDefinitions : F === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? A = w.parent.componentPropertyDefinitions : F === "COMPONENT" && (A = w.componentPropertyDefinitions), A)
                        for (const [k, M] of Object.entries(
                          C.componentProperties
                        )) {
                          const z = k.split("#")[0];
                          if (A[z])
                            try {
                              let D = M;
                              M && typeof M == "object" && "value" in M && (D = M.value), r.setProperties({
                                [z]: D
                              });
                            } catch (D) {
                              const _ = `Failed to set component property "${z}" for internal instance "${e.name}": ${D}`;
                              throw await t.error(_), new Error(_);
                            }
                        }
                    } else
                      await t.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (w) {
                    if (w instanceof Error)
                      throw w;
                    const A = `Failed to set component properties for instance "${e.name}": ${w}`;
                    throw await t.error(A), new Error(A);
                  }
              } else if (!r && L) {
                const w = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${C.componentNodeId.substring(0, 8)}...).`;
                throw await t.error(w), new Error(w);
              }
            }
          else {
            const L = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await t.error(L), new Error(L);
          }
        else if (C && C.instanceType === "remote")
          if (p) {
            const L = p.get(
              e._instanceRef
            );
            if (L) {
              if (r = L.createInstance(), await t.log(
                `✓ Created remote instance "${e.name}" from component "${C.componentName}" on REMOTES page`
              ), C.variantProperties && Object.keys(C.variantProperties).length > 0)
                try {
                  const w = await r.getMainComponentAsync();
                  if (w) {
                    let A = null;
                    const F = w.type;
                    if (F === "COMPONENT_SET" ? A = w.componentPropertyDefinitions : F === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? A = w.parent.componentPropertyDefinitions : await t.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), A) {
                      const k = {};
                      for (const [M, z] of Object.entries(
                        C.variantProperties
                      )) {
                        const D = M.split("#")[0];
                        A[D] && (k[D] = z);
                      }
                      Object.keys(k).length > 0 && r.setProperties(k);
                    }
                  } else
                    await t.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (w) {
                  const A = `Failed to set variant properties for remote instance "${e.name}": ${w}`;
                  throw await t.error(A), new Error(A);
                }
              if (C.componentProperties && Object.keys(C.componentProperties).length > 0)
                try {
                  const w = await r.getMainComponentAsync();
                  if (w) {
                    let A = null;
                    const F = w.type;
                    if (F === "COMPONENT_SET" ? A = w.componentPropertyDefinitions : F === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? A = w.parent.componentPropertyDefinitions : F === "COMPONENT" && (A = w.componentPropertyDefinitions), A)
                      for (const [k, M] of Object.entries(
                        C.componentProperties
                      )) {
                        const z = k.split("#")[0];
                        if (A[z])
                          try {
                            let D = M;
                            M && typeof M == "object" && "value" in M && (D = M.value), r.setProperties({
                              [z]: D
                            });
                          } catch (D) {
                            const _ = `Failed to set component property "${z}" for remote instance "${e.name}": ${D}`;
                            throw await t.error(_), new Error(_);
                          }
                      }
                  } else
                    await t.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (w) {
                  if (w instanceof Error)
                    throw w;
                  const A = `Failed to set component properties for remote instance "${e.name}": ${w}`;
                  throw await t.error(A), new Error(A);
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
            const L = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await t.error(L), new Error(L);
          }
        else if ((C == null ? void 0 : C.instanceType) === "normal") {
          if (!C.componentPageName) {
            const M = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await t.error(M), new Error(M);
          }
          await figma.loadAllPagesAsync();
          const L = figma.root.children.find(
            (M) => M.name === C.componentPageName
          );
          if (!L) {
            await t.log(
              `  Deferring normal instance "${e.name}" - referenced page "${C.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const M = figma.createFrame();
            if (M.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (M.x = e.x), e.y !== void 0 && (M.y = e.y), e.width !== void 0 && e.height !== void 0 ? M.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && M.resize(e.w, e.h), f) {
              const z = {
                placeholderFrameId: M.id,
                instanceEntry: C,
                nodeData: e,
                parentNodeId: a.id,
                instanceIndex: e._instanceRef
              };
              f.push(z), await t.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${f.length})`
              );
            } else
              await t.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            r = M;
            break;
          }
          let w = null;
          const A = (M, z, D, _, q) => {
            if (z.length === 0) {
              let re = null;
              for (const pe of M.children || [])
                if (pe.type === "COMPONENT") {
                  if (pe.name === D)
                    if (re || (re = pe), _)
                      try {
                        const fe = pe.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (fe && JSON.parse(fe).id === _)
                          return pe;
                      } catch (fe) {
                      }
                    else
                      return pe;
                } else if (pe.type === "COMPONENT_SET") {
                  if (q && pe.name !== q)
                    continue;
                  for (const fe of pe.children || [])
                    if (fe.type === "COMPONENT" && fe.name === D)
                      if (re || (re = fe), _)
                        try {
                          const Re = fe.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Re && JSON.parse(Re).id === _)
                            return fe;
                        } catch (Re) {
                        }
                      else
                        return fe;
                }
              return re;
            }
            const [se, ...oe] = z;
            for (const re of M.children || [])
              if (re.name === se) {
                if (oe.length === 0 && re.type === "COMPONENT_SET") {
                  if (q && re.name !== q)
                    continue;
                  for (const pe of re.children || [])
                    if (pe.type === "COMPONENT" && pe.name === D) {
                      if (_)
                        try {
                          const fe = pe.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (fe && JSON.parse(fe).id === _)
                            return pe;
                        } catch (fe) {
                        }
                      return pe;
                    }
                  return null;
                }
                return A(
                  re,
                  oe,
                  D,
                  _,
                  q
                );
              }
            return null;
          };
          await t.log(
            `  Looking for component "${C.componentName}" on page "${C.componentPageName}"${C.path && C.path.length > 0 ? ` at path [${C.path.join(" → ")}]` : " at page root"}${C.componentGuid ? ` (GUID: ${C.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const F = [], k = (M, z = 0) => {
            const D = "  ".repeat(z);
            if (M.type === "COMPONENT")
              F.push(`${D}COMPONENT: "${M.name}"`);
            else if (M.type === "COMPONENT_SET") {
              F.push(
                `${D}COMPONENT_SET: "${M.name}"`
              );
              for (const _ of M.children || [])
                _.type === "COMPONENT" && F.push(
                  `${D}  └─ COMPONENT: "${_.name}"`
                );
            }
            for (const _ of M.children || [])
              k(_, z + 1);
          };
          if (k(L), F.length > 0 ? await t.log(
            `  Available components on page "${C.componentPageName}":
${F.slice(0, 20).join(`
`)}${F.length > 20 ? `
  ... and ${F.length - 20} more` : ""}`
          ) : await t.warning(
            `  No components found on page "${C.componentPageName}"`
          ), w = A(
            L,
            C.path || [],
            C.componentName,
            C.componentGuid,
            C.componentSetName
          ), w && C.componentGuid)
            try {
              const M = w.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (M) {
                const z = JSON.parse(M);
                z.id !== C.componentGuid ? await t.warning(
                  `  Found component "${C.componentName}" by name but GUID verification failed (expected ${C.componentGuid.substring(0, 8)}..., got ${z.id ? z.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await t.log(
                  `  Found component "${C.componentName}" with matching GUID ${C.componentGuid.substring(0, 8)}...`
                );
              } else
                await t.warning(
                  `  Found component "${C.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (M) {
              await t.warning(
                `  Found component "${C.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!w) {
            await t.log(
              `  Deferring normal instance "${e.name}" - component "${C.componentName}" not found on page "${C.componentPageName}" (may not be created yet due to circular reference)`
            );
            const M = figma.createFrame();
            if (M.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (M.x = e.x), e.y !== void 0 && (M.y = e.y), e.width !== void 0 && e.height !== void 0 ? M.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && M.resize(e.w, e.h), f) {
              const z = {
                placeholderFrameId: M.id,
                instanceEntry: C,
                nodeData: e,
                parentNodeId: a.id,
                instanceIndex: e._instanceRef
              };
              f.push(z), await t.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${f.length})`
              );
            } else
              await t.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            r = M;
            break;
          }
          if (r = w.createInstance(), await t.log(
            `  Created normal instance "${e.name}" from component "${C.componentName}" on page "${C.componentPageName}"`
          ), C.variantProperties && Object.keys(C.variantProperties).length > 0)
            try {
              const M = await r.getMainComponentAsync();
              if (M) {
                let z = null;
                const D = M.type;
                if (D === "COMPONENT_SET" ? z = M.componentPropertyDefinitions : D === "COMPONENT" && M.parent && M.parent.type === "COMPONENT_SET" ? z = M.parent.componentPropertyDefinitions : await t.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), z) {
                  const _ = {};
                  for (const [q, se] of Object.entries(
                    C.variantProperties
                  )) {
                    const oe = q.split("#")[0];
                    z[oe] && (_[oe] = se);
                  }
                  Object.keys(_).length > 0 && r.setProperties(_);
                }
              }
            } catch (M) {
              await t.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${M}`
              );
            }
          if (C.componentProperties && Object.keys(C.componentProperties).length > 0)
            try {
              const M = await r.getMainComponentAsync();
              if (M) {
                let z = null;
                const D = M.type;
                if (D === "COMPONENT_SET" ? z = M.componentPropertyDefinitions : D === "COMPONENT" && M.parent && M.parent.type === "COMPONENT_SET" ? z = M.parent.componentPropertyDefinitions : D === "COMPONENT" && (z = M.componentPropertyDefinitions), z) {
                  const _ = {};
                  for (const [q, se] of Object.entries(
                    C.componentProperties
                  )) {
                    const oe = q.split("#")[0];
                    let re;
                    if (z[q] ? re = q : z[oe] ? re = oe : re = Object.keys(z).find(
                      (pe) => pe.split("#")[0] === oe
                    ), re) {
                      const pe = se && typeof se == "object" && "value" in se ? se.value : se;
                      _[re] = pe;
                    } else
                      await t.warning(
                        `Component property "${oe}" (from "${q}") does not exist on component "${C.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(z).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(_).length > 0)
                    try {
                      await t.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(_).join(", ")}`
                      ), await t.log(
                        `  Available component properties: ${Object.keys(z).join(", ")}`
                      ), r.setProperties(_), await t.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(_).join(", ")}`
                      );
                    } catch (q) {
                      await t.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${q}`
                      ), await t.warning(
                        `  Properties attempted: ${JSON.stringify(_)}`
                      ), await t.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(z))}`
                      );
                    }
                }
              } else
                await t.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (M) {
              await t.warning(
                `Failed to set component properties for normal instance "${e.name}": ${M}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              r.resize(e.width, e.height);
            } catch (M) {
              await t.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const L = `Instance "${e.name}" has unknown or missing instance type: ${(C == null ? void 0 : C.instanceType) || "unknown"}`;
          throw await t.error(L), new Error(L);
        }
      } else {
        const C = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await t.error(C), new Error(C);
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
      const C = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await t.error(C), new Error(C);
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
  ka(
    r,
    e.type || "FRAME",
    h
  ), e.name !== void 0 && (r.name = e.name || "Unnamed Node");
  const d = m && m.layoutMode !== void 0 && m.layoutMode !== "NONE", y = a && "layoutMode" in a && a.layoutMode !== "NONE";
  d || y || (e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y));
  const b = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height), $ = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && await t.log(
    `  [ISSUE #3 DEBUG] "${$}" has preserveRatio in nodeData: ${e.preserveRatio}`
  ), e.constraints !== void 0 && await t.log(
    `  [ISSUE #4 DEBUG] "${$}" has constraints in nodeData: ${JSON.stringify(e.constraints)}`
  ), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && await t.log(
    `  [ISSUE #4 DEBUG] "${$}" has constraintHorizontal: ${e.constraintHorizontal}, constraintVertical: ${e.constraintVertical}`
  ), e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && e.width !== void 0 && e.height !== void 0 && !b) {
    const C = r.preserveRatio;
    C !== void 0 && await t.log(
      `  [ISSUE #3 DEBUG] "${$}" preserveRatio before resize: ${C}`
    ), r.resize(e.width, e.height);
    const L = r.preserveRatio;
    L !== void 0 ? await t.log(
      `  [ISSUE #3 DEBUG] "${$}" preserveRatio after resize: ${L}`
    ) : e.preserveRatio !== void 0 && await t.warning(
      `  ⚠️ ISSUE #3: "${$}" preserveRatio was in nodeData (${e.preserveRatio}) but not set on node!`
    );
    const w = e.constraintHorizontal || ((P = e.constraints) == null ? void 0 : P.horizontal), A = e.constraintVertical || ((E = e.constraints) == null ? void 0 : E.vertical);
    (w !== void 0 || A !== void 0) && await t.log(
      `  [ISSUE #4] "${$}" (${e.type}) - Expected constraints from JSON: H=${w || "undefined"}, V=${A || "undefined"}`
    );
    const F = (V = r.constraints) == null ? void 0 : V.horizontal, k = (O = r.constraints) == null ? void 0 : O.vertical;
    (w !== void 0 || A !== void 0) && await t.log(
      `  [ISSUE #4] "${$}" (${e.type}) - Constraints after resize (before setting): H=${F || "undefined"}, V=${k || "undefined"}`
    );
    const M = e.constraintHorizontal !== void 0 || ((R = e.constraints) == null ? void 0 : R.horizontal) !== void 0, z = e.constraintVertical !== void 0 || ((v = e.constraints) == null ? void 0 : v.vertical) !== void 0;
    if (M || z) {
      const q = e.constraintHorizontal || ((G = e.constraints) == null ? void 0 : G.horizontal), se = e.constraintVertical || ((S = e.constraints) == null ? void 0 : S.vertical), oe = q || F || "MIN", re = se || k || "MIN";
      try {
        await t.log(
          `  [ISSUE #4] Setting constraints for "${$}" (${e.type}): H=${oe} (from ${q || "default"}), V=${re} (from ${se || "default"})`
        ), r.constraints = {
          horizontal: oe,
          vertical: re
        };
        const pe = (N = r.constraints) == null ? void 0 : N.horizontal, fe = (U = r.constraints) == null ? void 0 : U.vertical;
        pe === oe && fe === re ? await t.log(
          `  [ISSUE #4] ✓ Constraints set successfully: H=${pe}, V=${fe} for "${$}"`
        ) : await t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${oe}, V=${re}, got H=${pe || "undefined"}, V=${fe || "undefined"} for "${$}"`
        );
      } catch (pe) {
        await t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${$}" (${e.type}): ${pe instanceof Error ? pe.message : String(pe)}`
        );
      }
    }
    const D = r.constraintHorizontal, _ = r.constraintVertical;
    (w !== void 0 || A !== void 0) && (await t.log(
      `  [ISSUE #4] "${$}" (${e.type}) - Final constraints: H=${D || "undefined"}, V=${_ || "undefined"}`
    ), w !== void 0 && D !== w && await t.warning(
      `  ⚠️ ISSUE #4: "${$}" constraintHorizontal mismatch! Expected: ${w}, Got: ${D || "undefined"}`
    ), A !== void 0 && _ !== A && await t.warning(
      `  ⚠️ ISSUE #4: "${$}" constraintVertical mismatch! Expected: ${A}, Got: ${_ || "undefined"}`
    ), w !== void 0 && A !== void 0 && D === w && _ === A && await t.log(
      `  ✓ ISSUE #4: "${$}" constraints correctly set: H=${D}, V=${_}`
    ));
  } else {
    const C = e.constraintHorizontal || ((H = e.constraints) == null ? void 0 : H.horizontal), L = e.constraintVertical || ((ee = e.constraints) == null ? void 0 : ee.vertical);
    if ((C !== void 0 || L !== void 0) && (e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" ? await t.log(
      `  [ISSUE #4] "${$}" (VECTOR) - Constraints already set earlier (skipping "no resize" path)`
    ) : await t.log(
      `  [ISSUE #4] "${$}" (${e.type}) - Setting constraints (no resize): Expected H=${C || "undefined"}, V=${L || "undefined"}`
    )), e.type !== "VECTOR") {
      const w = e.constraintHorizontal !== void 0 || ((Y = e.constraints) == null ? void 0 : Y.horizontal) !== void 0, A = e.constraintVertical !== void 0 || ((j = e.constraints) == null ? void 0 : j.vertical) !== void 0;
      if (w || A) {
        const F = e.constraintHorizontal || ((te = e.constraints) == null ? void 0 : te.horizontal), k = e.constraintVertical || ((K = e.constraints) == null ? void 0 : K.vertical), M = r.constraints || {}, z = M.horizontal || "MIN", D = M.vertical || "MIN", _ = F || z, q = k || D;
        try {
          await t.log(
            `  [ISSUE #4] Setting constraints for "${$}" (${e.type}) (no resize): H=${_} (from ${F || "current"}), V=${q} (from ${k || "current"})`
          ), r.constraints = {
            horizontal: _,
            vertical: q
          };
          const se = (X = r.constraints) == null ? void 0 : X.horizontal, oe = (ge = r.constraints) == null ? void 0 : ge.vertical;
          se === _ && oe === q ? await t.log(
            `  [ISSUE #4] ✓ Constraints set successfully (no resize): H=${se}, V=${oe} for "${$}"`
          ) : await t.warning(
            `  [ISSUE #4] ⚠️ Constraints set but verification failed (no resize)! Expected H=${_}, V=${q}, got H=${se || "undefined"}, V=${oe || "undefined"} for "${$}"`
          );
        } catch (se) {
          await t.warning(
            `  [ISSUE #4] ✗ Failed to set constraints for "${$}" (${e.type}) (no resize): ${se instanceof Error ? se.message : String(se)}`
          );
        }
      }
    }
    if (e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && (C !== void 0 || L !== void 0)) {
      const w = (ce = r.constraints) == null ? void 0 : ce.horizontal, A = (J = r.constraints) == null ? void 0 : J.vertical;
      await t.log(
        `  [ISSUE #4] "${$}" (${e.type}) - Final constraints (no resize): H=${w || "undefined"}, V=${A || "undefined"}`
      ), C !== void 0 && w !== C && await t.warning(
        `  ⚠️ ISSUE #4: "${$}" constraintHorizontal mismatch! Expected: ${C}, Got: ${w || "undefined"}`
      ), L !== void 0 && A !== L && await t.warning(
        `  ⚠️ ISSUE #4: "${$}" constraintVertical mismatch! Expected: ${L}, Got: ${A || "undefined"}`
      ), C !== void 0 && L !== void 0 && w === C && A === L && await t.log(
        `  ✓ ISSUE #4: "${$}" constraints correctly set (no resize): H=${w}, V=${A}`
      );
    }
  }
  const x = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (!x || !e.boundVariables.opacity) && (r.opacity = e.opacity), e.rotation !== void 0 && (!x || !e.boundVariables.rotation) && (r.rotation = e.rotation), e.blendMode !== void 0 && (!x || !e.boundVariables.blendMode) && (r.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await t.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((ie = e.id) == null ? void 0 : ie.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await t.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let C = e.fills;
        const L = e.name || "Unnamed";
        if (Array.isArray(C))
          for (let w = 0; w < C.length; w++) {
            const A = C[w];
            A && typeof A == "object" && A.selectionColor !== void 0 && await t.log(
              `  [ISSUE #2 DEBUG] "${L}" fill[${w}] has selectionColor: ${JSON.stringify(A.selectionColor)}`
            );
          }
        if (Array.isArray(C)) {
          const w = e.name || "Unnamed";
          for (let A = 0; A < C.length; A++) {
            const F = C[A];
            F && typeof F == "object" && F.selectionColor !== void 0 && await t.warning(
              `  ⚠️ ISSUE #2: "${w}" fill[${A}] has selectionColor that will be preserved: ${JSON.stringify(F.selectionColor)}`
            );
          }
          C = C.map((A) => {
            if (A && typeof A == "object") {
              const F = ne({}, A);
              return delete F.boundVariables, F;
            }
            return A;
          });
        }
        if (e.fills && Array.isArray(e.fills) && s) {
          if (e.type === "VECTOR") {
            await t.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let k = 0; k < e.fills.length; k++) {
              const M = e.fills[k];
              if (M && typeof M == "object") {
                const z = M.boundVariables || M.bndVar;
                z ? await t.log(
                  `  DEBUG:   fill[${k}] has boundVariables: ${JSON.stringify(z)}`
                ) : await t.log(
                  `  DEBUG:   fill[${k}] has no boundVariables`
                );
              }
            }
          }
          const w = [];
          for (let k = 0; k < C.length; k++) {
            const M = C[k], z = e.fills[k];
            if (!z || typeof z != "object") {
              w.push(M);
              continue;
            }
            const D = z.boundVariables || z.bndVar;
            if (!D) {
              w.push(M);
              continue;
            }
            const _ = ne({}, M);
            _.boundVariables = {};
            for (const [q, se] of Object.entries(D))
              if (e.type === "VECTOR" && await t.log(
                `  DEBUG: Processing fill[${k}].${q} on VECTOR "${r.name || "Unnamed"}": varInfo=${JSON.stringify(se)}`
              ), Me(se)) {
                const oe = se._varRef;
                if (oe !== void 0) {
                  if (e.type === "VECTOR") {
                    await t.log(
                      `  DEBUG: Looking up variable reference ${oe} in recognizedVariables (map has ${s.size} entries)`
                    );
                    const pe = Array.from(
                      s.keys()
                    ).slice(0, 10);
                    await t.log(
                      `  DEBUG: Available variable references (first 10): ${pe.join(", ")}`
                    );
                    const fe = s.has(String(oe));
                    if (await t.log(
                      `  DEBUG: Variable reference ${oe} ${fe ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !fe) {
                      const Re = Array.from(
                        s.keys()
                      ).sort((St, Kt) => parseInt(St) - parseInt(Kt));
                      await t.log(
                        `  DEBUG: All available variable references: ${Re.join(", ")}`
                      );
                    }
                  }
                  let re = s.get(String(oe));
                  re || (e.type === "VECTOR" && await t.log(
                    `  DEBUG: Variable ${oe} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!u}`
                  ), n && i && u ? (await t.log(
                    `  Variable reference ${oe} not in recognizedVariables, attempting to resolve from variable table...`
                  ), re = await Ra(
                    oe,
                    n,
                    i,
                    u
                  ) || void 0, re ? (s.set(String(oe), re), await t.log(
                    `  ✓ Resolved variable ${re.name} from variable table and added to recognizedVariables`
                  )) : await t.warning(
                    `  Failed to resolve variable ${oe} from variable table`
                  )) : e.type === "VECTOR" && await t.warning(
                    `  Cannot resolve variable ${oe} from table - missing required parameters`
                  )), re ? (_.boundVariables[q] = {
                    type: "VARIABLE_ALIAS",
                    id: re.id
                  }, await t.log(
                    `  ✓ Restored bound variable for fill[${k}].${q} on "${r.name || "Unnamed"}" (${e.type}): variable ${re.name} (ID: ${re.id.substring(0, 8)}...)`
                  )) : await t.warning(
                    `  Variable reference ${oe} not found in recognizedVariables for fill[${k}].${q} on "${r.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await t.warning(
                    `  DEBUG: Variable reference ${oe} is undefined for fill[${k}].${q} on VECTOR "${r.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await t.warning(
                  `  DEBUG: fill[${k}].${q} on VECTOR "${r.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(se)}`
                );
            w.push(_);
          }
          r.fills = w, await t.log(
            `  ✓ Set fills with boundVariables on "${r.name || "Unnamed"}" (${e.type})`
          );
          const A = r.fills, F = e.name || "Unnamed";
          if (Array.isArray(A))
            for (let k = 0; k < A.length; k++) {
              const M = A[k];
              M && typeof M == "object" && M.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${F}" fill[${k}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify(M.selectionColor)}`
              );
            }
        } else {
          r.fills = C;
          const w = r.fills, A = e.name || "Unnamed";
          if (Array.isArray(w))
            for (let F = 0; F < w.length; F++) {
              const k = w[F];
              k && typeof k == "object" && k.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${A}" fill[${F}] has selectionColor AFTER setting: ${JSON.stringify(k.selectionColor)}`
              );
            }
        }
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && await t.log(
          `  Node "${r.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (C) {
        console.log("Error setting fills:", C);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        r.fills = [];
      } catch (C) {
        console.log("Error clearing fills:", C);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? r.strokes = e.strokes : r.strokes = [];
    } catch (C) {
      console.log("Error setting strokes:", C);
    }
  else if (e.type === "VECTOR")
    try {
      r.strokes = [];
    } catch (C) {
    }
  const I = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!I || !e.boundVariables.strokeWeight) && (r.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!I || !e.boundVariables.strokeWeight) && (r.strokeWeight = 0), e.strokeAlign !== void 0 && (!I || !e.boundVariables.strokeAlign) && (r.strokeAlign = e.strokeAlign);
  const B = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!B || !e.boundVariables.cornerRadius) && (r.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (r.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? r.layoutMode = e.layoutMode : await t.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && s) {
      const L = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const w of L) {
        const A = e.boundVariables[w];
        if (A && Me(A)) {
          const F = A._varRef;
          if (F !== void 0) {
            const k = s.get(String(F));
            if (k) {
              const M = {
                type: "VARIABLE_ALIAS",
                id: k.id
              };
              r.boundVariables || (r.boundVariables = {});
              const z = r[w], D = (Z = r.boundVariables) == null ? void 0 : Z[w];
              await t.log(
                `  DEBUG: Attempting to set bound variable for ${w} on "${e.name || "Unnamed"}": current value=${z}, current boundVar=${JSON.stringify(D)}`
              );
              try {
                r.setBoundVariable(w, null);
              } catch (q) {
              }
              try {
                r.setBoundVariable(w, k);
                const q = (W = r.boundVariables) == null ? void 0 : W[w];
                await t.log(
                  `  DEBUG: Immediately after setting ${w} bound variable: ${JSON.stringify(q)}`
                );
              } catch (q) {
                await t.warning(
                  `  Error setting bound variable for ${w}: ${q instanceof Error ? q.message : String(q)}`
                );
              }
              const _ = (ae = r.boundVariables) == null ? void 0 : ae[w];
              if (w === "itemSpacing") {
                const q = r[w], se = (le = r.boundVariables) == null ? void 0 : le[w];
                await t.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${e.name || "Unnamed"}":`
                ), await t.log(
                  `    - Expected variable ref: ${F}`
                ), await t.log(
                  `    - Final itemSpacing value: ${q}`
                ), await t.log(
                  `    - Final boundVariable: ${JSON.stringify(se)}`
                ), await t.log(
                  `    - Variable found: ${k ? `Yes (ID: ${k.id})` : "No"}`
                ), !_ || !_.id ? await t.warning(
                  "    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!"
                ) : await t.log(
                  "    ✓ itemSpacing variable binding SUCCESS"
                );
              }
              _ && typeof _ == "object" && _.type === "VARIABLE_ALIAS" && _.id === k.id ? await t.log(
                `  ✓ Set bound variable for ${w} on "${e.name || "Unnamed"}" (${e.type}): variable ${k.name} (ID: ${k.id.substring(0, 8)}...)`
              ) : await t.warning(
                `  Failed to set bound variable for ${w} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(M)}, Got: ${JSON.stringify(_)}`
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
    const C = e.boundVariables && typeof e.boundVariables == "object";
    if (C) {
      const L = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((w) => e.boundVariables[w]);
      L.length > 0 && await t.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${L.join(", ")}`
      );
    }
    if (e.paddingLeft !== void 0 && (!C || !e.boundVariables.paddingLeft) && (r.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!C || !e.boundVariables.paddingRight) && (r.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!C || !e.boundVariables.paddingTop) && (r.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!C || !e.boundVariables.paddingBottom) && (r.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && r.layoutMode !== void 0 && r.layoutMode !== "NONE") {
      const L = ((de = r.boundVariables) == null ? void 0 : de.itemSpacing) !== void 0;
      !L && (!C || !e.boundVariables.itemSpacing) ? r.itemSpacing !== e.itemSpacing && (await t.log(
        `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
      ), r.itemSpacing = e.itemSpacing) : L && await t.log(
        `  Skipping late setting of itemSpacing for "${e.name || "Unnamed"}" - already bound to variable`
      );
    }
    e.counterAxisSpacing !== void 0 && (!C || !e.boundVariables.counterAxisSpacing) && r.layoutMode !== void 0 && r.layoutMode !== "NONE" && (r.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (r.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" || e.type === "LINE") && (e.strokeCap !== void 0 && (r.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (r.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (r.dashPattern = e.dashPattern), e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: A } = await Promise.resolve().then(() => ya), F = e.fillGeometry.map((k) => {
          const M = k.data;
          return {
            data: A(M),
            windingRule: k.windingRule || k.windRule || "NONZERO"
          };
        });
        for (let k = 0; k < e.fillGeometry.length; k++) {
          const M = e.fillGeometry[k].data, z = F[k].data;
          M !== z && await t.log(
            `  Normalized path ${k + 1} for "${e.name || "Unnamed"}": ${M.substring(0, 50)}... -> ${z.substring(0, 50)}...`
          );
        }
        r.vectorPaths = F, await t.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${F.length} path(s))`
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
    const C = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !C)
      try {
        r.resize(e.width, e.height), await t.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (A) {
        await t.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    const L = e.constraintHorizontal || ((me = e.constraints) == null ? void 0 : me.horizontal), w = e.constraintVertical || ((ke = e.constraints) == null ? void 0 : ke.vertical);
    if (L !== void 0 || w !== void 0) {
      await t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Setting constraints immediately after size: Expected H=${L || "undefined"}, V=${w || "undefined"}`
      );
      const A = r.constraints || {}, F = A.horizontal || "MIN", k = A.vertical || "MIN", M = L || F, z = w || k;
      try {
        r.constraints = {
          horizontal: M,
          vertical: z
        };
        const q = (ft = r.constraints) == null ? void 0 : ft.horizontal, se = (ut = r.constraints) == null ? void 0 : ut.vertical;
        q === M && se === z ? await t.log(
          `  [ISSUE #4] ✓ Constraints set successfully for "${e.name || "Unnamed"}" (VECTOR): H=${q}, V=${se}`
        ) : await t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${M}, V=${z}, got H=${q || "undefined"}, V=${se || "undefined"} for "${e.name || "Unnamed"}"`
        );
      } catch (q) {
        await t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${e.name || "Unnamed"}" (VECTOR): ${q instanceof Error ? q.message : String(q)}`
        );
      }
      const D = (ht = r.constraints) == null ? void 0 : ht.horizontal, _ = (bt = r.constraints) == null ? void 0 : bt.vertical;
      await t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Final constraints after immediate setting: H=${D || "undefined"}, V=${_ || "undefined"}`
      ), L !== void 0 && D !== L && await t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintHorizontal mismatch! Expected: ${L}, Got: ${D || "undefined"}`
      ), w !== void 0 && _ !== w && await t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintVertical mismatch! Expected: ${w}, Got: ${_ || "undefined"}`
      ), L !== void 0 && w !== void 0 && D === L && _ === w && await t.log(
        `  ✓ ISSUE #4: "${e.name || "Unnamed"}" (VECTOR) constraints correctly set: H=${D}, V=${_}`
      );
    }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), r.fontName = e.fontName;
        } catch (L) {
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
      const C = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!C || !e.boundVariables.fontSize) && (r.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (r.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (r.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!C || !e.boundVariables.letterSpacing) && (r.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!C || !e.boundVariables.lineHeight) && (r.lineHeight = e.lineHeight), e.textCase !== void 0 && (r.textCase = e.textCase), e.textDecoration !== void 0 && (r.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (r.textAutoResize = e.textAutoResize);
    } catch (C) {
      console.log("Error setting text properties: " + C);
      try {
        r.characters = e.characters;
      } catch (L) {
        console.log("Could not set text characters: " + L);
      }
    }
  if (e.selectionColor !== void 0) {
    const C = e.name || "Unnamed";
    if (e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.selectionColor !== void 0)
      await t.log(
        `  [ISSUE #2] Skipping direct selectionColor value for "${C}" - will be set via bound variable`
      );
    else
      try {
        r.selectionColor = e.selectionColor, await t.log(
          `  [ISSUE #2] Set selectionColor (direct value) on "${C}": ${JSON.stringify(e.selectionColor)}`
        );
      } catch (w) {
        await t.warning(
          `  [ISSUE #2] Failed to set selectionColor on "${C}": ${w instanceof Error ? w.message : String(w)}`
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
    for (const [L, w] of Object.entries(
      e.boundVariables
    ))
      if (L !== "fills" && !C.includes(L)) {
        if (L === "selectionColor") {
          const A = e.name || "Unnamed";
          await t.log(
            `  [ISSUE #2] Restoring bound variable for selectionColor on "${A}"`
          );
        }
        if (Me(w) && n && s) {
          const A = w._varRef;
          if (A !== void 0) {
            const F = s.get(String(A));
            if (F)
              try {
                const k = {
                  type: "VARIABLE_ALIAS",
                  id: F.id
                };
                r.boundVariables || (r.boundVariables = {});
                const M = r[L];
                M !== void 0 && r.boundVariables[L] === void 0 && await t.warning(
                  `  Property ${L} has direct value ${M} which may prevent bound variable from being set`
                ), r.boundVariables[L] = k;
                const D = (yt = r.boundVariables) == null ? void 0 : yt[L];
                if (D && typeof D == "object" && D.type === "VARIABLE_ALIAS" && D.id === F.id)
                  await t.log(
                    `  ✓ Set bound variable for ${L} on "${e.name || "Unnamed"}" (${e.type}): variable ${F.name} (ID: ${F.id.substring(0, 8)}...)`
                  );
                else {
                  const _ = (wt = r.boundVariables) == null ? void 0 : wt[L];
                  await t.warning(
                    `  Failed to set bound variable for ${L} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${M}, Expected: ${JSON.stringify(k)}, Got: ${JSON.stringify(_)}`
                  );
                }
              } catch (k) {
                await t.warning(
                  `  Error setting bound variable for ${L} on "${e.name || "Unnamed"}": ${k}`
                );
              }
            else
              await t.warning(
                `  Variable reference ${A} not found in recognizedVariables for ${L} on "${e.name || "Unnamed"}"`
              );
          }
        }
      }
  }
  if (e.boundVariables && s && (e.boundVariables.width || e.boundVariables.height)) {
    const C = e.boundVariables.width, L = e.boundVariables.height;
    if (C && Me(C)) {
      const w = C._varRef;
      if (w !== void 0) {
        const A = s.get(String(w));
        if (A) {
          const F = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.width = F;
        }
      }
    }
    if (L && Me(L)) {
      const w = L._varRef;
      if (w !== void 0) {
        const A = s.get(String(w));
        if (A) {
          const F = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.height = F;
        }
      }
    }
  }
  const T = e.id && o && o.has(e.id) && r.type === "COMPONENT" && r.children && r.children.length > 0;
  if (e.children && Array.isArray(e.children) && r.type !== "INSTANCE" && !T) {
    const C = (w) => {
      const A = [];
      for (const F of w)
        F._truncated || (F.type === "COMPONENT" ? (A.push(F), F.children && Array.isArray(F.children) && A.push(...C(F.children))) : F.children && Array.isArray(F.children) && A.push(...C(F.children)));
      return A;
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
    const L = C(e.children);
    await t.log(
      `  First pass: Creating ${L.length} COMPONENT node(s) (without children)...`
    );
    for (const w of L)
      await t.log(
        `  Collected COMPONENT "${w.name || "Unnamed"}" (ID: ${w.id ? w.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const w of L)
      if (w.id && o && !o.has(w.id)) {
        const A = figma.createComponent();
        if (w.name !== void 0 && (A.name = w.name || "Unnamed Node"), w.componentPropertyDefinitions) {
          const F = w.componentPropertyDefinitions;
          let k = 0, M = 0;
          for (const [z, D] of Object.entries(F))
            try {
              const q = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[D.type];
              if (!q) {
                await t.warning(
                  `  Unknown property type ${D.type} for property "${z}" in component "${w.name || "Unnamed"}"`
                ), M++;
                continue;
              }
              const se = D.defaultValue, oe = z.split("#")[0];
              A.addComponentProperty(
                oe,
                q,
                se
              ), k++;
            } catch (_) {
              await t.warning(
                `  Failed to add component property "${z}" to "${w.name || "Unnamed"}" in first pass: ${_}`
              ), M++;
            }
          k > 0 && await t.log(
            `  Added ${k} component property definition(s) to "${w.name || "Unnamed"}" in first pass${M > 0 ? ` (${M} failed)` : ""}`
          );
        }
        o.set(w.id, A), await t.log(
          `  Created COMPONENT "${w.name || "Unnamed"}" (ID: ${w.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const w of e.children) {
      if (w._truncated)
        continue;
      const A = await _e(
        w,
        r,
        n,
        i,
        c,
        s,
        o,
        l,
        p,
        f,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        u
      );
      if (A && A.parent !== r) {
        if (A.parent && typeof A.parent.removeChild == "function")
          try {
            A.parent.removeChild(A);
          } catch (F) {
            await t.warning(
              `Failed to remove child "${A.name || "Unnamed"}" from parent "${A.parent.name || "Unnamed"}": ${F}`
            );
          }
        r.appendChild(A);
      }
    }
  }
  if (a && r.parent !== a) {
    if (r.parent && typeof r.parent.removeChild == "function")
      try {
        r.parent.removeChild(r);
      } catch (C) {
        await t.warning(
          `Failed to remove node "${r.name || "Unnamed"}" from parent "${r.parent.name || "Unnamed"}": ${C}`
        );
      }
    a.appendChild(r);
  }
  if ((r.type === "FRAME" || r.type === "COMPONENT" || r.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0) {
    const C = (($t = r.boundVariables) == null ? void 0 : $t.itemSpacing) !== void 0, L = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing;
    if (C)
      await t.log(
        `  FINAL CHECK: itemSpacing is bound to variable for "${e.name || "Unnamed"}" - skipping direct value fix`
      );
    else if (L)
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
async function La(e, a, n) {
  let i = 0, c = 0, s = 0;
  const o = (p) => {
    const f = [];
    if (p.type === "INSTANCE" && f.push(p), "children" in p && p.children)
      for (const m of p.children)
        f.push(...o(m));
    return f;
  }, l = o(e);
  await t.log(
    `  Found ${l.length} instance(s) to process for variant properties`
  );
  for (const p of l)
    try {
      const f = await p.getMainComponentAsync();
      if (!f) {
        c++;
        continue;
      }
      const m = a.getSerializedTable();
      let u = null, r;
      if (n._instanceTableMap ? (r = n._instanceTableMap.get(
        p.id
      ), r !== void 0 ? (u = m[r], await t.log(
        `  Found instance table index ${r} for instance "${p.name}" (ID: ${p.id.substring(0, 8)}...)`
      )) : await t.log(
        `  No instance table index mapping found for instance "${p.name}" (ID: ${p.id.substring(0, 8)}...), using fallback matching`
      )) : await t.log(
        `  No instance table map found, using fallback matching for instance "${p.name}"`
      ), !u) {
        for (const [d, y] of Object.entries(m))
          if (y.instanceType === "internal" && y.componentNodeId && n.has(y.componentNodeId)) {
            const g = n.get(y.componentNodeId);
            if (g && g.id === f.id) {
              u = y, await t.log(
                `  Matched instance "${p.name}" to instance table entry ${d} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!u) {
        await t.log(
          `  No matching entry found for instance "${p.name}" (main component: ${f.name}, ID: ${f.id.substring(0, 8)}...)`
        ), c++;
        continue;
      }
      if (!u.variantProperties) {
        await t.log(
          `  Instance table entry for "${p.name}" has no variant properties`
        ), c++;
        continue;
      }
      await t.log(
        `  Instance "${p.name}" matched to entry with variant properties: ${JSON.stringify(u.variantProperties)}`
      );
      let h = null;
      if (f.parent && f.parent.type === "COMPONENT_SET" && (h = f.parent.componentPropertyDefinitions), h) {
        const d = {};
        for (const [y, g] of Object.entries(
          u.variantProperties
        )) {
          const b = y.split("#")[0];
          h[b] && (d[b] = g);
        }
        Object.keys(d).length > 0 ? (p.setProperties(d), i++, await t.log(
          `  ✓ Set variant properties on instance "${p.name}": ${JSON.stringify(d)}`
        )) : c++;
      } else
        c++;
    } catch (f) {
      s++, await t.warning(
        `  Failed to set variant properties on instance "${p.name}": ${f}`
      );
    }
  await t.log(
    `  Variant properties set: ${i} processed, ${c} skipped, ${s} errors`
  );
}
async function Ct(e) {
  await figma.loadAllPagesAsync();
  const a = figma.root.children, n = new Set(a.map((s) => s.name));
  if (!n.has(e))
    return e;
  let i = 1, c = `${e}_${i}`;
  for (; n.has(c); )
    i++, c = `${e}_${i}`;
  return c;
}
async function Fa(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(a.map((s) => s.name));
  if (!n.has(e))
    return e;
  let i = 1, c = `${e}_${i}`;
  for (; n.has(c); )
    i++, c = `${e}_${i}`;
  return c;
}
async function Ba(e, a) {
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
  let i = 1, c = `${a}_${i}`;
  for (; n.has(c); )
    i++, c = `${a}_${i}`;
  return c;
}
function Ft(e, a) {
  const n = e.resolvedType.toUpperCase(), i = a.toUpperCase();
  return n === i;
}
async function Ua(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), n = ve(e.collectionName);
  if (Ve(e.collectionName)) {
    for (const i of a)
      if (ve(i.name) === n)
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
        Ie
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
function Ga(e) {
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
function pt(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let a;
  try {
    a = et.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const n = Ta(e, a);
  return {
    success: !0,
    stringTable: a,
    expandedJsonData: n
  };
}
function za(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: Je.fromTable(
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
async function _a(e, a) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), s = e.getTable();
  for (const [o, l] of Object.entries(s)) {
    if (l.isLocal === !1) {
      await t.log(
        `Skipping remote collection: "${l.collectionName}" (index ${o})`
      );
      continue;
    }
    const p = ve(l.collectionName), f = a == null ? void 0 : a.get(p);
    if (f) {
      await t.log(
        `✓ Using pre-created collection: "${p}" (index ${o})`
      ), n.set(o, f);
      continue;
    }
    const m = await Ua(l);
    m.matchType === "recognized" ? (await t.log(
      `✓ Recognized collection by GUID: "${l.collectionName}" (index ${o})`
    ), n.set(o, m.collection)) : m.matchType === "potential" ? (await t.log(
      `? Potential match by name: "${l.collectionName}" (index ${o})`
    ), i.set(o, {
      entry: l,
      collection: m.collection
    })) : (await t.log(
      `✗ No match found for collection: "${l.collectionName}" (index ${o}) - will create new`
    ), c.set(o, l));
  }
  return await t.log(
    `Collection matching complete: ${n.size} recognized, ${i.size} potential matches, ${c.size} to create`
  ), {
    recognizedCollections: n,
    potentialMatches: i,
    collectionsToCreate: c
  };
}
async function ja(e, a, n, i) {
  if (e.size !== 0) {
    if (i) {
      await t.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [c, { entry: s, collection: o }] of e.entries()) {
        const l = ve(
          s.collectionName
        ).toLowerCase();
        let p = !1;
        l === "tokens" || l === "token" ? p = i.tokens === "existing" : l === "theme" || l === "themes" ? p = i.theme === "existing" : (l === "layer" || l === "layers") && (p = i.layers === "existing");
        const f = Ve(s.collectionName) ? ve(s.collectionName) : o.name;
        p ? (await t.log(
          `✓ Wizard selection: Using existing collection "${f}" (index ${c})`
        ), a.set(c, o), await xe(o, s.modes), await t.log(
          `  ✓ Ensured modes for collection "${f}" (${s.modes.length} mode(s))`
        )) : (await t.log(
          `✗ Wizard selection: Will create new collection for "${s.collectionName}" (index ${c})`
        ), n.set(c, s));
      }
      return;
    }
    await t.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [c, { entry: s, collection: o }] of e.entries())
      try {
        const l = Ve(s.collectionName) ? ve(s.collectionName) : o.name, p = `Found existing "${l}" variable collection. Should I use it?`;
        await t.log(
          `Prompting user about potential match: "${l}"`
        ), await ze.prompt(p, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await t.log(
          `✓ User confirmed: Using existing collection "${l}" (index ${c})`
        ), a.set(c, o), await xe(o, s.modes), await t.log(
          `  ✓ Ensured modes for collection "${l}" (${s.modes.length} mode(s))`
        );
      } catch (l) {
        await t.log(
          `✗ User rejected: Will create new collection for "${s.collectionName}" (index ${c})`
        ), n.set(c, s);
      }
  }
}
async function Ha(e, a, n) {
  if (e.size === 0)
    return;
  await t.log("Ensuring modes exist for recognized collections...");
  const i = a.getTable();
  for (const [c, s] of e.entries()) {
    const o = i[c];
    o && (n.has(c) || (await xe(s, o.modes), await t.log(
      `  ✓ Ensured modes for collection "${s.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function Ja(e, a, n, i) {
  if (e.size !== 0) {
    await t.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [c, s] of e.entries()) {
      const o = ve(s.collectionName), l = i == null ? void 0 : i.get(o);
      if (l) {
        await t.log(
          `Reusing pre-created collection: "${o}" (index ${c}, id: ${l.id.substring(0, 8)}...)`
        ), a.set(c, l), await xe(l, s.modes), n.push(l);
        continue;
      }
      const p = await Fa(o);
      p !== o ? await t.log(
        `Creating collection: "${p}" (normalized: "${o}" - name conflict resolved)`
      ) : await t.log(`Creating collection: "${p}"`);
      const f = figma.variables.createVariableCollection(p);
      n.push(f);
      let m;
      if (Ve(s.collectionName)) {
        const u = Qe(s.collectionName);
        u && (m = u);
      } else s.collectionGuid && (m = s.collectionGuid);
      m && (f.setSharedPluginData(
        "recursica",
        Ie,
        m
      ), await t.log(
        `  Stored GUID: ${m.substring(0, 8)}...`
      )), await xe(f, s.modes), await t.log(
        `  ✓ Created collection "${p}" with ${s.modes.length} mode(s)`
      ), a.set(c, f);
    }
    await t.log("Collection creation complete");
  }
}
function Da(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: De.fromTable(e.variables)
    };
  } catch (a) {
    return {
      success: !1,
      error: `Failed to load variables table: ${a instanceof Error ? a.message : "Unknown error"}`
    };
  }
}
async function Wa(e, a, n, i) {
  const c = /* @__PURE__ */ new Map(), s = [], o = new Set(
    i.map((u) => u.id)
  );
  await t.log("Matching and creating variables in collections...");
  const l = e.getTable(), p = /* @__PURE__ */ new Map();
  for (const [u, r] of Object.entries(l)) {
    if (r._colRef === void 0)
      continue;
    const h = n.get(String(r._colRef));
    if (!h)
      continue;
    p.has(h.id) || p.set(h.id, {
      collectionName: h.name,
      existing: 0,
      created: 0
    });
    const d = p.get(h.id), y = o.has(
      h.id
    );
    let g;
    typeof r.variableType == "number" ? g = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[r.variableType] || String(r.variableType) : g = r.variableType;
    const b = await gt(
      h,
      r.variableName
    );
    if (b)
      if (Ft(b, g))
        c.set(u, b), d.existing++;
      else {
        await t.warning(
          `Type mismatch for variable "${r.variableName}" in collection "${h.name}": expected ${g}, found ${b.resolvedType}. Creating new variable with incremented name.`
        );
        const $ = await Ba(
          h,
          r.variableName
        ), x = await lt(
          $e(ne({}, r), {
            variableName: $,
            variableType: g
          }),
          h,
          e,
          a
        );
        y || s.push(x), c.set(u, x), d.created++;
      }
    else {
      const $ = await lt(
        $e(ne({}, r), {
          variableType: g
        }),
        h,
        e,
        a
      );
      y || s.push($), c.set(u, $), d.created++;
    }
  }
  await t.log("Variable processing complete:");
  for (const u of p.values())
    await t.log(
      `  "${u.collectionName}": ${u.existing} existing, ${u.created} created`
    );
  await t.log(
    "Final verification: Reading back all COLOR variables..."
  );
  let f = 0, m = 0;
  for (const u of s)
    if (u.resolvedType === "COLOR") {
      const r = await figma.variables.getVariableCollectionByIdAsync(
        u.variableCollectionId
      );
      if (!r) {
        await t.warning(
          `  ⚠️ Variable "${u.name}" has no variableCollection (ID: ${u.variableCollectionId})`
        );
        continue;
      }
      const h = r.modes;
      if (!h || h.length === 0) {
        await t.warning(
          `  ⚠️ Variable "${u.name}" collection has no modes`
        );
        continue;
      }
      for (const d of h) {
        const y = u.valuesByMode[d.modeId];
        if (y && typeof y == "object" && "r" in y) {
          const g = y;
          Math.abs(g.r - 1) < 0.01 && Math.abs(g.g - 1) < 0.01 && Math.abs(g.b - 1) < 0.01 ? (m++, await t.warning(
            `  ⚠️ Variable "${u.name}" mode "${d.name}" is WHITE: r=${g.r.toFixed(3)}, g=${g.g.toFixed(3)}, b=${g.b.toFixed(3)}`
          )) : (f++, await t.log(
            `  ✓ Variable "${u.name}" mode "${d.name}" has color: r=${g.r.toFixed(3)}, g=${g.g.toFixed(3)}, b=${g.b.toFixed(3)}`
          ));
        } else y && typeof y == "object" && "type" in y || await t.warning(
          `  ⚠️ Variable "${u.name}" mode "${d.name}" has unexpected value type: ${JSON.stringify(y)}`
        );
      }
    }
  return await t.log(
    `Final verification complete: ${f} color variables verified, ${m} white variables found`
  ), {
    recognizedVariables: c,
    newlyCreatedVariables: s
  };
}
function Ka(e) {
  if (!e.instances)
    return null;
  try {
    return We.fromTable(e.instances);
  } catch (a) {
    return null;
  }
}
function qa(e) {
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
  e.type !== void 0 && (e.type = qa(e.type));
  const a = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (a && (a === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      mt(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function Xa(e, a) {
  const n = /* @__PURE__ */ new Set();
  for (const s of e.children)
    (s.type === "FRAME" || s.type === "COMPONENT") && n.add(s.name);
  if (!n.has(a))
    return a;
  let i = 1, c = `${a}_${i}`;
  for (; n.has(c); )
    i++, c = `${a}_${i}`;
  return c;
}
async function Ya(e, a, n, i, c, s = "") {
  var d;
  const o = e.getSerializedTable(), l = Object.values(o).filter(
    (y) => y.instanceType === "remote"
  ), p = /* @__PURE__ */ new Map();
  if (l.length === 0)
    return await t.log("No remote instances found"), p;
  await t.log(
    `Processing ${l.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const f = figma.root.children, m = s ? `${s} REMOTES` : "REMOTES";
  let u = f.find(
    (y) => y.name === "REMOTES" || y.name === m
  );
  if (u ? (await t.log("Found existing REMOTES page"), s && !u.name.startsWith(s) && (u.name = m)) : (u = figma.createPage(), u.name = m, await t.log("Created REMOTES page")), l.length > 0 && (u.setPluginData("RecursicaUnderReview", "true"), await t.log("Marked REMOTES page as under review")), !u.children.some(
    (y) => y.type === "FRAME" && y.name === "Title"
  )) {
    const y = { family: "Inter", style: "Bold" }, g = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(y), await figma.loadFontAsync(g);
    const b = figma.createFrame();
    b.name = "Title", b.layoutMode = "VERTICAL", b.paddingTop = 20, b.paddingBottom = 20, b.paddingLeft = 20, b.paddingRight = 20, b.fills = [];
    const $ = figma.createText();
    $.fontName = y, $.characters = "REMOTE INSTANCES", $.fontSize = 24, $.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], b.appendChild($);
    const x = figma.createText();
    x.fontName = g, x.characters = "These are remotely connected component instances found in our different component pages.", x.fontSize = 14, x.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], b.appendChild(x), u.appendChild(b), await t.log("Created title and description on REMOTES page");
  }
  const h = /* @__PURE__ */ new Map();
  for (const [y, g] of Object.entries(o)) {
    if (g.instanceType !== "remote")
      continue;
    const b = parseInt(y, 10);
    if (await t.log(
      `Processing remote instance ${b}: "${g.componentName}"`
    ), !g.structure) {
      await t.warning(
        `Remote instance "${g.componentName}" missing structure data, skipping`
      );
      continue;
    }
    mt(g.structure);
    const $ = g.structure.children !== void 0, x = g.structure.child !== void 0, I = g.structure.children ? g.structure.children.length : g.structure.child ? g.structure.child.length : 0;
    await t.log(
      `  Structure type: ${g.structure.type || "unknown"}, has children: ${I} (children key: ${$}, child key: ${x})`
    );
    let B = g.componentName;
    if (g.path && g.path.length > 0) {
      const P = g.path.filter((E) => E !== "").join(" / ");
      P && (B = `${P} / ${g.componentName}`);
    }
    const T = await Xa(
      u,
      B
    );
    T !== B && await t.log(
      `Component name conflict: "${B}" -> "${T}"`
    );
    try {
      if (g.structure.type !== "COMPONENT") {
        await t.warning(
          `Remote instance "${g.componentName}" structure is not a COMPONENT (type: ${g.structure.type}), creating frame fallback`
        );
        const E = figma.createFrame();
        E.name = T;
        const V = await _e(
          g.structure,
          E,
          a,
          n,
          null,
          i,
          h,
          !0,
          // isRemoteStructure: true
          null,
          // remoteComponentMap - not needed here
          null,
          // deferredInstances - not needed for remote instances
          null,
          // parentNodeData - not available for remote structures
          c
        );
        V ? (E.appendChild(V), u.appendChild(E), await t.log(
          `✓ Created remote instance frame fallback: "${T}"`
        )) : E.remove();
        continue;
      }
      const P = figma.createComponent();
      P.name = T, u.appendChild(P), await t.log(
        `  Created component node: "${T}"`
      );
      try {
        if (g.structure.componentPropertyDefinitions) {
          const S = g.structure.componentPropertyDefinitions;
          let N = 0, U = 0;
          for (const [H, ee] of Object.entries(S))
            try {
              const j = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[ee.type];
              if (!j) {
                await t.warning(
                  `  Unknown property type ${ee.type} for property "${H}" in component "${g.componentName}"`
                ), U++;
                continue;
              }
              const te = ee.defaultValue, K = H.split("#")[0];
              P.addComponentProperty(
                K,
                j,
                te
              ), N++;
            } catch (Y) {
              await t.warning(
                `  Failed to add component property "${H}" to "${g.componentName}": ${Y}`
              ), U++;
            }
          N > 0 && await t.log(
            `  Added ${N} component property definition(s) to "${g.componentName}"${U > 0 ? ` (${U} failed)` : ""}`
          );
        }
        g.structure.name !== void 0 && (P.name = g.structure.name);
        const E = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.width || g.structure.boundVariables.height);
        g.structure.width !== void 0 && g.structure.height !== void 0 && !E && P.resize(g.structure.width, g.structure.height), g.structure.x !== void 0 && (P.x = g.structure.x), g.structure.y !== void 0 && (P.y = g.structure.y);
        const V = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        if (g.structure.visible !== void 0 && (P.visible = g.structure.visible), g.structure.opacity !== void 0 && (!V || !g.structure.boundVariables.opacity) && (P.opacity = g.structure.opacity), g.structure.rotation !== void 0 && (!V || !g.structure.boundVariables.rotation) && (P.rotation = g.structure.rotation), g.structure.blendMode !== void 0 && (!V || !g.structure.boundVariables.blendMode) && (P.blendMode = g.structure.blendMode), g.structure.fills !== void 0)
          try {
            let S = g.structure.fills;
            Array.isArray(S) && (S = S.map((N) => {
              if (N && typeof N == "object") {
                const U = ne({}, N);
                return delete U.boundVariables, U;
              }
              return N;
            })), P.fills = S, (d = g.structure.boundVariables) != null && d.fills && i && await xa(
              P,
              g.structure.boundVariables,
              "fills",
              i
            );
          } catch (S) {
            await t.warning(
              `Error setting fills for remote component "${g.componentName}": ${S}`
            );
          }
        if (g.structure.strokes !== void 0)
          try {
            P.strokes = g.structure.strokes;
          } catch (S) {
            await t.warning(
              `Error setting strokes for remote component "${g.componentName}": ${S}`
            );
          }
        const O = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.strokeWeight || g.structure.boundVariables.strokeAlign);
        g.structure.strokeWeight !== void 0 && (!O || !g.structure.boundVariables.strokeWeight) && (P.strokeWeight = g.structure.strokeWeight), g.structure.strokeAlign !== void 0 && (!O || !g.structure.boundVariables.strokeAlign) && (P.strokeAlign = g.structure.strokeAlign), g.structure.layoutMode !== void 0 && (P.layoutMode = g.structure.layoutMode), g.structure.primaryAxisSizingMode !== void 0 && (P.primaryAxisSizingMode = g.structure.primaryAxisSizingMode), g.structure.counterAxisSizingMode !== void 0 && (P.counterAxisSizingMode = g.structure.counterAxisSizingMode);
        const R = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        g.structure.paddingLeft !== void 0 && (!R || !g.structure.boundVariables.paddingLeft) && (P.paddingLeft = g.structure.paddingLeft), g.structure.paddingRight !== void 0 && (!R || !g.structure.boundVariables.paddingRight) && (P.paddingRight = g.structure.paddingRight), g.structure.paddingTop !== void 0 && (!R || !g.structure.boundVariables.paddingTop) && (P.paddingTop = g.structure.paddingTop), g.structure.paddingBottom !== void 0 && (!R || !g.structure.boundVariables.paddingBottom) && (P.paddingBottom = g.structure.paddingBottom), g.structure.itemSpacing !== void 0 && (!R || !g.structure.boundVariables.itemSpacing) && (P.itemSpacing = g.structure.itemSpacing);
        const v = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.cornerRadius || g.structure.boundVariables.topLeftRadius || g.structure.boundVariables.topRightRadius || g.structure.boundVariables.bottomLeftRadius || g.structure.boundVariables.bottomRightRadius);
        if (g.structure.cornerRadius !== void 0 && (!v || !g.structure.boundVariables.cornerRadius) && (P.cornerRadius = g.structure.cornerRadius), g.structure.boundVariables && i) {
          const S = g.structure.boundVariables, N = [
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
          for (const U of N)
            if (S[U] && Me(S[U])) {
              const H = S[U]._varRef;
              if (H !== void 0) {
                const ee = i.get(String(H));
                if (ee) {
                  const Y = {
                    type: "VARIABLE_ALIAS",
                    id: ee.id
                  };
                  P.boundVariables || (P.boundVariables = {}), P.boundVariables[U] = Y;
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
            const N = G[S];
            if (await t.log(
              `  DEBUG: Processing child ${S + 1}/${G.length}: ${JSON.stringify({ name: N == null ? void 0 : N.name, type: N == null ? void 0 : N.type, hasTruncated: !!(N != null && N._truncated) })}`
            ), N._truncated) {
              await t.log(
                `  Skipping truncated child: ${N._reason || "Unknown"}`
              );
              continue;
            }
            await t.log(
              `  Recreating child: "${N.name || "Unnamed"}" (type: ${N.type})`
            );
            const U = await _e(
              N,
              P,
              a,
              n,
              null,
              i,
              h,
              !0,
              // isRemoteStructure: true
              null,
              // remoteComponentMap - not needed here
              null,
              // deferredInstances - not needed for remote instances
              g.structure,
              // parentNodeData - pass the component's structure so children can check for auto-layout
              c
            );
            U ? (P.appendChild(U), await t.log(
              `  ✓ Appended child "${N.name || "Unnamed"}" to component "${g.componentName}"`
            )) : await t.warning(
              `  ✗ Failed to create child "${N.name || "Unnamed"}" (type: ${N.type})`
            );
          }
        }
        p.set(b, P), await t.log(
          `✓ Created remote component: "${T}" (index ${b})`
        );
      } catch (E) {
        await t.warning(
          `Error populating remote component "${g.componentName}": ${E instanceof Error ? E.message : "Unknown error"}`
        ), P.remove();
      }
    } catch (P) {
      await t.warning(
        `Error recreating remote instance "${g.componentName}": ${P instanceof Error ? P.message : "Unknown error"}`
      );
    }
  }
  return await t.log(
    `Remote instance processing complete: ${p.size} component(s) created`
  ), p;
}
async function Za(e, a, n, i, c, s, o = null, l = null, p = !1, f = null, m = !1, u = !1, r = "") {
  await t.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const h = figma.root.children, d = "RecursicaPublishedMetadata";
  let y = null;
  for (const V of h) {
    const O = V.getPluginData(d);
    if (O)
      try {
        if (JSON.parse(O).id === e.guid) {
          y = V;
          break;
        }
      } catch (R) {
        continue;
      }
  }
  let g = !1;
  if (y && !p && !m) {
    let V;
    try {
      const v = y.getPluginData(d);
      v && (V = JSON.parse(v).version);
    } catch (v) {
    }
    const O = V !== void 0 ? ` v${V}` : "", R = `Found existing component "${y.name}${O}". Should I use it or create a copy?`;
    await t.log(
      `Found existing page with same GUID: "${y.name}". Prompting user...`
    );
    try {
      await ze.prompt(R, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), g = !0, await t.log(
        `User chose to use existing page: "${y.name}"`
      );
    } catch (v) {
      await t.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (g && y)
    return await figma.setCurrentPageAsync(y), await t.log(
      `Using existing page: "${y.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await t.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${y.name}"`
    ), {
      success: !0,
      page: y,
      // Include pageId so it can be tracked in importedPages
      pageId: y.id
    };
  const b = h.find((V) => V.name === e.name);
  b && await t.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let $;
  if (y || b) {
    const V = `__${e.name}`;
    $ = await Ct(V), await t.log(
      `Creating scratch page: "${$}" (will be renamed to "${e.name}" on success)`
    );
  } else
    $ = e.name, await t.log(`Creating page: "${$}"`);
  const x = figma.createPage();
  if (x.name = $, await figma.setCurrentPageAsync(x), await t.log(`Switched to page: "${$}"`), !a.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await t.log("Recreating page structure...");
  const I = a.pageData;
  if (I.backgrounds !== void 0)
    try {
      x.backgrounds = I.backgrounds, await t.log(
        `Set page background: ${JSON.stringify(I.backgrounds)}`
      );
    } catch (V) {
      await t.warning(`Failed to set page background: ${V}`);
    }
  mt(I);
  const B = /* @__PURE__ */ new Map(), T = (V, O = []) => {
    if (V.type === "COMPONENT" && V.id && O.push(V.id), V.children && Array.isArray(V.children))
      for (const R of V.children)
        R._truncated || T(R, O);
    return O;
  }, P = T(I);
  if (await t.log(
    `Found ${P.length} COMPONENT node(s) in page data`
  ), P.length > 0 && (await t.log(
    `Component IDs in page data (first 20): ${P.slice(0, 20).map((V) => V.substring(0, 8) + "...").join(", ")}`
  ), I._allComponentIds = P), I.children && Array.isArray(I.children))
    for (const V of I.children) {
      const O = await _e(
        V,
        x,
        n,
        i,
        c,
        s,
        B,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        l,
        I,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        f
      );
      O && x.appendChild(O);
    }
  await t.log("Page structure recreated successfully"), c && (await t.log(
    "Third pass: Setting variant properties on instances..."
  ), await La(
    x,
    c,
    B
  ));
  const E = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (x.setPluginData(d, JSON.stringify(E)), await t.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), $.startsWith("__")) {
    let V;
    u ? V = r ? `${r} ${e.name}` : e.name : V = await Ct(e.name), x.name = V, await t.log(`Renamed page from "${$}" to "${V}"`);
  } else u && r && (x.name.startsWith(r) || (x.name = `${r} ${x.name}`));
  return {
    success: !0,
    page: x,
    deferredInstances: l || void 0
  };
}
async function Bt(e) {
  var i, c, s;
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
    const l = Ga(o);
    if (!l.success)
      return await t.error(l.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: l.error,
        data: {}
      };
    const p = l.metadata;
    await t.log(
      `Metadata validated: guid=${p.guid}, name=${p.name}`
    ), await t.log("Loading string table...");
    const f = pt(o);
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
    const u = za(m);
    if (!u.success)
      return u.error === "No collections table found in JSON" ? (await t.log(u.error), await t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: p.name }
      }) : (await t.error(u.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: u.error,
        data: {}
      });
    const r = u.collectionTable;
    await t.log(
      `Loaded collections table with ${r.getSize()} collection(s)`
    ), await t.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: h, potentialMatches: d, collectionsToCreate: y } = await _a(r, e.preCreatedCollections);
    await ja(
      d,
      h,
      y,
      e.collectionChoices
    ), await Ha(
      h,
      r,
      d
    ), await Ja(
      y,
      h,
      n,
      e.preCreatedCollections
    ), await t.log("Loading variables table...");
    const g = Da(m);
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
    const b = g.variableTable;
    await t.log(
      `Loaded variables table with ${b.getSize()} variable(s)`
    );
    const { recognizedVariables: $, newlyCreatedVariables: x } = await Wa(
      b,
      r,
      h,
      n
    );
    await t.log("Loading instance table...");
    const I = Ka(m);
    if (I) {
      const H = I.getSerializedTable(), ee = Object.values(H).filter(
        (j) => j.instanceType === "internal"
      ), Y = Object.values(H).filter(
        (j) => j.instanceType === "remote"
      );
      await t.log(
        `Loaded instance table with ${I.getSize()} instance(s) (${ee.length} internal, ${Y.length} remote)`
      );
    } else
      await t.log("No instance table found in JSON");
    const B = [], T = (i = e.isMainPage) != null ? i : !0, P = (c = e.alwaysCreateCopy) != null ? c : !1, E = (s = e.skipUniqueNaming) != null ? s : !1, V = e.constructionIcon || "";
    let O = null;
    I && (O = await Ya(
      I,
      b,
      r,
      $,
      h,
      V
    ));
    const R = await Za(
      p,
      m,
      b,
      r,
      I,
      $,
      O,
      B,
      T,
      h,
      P,
      E,
      V
    );
    if (!R.success)
      return await t.error(R.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: R.error,
        data: {}
      };
    const v = R.page, G = $.size + x.length, S = R.deferredInstances || B, N = (S == null ? void 0 : S.length) || 0;
    if (await t.log("=== Import Complete ==="), await t.log(
      `Successfully processed ${h.size} collection(s), ${G} variable(s), and created page "${v.name}"${N > 0 ? ` (${N} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), N > 0) {
      await t.log(
        `  [DEBUG] Returning ${N} deferred instance(s) in response`
      );
      for (const H of S)
        await t.log(
          `    - "${H.nodeData.name}" from page "${H.instanceEntry.componentPageName}"`
        );
    }
    const U = R.pageId || v.id;
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: v.name,
        pageId: U,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: N > 0 ? S : void 0,
        createdEntities: {
          pageIds: [v.id],
          collectionIds: n.map((H) => H.id),
          variableIds: x.map((H) => H.id)
        }
      }
    };
  } catch (o) {
    const l = o instanceof Error ? o.message : "Unknown error occurred";
    return await t.error(`Import failed: ${l}`), o instanceof Error && o.stack && await t.error(`Stack trace: ${o.stack}`), console.error("Error importing page:", o), {
      type: "importPage",
      success: !1,
      error: !0,
      message: l,
      data: {}
    };
  }
}
async function Ut(e, a = "") {
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  await t.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let n = 0, i = 0;
  const c = [];
  await figma.loadAllPagesAsync();
  for (const s of e)
    try {
      const { placeholderFrameId: o, instanceEntry: l, nodeData: p, parentNodeId: f } = s, m = await figma.getNodeByIdAsync(
        o
      ), u = await figma.getNodeByIdAsync(
        f
      );
      if (!m || !u) {
        const b = `Deferred instance "${p.name}" - could not find placeholder frame (${o}) or parent node (${f})`;
        await t.error(b), c.push(b), i++;
        continue;
      }
      let r = figma.root.children.find((b) => {
        const $ = b.name === l.componentPageName, x = a && b.name === `${a} ${l.componentPageName}`;
        return $ || x;
      });
      if (!r) {
        const b = be(
          l.componentPageName
        );
        r = figma.root.children.find(($) => be($.name) === b);
      }
      if (!r && a) {
        const b = figma.root.children.map(($) => $.name).slice(0, 10);
        await t.log(
          `  [DEBUG] Looking for page "${l.componentPageName}" (or "${a} ${l.componentPageName}"). Available pages (first 10): ${b.join(", ")}`
        );
      }
      if (!r) {
        const b = a ? `"${l.componentPageName}" or "${a} ${l.componentPageName}"` : `"${l.componentPageName}"`, $ = `Deferred instance "${p.name}" still cannot find referenced page (tried: ${b}, and clean name matching)`;
        await t.error($), c.push($), i++;
        continue;
      }
      const h = (b, $, x, I, B) => {
        if ($.length === 0) {
          let V = null;
          const O = be(x);
          for (const R of b.children || [])
            if (R.type === "COMPONENT") {
              const v = R.name === x, G = be(R.name) === O;
              if (v || G) {
                if (V || (V = R), v && I)
                  try {
                    const S = R.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (S && JSON.parse(S).id === I)
                      return R;
                  } catch (S) {
                  }
                else if (v)
                  return R;
              }
            } else if (R.type === "COMPONENT_SET") {
              if (B) {
                const v = R.name === B, G = be(R.name) === be(B);
                if (!v && !G)
                  continue;
              }
              for (const v of R.children || [])
                if (v.type === "COMPONENT") {
                  const G = v.name === x, S = be(v.name) === O;
                  if (G || S) {
                    if (V || (V = v), G && I)
                      try {
                        const N = v.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (N && JSON.parse(N).id === I)
                          return v;
                      } catch (N) {
                      }
                    else if (G)
                      return v;
                  }
                }
            }
          return V;
        }
        const [T, ...P] = $, E = be(T);
        for (const V of b.children || []) {
          const O = V.name === T, R = be(V.name) === E;
          if (O || R) {
            if (P.length === 0) {
              if (V.type === "COMPONENT_SET") {
                if (B) {
                  const S = V.name === B, N = be(V.name) === be(B);
                  if (!S && !N)
                    continue;
                }
                const v = be(x);
                let G = null;
                for (const S of V.children || [])
                  if (S.type === "COMPONENT") {
                    const N = S.name === x, U = be(S.name) === v;
                    if (N || U) {
                      if (G || (G = S), I)
                        try {
                          const H = S.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (H && JSON.parse(H).id === I)
                            return S;
                        } catch (H) {
                        }
                      if (N)
                        return S;
                    }
                  }
                return G || null;
              }
              return null;
            }
            return P.length > 0 ? h(
              V,
              P,
              x,
              I,
              B
            ) : null;
          }
        }
        return null;
      };
      await t.log(
        `  [DEBUG] Searching for component "${l.componentName}" on page "${r.name}"`
      ), l.path && l.path.length > 0 ? await t.log(
        `  [DEBUG] Component path: [${l.path.join(" → ")}]`
      ) : await t.log("  [DEBUG] Component is at page root"), l.componentSetName && await t.log(
        `  [DEBUG] Component set name: "${l.componentSetName}"`
      ), l.componentGuid && await t.log(
        `  [DEBUG] Component GUID: ${l.componentGuid.substring(0, 8)}...`
      );
      const d = r.children.slice(0, 10).map((b) => `${b.type}: "${b.name}"${b.type === "COMPONENT_SET" ? ` (${b.children.length} variants)` : ""}`);
      await t.log(
        `  [DEBUG] Top-level nodes on page "${r.name}" (first 10): ${d.join(", ")}`
      );
      let y = h(
        r,
        l.path || [],
        l.componentName,
        l.componentGuid,
        l.componentSetName
      );
      if (!y && l.componentSetName) {
        await t.log(
          `  [DEBUG] Path-based search failed, trying recursive search for COMPONENT_SET "${l.componentSetName}"`
        );
        const b = ($, x = 0) => {
          if (x > 5) return null;
          for (const I of $.children || []) {
            if (I.type === "COMPONENT_SET") {
              const B = I.name === l.componentSetName, T = be(I.name) === be(l.componentSetName || "");
              if (B || T) {
                const P = be(
                  l.componentName
                );
                for (const E of I.children || [])
                  if (E.type === "COMPONENT") {
                    const V = E.name === l.componentName, O = be(E.name) === P;
                    if (V || O) {
                      if (l.componentGuid)
                        try {
                          const R = E.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (R && JSON.parse(R).id === l.componentGuid)
                            return E;
                        } catch (R) {
                        }
                      return E;
                    }
                  }
              }
            }
            if (I.type === "FRAME" || I.type === "GROUP") {
              const B = b(I, x + 1);
              if (B) return B;
            }
          }
          return null;
        };
        y = b(r), y && await t.log(
          `  [DEBUG] Found component via recursive search: "${y.name}"`
        );
      }
      if (!y) {
        const b = l.path && l.path.length > 0 ? ` at path [${l.path.join(" → ")}]` : " at page root", $ = [], x = (B, T = 0) => {
          if (!(T > 3) && ((B.type === "COMPONENT" || B.type === "COMPONENT_SET") && $.push(
            `${B.type}: "${B.name}"${B.type === "COMPONENT_SET" ? ` (${B.children.length} variants)` : ""}`
          ), B.children && Array.isArray(B.children)))
            for (const P of B.children.slice(0, 10))
              x(P, T + 1);
        };
        x(r), await t.log(
          `  [DEBUG] Available components on page "${r.name}" (first 20): ${$.slice(0, 20).join(", ")}`
        );
        const I = `Deferred instance "${p.name}" still cannot find component "${l.componentName}" on page "${l.componentPageName}"${b}`;
        await t.error(I), c.push(I), i++;
        continue;
      }
      const g = y.createInstance();
      if (g.name = p.name || m.name.replace("[Deferred: ", "").replace("]", ""), g.x = m.x, g.y = m.y, m.width !== void 0 && m.height !== void 0 && g.resize(m.width, m.height), l.variantProperties && Object.keys(l.variantProperties).length > 0)
        try {
          const b = await g.getMainComponentAsync();
          if (b) {
            let $ = null;
            const x = b.type;
            if (x === "COMPONENT_SET" ? $ = b.componentPropertyDefinitions : x === "COMPONENT" && b.parent && b.parent.type === "COMPONENT_SET" ? $ = b.parent.componentPropertyDefinitions : await t.warning(
              `Cannot set variant properties for resolved instance "${p.name}" - main component is not a COMPONENT_SET or variant`
            ), $) {
              const I = {};
              for (const [B, T] of Object.entries(
                l.variantProperties
              )) {
                const P = B.split("#")[0];
                $[P] && (I[P] = T);
              }
              Object.keys(I).length > 0 && g.setProperties(I);
            }
          }
        } catch (b) {
          await t.warning(
            `Failed to set variant properties for resolved instance "${p.name}": ${b}`
          );
        }
      if (l.componentProperties && Object.keys(l.componentProperties).length > 0)
        try {
          const b = await g.getMainComponentAsync();
          if (b) {
            let $ = null;
            const x = b.type;
            if (x === "COMPONENT_SET" ? $ = b.componentPropertyDefinitions : x === "COMPONENT" && b.parent && b.parent.type === "COMPONENT_SET" ? $ = b.parent.componentPropertyDefinitions : x === "COMPONENT" && ($ = b.componentPropertyDefinitions), $)
              for (const [I, B] of Object.entries(
                l.componentProperties
              )) {
                const T = I.split("#")[0];
                if ($[T])
                  try {
                    g.setProperties({
                      [T]: B
                    });
                  } catch (P) {
                    await t.warning(
                      `Failed to set component property "${T}" for resolved instance "${p.name}": ${P}`
                    );
                  }
              }
          }
        } catch (b) {
          await t.warning(
            `Failed to set component properties for resolved instance "${p.name}": ${b}`
          );
        }
      if ("children" in u && "insertChild" in u) {
        const b = u.children.indexOf(m);
        u.insertChild(b, g), m.remove();
      } else {
        const b = `Parent node does not support children operations for deferred instance "${p.name}"`;
        await t.error(b), c.push(b);
        continue;
      }
      await t.log(
        `  ✓ Resolved deferred instance "${p.name}" from component "${l.componentName}" on page "${l.componentPageName}"`
      ), n++;
    } catch (o) {
      const l = o instanceof Error ? o.message : String(o), p = `Failed to resolve deferred instance "${s.nodeData.name}": ${l}`;
      await t.error(p), c.push(p), i++;
    }
  return await t.log(
    `=== Deferred Resolution Complete: ${n} resolved, ${i} failed ===`
  ), { resolved: n, failed: i, errors: c };
}
async function Qa(e) {
  await t.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: a, collectionIds: n, variableIds: i } = e;
    let c = 0;
    for (const l of i)
      try {
        const p = await figma.variables.getVariableByIdAsync(l);
        if (p) {
          const f = p.variableCollectionId;
          n.includes(f) || (p.remove(), c++);
        }
      } catch (p) {
        await t.warning(
          `Could not delete variable ${l.substring(0, 8)}...: ${p}`
        );
      }
    let s = 0;
    for (const l of n)
      try {
        const p = await figma.variables.getVariableCollectionByIdAsync(l);
        p && (p.remove(), s++);
      } catch (p) {
        await t.warning(
          `Could not delete collection ${l.substring(0, 8)}...: ${p}`
        );
      }
    await figma.loadAllPagesAsync();
    let o = 0;
    for (const l of a)
      try {
        const p = await figma.getNodeByIdAsync(l);
        p && p.type === "PAGE" && (p.remove(), o++);
      } catch (p) {
        await t.warning(
          `Could not delete page ${l.substring(0, 8)}...: ${p}`
        );
      }
    return await t.log(
      `Cleanup complete: Deleted ${o} page(s), ${s} collection(s), ${c} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: o,
        deletedCollections: s,
        deletedVariables: c
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
async function Gt(e) {
  const a = [];
  for (const { fileName: n, jsonData: i } of e)
    try {
      const c = pt(i);
      if (!c.success || !c.expandedJsonData) {
        await t.warning(
          `Skipping ${n} - failed to expand JSON: ${c.error || "Unknown error"}`
        );
        continue;
      }
      const s = c.expandedJsonData, o = s.metadata;
      if (!o || !o.name || !o.guid) {
        await t.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const l = [];
      if (s.instances) {
        const f = We.fromTable(
          s.instances
        ).getSerializedTable();
        for (const m of Object.values(f))
          m.instanceType === "normal" && m.componentPageName && (l.includes(m.componentPageName) || l.push(m.componentPageName));
      }
      a.push({
        fileName: n,
        pageName: o.name,
        pageGuid: o.guid,
        dependencies: l,
        jsonData: i
        // Store original JSON data for import
      }), await t.log(
        `  ${n}: "${o.name}" depends on: ${l.length > 0 ? l.join(", ") : "none"}`
      );
    } catch (c) {
      await t.error(
        `Error processing ${n}: ${c instanceof Error ? c.message : String(c)}`
      );
    }
  return a;
}
function zt(e) {
  const a = [], n = [], i = [], c = /* @__PURE__ */ new Map();
  for (const f of e)
    c.set(f.pageName, f);
  const s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), l = [], p = (f) => {
    if (s.has(f.pageName))
      return !1;
    if (o.has(f.pageName)) {
      const m = l.findIndex(
        (u) => u.pageName === f.pageName
      );
      if (m !== -1) {
        const u = l.slice(m).concat([f]);
        return n.push(u), !0;
      }
      return !1;
    }
    o.add(f.pageName), l.push(f);
    for (const m of f.dependencies) {
      const u = c.get(m);
      u && p(u);
    }
    return o.delete(f.pageName), l.pop(), s.add(f.pageName), a.push(f), !1;
  };
  for (const f of e)
    s.has(f.pageName) || p(f);
  for (const f of e)
    for (const m of f.dependencies)
      c.has(m) || i.push(
        `Page "${f.pageName}" (${f.fileName}) depends on "${m}" which is not in the import set`
      );
  return { order: a, cycles: n, errors: i };
}
async function _t(e) {
  await t.log("=== Building Dependency Graph ===");
  const a = await Gt(e);
  await t.log("=== Resolving Import Order ===");
  const n = zt(a);
  if (n.cycles.length > 0) {
    await t.log(
      `Detected ${n.cycles.length} circular dependency cycle(s):`
    );
    for (const i of n.cycles) {
      const c = i.map((s) => `"${s.pageName}"`).join(" → ");
      await t.log(`  Cycle: ${c} → (back to start)`);
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
    const c = n.order[i];
    await t.log(`  ${i + 1}. ${c.fileName} ("${c.pageName}")`);
  }
  return n;
}
async function jt(e) {
  var $, x, I, B, T, P;
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
    errors: c
  } = await _t(a);
  c.length > 0 && await t.warning(
    `Found ${c.length} dependency warning(s) - some dependencies may be missing`
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
    const E = "recursica:collectionId", V = async (R) => {
      const v = await figma.variables.getLocalVariableCollectionsAsync(), G = new Set(v.map((U) => U.name));
      if (!G.has(R))
        return R;
      let S = 1, N = `${R}_${S}`;
      for (; G.has(N); )
        S++, N = `${R}_${S}`;
      return N;
    }, O = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: R, normalizedName: v } of O)
      if (R === "new") {
        await t.log(
          `Processing collection type: "${v}" (choice: "new") - will create new collection`
        );
        const G = await V(v), S = figma.variables.createVariableCollection(G);
        if (Ve(v)) {
          const N = Qe(v);
          N && (S.setSharedPluginData(
            "recursica",
            E,
            N
          ), await t.log(
            `  Stored fixed GUID: ${N.substring(0, 8)}...`
          ));
        }
        s.set(v, S), await t.log(
          `✓ Pre-created collection: "${G}" (normalized: "${v}", id: ${S.id.substring(0, 8)}...)`
        );
      } else
        await t.log(
          `Skipping collection type: "${v}" (choice: "existing")`
        );
    s.size > 0 && await t.log(
      `Pre-created ${s.size} collection(s) for reuse across all imports`
    );
  }
  await t.log("=== Importing Pages in Order ===");
  let o = 0, l = 0;
  const p = [...c], f = [], m = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, u = [];
  if (s.size > 0)
    for (const E of s.values())
      m.collectionIds.push(E.id), await t.log(
        `Tracking pre-created collection: "${E.name}" (${E.id.substring(0, 8)}...)`
      );
  const r = e.mainFileName;
  for (let E = 0; E < n.length; E++) {
    const V = n[E], O = r ? V.fileName === r : E === n.length - 1;
    await t.log(
      `[${E + 1}/${n.length}] Importing ${V.fileName} ("${V.pageName}")${O ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const R = E === 0, v = await Bt({
        jsonData: V.jsonData,
        isMainPage: O,
        clearConsole: R,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: ($ = e.skipUniqueNaming) != null ? $ : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: s
        // Pass pre-created collections for reuse
      });
      if (v.success) {
        if (o++, (x = v.data) != null && x.deferredInstances) {
          const G = v.data.deferredInstances;
          Array.isArray(G) && (await t.log(
            `  [DEBUG] Collected ${G.length} deferred instance(s) from ${V.fileName}`
          ), f.push(...G));
        } else
          await t.log(
            `  [DEBUG] No deferred instances in response for ${V.fileName}`
          );
        if ((I = v.data) != null && I.createdEntities) {
          const G = v.data.createdEntities;
          G.pageIds && m.pageIds.push(...G.pageIds), G.collectionIds && m.collectionIds.push(...G.collectionIds), G.variableIds && m.variableIds.push(...G.variableIds);
          const S = ((B = G.pageIds) == null ? void 0 : B[0]) || ((T = v.data) == null ? void 0 : T.pageId);
          (P = v.data) != null && P.pageName && S && u.push({
            name: v.data.pageName,
            pageId: S
          });
        }
      } else
        l++, p.push(
          `Failed to import ${V.fileName}: ${v.message || "Unknown error"}`
        );
    } catch (R) {
      l++;
      const v = R instanceof Error ? R.message : String(R);
      p.push(`Failed to import ${V.fileName}: ${v}`);
    }
  }
  if (f.length > 0) {
    await t.log(
      `=== Resolving ${f.length} Deferred Instance(s) ===`
    );
    try {
      const E = await Ut(
        f,
        e.constructionIcon || ""
      );
      await t.log(
        `  Resolved: ${E.resolved}, Failed: ${E.failed}`
      ), E.errors.length > 0 && p.push(...E.errors);
    } catch (E) {
      p.push(
        `Failed to resolve deferred instances: ${E instanceof Error ? E.message : String(E)}`
      );
    }
  }
  const h = Array.from(
    new Set(m.collectionIds)
  ), d = Array.from(
    new Set(m.variableIds)
  ), y = Array.from(new Set(m.pageIds));
  if (await t.log("=== Import Summary ==="), await t.log(
    `  Imported: ${o}, Failed: ${l}, Deferred instances: ${f.length}`
  ), await t.log(
    `  Collections in allCreatedEntityIds: ${m.collectionIds.length}, Unique: ${h.length}`
  ), h.length > 0) {
    await t.log(
      `  Created ${h.length} collection(s)`
    );
    for (const E of h)
      try {
        const V = await figma.variables.getVariableCollectionByIdAsync(E);
        V && await t.log(
          `    - "${V.name}" (${E.substring(0, 8)}...)`
        );
      } catch (V) {
      }
  }
  const g = l === 0, b = g ? `Successfully imported ${o} page(s)${f.length > 0 ? ` (${f.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${l} failure(s). ${p.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: g,
    error: !g,
    message: b,
    data: {
      imported: o,
      failed: l,
      deferred: f.length,
      errors: p,
      importedPages: u,
      createdEntities: {
        pageIds: y,
        collectionIds: h,
        variableIds: d
      }
    }
  };
}
async function en(e) {
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
    const c = await at(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const s = JSON.stringify(c, null, 2), o = JSON.parse(s), l = "Copy - " + o.name, p = figma.createPage();
    if (p.name = l, figma.root.appendChild(p), o.children && o.children.length > 0) {
      let u = function(h) {
        h.forEach((d) => {
          const y = (d.x || 0) + (d.width || 0);
          y > r && (r = y), d.children && d.children.length > 0 && u(d.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let r = 0;
      u(o.children), console.log("Original content rightmost edge: " + r);
      for (const h of o.children)
        await _e(h, p, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const f = tt(o);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: o.name,
        newPageName: l,
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
async function tn(e) {
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
async function an(e) {
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
async function nn(e) {
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
async function on(e) {
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
async function rn(e) {
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
async function sn(e) {
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
async function cn(e) {
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
function we(e, a = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: a
  };
}
function Ce(e, a, n = {}) {
  const i = a instanceof Error ? a.message : a;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: n
  };
}
const Ht = "RecursicaPublishedMetadata";
async function ln(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (l) => l.id === a.id
    ), c = a.getPluginData(Ht);
    if (!c) {
      const f = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: Ze(a.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return we("getComponentMetadata", f);
    }
    const o = {
      componentMetadata: JSON.parse(c),
      currentPageIndex: i
    };
    return we("getComponentMetadata", o);
  } catch (a) {
    return console.error("Error getting component metadata:", a), Ce(
      "getComponentMetadata",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function dn(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children, n = [];
    for (const c of a) {
      if (c.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${c.name} (type: ${c.type})`
        );
        continue;
      }
      const s = c, o = s.getPluginData(Ht);
      if (o)
        try {
          const l = JSON.parse(o);
          n.push(l);
        } catch (l) {
          console.warn(
            `Failed to parse metadata for page "${s.name}":`,
            l
          );
          const f = {
            _ver: 1,
            id: "",
            name: Ze(s.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          n.push(f);
        }
      else {
        const p = {
          _ver: 1,
          id: "",
          name: Ze(s.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(p);
      }
    }
    return we("getAllComponents", {
      components: n
    });
  } catch (a) {
    return console.error("Error getting all components:", a), Ce(
      "getAllComponents",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function gn(e) {
  try {
    const a = e.requestId, n = e.action;
    return !a || !n ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (ze.handleResponse({ requestId: a, action: n }), {
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
async function pn(e) {
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
const Se = "RecursicaPrimaryImport", ue = "RecursicaUnderReview", Jt = "---", Dt = "---", Ne = "RecursicaImportDivider", Be = "start", Ue = "end", Pe = "⚠️";
async function mn(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    for (const i of a) {
      if (i.type !== "PAGE")
        continue;
      const c = i.getPluginData(Se);
      if (c)
        try {
          const o = JSON.parse(c), l = {
            exists: !0,
            pageId: i.id,
            metadata: o
          };
          return we(
            "checkForExistingPrimaryImport",
            l
          );
        } catch (o) {
          await t.warning(
            `Failed to parse primary import metadata on page "${i.name}": ${o}`
          );
          continue;
        }
      if (i.getPluginData(ue) === "true") {
        const o = i.getPluginData(Se);
        if (o)
          try {
            const l = JSON.parse(o), p = {
              exists: !0,
              pageId: i.id,
              metadata: l
            };
            return we(
              "checkForExistingPrimaryImport",
              p
            );
          } catch (l) {
          }
        else
          await t.warning(
            `Found page "${i.name}" marked as under review but missing primary import metadata`
          );
      }
    }
    return we("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (a) {
    return console.error("Error checking for existing primary import:", a), Ce(
      "checkForExistingPrimaryImport",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function fn(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children.find(
      (l) => l.type === "PAGE" && l.getPluginData(Ne) === Be
    ), n = figma.root.children.find(
      (l) => l.type === "PAGE" && l.getPluginData(Ne) === Ue
    );
    if (a && n) {
      const l = {
        startDividerId: a.id,
        endDividerId: n.id
      };
      return we("createImportDividers", l);
    }
    const i = figma.createPage();
    i.name = Jt, i.setPluginData(Ne, Be), i.setPluginData(ue, "true");
    const c = figma.createPage();
    c.name = Dt, c.setPluginData(Ne, Ue), c.setPluginData(ue, "true");
    const s = figma.root.children.indexOf(i);
    figma.root.insertChild(s + 1, c), await t.log("Created import dividers");
    const o = {
      startDividerId: i.id,
      endDividerId: c.id
    };
    return we("createImportDividers", o);
  } catch (a) {
    return console.error("Error creating import dividers:", a), Ce(
      "createImportDividers",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function un(e) {
  var a, n, i, c, s, o, l;
  try {
    await t.log("=== Starting Single Component Import ==="), await t.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let p = figma.root.children.find(
      (S) => S.type === "PAGE" && S.getPluginData(Ne) === Be
    );
    p || (p = figma.createPage(), p.name = Jt, p.setPluginData(Ne, Be), p.setPluginData(ue, "true"), await t.log("Created start divider"));
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
    const u = await jt({
      jsonFiles: m,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: Pe
      // Add construction icon to page names
    });
    if (!u.success)
      throw new Error(
        u.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const r = figma.root.children;
    let h = r.find(
      (S) => S.type === "PAGE" && S.getPluginData(Ne) === Ue
    );
    if (!h) {
      h = figma.createPage(), h.name = Dt, h.setPluginData(
        Ne,
        Ue
      ), h.setPluginData(ue, "true");
      let S = r.length;
      for (let N = r.length - 1; N >= 0; N--) {
        const U = r[N];
        if (U.type === "PAGE" && U.getPluginData(Ne) !== Be && U.getPluginData(Ne) !== Ue) {
          S = N + 1;
          break;
        }
      }
      figma.root.insertChild(S, h), await t.log("Created end divider");
    }
    await t.log(
      `Import result data structure: ${JSON.stringify(Object.keys(u.data || {}))}`
    );
    const d = u.data;
    if (await t.log(
      `Import result has createdEntities: ${!!(d != null && d.createdEntities)}`
    ), d != null && d.createdEntities && (await t.log(
      `  Collection IDs: ${((a = d.createdEntities.collectionIds) == null ? void 0 : a.length) || 0}`
    ), await t.log(
      `  Variable IDs: ${((n = d.createdEntities.variableIds) == null ? void 0 : n.length) || 0}`
    ), await t.log(
      `  Page IDs: ${((i = d.createdEntities.pageIds) == null ? void 0 : i.length) || 0}`
    )), !(d != null && d.importedPages) || d.importedPages.length === 0)
      throw new Error("No pages were imported");
    const y = "RecursicaPublishedMetadata", g = e.mainComponent.guid;
    await t.log(
      `Looking for main page by GUID: ${g.substring(0, 8)}...`
    );
    let b, $ = null;
    for (const S of d.importedPages)
      try {
        const N = await figma.getNodeByIdAsync(
          S.pageId
        );
        if (N && N.type === "PAGE") {
          const U = N.getPluginData(y);
          if (U)
            try {
              if (JSON.parse(U).id === g) {
                b = S.pageId, $ = N, await t.log(
                  `Found main page by GUID: "${N.name}" (ID: ${S.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (H) {
            }
        }
      } catch (N) {
        await t.warning(
          `Error checking page ${S.pageId}: ${N}`
        );
      }
    if (!b) {
      await t.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const S = figma.root.children;
      for (const N of S)
        if (N.type === "PAGE") {
          const U = N.getPluginData(y);
          if (U)
            try {
              if (JSON.parse(U).id === g) {
                b = N.id, $ = N, await t.log(
                  `Found main page by GUID in all pages: "${N.name}" (ID: ${N.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (H) {
            }
        }
    }
    if (!b || !$) {
      await t.error(
        `Failed to find imported main page by GUID: ${g.substring(0, 8)}...`
      ), await t.log("Imported pages were:");
      for (const S of d.importedPages)
        await t.log(
          `  - "${S.name}" (ID: ${S.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!$ || $.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const S of d.importedPages)
      try {
        const N = await figma.getNodeByIdAsync(
          S.pageId
        );
        if (N && N.type === "PAGE") {
          N.setPluginData(ue, "true");
          const U = N.name.replace(/_\d+$/, "");
          if (!U.startsWith(Pe))
            N.name = `${Pe} ${U}`;
          else {
            const H = U.replace(Pe, "").trim();
            N.name = `${Pe} ${H}`;
          }
        }
      } catch (N) {
        await t.warning(
          `Failed to mark page ${S.pageId} as under review: ${N}`
        );
      }
    await figma.loadAllPagesAsync();
    const x = figma.root.children, I = x.find(
      (S) => S.type === "PAGE" && (S.name === "REMOTES" || S.name === `${Pe} REMOTES`)
    );
    I && (I.setPluginData(ue, "true"), I.name.startsWith(Pe) || (I.name = `${Pe} REMOTES`), await t.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const B = x.find(
      (S) => S.type === "PAGE" && S.getPluginData(Ne) === Be
    ), T = x.find(
      (S) => S.type === "PAGE" && S.getPluginData(Ne) === Ue
    );
    if (B && T) {
      const S = x.indexOf(B), N = x.indexOf(T);
      for (let U = S + 1; U < N; U++) {
        const H = x[U];
        H.type === "PAGE" && H.getPluginData(ue) !== "true" && (H.setPluginData(ue, "true"), await t.log(
          `Marked page "${H.name}" as under review (found between dividers)`
        ));
      }
    }
    const P = [], E = [];
    if (await t.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((s = (c = d == null ? void 0 : d.createdEntities) == null ? void 0 : c.collectionIds) == null ? void 0 : s.length) || 0}`
    ), (o = d == null ? void 0 : d.createdEntities) != null && o.collectionIds) {
      await t.log(
        `[EXTRACTION] Collection IDs to process: ${d.createdEntities.collectionIds.map((S) => S.substring(0, 8) + "...").join(", ")}`
      );
      for (const S of d.createdEntities.collectionIds)
        try {
          const N = await figma.variables.getVariableCollectionByIdAsync(S);
          N ? (P.push({
            collectionId: N.id,
            collectionName: N.name
          }), await t.log(
            `[EXTRACTION] ✓ Extracted collection: "${N.name}" (${S.substring(0, 8)}...)`
          )) : await t.warning(
            `[EXTRACTION] Collection ${S.substring(0, 8)}... not found`
          );
        } catch (N) {
          await t.warning(
            `[EXTRACTION] Failed to get collection ${S.substring(0, 8)}...: ${N}`
          );
        }
    } else
      await t.warning(
        "[EXTRACTION] No collectionIds found in importResultData.createdEntities"
      );
    await t.log(
      `[EXTRACTION] Total collections extracted: ${P.length}`
    ), P.length > 0 && await t.log(
      `[EXTRACTION] Extracted collections: ${P.map((S) => `"${S.collectionName}" (${S.collectionId.substring(0, 8)}...)`).join(", ")}`
    );
    const V = new Set(
      P.map((S) => S.collectionId)
    );
    if ((l = d == null ? void 0 : d.createdEntities) != null && l.variableIds)
      for (const S of d.createdEntities.variableIds)
        try {
          const N = await figma.variables.getVariableByIdAsync(S);
          if (N && N.resolvedType && !V.has(N.variableCollectionId)) {
            const U = await figma.variables.getVariableCollectionByIdAsync(
              N.variableCollectionId
            );
            U && E.push({
              variableId: N.id,
              variableName: N.name,
              collectionId: N.variableCollectionId,
              collectionName: U.name
            });
          }
        } catch (N) {
          await t.warning(
            `Failed to get variable ${S}: ${N}`
          );
        }
    const O = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: P,
      createdVariables: E,
      importError: void 0
      // No error yet
    };
    await t.log(
      `Storing metadata with ${P.length} collection(s) and ${E.length} variable(s)`
    ), $.setPluginData(
      Se,
      JSON.stringify(O)
    ), $.setPluginData(ue, "true"), await t.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const R = [];
    d.importedPages && R.push(
      ...d.importedPages.map((S) => S.pageId)
    ), await t.log("=== Single Component Import Complete ==="), O.importError = void 0, await t.log(
      `[METADATA] About to store metadata with ${P.length} collection(s) and ${E.length} variable(s)`
    ), P.length > 0 && await t.log(
      `[METADATA] Collections to store: ${P.map((S) => `"${S.collectionName}" (${S.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), $.setPluginData(
      Se,
      JSON.stringify(O)
    ), await t.log(
      `[METADATA] Stored metadata: ${P.length} collection(s), ${E.length} variable(s)`
    );
    const v = $.getPluginData(Se);
    if (v)
      try {
        const S = JSON.parse(v);
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
      mainPageId: $.id,
      importedPageIds: R,
      createdCollections: P,
      createdVariables: E
    };
    return we("importSingleComponentWithWizard", G);
  } catch (p) {
    const f = p instanceof Error ? p.message : "Unknown error occurred";
    await t.error(`Import failed: ${f}`);
    try {
      await figma.loadAllPagesAsync();
      const m = figma.root.children;
      let u = null;
      for (const r of m) {
        if (r.type !== "PAGE") continue;
        const h = r.getPluginData(Se);
        if (h)
          try {
            if (JSON.parse(h).componentGuid === e.mainComponent.guid) {
              u = r;
              break;
            }
          } catch (d) {
          }
      }
      if (u) {
        const r = u.getPluginData(Se);
        if (r)
          try {
            const h = JSON.parse(r);
            await t.log(
              `[CATCH] Found existing metadata with ${h.createdCollections.length} collection(s) and ${h.createdVariables.length} variable(s)`
            ), h.importError = f, u.setPluginData(
              Se,
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
        for (const y of m) {
          if (y.type !== "PAGE") continue;
          y.getPluginData(ue) === "true" && r.push(y);
        }
        const h = [];
        if (e.wizardSelections) {
          const y = await figma.variables.getLocalVariableCollectionsAsync(), g = [
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
          for (const { choice: b, normalizedName: $ } of g)
            if (b === "new") {
              const x = y.filter((I) => ve(I.name) === $);
              if (x.length > 0) {
                const I = x[0];
                h.push({
                  collectionId: I.id,
                  collectionName: I.name
                }), await t.log(
                  `Found created collection: "${I.name}" (${I.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const d = [];
        if (r.length > 0) {
          const y = r[0], g = {
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
            createdVariables: d,
            importError: f
          };
          y.setPluginData(
            Se,
            JSON.stringify(g)
          ), await t.log(
            `Created fallback metadata with ${h.length} collection(s) and error information`
          );
        }
      }
    } catch (m) {
      await t.warning(
        `Failed to store error metadata: ${m instanceof Error ? m.message : String(m)}`
      );
    }
    return Ce(
      "importSingleComponentWithWizard",
      p instanceof Error ? p : new Error(String(p))
    );
  }
}
async function Wt(e) {
  try {
    await t.log("=== Starting Import Group Deletion ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const n = a.getPluginData(Se);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await t.log(
      `Found metadata: ${i.createdCollections.length} collection(s), ${i.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const c = figma.root.children, s = [];
    for (const r of c) {
      if (r.type !== "PAGE")
        continue;
      r.getPluginData(ue) === "true" && (s.push(r), await t.log(
        `Found page to delete: "${r.name}" (under review)`
      ));
    }
    await t.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let o = 0;
    for (const r of i.createdVariables)
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
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let l = 0;
    for (const r of i.createdCollections)
      try {
        const h = await figma.variables.getVariableCollectionByIdAsync(
          r.collectionId
        );
        h ? (h.remove(), l++, await t.log(
          `Deleted collection: ${r.collectionName} (${r.collectionId})`
        )) : await t.warning(
          `Collection ${r.collectionName} (${r.collectionId}) not found - may have already been deleted`
        );
      } catch (h) {
        await t.warning(
          `Failed to delete collection ${r.collectionName}: ${h instanceof Error ? h.message : String(h)}`
        );
      }
    const p = s.map((r) => ({
      page: r,
      name: r.name,
      id: r.id
    })), f = figma.currentPage;
    if (p.some(
      (r) => r.id === f.id
    )) {
      await figma.loadAllPagesAsync();
      const h = figma.root.children.find(
        (d) => d.type === "PAGE" && !p.some((y) => y.id === d.id)
      );
      h ? (await figma.setCurrentPageAsync(h), await t.log(
        `Switched away from page "${f.name}" before deletion`
      )) : await t.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: r, name: h } of p)
      try {
        let d = !1;
        try {
          await figma.loadAllPagesAsync(), d = figma.root.children.some((g) => g.id === r.id);
        } catch (y) {
          d = !1;
        }
        if (!d) {
          await t.log(`Page "${h}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === r.id) {
          await figma.loadAllPagesAsync();
          const g = figma.root.children.find(
            (b) => b.type === "PAGE" && b.id !== r.id && !p.some(($) => $.id === b.id)
          );
          g && await figma.setCurrentPageAsync(g);
        }
        r.remove(), await t.log(`Deleted page: "${h}"`);
      } catch (d) {
        await t.warning(
          `Failed to delete page "${h}": ${d instanceof Error ? d.message : String(d)}`
        );
      }
    await t.log("=== Import Group Deletion Complete ===");
    const u = {
      success: !0,
      deletedPages: s.length,
      deletedCollections: l,
      deletedVariables: o
    };
    return we("deleteImportGroup", u);
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Delete failed: ${n}`), Ce(
      "deleteImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function hn(e) {
  try {
    await t.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const a = figma.root.children;
    let n = null;
    for (const f of a) {
      if (f.type !== "PAGE")
        continue;
      if (f.getPluginData(Se)) {
        n = f;
        break;
      }
    }
    if (n)
      return await t.log(
        "Found page with metadata, using deleteImportGroup"
      ), await Wt({ pageId: n.id });
    await t.log(
      "No primary metadata found, looking for pages with UNDER_REVIEW_KEY or PAGE_METADATA_KEY"
    );
    const i = "RecursicaPublishedMetadata", c = [];
    for (const f of a) {
      if (f.type !== "PAGE")
        continue;
      const m = f.getPluginData(ue), u = f.getPluginData(i);
      (m === "true" || u) && (c.push({ id: f.id, name: f.name }), await t.log(
        `Found page to delete: "${f.name}" (underReview: ${m === "true"}, hasMetadata: ${!!u})`
      ));
    }
    const s = figma.currentPage;
    if (c.some(
      (f) => f.id === s.id
    )) {
      await figma.loadAllPagesAsync();
      const m = figma.root.children.find(
        (u) => u.type === "PAGE" && !c.some((r) => r.id === u.id)
      );
      m && (await figma.setCurrentPageAsync(m), await t.log(
        `Switched away from page "${s.name}" before deletion`
      ));
    }
    let l = 0;
    for (const f of c)
      try {
        await figma.loadAllPagesAsync();
        const m = await figma.getNodeByIdAsync(
          f.id
        );
        if (!m || m.type !== "PAGE")
          continue;
        if (figma.currentPage.id === m.id) {
          await figma.loadAllPagesAsync();
          const r = figma.root.children.find(
            (h) => h.type === "PAGE" && h.id !== m.id && !c.some((d) => d.id === h.id)
          );
          r && await figma.setCurrentPageAsync(r);
        }
        m.remove(), l++, await t.log(`Deleted page: "${f.name}"`);
      } catch (m) {
        await t.warning(
          `Failed to delete page "${f.name}" (${f.id.substring(0, 8)}...): ${m instanceof Error ? m.message : String(m)}`
        );
      }
    return await t.log("=== Failed Import Cleanup Complete ==="), we("cleanupFailedImport", {
      success: !0,
      deletedPages: l,
      deletedCollections: 0,
      // Can't clean up without metadata
      deletedVariables: 0
      // Can't clean up without metadata
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Cleanup failed: ${n}`), Ce(
      "cleanupFailedImport",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function bn(e) {
  try {
    await t.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Page not found");
    a.setPluginData(Se, ""), a.setPluginData(ue, "");
    const n = figma.root.children;
    for (const c of n)
      if (c.type === "PAGE" && c.getPluginData(ue) === "true") {
        const o = c.getPluginData(Se);
        if (o)
          try {
            JSON.parse(o), c.setPluginData(ue, "");
          } catch (l) {
            c.setPluginData(ue, "");
          }
        else
          c.setPluginData(ue, "");
      }
    return await t.log(
      "Cleared import metadata from page and related pages"
    ), we("clearImportMetadata", {
      success: !0
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Clear metadata failed: ${n}`), Ce(
      "clearImportMetadata",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function yn(e) {
  try {
    await t.log("=== Summarizing Variables for Wizard ===");
    const a = [];
    for (const { fileName: h, jsonData: d } of e.jsonFiles)
      try {
        const y = pt(d);
        if (!y.success || !y.expandedJsonData) {
          await t.warning(
            `Skipping ${h} - failed to expand JSON: ${y.error || "Unknown error"}`
          );
          continue;
        }
        const g = y.expandedJsonData;
        if (!g.collections)
          continue;
        const $ = Je.fromTable(
          g.collections
        );
        if (!g.variables)
          continue;
        const I = De.fromTable(g.variables).getTable();
        for (const B of Object.values(I)) {
          if (B._colRef === void 0)
            continue;
          const T = $.getCollectionByIndex(
            B._colRef
          );
          if (T) {
            const E = ve(
              T.collectionName
            ).toLowerCase();
            (E === "tokens" || E === "theme" || E === "layer") && a.push({
              name: B.variableName,
              collectionName: E
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (y) {
        await t.warning(
          `Error processing ${h}: ${y instanceof Error ? y.message : String(y)}`
        );
        continue;
      }
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let i = null, c = null, s = null;
    for (const h of n) {
      const y = ve(h.name).toLowerCase();
      (y === "tokens" || y === "token") && !i ? i = h : (y === "theme" || y === "themes") && !c ? c = h : (y === "layer" || y === "layers") && !s && (s = h);
    }
    const o = a.filter(
      (h) => h.collectionName === "tokens"
    ), l = a.filter((h) => h.collectionName === "theme"), p = a.filter((h) => h.collectionName === "layer"), f = {
      existing: 0,
      new: 0
    }, m = {
      existing: 0,
      new: 0
    }, u = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && i) {
      const h = /* @__PURE__ */ new Set();
      for (const d of i.variableIds)
        try {
          const y = figma.variables.getVariableById(d);
          y && h.add(y.name);
        } catch (y) {
          continue;
        }
      for (const d of o)
        h.has(d.name) ? f.existing++ : f.new++;
    } else
      f.new = o.length;
    if (e.themeCollection === "existing" && c) {
      const h = /* @__PURE__ */ new Set();
      for (const d of c.variableIds)
        try {
          const y = figma.variables.getVariableById(d);
          y && h.add(y.name);
        } catch (y) {
          continue;
        }
      for (const d of l)
        h.has(d.name) ? m.existing++ : m.new++;
    } else
      m.new = l.length;
    if (e.layersCollection === "existing" && s) {
      const h = /* @__PURE__ */ new Set();
      for (const d of s.variableIds)
        try {
          const y = figma.variables.getVariableById(d);
          y && h.add(y.name);
        } catch (y) {
          continue;
        }
      for (const d of p)
        h.has(d.name) ? u.existing++ : u.new++;
    } else
      u.new = p.length;
    return await t.log(
      `Variable summary: Tokens - ${f.existing} existing, ${f.new} new; Theme - ${m.existing} existing, ${m.new} new; Layers - ${u.existing} existing, ${u.new} new`
    ), we("summarizeVariablesForWizard", {
      tokens: f,
      theme: m,
      layers: u
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Summarize failed: ${n}`), Ce(
      "summarizeVariablesForWizard",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function wn(e) {
  try {
    const a = "recursica:collectionId", i = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((c) => {
        const s = c.getSharedPluginData("recursica", a);
        return {
          id: c.id,
          name: c.name,
          guid: s || void 0
        };
      })
    };
    return we(
      "getLocalVariableCollections",
      i
    );
  } catch (a) {
    return Ce(
      "getLocalVariableCollections",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function $n(e) {
  try {
    const a = "recursica:collectionId", n = [];
    for (const c of e.collectionIds)
      try {
        const s = await figma.variables.getVariableCollectionByIdAsync(c);
        if (s) {
          const o = s.getSharedPluginData(
            "recursica",
            a
          );
          n.push({
            collectionId: c,
            guid: o || null
          });
        } else
          n.push({
            collectionId: c,
            guid: null
          });
      } catch (s) {
        await t.warning(
          `Failed to get GUID for collection ${c}: ${s instanceof Error ? s.message : String(s)}`
        ), n.push({
          collectionId: c,
          guid: null
        });
      }
    return we(
      "getCollectionGuids",
      {
        collectionGuids: n
      }
    );
  } catch (a) {
    return Ce(
      "getCollectionGuids",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Sn(e) {
  try {
    await t.log("=== Starting Import Group Merge ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const n = a.getPluginData(Se);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await t.log(
      `Found metadata for component: ${i.componentName} (Version: ${i.componentVersion})`
    );
    let c = 0, s = 0;
    const o = "recursica:collectionId";
    for (const g of e.collectionChoices)
      if (g.choice === "merge")
        try {
          const b = await figma.variables.getVariableCollectionByIdAsync(
            g.newCollectionId
          );
          if (!b) {
            await t.warning(
              `New collection ${g.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let $ = null;
          if (g.existingCollectionId)
            $ = await figma.variables.getVariableCollectionByIdAsync(
              g.existingCollectionId
            );
          else {
            const E = b.getSharedPluginData(
              "recursica",
              o
            );
            if (E) {
              const V = await figma.variables.getLocalVariableCollectionsAsync();
              for (const O of V)
                if (O.getSharedPluginData(
                  "recursica",
                  o
                ) === E && O.id !== g.newCollectionId) {
                  $ = O;
                  break;
                }
              if (!$ && (E === Oe.LAYER || E === Oe.TOKENS || E === Oe.THEME)) {
                let O;
                E === Oe.LAYER ? O = Te.LAYER : E === Oe.TOKENS ? O = Te.TOKENS : O = Te.THEME;
                for (const R of V)
                  if (R.getSharedPluginData(
                    "recursica",
                    o
                  ) === E && R.name === O && R.id !== g.newCollectionId) {
                    $ = R;
                    break;
                  }
                $ || ($ = figma.variables.createVariableCollection(O), $.setSharedPluginData(
                  "recursica",
                  o,
                  E
                ), await t.log(
                  `Created new standard collection: "${O}"`
                ));
              }
            }
          }
          if (!$) {
            await t.warning(
              "Could not find or create existing collection for merge, skipping"
            );
            continue;
          }
          await t.log(
            `Merging collection "${b.name}" (${g.newCollectionId.substring(0, 8)}...) into "${$.name}" (${$.id.substring(0, 8)}...)`
          );
          const x = b.variableIds.map(
            (E) => figma.variables.getVariableByIdAsync(E)
          ), I = await Promise.all(x), B = $.variableIds.map(
            (E) => figma.variables.getVariableByIdAsync(E)
          ), T = await Promise.all(B), P = new Set(
            T.filter((E) => E !== null).map((E) => E.name)
          );
          for (const E of I)
            if (E)
              try {
                if (P.has(E.name)) {
                  await t.warning(
                    `Variable "${E.name}" already exists in collection "${$.name}", skipping`
                  );
                  continue;
                }
                const V = figma.variables.createVariable(
                  E.name,
                  $,
                  E.resolvedType
                );
                for (const O of $.modes) {
                  const R = O.modeId;
                  let v = E.valuesByMode[R];
                  if (v === void 0 && b.modes.length > 0) {
                    const G = b.modes[0].modeId;
                    v = E.valuesByMode[G];
                  }
                  v !== void 0 && V.setValueForMode(R, v);
                }
                await t.log(
                  `  ✓ Copied variable "${E.name}" to collection "${$.name}"`
                );
              } catch (V) {
                await t.warning(
                  `Failed to copy variable "${E.name}": ${V instanceof Error ? V.message : String(V)}`
                );
              }
          b.remove(), c++, await t.log(
            `✓ Merged and deleted collection: ${b.name}`
          );
        } catch (b) {
          await t.warning(
            `Failed to merge collection: ${b instanceof Error ? b.message : String(b)}`
          );
        }
      else
        s++, await t.log(`Kept collection: ${g.newCollectionId}`);
    await t.log("Removing dividers...");
    const l = figma.root.children, p = [];
    for (const g of l) {
      if (g.type !== "PAGE") continue;
      const b = g.getPluginData(Ne);
      (b === "start" || b === "end") && p.push(g);
    }
    const f = figma.currentPage;
    if (p.some((g) => g.id === f.id))
      if (a && a.id !== f.id)
        figma.currentPage = a;
      else {
        const g = l.find(
          (b) => b.type === "PAGE" && !p.some(($) => $.id === b.id)
        );
        g && (figma.currentPage = g);
      }
    const m = p.map((g) => g.name);
    for (const g of p)
      try {
        g.remove();
      } catch (b) {
        await t.warning(
          `Failed to delete divider: ${b instanceof Error ? b.message : String(b)}`
        );
      }
    for (const g of m)
      await t.log(`Deleted divider: ${g}`);
    await t.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const u = figma.root.children;
    let r = 0;
    const h = "RecursicaPublishedMetadata", d = [];
    for (const g of u)
      if (g.type === "PAGE")
        try {
          if (g.getPluginData(ue) === "true") {
            const $ = g.getPluginData(h);
            let x = {};
            if ($)
              try {
                x = JSON.parse($);
              } catch (I) {
              }
            d.push({
              pageId: g.id,
              pageName: g.name,
              pageMetadata: x
            });
          }
        } catch (b) {
          await t.warning(
            `Failed to process page: ${b instanceof Error ? b.message : String(b)}`
          );
        }
    for (const g of d)
      try {
        const b = await figma.getNodeByIdAsync(
          g.pageId
        );
        if (!b || b.type !== "PAGE") {
          await t.warning(
            `Page ${g.pageId} not found, skipping rename`
          );
          continue;
        }
        let $ = b.name;
        if ($.startsWith(Pe) && ($ = $.substring(Pe.length).trim()), $ === "REMOTES" || $.includes("REMOTES")) {
          b.name = "REMOTES", r++, await t.log(`Renamed page: "${b.name}" -> "REMOTES"`);
          continue;
        }
        const I = g.pageMetadata.name && g.pageMetadata.name.length > 0 && !g.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? g.pageMetadata.name : i.componentName || $, B = g.pageMetadata.version !== void 0 ? g.pageMetadata.version : i.componentVersion, T = `${I} (VERSION: ${B})`;
        b.name = T, r++, await t.log(`Renamed page: "${$}" -> "${T}"`);
      } catch (b) {
        await t.warning(
          `Failed to rename page ${g.pageId}: ${b instanceof Error ? b.message : String(b)}`
        );
      }
    if (await t.log("Clearing import metadata..."), a)
      try {
        a.setPluginData(Se, "");
      } catch (g) {
        await t.warning(
          `Failed to clear primary import metadata: ${g instanceof Error ? g.message : String(g)}`
        );
      }
    for (const g of d)
      try {
        const b = await figma.getNodeByIdAsync(
          g.pageId
        );
        b && b.type === "PAGE" && b.setPluginData(ue, "");
      } catch (b) {
        await t.warning(
          `Failed to clear under review metadata for page ${g.pageId}: ${b instanceof Error ? b.message : String(b)}`
        );
      }
    const y = {
      mergedCollections: c,
      keptCollections: s,
      pagesRenamed: r
    };
    return await t.log(
      `=== Merge Complete ===
  Merged: ${c} collection(s)
  Kept: ${s} collection(s)
  Renamed: ${r} page(s)`
    ), we(
      "mergeImportGroup",
      y
    );
  } catch (a) {
    return await t.error(
      `Merge failed: ${a instanceof Error ? a.message : String(a)}`
    ), Ce(
      "mergeImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function vn(e) {
  var a, n, i, c, s;
  try {
    await t.log("=== Test: itemSpacing Variable Binding ===");
    const o = await figma.getNodeByIdAsync(e);
    if (!o || o.type !== "PAGE")
      throw new Error("Test page not found");
    const l = o.children.find(
      (d) => d.type === "FRAME" && d.name === "Test"
    );
    if (!l)
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
    const u = [];
    await t.log(
      `
--- Approach 1: Set layoutMode, then immediately bind ---`
    );
    try {
      const d = figma.createFrame();
      d.name = "Test Frame 1 - Immediate Bind", l.appendChild(d), d.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), d.setBoundVariable("itemSpacing", m), await t.log(
        "  Set bound variable immediately after layoutMode"
      );
      const y = (a = d.boundVariables) == null ? void 0 : a.itemSpacing, g = d.itemSpacing, b = y !== void 0;
      await t.log(`  Result: ${b ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(y)}`), u.push({
        approach: "1 - Immediate bind after layoutMode",
        success: b,
        message: b ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: y
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 1 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), u.push({
        approach: "1 - Immediate bind after layoutMode",
        success: !1,
        message: `Error: ${d instanceof Error ? d.message : String(d)}`
      });
    }
    await t.log(
      `
--- Approach 2: Set layoutMode, clear itemSpacing, then bind ---`
    );
    try {
      const d = figma.createFrame();
      d.name = "Test Frame 2 - Clear Then Bind", l.appendChild(d), d.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
        `  itemSpacing after layoutMode: ${d.itemSpacing}`
      ), d.itemSpacing = 0, await t.log("  Set itemSpacing to 0"), d.setBoundVariable("itemSpacing", m), await t.log("  Set bound variable after clearing");
      const y = (n = d.boundVariables) == null ? void 0 : n.itemSpacing, g = d.itemSpacing, b = y !== void 0;
      await t.log(`  Result: ${b ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(y)}`), u.push({
        approach: "2 - Clear then bind",
        success: b,
        message: b ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: y
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 2 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), u.push({
        approach: "2 - Clear then bind",
        success: !1,
        message: `Error: ${d instanceof Error ? d.message : String(d)}`
      });
    }
    await t.log(
      `
--- Approach 3: Set boundVariable first, then layoutMode ---`
    );
    try {
      const d = figma.createFrame();
      d.name = "Test Frame 3 - Bind Before Layout", l.appendChild(d);
      try {
        d.setBoundVariable("itemSpacing", m), await t.log("  Set bound variable before layoutMode");
      } catch ($) {
        await t.log(
          `  Could not set bound variable before layoutMode (expected): ${$ instanceof Error ? $.message : String($)}`
        );
      }
      d.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL");
      const y = (i = d.boundVariables) == null ? void 0 : i.itemSpacing, g = d.itemSpacing, b = y !== void 0;
      await t.log(`  Result: ${b ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(y)}`), u.push({
        approach: "3 - Bind before layoutMode",
        success: b,
        message: b ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: y
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 3 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), u.push({
        approach: "3 - Bind before layoutMode",
        success: !1,
        message: `Error: ${d instanceof Error ? d.message : String(d)}`
      });
    }
    await t.log(
      `
--- Approach 4: Remove then set bound variable ---`
    );
    try {
      const d = figma.createFrame();
      d.name = "Test Frame 4 - Remove Then Bind", l.appendChild(d), d.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
        `  itemSpacing after layoutMode: ${d.itemSpacing}`
      );
      try {
        d.setBoundVariable("itemSpacing", null), await t.log("  Removed bound variable (if any)");
      } catch ($) {
        await t.log(
          `  No bound variable to remove (expected): ${$ instanceof Error ? $.message : String($)}`
        );
      }
      d.setBoundVariable("itemSpacing", m), await t.log("  Set bound variable after remove");
      const y = (c = d.boundVariables) == null ? void 0 : c.itemSpacing, g = d.itemSpacing, b = y !== void 0;
      await t.log(`  Result: ${b ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(y)}`), u.push({
        approach: "4 - Remove then bind",
        success: b,
        message: b ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: y
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 4 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), u.push({
        approach: "4 - Remove then bind",
        success: !1,
        message: `Error: ${d instanceof Error ? d.message : String(d)}`
      });
    }
    await t.log(
      `
--- Approach 5: Set layoutMode, wait, then bind ---`
    );
    try {
      const d = figma.createFrame();
      d.name = "Test Frame 5 - Wait Then Bind", l.appendChild(d), d.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await new Promise(($) => setTimeout($, 10)), await t.log("  Waited 10ms"), d.setBoundVariable("itemSpacing", m), await t.log("  Set bound variable after wait");
      const y = (s = d.boundVariables) == null ? void 0 : s.itemSpacing, g = d.itemSpacing, b = y !== void 0;
      await t.log(`  Result: ${b ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(y)}`), u.push({
        approach: "5 - Wait then bind",
        success: b,
        message: b ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: y
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 5 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), u.push({
        approach: "5 - Wait then bind",
        success: !1,
        message: `Error: ${d instanceof Error ? d.message : String(d)}`
      });
    }
    await t.log(`
=== Test Summary ===`);
    const r = u.filter((d) => d.success), h = u.filter((d) => !d.success);
    await t.log(
      `Successful approaches: ${r.length}/${u.length}`
    );
    for (const d of u)
      await t.log(
        `  ${d.approach}: ${d.success ? "✓ SUCCESS" : "✗ FAILED"} - ${d.message}`
      );
    return {
      success: r.length > 0,
      message: `Test completed: ${r.length}/${u.length} approaches succeeded`,
      details: {
        results: u,
        successfulApproaches: r.map((d) => d.approach),
        failedApproaches: h.map((d) => d.approach)
      }
    };
  } catch (o) {
    const l = o instanceof Error ? o.message : "Unknown error occurred";
    return await t.error(`Test failed: ${l}`), {
      success: !1,
      message: `Test error: ${l}`
    };
  }
}
async function En(e) {
  var a, n, i, c, s, o, l, p;
  try {
    await t.log(
      "=== Test: itemSpacing Variable Binding - Import Simulation ==="
    );
    const f = await figma.getNodeByIdAsync(e);
    if (!f || f.type !== "PAGE")
      throw new Error("Test page not found");
    const m = f.children.find(
      (j) => j.type === "FRAME" && j.name === "Test"
    );
    if (!m)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const u = figma.variables.createVariableCollection("Test"), r = u.modes[0], h = figma.variables.createVariable(
      "Spacing",
      u,
      "FLOAT"
    );
    h.setValueForMode(r.modeId, 16), await t.log(
      `Created variable: "${h.name}" = ${h.valuesByMode[r.modeId]} in collection "${u.name}"`
    ), await t.log(`
--- Simulating Import Process ---`);
    const d = figma.createFrame();
    d.name = "Import Simulation Frame", m.appendChild(d), await t.log("  Created frame"), d.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
      `  itemSpacing after layoutMode: ${d.itemSpacing}`
    ), await t.log(
      "  Setting bound variable using setBoundVariable() API..."
    );
    try {
      d.setBoundVariable("itemSpacing", null);
    } catch (j) {
    }
    d.setBoundVariable("itemSpacing", h), await t.log(
      "  Called setBoundVariable('itemSpacing', variable)"
    );
    const y = (a = d.boundVariables) == null ? void 0 : a.itemSpacing, g = d.itemSpacing;
    if (await t.log(
      `  After setting binding: itemSpacing=${g}, boundVar=${JSON.stringify(y)}`
    ), !y)
      return {
        success: !1,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: g,
          boundVariable: y
        }
      };
    await t.log("  Setting other layout properties..."), d.primaryAxisSizingMode = "AUTO", d.counterAxisSizingMode = "AUTO", d.primaryAxisAlignItems = "MIN", d.counterAxisAlignItems = "MIN", await t.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems"
    );
    const b = (n = d.boundVariables) == null ? void 0 : n.itemSpacing, $ = d.itemSpacing;
    await t.log(
      `  After layout properties: itemSpacing=${$}, boundVar=${JSON.stringify(b)}`
    ), await t.log("  Setting padding properties..."), d.paddingLeft = 0, d.paddingRight = 0, d.paddingTop = 0, d.paddingBottom = 0, await t.log("  Set padding to 0");
    const x = (i = d.boundVariables) == null ? void 0 : i.itemSpacing, I = d.itemSpacing;
    await t.log(
      `  After padding: itemSpacing=${I}, boundVar=${JSON.stringify(x)}`
    ), await t.log("  Simulating 'late setting' code...");
    const B = 0, T = !0, P = { itemSpacing: !0 }, E = ((c = d.boundVariables) == null ? void 0 : c.itemSpacing) !== void 0;
    B !== void 0 && d.layoutMode !== void 0 && (!E && (!T || !P.itemSpacing) || E && await t.log(
      "  ✓ Late setting correctly skipped (binding exists)"
    ));
    const V = (s = d.boundVariables) == null ? void 0 : s.itemSpacing, O = d.itemSpacing;
    await t.log(
      `  After late setting: itemSpacing=${O}, boundVar=${JSON.stringify(V)}`
    ), await t.log("  Appending children (might reset itemSpacing)...");
    const R = figma.createFrame();
    R.name = "Child 1", R.resize(50, 50), d.appendChild(R);
    const v = figma.createFrame();
    v.name = "Child 2", v.resize(50, 50), d.appendChild(v), await t.log("  Appended 2 children");
    const G = (o = d.boundVariables) == null ? void 0 : o.itemSpacing, S = d.itemSpacing;
    await t.log(
      `  After appending children: itemSpacing=${S}, boundVar=${JSON.stringify(G)}`
    ), await t.log("  Simulating 'FINAL FIX' code..."), ((l = d.boundVariables) == null ? void 0 : l.itemSpacing) !== void 0 ? await t.log(
      "  ✓ FINAL FIX correctly skipped (binding exists)"
    ) : !0 && await t.log(
      "  ⚠️ FINAL FIX: Binding should exist but doesn't!"
    );
    const H = (p = d.boundVariables) == null ? void 0 : p.itemSpacing, ee = d.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${ee}, boundVar=${JSON.stringify(H)}`
    );
    const Y = H !== void 0 && H.id === h.id;
    return await t.log(`
=== Import Simulation Summary ===`), await t.log(
      `Result: ${Y ? "SUCCESS" : "FAILED"} - Binding ${Y ? "survived" : "was lost"} through import simulation`
    ), {
      success: Y,
      message: Y ? "Variable binding survived the import simulation" : "Variable binding was lost during import simulation",
      details: {
        afterSet: {
          itemSpacing: g,
          boundVariable: y
        },
        afterLayout: {
          itemSpacing: $,
          boundVariable: b
        },
        afterPadding: {
          itemSpacing: I,
          boundVariable: x
        },
        afterLate: {
          itemSpacing: O,
          boundVariable: V
        },
        afterChildren: {
          itemSpacing: S,
          boundVariable: G
        },
        final: {
          itemSpacing: ee,
          boundVariable: H
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
async function Nn(e) {
  var a, n, i, c;
  try {
    await t.log(
      "=== Test: itemSpacing Variable Binding - FAILURE DEMONSTRATION ==="
    ), await t.log(
      "This test demonstrates the OLD BROKEN approach that was causing the issue."
    );
    const s = await figma.getNodeByIdAsync(e);
    if (!s || s.type !== "PAGE")
      throw new Error("Test page not found");
    const o = s.children.find(
      (T) => T.type === "FRAME" && T.name === "Test"
    );
    if (!o)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const l = figma.variables.createVariableCollection("Test"), p = l.modes[0], f = figma.variables.createVariable(
      "Spacing",
      l,
      "FLOAT"
    );
    f.setValueForMode(p.modeId, 16), await t.log(
      `Created variable: "${f.name}" = ${f.valuesByMode[p.modeId]} in collection "${l.name}"`
    ), await t.log(`
--- Simulating OLD BROKEN Import Process ---`);
    const m = figma.createFrame();
    m.name = "Failure Demo Frame", o.appendChild(m), await t.log("  Created frame"), m.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
      `  itemSpacing after layoutMode: ${m.itemSpacing}`
    ), await t.log(
      "  ⚠️ BROKEN: Attempting to set bound variable using direct assignment..."
    );
    try {
      m.boundVariables = $e(ne({}, m.boundVariables || {}), {
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
    const u = (a = m.boundVariables) == null ? void 0 : a.itemSpacing, r = m.itemSpacing;
    await t.log(
      `  After broken set: itemSpacing=${r}, boundVar=${JSON.stringify(u)}`
    ), await t.log(
      "  Attempting to fix by using setBoundVariable() API..."
    );
    try {
      m.setBoundVariable("itemSpacing", f), await t.log(
        "  Called setBoundVariable('itemSpacing', variable)"
      );
    } catch (T) {
      await t.log(
        `  setBoundVariable failed: ${T instanceof Error ? T.message : String(T)}`
      );
    }
    const h = (n = m.boundVariables) == null ? void 0 : n.itemSpacing, d = m.itemSpacing;
    await t.log(
      `  After correct set: itemSpacing=${d}, boundVar=${JSON.stringify(h)}`
    ), await t.log(
      "  ⚠️ BROKEN: Simulating 'late setting' code WITHOUT checking if bound..."
    );
    const y = 0;
    y !== void 0 && m.layoutMode !== void 0 && (await t.log(
      "  ⚠️ Late setting OVERRIDING itemSpacing without checking if bound!"
    ), m.itemSpacing = y);
    const g = (i = m.boundVariables) == null ? void 0 : i.itemSpacing, b = m.itemSpacing;
    await t.log(
      `  After broken late setting: itemSpacing=${b}, boundVar=${JSON.stringify(g)}`
    ), await t.log(
      "  ⚠️ BROKEN: Simulating 'FINAL FIX' code WITHOUT checking if bound..."
    );
    const $ = 0;
    (m.layoutMode === "VERTICAL" || m.layoutMode === "HORIZONTAL") && $ !== void 0 && (await t.log(
      "  ⚠️ FINAL FIX OVERRIDING itemSpacing without checking if bound!"
    ), m.itemSpacing = $);
    const x = (c = m.boundVariables) == null ? void 0 : c.itemSpacing, I = m.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${I}, boundVar=${JSON.stringify(x)}`
    );
    const B = x === void 0;
    return await t.log(`
=== Failure Demonstration Summary ===`), await t.log(
      `Result: ${B ? "FAILURE DEMONSTRATED ✓" : "UNEXPECTED - Binding survived"} - ${B ? "Binding was lost as expected (demonstrating the bug)" : "Binding survived (unexpected - bug may be fixed)"}`
    ), {
      success: B,
      // Success = we demonstrated the failure
      message: B ? "Failure demonstrated: Binding was lost using old broken approach" : "Unexpected: Binding survived (bug may already be fixed)",
      details: {
        afterBrokenSet: {
          itemSpacing: r,
          boundVariable: u
        },
        afterCorrectSet: {
          itemSpacing: d,
          boundVariable: h
        },
        afterLate: {
          itemSpacing: b,
          boundVariable: g
        },
        final: {
          itemSpacing: I,
          boundVariable: x
        },
        bindingLost: B
      }
    };
  } catch (s) {
    const o = s instanceof Error ? s.message : "Unknown error occurred";
    return await t.error(
      `Failure demonstration test failed: ${o}`
    ), {
      success: !1,
      message: `Test error: ${o}`
    };
  }
}
async function Cn(e) {
  var a, n, i, c, s, o, l, p;
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
      (j) => j.type === "FRAME" && j.name === "Test"
    );
    if (!m)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const u = figma.variables.createVariableCollection("Test"), r = u.modes[0], h = figma.variables.createVariable(
      "Spacing",
      u,
      "FLOAT"
    );
    h.setValueForMode(r.modeId, 16), await t.log(
      `Created variable: "${h.name}" = ${h.valuesByMode[r.modeId]} in collection "${u.name}"`
    ), await t.log(`
--- Simulating NEW FIXED Import Process ---`);
    const d = figma.createFrame();
    d.name = "Fix Demo Frame", m.appendChild(d), await t.log("  Created frame"), d.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), await t.log(
      `  itemSpacing after layoutMode: ${d.itemSpacing}`
    ), await t.log(
      "  ✓ FIXED: Setting bound variable using setBoundVariable() API..."
    );
    try {
      d.setBoundVariable("itemSpacing", null);
    } catch (j) {
    }
    d.setBoundVariable("itemSpacing", h), await t.log(
      "  Called setBoundVariable('itemSpacing', variable) (CORRECT APPROACH)"
    );
    const y = (a = d.boundVariables) == null ? void 0 : a.itemSpacing, g = d.itemSpacing;
    if (await t.log(
      `  After setting binding: itemSpacing=${g}, boundVar=${JSON.stringify(y)}`
    ), !y)
      return {
        success: !1,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: g,
          boundVariable: y
        }
      };
    await t.log("  Setting other layout properties..."), d.primaryAxisSizingMode = "AUTO", d.counterAxisSizingMode = "AUTO", d.primaryAxisAlignItems = "MIN", d.counterAxisAlignItems = "MIN", await t.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems"
    );
    const b = (n = d.boundVariables) == null ? void 0 : n.itemSpacing, $ = d.itemSpacing;
    await t.log(
      `  After layout properties: itemSpacing=${$}, boundVar=${JSON.stringify(b)}`
    ), await t.log("  Setting padding properties..."), d.paddingLeft = 0, d.paddingRight = 0, d.paddingTop = 0, d.paddingBottom = 0, await t.log("  Set padding to 0");
    const x = (i = d.boundVariables) == null ? void 0 : i.itemSpacing, I = d.itemSpacing;
    await t.log(
      `  After padding: itemSpacing=${I}, boundVar=${JSON.stringify(x)}`
    ), await t.log(
      "  ✓ FIXED: Simulating 'late setting' code WITH check if bound..."
    );
    const B = 0, T = !0, P = { itemSpacing: !0 }, E = ((c = d.boundVariables) == null ? void 0 : c.itemSpacing) !== void 0;
    B !== void 0 && d.layoutMode !== void 0 && (!E && (!T || !P.itemSpacing) || E && await t.log(
      "  ✓ Late setting correctly skipped (binding exists) - FIXED!"
    ));
    const V = (s = d.boundVariables) == null ? void 0 : s.itemSpacing, O = d.itemSpacing;
    await t.log(
      `  After fixed late setting: itemSpacing=${O}, boundVar=${JSON.stringify(V)}`
    ), await t.log("  Appending children (might reset itemSpacing)...");
    const R = figma.createFrame();
    R.name = "Child 1", R.resize(50, 50), d.appendChild(R);
    const v = figma.createFrame();
    v.name = "Child 2", v.resize(50, 50), d.appendChild(v), await t.log("  Appended 2 children");
    const G = (o = d.boundVariables) == null ? void 0 : o.itemSpacing, S = d.itemSpacing;
    await t.log(
      `  After appending children: itemSpacing=${S}, boundVar=${JSON.stringify(G)}`
    ), await t.log(
      "  ✓ FIXED: Simulating 'FINAL FIX' code WITH check if bound..."
    );
    const N = ((l = d.boundVariables) == null ? void 0 : l.itemSpacing) !== void 0, U = 0;
    (d.type === "FRAME" || d.type === "COMPONENT" || d.type === "INSTANCE") && (d.layoutMode === "VERTICAL" || d.layoutMode === "HORIZONTAL") && U !== void 0 && (N ? await t.log(
      "  ✓ FINAL FIX correctly skipped (binding exists) - FIXED!"
    ) : (await t.log(
      "  FINAL FIX would set direct value (but binding doesn't exist, so OK)"
    ), d.itemSpacing = U));
    const H = (p = d.boundVariables) == null ? void 0 : p.itemSpacing, ee = d.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${ee}, boundVar=${JSON.stringify(H)}`
    );
    const Y = H !== void 0 && H.id === h.id;
    return await t.log(`
=== Fix Demonstration Summary ===`), await t.log(
      `Result: ${Y ? "SUCCESS ✓" : "FAILED ✗"} - Binding ${Y ? "survived" : "was lost"} through fixed import simulation`
    ), {
      success: Y,
      message: Y ? "Fix demonstrated: Binding survived using new fixed approach" : "Fix failed: Binding was lost (unexpected)",
      details: {
        afterSet: {
          itemSpacing: g,
          boundVariable: y
        },
        afterLayout: {
          itemSpacing: $,
          boundVariable: b
        },
        afterPadding: {
          itemSpacing: I,
          boundVariable: x
        },
        afterLate: {
          itemSpacing: O,
          boundVariable: V
        },
        afterChildren: {
          itemSpacing: S,
          boundVariable: G
        },
        final: {
          itemSpacing: ee,
          boundVariable: H
        },
        bindingSurvived: Y
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
async function An(e) {
  var a, n, i, c, s, o, l, p, f, m, u, r;
  try {
    await t.log(
      "=== Test: Constraints Import/Export (Issue #4) ==="
    );
    const h = await figma.getNodeByIdAsync(e);
    if (!h || h.type !== "PAGE")
      throw new Error("Test page not found");
    const d = h.children.find(
      (U) => U.type === "FRAME" && U.name === "Test"
    );
    if (!d)
      throw new Error("Test frame container not found on page");
    await t.log(
      `
--- Step 1: Create frame with SCALE constraints ---`
    );
    const y = figma.createFrame();
    y.name = "Original Frame - SCALE Constraints", y.resize(100, 100), d.appendChild(y), await t.log(
      "  Setting constraints using constraints object API..."
    );
    try {
      y.constraints = {
        horizontal: "SCALE",
        vertical: "SCALE"
      }, await t.log("  ✓ Set constraints using constraints object");
    } catch (U) {
      const H = U instanceof Error ? U.message : String(U);
      throw await t.warning(
        `  ✗ Failed to set constraints: ${H}`
      ), new Error(`Failed to set constraints on frame: ${H}`);
    }
    const g = (a = y.constraints) == null ? void 0 : a.horizontal, b = (n = y.constraints) == null ? void 0 : n.vertical;
    if (await t.log(
      `  Original constraints: H=${g}, V=${b}`
    ), g !== "SCALE" || b !== "SCALE")
      throw new Error(
        `Failed to set SCALE constraints. Got H=${g}, V=${b}`
      );
    const $ = (i = y.constraints) == null ? void 0 : i.horizontal, x = (c = y.constraints) == null ? void 0 : c.vertical;
    if (await t.log(
      `  Original constraints: H=${$}, V=${x}`
    ), $ !== "SCALE" || x !== "SCALE")
      return {
        success: !1,
        message: "Failed to set SCALE constraints on original frame",
        details: {
          constraintHorizontal: $,
          constraintVertical: x
        }
      };
    await t.log(
      `
--- Step 2: Simulate Export (read constraints) ---`
    );
    const I = (s = y.constraints) == null ? void 0 : s.horizontal, B = (o = y.constraints) == null ? void 0 : o.vertical;
    await t.log(
      `  Exported constraints: H=${I}, V=${B}`
    );
    const T = {
      type: "FRAME",
      name: "Imported Frame - Should Have SCALE",
      width: 100,
      height: 100,
      constraintHorizontal: I,
      constraintVertical: B
    };
    await t.log(
      `
--- Step 3: Simulate Import (create frame and set constraints) ---`
    );
    const P = figma.createFrame();
    P.name = "Imported Frame - SCALE Constraints", P.resize(T.width, T.height), d.appendChild(P);
    const E = (l = P.constraints) == null ? void 0 : l.horizontal, V = (p = P.constraints) == null ? void 0 : p.vertical;
    await t.log(
      `  Constraints before setting: H=${E}, V=${V} (expected: MIN, MIN)`
    ), P.constraints = {
      horizontal: I,
      vertical: B
    }, await t.log(
      `  Set constraints using constraints object: H=${I}, V=${B}`
    ), await t.log(`
--- Step 4: Verify Imported Constraints ---`);
    const O = (f = P.constraints) == null ? void 0 : f.horizontal, R = (m = P.constraints) == null ? void 0 : m.vertical;
    await t.log(
      `  Imported constraints: H=${O}, V=${R}`
    ), await t.log("  Expected constraints: H=SCALE, V=SCALE");
    const v = O === "SCALE" && R === "SCALE";
    v ? await t.log("  ✓ Constraints correctly imported as SCALE") : await t.warning(
      `  ⚠️ Constraints mismatch! Expected SCALE, got H=${O}, V=${R}`
    ), await t.log(`
--- Step 5: Test Other Constraint Values ---`);
    const G = [
      { h: "MIN", v: "MIN", name: "MIN/MIN" },
      { h: "CENTER", v: "CENTER", name: "CENTER/CENTER" },
      { h: "MAX", v: "MAX", name: "MAX/MAX" },
      { h: "STRETCH", v: "STRETCH", name: "STRETCH/STRETCH" }
    ], S = [];
    for (const U of G) {
      const H = figma.createFrame();
      H.name = `Test Frame - ${U.name}`, H.resize(50, 50), d.appendChild(H), H.constraints = {
        horizontal: U.h,
        vertical: U.v
      };
      const ee = (u = H.constraints) == null ? void 0 : u.horizontal, Y = (r = H.constraints) == null ? void 0 : r.vertical, j = ee === U.h && Y === U.v;
      S.push({
        name: U.name,
        success: j,
        details: {
          expected: { h: U.h, v: U.v },
          actual: { h: ee, v: Y }
        }
      }), j ? await t.log(
        `  ✓ ${U.name}: Correctly set to H=${ee}, V=${Y}`
      ) : await t.warning(
        `  ⚠️ ${U.name}: Expected H=${U.h}, V=${U.v}, got H=${ee}, V=${Y}`
      );
    }
    const N = S.every((U) => U.success);
    return {
      success: v && N,
      message: v && N ? "Constraints correctly exported and imported (SCALE preserved)" : `Constraints test failed: SCALE=${v ? "PASS" : "FAIL"}, Other values=${N ? "PASS" : "FAIL"}`,
      details: {
        original: {
          constraintHorizontal: $,
          constraintVertical: x
        },
        exported: {
          constraintHorizontal: I,
          constraintVertical: B
        },
        imported: {
          constraintHorizontal: O,
          constraintVertical: R
        },
        otherValues: S,
        allTestsPassed: v && N
      }
    };
  } catch (h) {
    const d = h instanceof Error ? h.message : "Unknown error occurred";
    return await t.error(`Constraints test failed: ${d}`), {
      success: !1,
      message: `Test error: ${d}`
    };
  }
}
async function In(e) {
  var a, n, i, c;
  try {
    await t.log(
      "=== Test: Constraints on VECTOR in COMPONENT (FAILURE CASE) ==="
    );
    const s = await figma.getNodeByIdAsync(e);
    if (!s || s.type !== "PAGE")
      throw new Error("Test page not found");
    const o = s.children.find(
      (g) => g.type === "FRAME" && g.name === "Test"
    );
    if (!o)
      throw new Error("Test frame container not found on page");
    await t.log(
      `
--- Step 1: Create COMPONENT (parent for VECTOR) ---`
    );
    const l = figma.createComponent();
    l.name = "Test Component - Vector Constraints", l.resize(100, 100), o.appendChild(l), await t.log("  Created COMPONENT"), await t.log(
      `
--- Step 2: Create VECTOR as child of COMPONENT ---`
    );
    const p = figma.createVector();
    p.name = "Test Vector - Should Have SCALE Constraints", l.appendChild(p), await t.log("  Created VECTOR and appended to COMPONENT"), await t.log(
      `
--- Step 3: Set vectorPaths and size (simulating import) ---`
    ), p.vectorPaths = [
      {
        windingRule: "NONZERO",
        data: "M 0 0 L 50 0 L 50 50 L 0 50 Z"
      }
    ], p.resize(50, 50), await t.log("  Set vectorPaths and size"), await t.log(
      `
--- Step 4: Try to set constraints (AFTER vectorPaths/size) ---`
    ), await t.log(
      "  This simulates setting constraints after the node is fully created"
    ), await t.log(
      "  Using constraints object API (should work even after appending to COMPONENT)"
    );
    let f = !1, m = !1, u, r;
    try {
      p.constraints = {
        horizontal: "SCALE",
        vertical: "SCALE"
      };
      const g = (a = p.constraints) == null ? void 0 : a.horizontal, b = (n = p.constraints) == null ? void 0 : n.vertical;
      g === "SCALE" && b === "SCALE" ? (f = !0, m = !0, await t.log(
        "  ✓ Constraints set successfully using constraints object (unexpected - should have failed with old approach)"
      )) : await t.warning(
        `  ⚠️ Constraints set but values are H=${g || "undefined"}, V=${b || "undefined"}`
      );
    } catch (g) {
      u = g instanceof Error ? g.message : String(g), r = u, await t.warning(
        `  ✗ Failed to set constraints: ${u}`
      );
    }
    await t.log(`
--- Step 5: Verify Final State ---`);
    const h = (i = p.constraints) == null ? void 0 : i.horizontal, d = (c = p.constraints) == null ? void 0 : c.vertical;
    await t.log(
      `  Final constraints: H=${h || "undefined"}, V=${d || "undefined"}`
    );
    const y = f && m && h === "SCALE" && d === "SCALE";
    return y ? await t.log(
      "  ✓ Constraints successfully set using constraints object API (even after appending to COMPONENT)"
    ) : await t.warning(
      `  ⚠️ Constraints could not be set. H=${h || "undefined"}, V=${d || "undefined"}`
    ), {
      success: y,
      message: y ? "Constraints successfully set on VECTOR in COMPONENT using constraints object API (even after appending)" : "Failed to set constraints on VECTOR in COMPONENT",
      details: {
        constraintHSet: f,
        constraintVSet: m,
        constraintHError: u,
        constraintVError: r,
        finalConstraintH: h,
        finalConstraintV: d,
        success: y
      }
    };
  } catch (s) {
    const o = s instanceof Error ? s.message : "Unknown error occurred";
    return await t.error(
      `Constraints vector in component failure test error: ${o}`
    ), {
      success: !1,
      message: `Test error: ${o}`
    };
  }
}
async function Tn(e) {
  var a, n, i, c;
  try {
    await t.log(
      "=== Test: Constraints on VECTOR in COMPONENT (FIX CASE) ==="
    );
    const s = await figma.getNodeByIdAsync(e);
    if (!s || s.type !== "PAGE")
      throw new Error("Test page not found");
    const o = s.children.find(
      (g) => g.type === "FRAME" && g.name === "Test"
    );
    if (!o)
      throw new Error("Test frame container not found on page");
    await t.log(
      `
--- Step 1: Create COMPONENT (parent for VECTOR) ---`
    );
    const l = figma.createComponent();
    l.name = "Test Component - Vector Constraints (Fixed)", l.resize(100, 100), o.appendChild(l), await t.log("  Created COMPONENT"), await t.log(
      `
--- Step 2: Create VECTOR (NOT appended yet) ---`
    );
    const p = figma.createVector();
    p.name = "Test Vector - SCALE Constraints (Fixed)", await t.log("  Created VECTOR (not yet appended to COMPONENT)"), await t.log(
      `
--- Step 3: Set vectorPaths FIRST (required before constraints) ---`
    ), p.vectorPaths = [
      {
        windingRule: "NONZERO",
        data: "M 0 0 L 50 0 L 50 50 L 0 50 Z"
      }
    ], await t.log("  Set vectorPaths"), await t.log(
      `
--- Step 4: Set size (after vectorPaths, before constraints) ---`
    ), p.resize(50, 50), await t.log("  Set size to 50x50"), await t.log(
      `
--- Step 5: Append VECTOR to COMPONENT (before setting constraints) ---`
    ), await t.log(
      "  NOTE: Testing if constraints can be set after appending (alternative approach)"
    ), l.appendChild(p), await t.log("  Appended VECTOR to COMPONENT"), await t.log(
      `
--- Step 6: Try to set constraints AFTER appending (FIX ATTEMPT) ---`
    ), await t.log(
      "  This tests if constraints can be set after the node is in the tree"
    );
    let f = !1, m = !1, u, r;
    try {
      p.constraints = {
        horizontal: "SCALE",
        vertical: "SCALE"
      };
      const g = (a = p.constraints) == null ? void 0 : a.horizontal, b = (n = p.constraints) == null ? void 0 : n.vertical;
      g === "SCALE" && b === "SCALE" ? (f = !0, m = !0, await t.log(
        "  ✓ Constraints set successfully using constraints object: H=SCALE, V=SCALE"
      )) : await t.warning(
        `  ⚠️ Constraints set but values are H=${g || "undefined"}, V=${b || "undefined"} (expected SCALE)`
      );
    } catch (g) {
      u = g instanceof Error ? g.message : String(g), r = u, await t.warning(
        `  ✗ Failed to set constraints: ${u}`
      );
    }
    await t.log(`
--- Step 7: Verify constraints are set ---`);
    const h = (i = p.constraints) == null ? void 0 : i.horizontal, d = (c = p.constraints) == null ? void 0 : c.vertical;
    await t.log(
      `  Final constraints: H=${h || "undefined"}, V=${d || "undefined"}`
    ), await t.log("  Expected: H=SCALE, V=SCALE");
    const y = f && m && h === "SCALE" && d === "SCALE";
    return y ? await t.log(
      "  ✓ Constraints correctly set and preserved through all operations"
    ) : await t.warning(
      `  ⚠️ Constraints test failed! Expected SCALE/SCALE, got H=${h || "undefined"}, V=${d || "undefined"}`
    ), {
      success: y,
      message: y ? "Constraints correctly set on VECTOR in COMPONENT when set immediately after creation" : "Failed to set constraints on VECTOR in COMPONENT",
      details: {
        constraintHSet: f,
        constraintVSet: m,
        constraintHError: u,
        constraintVError: r,
        finalConstraintH: h,
        finalConstraintV: d,
        success: y
      }
    };
  } catch (s) {
    const o = s instanceof Error ? s.message : "Unknown error occurred";
    return await t.error(
      `Constraints vector in component fix test error: ${o}`
    ), {
      success: !1,
      message: `Test error: ${o}`
    };
  }
}
async function Pn(e) {
  var a, n, i, c;
  try {
    await t.log(
      "=== Test: Constraints on Standalone VECTOR (not in COMPONENT) ==="
    );
    const s = await figma.getNodeByIdAsync(e);
    if (!s || s.type !== "PAGE")
      throw new Error("Test page not found");
    const o = s.children.find(
      (y) => y.type === "FRAME" && y.name === "Test"
    );
    if (!o)
      throw new Error("Test frame container not found on page");
    await t.log(
      `
--- Step 1: Create standalone VECTOR (not in COMPONENT) ---`
    );
    const l = figma.createVector();
    l.name = "Test Vector - Standalone", await t.log("  Created VECTOR (standalone, not in COMPONENT)"), await t.log(`
--- Step 2: Set vectorPaths and size ---`), l.vectorPaths = [
      {
        windingRule: "NONZERO",
        data: "M 0 0 L 50 0 L 50 50 L 0 50 Z"
      }
    ], l.resize(50, 50), await t.log("  Set vectorPaths and size"), await t.log(
      `
--- Step 3: Append VECTOR to testFrame (not COMPONENT) ---`
    ), o.appendChild(l), await t.log("  Appended VECTOR to testFrame"), await t.log(
      `
--- Step 4: Try to set constraints on standalone VECTOR ---`
    ), await t.log(
      "  Testing multiple approaches: constraints object, then direct properties"
    );
    let p = !1, f = !1, m, u;
    await t.log(
      "  Attempting to set constraints using constraints object API..."
    );
    try {
      l.constraints = {
        horizontal: "SCALE",
        vertical: "SCALE"
      };
      const y = (a = l.constraints) == null ? void 0 : a.horizontal, g = (n = l.constraints) == null ? void 0 : n.vertical;
      y === "SCALE" && g === "SCALE" ? (p = !0, f = !0, await t.log(
        "  ✓ Constraints set successfully via constraints object: H=SCALE, V=SCALE"
      )) : await t.warning(
        `  ⚠️ Constraints set but values are H=${y || "undefined"}, V=${g || "undefined"}`
      );
    } catch (y) {
      m = y instanceof Error ? y.message : String(y), u = m, await t.warning(
        `  ✗ Failed to set constraints: ${m}`
      );
    }
    await t.log(`
--- Step 5: Verify Final State ---`);
    const r = (i = l.constraints) == null ? void 0 : i.horizontal, h = (c = l.constraints) == null ? void 0 : c.vertical;
    await t.log(
      `  Final constraints: H=${r || "undefined"}, V=${h || "undefined"}`
    );
    const d = p && f && r === "SCALE" && h === "SCALE";
    return d ? (await t.log(
      "  ✓ Constraints can be set on standalone VECTOR nodes"
    ), await t.log(
      "  → This suggests the issue is specific to VECTOR nodes in COMPONENTs"
    )) : (await t.warning(
      "  ⚠️ Constraints cannot be set on standalone VECTOR nodes either"
    ), await t.warning(
      "  → This suggests VECTOR nodes may not support constraints at all, or there's a different issue"
    )), {
      success: d,
      message: d ? "Constraints can be set on standalone VECTOR nodes (issue is specific to COMPONENT children)" : "Constraints cannot be set on standalone VECTOR nodes (may be a general limitation)",
      details: {
        constraintHSet: p,
        constraintVSet: f,
        constraintHError: m,
        constraintVError: u,
        finalConstraintH: r,
        finalConstraintV: h,
        success: d
      }
    };
  } catch (s) {
    const o = s instanceof Error ? s.message : "Unknown error occurred";
    return await t.error(
      `Constraints standalone vector test error: ${o}`
    ), {
      success: !1,
      message: `Test error: ${o}`
    };
  }
}
async function Vn(e) {
  try {
    await t.log("=== Starting Test ==="), await figma.loadAllPagesAsync();
    let n = figma.root.children.find(
      (V) => V.type === "PAGE" && V.name === "Test"
    );
    n ? await t.log('Found existing "Test" page') : (n = figma.createPage(), n.name = "Test", await t.log('Created "Test" page')), await figma.setCurrentPageAsync(n);
    const i = n.children.find(
      (V) => V.type === "FRAME" && V.name === "Test"
    );
    i && (await t.log(
      'Found existing "Test" frame, deleting it and all children...'
    ), i.remove(), await t.log('Deleted existing "Test" frame'));
    const c = figma.createFrame();
    c.name = "Test", n.appendChild(c), await t.log('Created new "Test" frame container');
    const s = [];
    await t.log(`
` + "=".repeat(60)), await t.log("TEST 1: Original 5 Approaches"), await t.log("=".repeat(60));
    const o = await vn(n.id);
    s.push({
      name: "Original 5 Approaches",
      success: o.success,
      message: o.message,
      details: o.details
    }), c.remove();
    const l = figma.createFrame();
    l.name = "Test", n.appendChild(l), await t.log(`
` + "=".repeat(60)), await t.log("TEST 2: Import Simulation"), await t.log("=".repeat(60));
    const p = await En(
      n.id
    );
    s.push({
      name: "Import Simulation",
      success: p.success,
      message: p.message,
      details: p.details
    }), l.remove();
    const f = figma.createFrame();
    f.name = "Test", n.appendChild(f), await t.log(`
` + "=".repeat(60)), await t.log(
      "TEST 3: Failure Demonstration (Old Broken Approach)"
    ), await t.log("=".repeat(60));
    const m = await Nn(
      n.id
    );
    s.push({
      name: "Failure Demonstration",
      success: m.success,
      message: m.message,
      details: m.details
    }), f.remove();
    const u = figma.createFrame();
    u.name = "Test", n.appendChild(u), await t.log(`
` + "=".repeat(60)), await t.log("TEST 4: Fix Demonstration (New Fixed Approach)"), await t.log("=".repeat(60));
    const r = await Cn(n.id);
    s.push({
      name: "Fix Demonstration",
      success: r.success,
      message: r.message,
      details: r.details
    }), u.remove();
    const h = figma.createFrame();
    h.name = "Test", n.appendChild(h), await t.log(`
` + "=".repeat(60)), await t.log("TEST 5: Constraints Import/Export (Issue #4)"), await t.log("=".repeat(60));
    const d = await An(n.id);
    s.push({
      name: "Constraints Import/Export",
      success: d.success,
      message: d.message,
      details: d.details
    }), h.remove();
    const y = figma.createFrame();
    y.name = "Test", n.appendChild(y), await t.log(`
` + "=".repeat(60)), await t.log(
      "TEST 6: Constraints on VECTOR in COMPONENT (FAILURE CASE)"
    ), await t.log("=".repeat(60));
    const g = await In(
      n.id
    );
    s.push({
      name: "Constraints VECTOR in COMPONENT (Failure)",
      success: g.success,
      message: g.message,
      details: g.details
    }), y.remove();
    const b = figma.createFrame();
    b.name = "Test", n.appendChild(b), await t.log(`
` + "=".repeat(60)), await t.log(
      "TEST 7: Constraints on VECTOR in COMPONENT (FIX CASE)"
    ), await t.log("=".repeat(60));
    const $ = await Tn(n.id);
    s.push({
      name: "Constraints VECTOR in COMPONENT (Fix)",
      success: $.success,
      message: $.message,
      details: $.details
    }), b.remove();
    const x = figma.createFrame();
    x.name = "Test", n.appendChild(x), await t.log(`
` + "=".repeat(60)), await t.log(
      "TEST 8: Constraints on Standalone VECTOR (not in COMPONENT)"
    ), await t.log("=".repeat(60));
    const I = await Pn(n.id);
    s.push({
      name: "Constraints VECTOR Standalone",
      success: I.success,
      message: I.message,
      details: I.details
    }), await t.log(`
` + "=".repeat(60)), await t.log("=== ALL TESTS COMPLETE ==="), await t.log("=".repeat(60));
    const B = s.filter((V) => V.success), T = s.filter((V) => !V.success);
    await t.log(
      `Total: ${s.length} | Passed: ${B.length} | Failed: ${T.length}`
    );
    for (const V of s)
      await t.log(
        `  ${V.success ? "✓" : "✗"} ${V.name}: ${V.message}`
      );
    const E = {
      testResults: {
        success: o.success && p.success && m.success && // This "success" means we demonstrated the failure
        r.success && d.success && g.success && // This "success" means we demonstrated the failure
        $.success && I.success,
        message: `All tests completed: ${B.length}/${s.length} passed`,
        details: {
          summary: {
            total: s.length,
            passed: B.length,
            failed: T.length
          },
          tests: s
        }
      },
      allTests: s
    };
    return we("runTest", E);
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Test failed: ${n}`), Ce("runTest", n);
  }
}
const On = {
  getCurrentUser: ea,
  loadPages: ta,
  exportPage: Fe,
  importPage: Bt,
  cleanupCreatedEntities: Qa,
  resolveDeferredNormalInstances: Ut,
  determineImportOrder: _t,
  buildDependencyGraph: Gt,
  resolveImportOrder: zt,
  importPagesInOrder: jt,
  quickCopy: en,
  storeAuthData: tn,
  loadAuthData: an,
  clearAuthData: nn,
  storeImportData: on,
  loadImportData: rn,
  clearImportData: sn,
  storeSelectedRepo: cn,
  getComponentMetadata: ln,
  getAllComponents: dn,
  pluginPromptResponse: gn,
  switchToPage: pn,
  checkForExistingPrimaryImport: mn,
  createImportDividers: fn,
  importSingleComponentWithWizard: un,
  deleteImportGroup: Wt,
  clearImportMetadata: bn,
  cleanupFailedImport: hn,
  summarizeVariablesForWizard: yn,
  getLocalVariableCollections: wn,
  getCollectionGuids: $n,
  mergeImportGroup: Sn,
  runTest: Vn
}, Mn = On;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    da(e);
    return;
  }
  const a = e;
  try {
    const n = a.type, i = Mn[n];
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
    const c = await i(a.data);
    figma.ui.postMessage($e(ne({}, c), {
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
