var Kt = Object.defineProperty, qt = Object.defineProperties;
var Xt = Object.getOwnPropertyDescriptors;
var Et = Object.getOwnPropertySymbols;
var Yt = Object.prototype.hasOwnProperty, Zt = Object.prototype.propertyIsEnumerable;
var at = (e, a, n) => a in e ? Kt(e, a, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[a] = n, ee = (e, a) => {
  for (var n in a || (a = {}))
    Yt.call(a, n) && at(e, n, a[n]);
  if (Et)
    for (var n of Et(a))
      Zt.call(a, n) && at(e, n, a[n]);
  return e;
}, ye = (e, a) => qt(e, Xt(a));
var $e = (e, a, n) => at(e, typeof a != "symbol" ? a + "" : a, n);
async function Qt(e) {
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
async function ea(e) {
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
const de = {
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
}, fe = ye(ee({}, de), {
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
}), ve = ye(ee({}, de), {
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
}), xe = ye(ee({}, de), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), At = ye(ee({}, de), {
  cornerRadius: 0
}), ta = ye(ee({}, de), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function aa(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return fe;
    case "TEXT":
      return ve;
    case "VECTOR":
      return xe;
    case "LINE":
      return ta;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return At;
    default:
      return de;
  }
}
function X(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((n, i) => X(n, a[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const n = Object.keys(e), i = Object.keys(a);
      return n.length !== i.length ? !0 : n.some(
        (s) => !(s in a) || X(e[s], a[s])
      );
    }
    return !0;
  }
  return e !== a;
}
const Pe = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, Ce = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function we(e) {
  const a = e.trim(), i = a.replace(/_\d+$/, "").toLowerCase();
  return i === "themes" || i === "theme" ? Ce.THEME : i === "token" || i === "tokens" ? Ce.TOKENS : i === "layer" || i === "layers" ? Ce.LAYER : a;
}
function Ie(e) {
  const a = we(e);
  return a === Ce.LAYER || a === Ce.TOKENS || a === Ce.THEME;
}
function Ze(e) {
  const a = we(e);
  if (a === Ce.LAYER)
    return Pe.LAYER;
  if (a === Ce.TOKENS)
    return Pe.TOKENS;
  if (a === Ce.THEME)
    return Pe.THEME;
}
class je {
  constructor() {
    $e(this, "collectionMap");
    // collectionId -> index
    $e(this, "collections");
    // index -> collection data
    $e(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    $e(this, "nextIndex");
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
    const i = we(
      a.collectionName
    );
    if (Ie(a.collectionName)) {
      const o = this.findCollectionByNormalizedName(i);
      if (o !== void 0) {
        const l = this.collections[o];
        return l.modes = this.mergeModes(
          l.modes,
          a.modes
        ), this.collectionMap.set(n, o), o;
      }
    }
    const s = this.nextIndex++;
    this.collectionMap.set(n, s);
    const c = ye(ee({}, a), {
      collectionName: i
    });
    if (Ie(a.collectionName)) {
      const o = Ze(
        a.collectionName
      );
      o && (c.collectionGuid = o), this.normalizedNameMap.set(i, s);
    }
    return this.collections[s] = c, s;
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
      const i = this.collections[n], s = ee({
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
    const n = new je(), i = Object.entries(a).sort(
      (c, o) => parseInt(c[0], 10) - parseInt(o[0], 10)
    );
    for (const [c, o] of i) {
      const l = parseInt(c, 10), p = (s = o.isLocal) != null ? s : !0, f = we(
        o.collectionName || ""
      ), m = o.collectionId || o.collectionGuid || `temp:${l}:${f}`, h = ee({
        collectionName: f,
        collectionId: m,
        isLocal: p,
        modes: o.modes || []
      }, o.collectionGuid && {
        collectionGuid: o.collectionGuid
      });
      n.collectionMap.set(m, l), n.collections[l] = h, Ie(f) && n.normalizedNameMap.set(f, l), n.nextIndex = Math.max(
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
const na = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, ia = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function oa(e) {
  var n;
  const a = e.toUpperCase();
  return (n = na[a]) != null ? n : e;
}
function ra(e) {
  var a;
  return typeof e == "number" ? (a = ia[e]) != null ? a : e.toString() : e;
}
class He {
  constructor() {
    $e(this, "variableMap");
    // variableKey -> index
    $e(this, "variables");
    // index -> variable data
    $e(this, "nextIndex");
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
      ), c = ee(ee({
        variableName: i.variableName,
        variableType: oa(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), s && { valuesByMode: s });
      a[String(n)] = c;
    }
    return a;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(a) {
    const n = new He(), i = Object.entries(a).sort(
      (s, c) => parseInt(s[0], 10) - parseInt(c[0], 10)
    );
    for (const [s, c] of i) {
      const o = parseInt(s, 10), l = ra(c.variableType), p = ye(ee({}, c), {
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
function sa(e) {
  return {
    _varRef: e
  };
}
function Ve(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let ca = 0;
const _e = /* @__PURE__ */ new Map();
function la(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = _e.get(e.requestId);
  a && (_e.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function lt() {
  return new Promise((e, a) => {
    const n = `guid_${Date.now()}_${++ca}`;
    _e.set(n, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: n
    }), setTimeout(() => {
      _e.has(n) && (_e.delete(n), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
async function Je() {
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
    }), await Je();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await Je();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await Je();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await Je();
  }
};
function da(e, a) {
  const n = a.modes.find((i) => i.modeId === e);
  return n ? n.name : e;
}
async function It(e, a, n, i, s = /* @__PURE__ */ new Set()) {
  const c = {};
  for (const [o, l] of Object.entries(e)) {
    const p = da(o, i);
    if (l == null) {
      c[p] = l;
      continue;
    }
    if (typeof l == "string" || typeof l == "number" || typeof l == "boolean") {
      c[p] = l;
      continue;
    }
    if (typeof l == "object" && l !== null && "type" in l && l.type === "VARIABLE_ALIAS" && "id" in l) {
      const f = l.id;
      if (s.has(f)) {
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
      const h = new Set(s);
      h.add(f);
      const r = await figma.variables.getVariableCollectionByIdAsync(
        m.variableCollectionId
      ), u = m.key;
      if (!u) {
        c[p] = {
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
        variableKey: u,
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
          h
        ));
      }
      const b = a.addVariable(d);
      c[p] = {
        type: "VARIABLE_ALIAS",
        id: f,
        _varRef: b
      };
    } else
      c[p] = l;
  }
  return c;
}
const We = "recursica:collectionId";
async function ga(e) {
  if (e.remote === !0) {
    const n = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(n)) {
      const s = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await t.error(s), new Error(s);
    }
    return e.id;
  } else {
    if (Ie(e.name)) {
      const s = Ze(e.name);
      if (s) {
        const c = e.getSharedPluginData(
          "recursica",
          We
        );
        return (!c || c.trim() === "") && e.setSharedPluginData(
          "recursica",
          We,
          s
        ), s;
      }
    }
    const n = e.getSharedPluginData(
      "recursica",
      We
    );
    if (n && n.trim() !== "")
      return n;
    const i = await lt();
    return e.setSharedPluginData("recursica", We, i), i;
  }
}
function pa(e, a) {
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
  pa(e.name, n);
  const s = await ga(e), c = e.modes.map((f) => f.name), o = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: n,
    modes: c,
    collectionGuid: s
  }, l = a.addCollection(o), p = n ? "local" : "remote";
  return await t.log(
    `  Added ${p} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), l;
}
async function it(e, a, n) {
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
    const c = i.key;
    if (!c)
      return console.log("Variable missing key:", e.id), null;
    const o = await Tt(
      s,
      n
    ), l = {
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
    i.valuesByMode && (l.valuesByMode = await It(
      i.valuesByMode,
      a,
      n,
      s,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const p = a.addVariable(l);
    return sa(p);
  } catch (i) {
    const s = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${s}`
    );
  }
}
async function Fe(e, a, n) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const s in e)
    if (Object.prototype.hasOwnProperty.call(e, s)) {
      const c = e[s];
      if (c && typeof c == "object" && !Array.isArray(c))
        if (c.type === "VARIABLE_ALIAS") {
          const o = await it(
            c,
            a,
            n
          );
          o && (i[s] = o);
        } else
          i[s] = await Fe(
            c,
            a,
            n
          );
      else Array.isArray(c) ? i[s] = await Promise.all(
        c.map(async (o) => (o == null ? void 0 : o.type) === "VARIABLE_ALIAS" ? await it(
          o,
          a,
          n
        ) || o : o && typeof o == "object" ? await Fe(
          o,
          a,
          n
        ) : o)
      ) : i[s] = c;
    }
  return i;
}
async function Pt(e, a, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const s = {};
      for (const c in i)
        Object.prototype.hasOwnProperty.call(i, c) && (c === "boundVariables" ? s[c] = await Fe(
          i[c],
          a,
          n
        ) : s[c] = i[c]);
      return s;
    })
  );
}
async function Vt(e, a, n) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const s = {};
      for (const c in i)
        Object.prototype.hasOwnProperty.call(i, c) && (c === "boundVariables" ? s[c] = await Fe(
          i[c],
          a,
          n
        ) : s[c] = i[c]);
      return s;
    })
  );
}
const ze = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: Fe,
  resolveVariableAliasMetadata: it,
  serializeBackgrounds: Vt,
  serializeFills: Pt
}, Symbol.toStringTag, { value: "Module" }));
async function Ot(e, a) {
  var l, p;
  const n = {}, i = /* @__PURE__ */ new Set();
  e.type && (n.type = e.type, i.add("type")), e.id && (n.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (n.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (n.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (n.y = e.y, i.add("y")), e.width !== void 0 && (n.width = e.width, i.add("width")), e.height !== void 0 && (n.height = e.height, i.add("height"));
  const s = e.name || "Unnamed";
  e.preserveRatio !== void 0 && console.log(
    `[ISSUE #3 EXPORT DEBUG] "${s}" has preserveRatio: ${e.preserveRatio} (NOT being exported - needs to be added!)`
  );
  const c = e.type;
  if (c === "FRAME" || c === "COMPONENT" || c === "INSTANCE" || c === "GROUP" || c === "BOOLEAN_OPERATION" || c === "VECTOR" || c === "STAR" || c === "LINE" || c === "ELLIPSE" || c === "POLYGON" || c === "RECTANGLE" || c === "TEXT") {
    const f = e.constraintHorizontal !== void 0 ? e.constraintHorizontal : (l = e.constraints) == null ? void 0 : l.horizontal, m = e.constraintVertical !== void 0 ? e.constraintVertical : (p = e.constraints) == null ? void 0 : p.vertical;
    f !== void 0 ? X(
      f,
      de.constraintHorizontal
    ) ? (n.constraintHorizontal = f, i.add("constraintHorizontal"), console.log(
      `[ISSUE #4 EXPORT] "${s}" (${c}) exporting constraintHorizontal: ${f} (different from default: ${de.constraintHorizontal})`
    )) : console.log(
      `[ISSUE #4 EXPORT DEBUG] "${s}" (${c}) has constraintHorizontal: ${f} (default, not exporting)`
    ) : console.log(
      `[ISSUE #4 EXPORT DEBUG] "${s}" (${c}) constraintHorizontal is undefined (checked both direct property and constraints.horizontal)`
    ), m !== void 0 ? X(
      m,
      de.constraintVertical
    ) ? (n.constraintVertical = m, i.add("constraintVertical"), console.log(
      `[ISSUE #4 EXPORT] "${s}" (${c}) exporting constraintVertical: ${m} (different from default: ${de.constraintVertical})`
    )) : console.log(
      `[ISSUE #4 EXPORT DEBUG] "${s}" (${c}) has constraintVertical: ${m} (default, not exporting)`
    ) : console.log(
      `[ISSUE #4 EXPORT DEBUG] "${s}" (${c}) constraintVertical is undefined (checked both direct property and constraints.vertical)`
    );
  }
  if (e.visible !== void 0 && X(e.visible, de.visible) && (n.visible = e.visible, i.add("visible")), e.locked !== void 0 && X(e.locked, de.locked) && (n.locked = e.locked, i.add("locked")), e.opacity !== void 0 && X(e.opacity, de.opacity) && (n.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && X(e.rotation, de.rotation) && (n.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && X(e.blendMode, de.blendMode) && (n.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && X(e.effects, de.effects) && (n.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const f = await Pt(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    X(f, de.fills) && (n.fills = f), i.add("fills");
  }
  if (e.strokes !== void 0 && X(e.strokes, de.strokes) && (n.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && X(e.strokeWeight, de.strokeWeight) && (n.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && X(e.strokeAlign, de.strokeAlign) && (n.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const f = await Fe(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    );
    Object.keys(f).length > 0 && (n.boundVariables = f), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const f = await Vt(
      e.backgrounds,
      a.variableTable,
      a.collectionTable
    );
    f && Array.isArray(f) && f.length > 0 && (n.backgrounds = f), i.add("backgrounds");
  }
  return n;
}
const ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: Ot
}, Symbol.toStringTag, { value: "Module" }));
async function ot(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (n.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (s) {
    }
  return e.layoutMode !== void 0 && X(e.layoutMode, fe.layoutMode) && (n.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && X(
    e.primaryAxisSizingMode,
    fe.primaryAxisSizingMode
  ) && (n.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && X(
    e.counterAxisSizingMode,
    fe.counterAxisSizingMode
  ) && (n.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && X(
    e.primaryAxisAlignItems,
    fe.primaryAxisAlignItems
  ) && (n.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && X(
    e.counterAxisAlignItems,
    fe.counterAxisAlignItems
  ) && (n.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && X(e.paddingLeft, fe.paddingLeft) && (n.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && X(e.paddingRight, fe.paddingRight) && (n.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && X(e.paddingTop, fe.paddingTop) && (n.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && X(e.paddingBottom, fe.paddingBottom) && (n.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && X(e.itemSpacing, fe.itemSpacing) && (n.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.counterAxisSpacing !== void 0 && X(
    e.counterAxisSpacing,
    fe.counterAxisSpacing
  ) && (n.counterAxisSpacing = e.counterAxisSpacing, i.add("counterAxisSpacing")), e.cornerRadius !== void 0 && X(e.cornerRadius, fe.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && X(e.clipsContent, fe.clipsContent) && (n.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && X(e.layoutWrap, fe.layoutWrap) && (n.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && X(e.layoutGrow, fe.layoutGrow) && (n.layoutGrow = e.layoutGrow, i.add("layoutGrow")), n;
}
const fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: ot
}, Symbol.toStringTag, { value: "Module" }));
async function ua(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (n.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (n.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (n.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && X(
    e.textAlignHorizontal,
    ve.textAlignHorizontal
  ) && (n.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && X(
    e.textAlignVertical,
    ve.textAlignVertical
  ) && (n.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && X(e.letterSpacing, ve.letterSpacing) && (n.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && X(e.lineHeight, ve.lineHeight) && (n.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && X(e.textCase, ve.textCase) && (n.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && X(e.textDecoration, ve.textDecoration) && (n.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && X(e.textAutoResize, ve.textAutoResize) && (n.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && X(
    e.paragraphSpacing,
    ve.paragraphSpacing
  ) && (n.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && X(e.paragraphIndent, ve.paragraphIndent) && (n.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && X(e.listOptions, ve.listOptions) && (n.listOptions = e.listOptions, i.add("listOptions")), n;
}
function ha(e) {
  const a = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (a) {
    const n = parseFloat(a[1]), i = parseInt(a[2]), s = n * Math.pow(10, i);
    return Math.abs(s) < 1e-10 ? "0" : s.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function Mt(e) {
  if (!e || typeof e != "string")
    return e;
  let a = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (n) => ha(n));
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
function rt(e) {
  return Array.isArray(e) ? e.map((a) => ({
    data: Mt(a.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: a.windRule || a.windingRule || "NONZERO"
  })) : e;
}
const ya = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: Mt,
  normalizeVectorGeometry: rt
}, Symbol.toStringTag, { value: "Module" }));
async function ba(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && X(e.fillGeometry, xe.fillGeometry) && (n.fillGeometry = rt(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && X(e.strokeGeometry, xe.strokeGeometry) && (n.strokeGeometry = rt(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && X(e.strokeCap, xe.strokeCap) && (n.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && X(e.strokeJoin, xe.strokeJoin) && (n.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && X(e.dashPattern, xe.dashPattern) && (n.dashPattern = e.dashPattern, i.add("dashPattern")), n;
}
async function wa(e, a) {
  const n = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && X(e.cornerRadius, At.cornerRadius) && (n.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (n.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (n.pointCount = e.pointCount, i.add("pointCount")), n;
}
const Ke = /* @__PURE__ */ new Map();
let $a = 0;
function Sa() {
  return `prompt_${Date.now()}_${++$a}`;
}
const Be = {
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
    const n = typeof a == "number" ? { timeoutMs: a } : a, i = (l = n == null ? void 0 : n.timeoutMs) != null ? l : 3e5, s = n == null ? void 0 : n.okLabel, c = n == null ? void 0 : n.cancelLabel, o = Sa();
    return new Promise((p, f) => {
      const m = i === -1 ? null : setTimeout(() => {
        Ke.delete(o), f(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      Ke.set(o, {
        resolve: p,
        reject: f,
        timeout: m
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: ee(ee({
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
    const { requestId: a, action: n } = e, i = Ke.get(a);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${a}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), Ke.delete(a), n === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
}, Ea = "RecursicaPublishedMetadata";
function nt(e) {
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
function vt(e) {
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
async function va(e, a) {
  var s, c;
  const n = {}, i = /* @__PURE__ */ new Set();
  if (n._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const o = await e.getMainComponentAsync();
    if (!o) {
      const V = e.name || "(unnamed)", I = e.id;
      if (a.detachedComponentsHandled.has(I))
        await t.log(
          `Treating detached instance "${V}" as internal instance (already prompted)`
        );
      else {
        await t.warning(
          `Found detached instance: "${V}" (main component is missing)`
        );
        const S = `Found detached instance "${V}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await Be.prompt(S, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(I), await t.log(
            `Treating detached instance "${V}" as internal instance`
          );
        } catch (N) {
          if (N instanceof Error && N.message === "User cancelled") {
            const U = `Export cancelled: Detached instance "${V}" found. Please fix the instance before exporting.`;
            await t.error(U);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (z) {
              console.warn("Could not scroll to instance:", z);
            }
            throw new Error(U);
          } else
            throw N;
        }
      }
      if (!nt(e).page) {
        const S = `Detached instance "${V}" is not on any page. Cannot export.`;
        throw await t.error(S), new Error(S);
      }
      let M, x;
      try {
        e.variantProperties && (M = e.variantProperties), e.componentProperties && (x = e.componentProperties);
      } catch (S) {
      }
      const v = ee(ee({
        instanceType: "internal",
        componentName: V,
        componentNodeId: e.id
      }, M && { variantProperties: M }), x && { componentProperties: x }), G = a.instanceTable.addInstance(v);
      return n._instanceRef = G, i.add("_instanceRef"), await t.log(
        `  Exported detached INSTANCE: "${V}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), n;
    }
    const l = e.name || "(unnamed)", p = o.name || "(unnamed)", f = o.remote === !0, h = nt(e).page, r = nt(o);
    let u = r.page;
    if (!u && f)
      try {
        await figma.loadAllPagesAsync();
        const V = figma.root.children;
        let I = null;
        for (const E of V)
          try {
            if (E.findOne(
              (M) => M.id === o.id
            )) {
              I = E;
              break;
            }
          } catch (T) {
          }
        if (!I) {
          const E = o.id.split(":")[0];
          for (const T of V) {
            const M = T.id.split(":")[0];
            if (E === M) {
              I = T;
              break;
            }
          }
        }
        I && (u = I);
      } catch (V) {
      }
    let d, b = u;
    if (f)
      if (u) {
        const V = vt(u);
        d = "normal", b = u, V != null && V.id ? await t.log(
          `  Component "${p}" is from library but also exists on local page "${u.name}" with metadata. Treating as "normal" instance.`
        ) : await t.log(
          `  Component "${p}" is from library and exists on local page "${u.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        d = "remote", await t.log(
          `  Component "${p}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (u && h && u.id === h.id)
      d = "internal";
    else if (u && h && u.id !== h.id)
      d = "normal";
    else if (u && !h)
      d = "normal";
    else if (!f && r.reason === "detached") {
      const V = o.id;
      if (a.detachedComponentsHandled.has(V))
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
        const I = `Found detached instance "${l}" attached to component "${p}". This should be fixed. Continue to publish?`;
        try {
          await Be.prompt(I, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), a.detachedComponentsHandled.add(V), d = "remote", await t.log(
            `Treating detached instance "${l}" as remote instance (will be created on REMOTES page)`
          );
        } catch (E) {
          if (E instanceof Error && E.message === "User cancelled") {
            const T = `Export cancelled: Detached instance "${l}" found. The component "${p}" is not on any page. Please fix the instance before exporting.`;
            throw await t.error(T), new Error(T);
          } else
            throw E;
        }
      }
    } else
      f || await t.warning(
        `  Instance "${l}" -> component "${p}": componentPage is null but component is not remote. Reason: ${r.reason}. Cannot determine instance type.`
      ), d = "normal";
    let g, y;
    try {
      if (e.variantProperties && (g = e.variantProperties, await t.log(
        `  Instance "${l}" -> variantProperties from instance: ${JSON.stringify(g)}`
      )), typeof e.getProperties == "function")
        try {
          const V = await e.getProperties();
          V && V.variantProperties && (await t.log(
            `  Instance "${l}" -> variantProperties from getProperties(): ${JSON.stringify(V.variantProperties)}`
          ), V.variantProperties && Object.keys(V.variantProperties).length > 0 && (g = V.variantProperties));
        } catch (V) {
          await t.log(
            `  Instance "${l}" -> getProperties() not available or failed: ${V}`
          );
        }
      if (e.componentProperties && (y = e.componentProperties), o.parent && o.parent.type === "COMPONENT_SET") {
        const V = o.parent;
        try {
          const I = V.componentPropertyDefinitions;
          I && await t.log(
            `  Component set "${V.name}" has property definitions: ${JSON.stringify(Object.keys(I))}`
          );
          const E = {}, T = p.split(",").map((M) => M.trim());
          for (const M of T) {
            const x = M.split("=").map((v) => v.trim());
            if (x.length >= 2) {
              const v = x[0], G = x.slice(1).join("=").trim();
              I && I[v] && (E[v] = G);
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
            const M = o.variantProperties;
            await t.log(
              `  Main component "${p}" has variantProperties: ${JSON.stringify(M)}`
            ), g = M;
          }
        } catch (I) {
          await t.warning(
            `  Could not get variant properties from component set: ${I}`
          );
        }
      }
    } catch (V) {
    }
    let $, R;
    try {
      let V = o.parent;
      const I = [];
      let E = 0;
      const T = 20;
      for (; V && E < T; )
        try {
          const M = V.type, x = V.name;
          if (M === "COMPONENT_SET" && !R && (R = x), M === "PAGE")
            break;
          const v = x || "";
          I.unshift(v), (R === "arrow-top-right-on-square" || p === "arrow-top-right-on-square") && await t.log(
            `  [PATH BUILD] Added segment: "${v}" (type: ${M}) to path for component "${p}"`
          ), V = V.parent, E++;
        } catch (M) {
          (R === "arrow-top-right-on-square" || p === "arrow-top-right-on-square") && await t.warning(
            `  [PATH BUILD] Error building path for "${p}": ${M}`
          );
          break;
        }
      $ = I, (R === "arrow-top-right-on-square" || p === "arrow-top-right-on-square") && await t.log(
        `  [PATH BUILD] Final path for component "${p}": [${I.join(" → ")}]`
      );
    } catch (V) {
    }
    const P = ee(ee(ee(ee({
      instanceType: d,
      componentName: p
    }, R && { componentSetName: R }), g && { variantProperties: g }), y && { componentProperties: y }), d === "normal" ? { path: $ || [] } : $ && $.length > 0 && {
      path: $
    });
    if (d === "internal") {
      P.componentNodeId = o.id, await t.log(
        `  Found INSTANCE: "${l}" -> INTERNAL component "${p}" (ID: ${o.id.substring(0, 8)}...)`
      );
      const V = e.boundVariables, I = o.boundVariables;
      if (V && typeof V == "object") {
        const v = Object.keys(V);
        await t.log(
          `  DEBUG: Internal instance "${l}" -> boundVariables keys: ${v.length > 0 ? v.join(", ") : "none"}`
        );
        for (const S of v) {
          const N = V[S], U = (N == null ? void 0 : N.type) || typeof N;
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
          V[S] !== void 0 && await t.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${S} = ${JSON.stringify(V[S])}`
          );
      } else
        await t.log(
          `  DEBUG: Internal instance "${l}" -> No boundVariables found on instance node`
        );
      if (I && typeof I == "object") {
        const v = Object.keys(I);
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
      const T = Object.keys(e).filter(
        (v) => !v.startsWith("_") && v !== "parent" && v !== "removed" && typeof e[v] != "function" && v !== "type" && v !== "id" && v !== "name" && v !== "boundVariables" && v !== "backgrounds" && v !== "fills"
      ), M = Object.keys(o).filter(
        (v) => !v.startsWith("_") && v !== "parent" && v !== "removed" && typeof o[v] != "function" && v !== "type" && v !== "id" && v !== "name" && v !== "boundVariables" && v !== "backgrounds" && v !== "fills"
      ), x = [
        .../* @__PURE__ */ new Set([...T, ...M])
      ].filter(
        (v) => v.toLowerCase().includes("selection") || v.toLowerCase().includes("select") || v.toLowerCase().includes("color") && !v.toLowerCase().includes("fill") && !v.toLowerCase().includes("stroke")
      );
      if (x.length > 0) {
        await t.log(
          `  DEBUG: Found selection/color-related properties: ${x.join(", ")}`
        );
        for (const v of x)
          try {
            if (T.includes(v)) {
              const G = e[v];
              await t.log(
                `  DEBUG:   Instance.${v}: ${JSON.stringify(G)}`
              );
            }
            if (M.includes(v)) {
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
      const V = b || u;
      if (V) {
        P.componentPageName = V.name;
        const E = vt(V);
        E != null && E.id && E.version !== void 0 ? (P.componentGuid = E.id, P.componentVersion = E.version, await t.log(
          `  Found INSTANCE: "${l}" -> NORMAL component "${p}" (ID: ${o.id.substring(0, 8)}...) at path [${($ || []).join(" → ")}]`
        )) : await t.warning(
          `  Instance "${l}" -> component "${p}" is classified as normal but page "${V.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const E = o.id;
        let T = "", M = "";
        switch (r.reason) {
          case "broken_chain":
            T = "The component's parent chain is broken and cannot be traversed to find the page", M = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            T = "Cannot access the component's parent chain (access error)", M = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            T = "Cannot determine which page the component is on", M = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([o]);
        } catch (G) {
          console.warn("Could not scroll to component:", G);
        }
        const x = `Normal instance "${l}" -> component "${p}" (ID: ${E}) has no componentPage. ${T}. ${M} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", x), await t.error(x);
        const v = new Error(x);
        throw console.error("Throwing error:", v), v;
      }
      $ === void 0 && console.warn(
        `Failed to build path for normal instance "${l}" -> component "${p}". Path is required for resolution.`
      );
      const I = $ && $.length > 0 ? ` at path [${$.join(" → ")}]` : " at page root";
      await t.log(
        `  Found INSTANCE: "${l}" -> NORMAL component "${p}" (ID: ${o.id.substring(0, 8)}...)${I}`
      );
    } else if (d === "remote") {
      let V, I;
      const E = a.detachedComponentsHandled.has(
        o.id
      );
      if (!E)
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const M = await o.getPublishStatusAsync();
              M && typeof M == "object" && (M.libraryName && (V = M.libraryName), M.libraryKey && (I = M.libraryKey));
            } catch (M) {
            }
          try {
            const M = figma.teamLibrary;
            if (typeof (M == null ? void 0 : M.getAvailableLibraryComponentSetsAsync) == "function") {
              const x = await M.getAvailableLibraryComponentSetsAsync();
              if (x && Array.isArray(x)) {
                for (const v of x)
                  if (v.key === o.key || v.name === o.name) {
                    v.libraryName && (V = v.libraryName), v.libraryKey && (I = v.libraryKey);
                    break;
                  }
              }
            }
          } catch (M) {
          }
        } catch (M) {
          console.warn(
            `Error getting library info for remote component "${p}":`,
            M
          );
        }
      if (V && (P.remoteLibraryName = V), I && (P.remoteLibraryKey = I), E && (P.componentNodeId = o.id), a.instanceTable.getInstanceIndex(P) !== -1)
        await t.log(
          `  Found INSTANCE: "${l}" -> REMOTE component "${p}" (ID: ${o.id.substring(0, 8)}...)${E ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: M } = await Promise.resolve().then(() => ma), x = await M(e, a), { parseFrameProperties: v } = await Promise.resolve().then(() => fa), G = await v(e, a), S = ye(ee(ee({}, x), G), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const N = ye(ee({}, a), {
              depth: (a.depth || 0) + 1
            }), { extractNodeData: U } = await Promise.resolve().then(() => Ta), z = [];
            for (const K of e.children)
              try {
                let H;
                if (K.type === "INSTANCE")
                  try {
                    const J = await K.getMainComponentAsync();
                    if (J) {
                      const ne = await M(
                        K,
                        a
                      ), oe = await v(
                        K,
                        a
                      ), ce = await U(
                        J,
                        /* @__PURE__ */ new WeakSet(),
                        N
                      );
                      H = ye(ee(ee(ee({}, ce), ne), oe), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      H = await U(
                        K,
                        /* @__PURE__ */ new WeakSet(),
                        N
                      ), H.type === "INSTANCE" && (H.type = "COMPONENT"), delete H._instanceRef;
                  } catch (J) {
                    H = await U(
                      K,
                      /* @__PURE__ */ new WeakSet(),
                      N
                    ), H.type === "INSTANCE" && (H.type = "COMPONENT"), delete H._instanceRef;
                  }
                else {
                  H = await U(
                    K,
                    /* @__PURE__ */ new WeakSet(),
                    N
                  );
                  const J = K.boundVariables;
                  if (J && typeof J == "object") {
                    const ne = Object.keys(J);
                    ne.length > 0 && (await t.log(
                      `  DEBUG: Child "${K.name || "Unnamed"}" -> boundVariables keys: ${ne.join(", ")}`
                    ), J.backgrounds !== void 0 && await t.log(
                      `  DEBUG:   Child "${K.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(J.backgrounds)}`
                    ));
                  }
                  if (o.children && Array.isArray(o.children)) {
                    const ne = o.children.find(
                      (oe) => oe.name === K.name
                    );
                    if (ne) {
                      const oe = ne.boundVariables;
                      if (oe && typeof oe == "object") {
                        const ce = Object.keys(oe);
                        if (ce.length > 0 && (await t.log(
                          `  DEBUG: Main component child "${ne.name || "Unnamed"}" -> boundVariables keys: ${ce.join(", ")}`
                        ), oe.backgrounds !== void 0 && (await t.log(
                          `  DEBUG:   Main component child "${ne.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(oe.backgrounds)}`
                        ), !J || !J.backgrounds))) {
                          await t.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: pe } = await Promise.resolve().then(() => ze), se = await pe(
                            oe,
                            a.variableTable,
                            a.collectionTable
                          );
                          H.boundVariables || (H.boundVariables = {}), se.backgrounds && (H.boundVariables.backgrounds = se.backgrounds, await t.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                z.push(H);
              } catch (H) {
                console.warn(
                  `Failed to extract child "${K.name || "Unnamed"}" for remote component "${p}":`,
                  H
                );
              }
            S.children = z;
          }
          if (!S)
            throw new Error("Failed to build structure for remote instance");
          try {
            const N = e.boundVariables;
            if (N && typeof N == "object") {
              const j = Object.keys(N);
              await t.log(
                `  DEBUG: Instance "${l}" -> boundVariables keys: ${j.length > 0 ? j.join(", ") : "none"}`
              );
              for (const Y of j) {
                const Q = N[Y], he = (Q == null ? void 0 : Q.type) || typeof Q;
                if (await t.log(
                  `  DEBUG:   boundVariables.${Y}: type=${he}, value=${JSON.stringify(Q)}`
                ), Q && typeof Q == "object" && !Array.isArray(Q)) {
                  const Te = Object.keys(Q);
                  if (Te.length > 0) {
                    await t.log(
                      `  DEBUG:     boundVariables.${Y} has nested keys: ${Te.join(", ")}`
                    );
                    for (const Ge of Te) {
                      const Oe = Q[Ge];
                      Oe && typeof Oe == "object" && Oe.type === "VARIABLE_ALIAS" && await t.log(
                        `  DEBUG:       boundVariables.${Y}.${Ge}: VARIABLE_ALIAS id=${Oe.id}`
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
              for (const Y of Z)
                N[Y] !== void 0 && await t.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${Y} = ${JSON.stringify(N[Y])}`
                );
            } else
              await t.log(
                `  DEBUG: Instance "${l}" -> No boundVariables found on instance node`
              );
            const U = N && N.fills !== void 0 && N.fills !== null, z = S.fills !== void 0 && Array.isArray(S.fills) && S.fills.length > 0, K = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, H = o.fills !== void 0 && Array.isArray(o.fills) && o.fills.length > 0;
            if (await t.log(
              `  DEBUG: Instance "${l}" -> fills check: instanceHasFills=${K}, structureHasFills=${z}, mainComponentHasFills=${H}, hasInstanceFillsBoundVar=${!!U}`
            ), U && !z) {
              await t.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (K) {
                  const { serializeFills: j } = await Promise.resolve().then(() => ze), Z = await j(
                    e.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  S.fills = Z, await t.log(
                    `  DEBUG: Got ${Z.length} fill(s) from instance node`
                  );
                } else if (H) {
                  const { serializeFills: j } = await Promise.resolve().then(() => ze), Z = await j(
                    o.fills,
                    a.variableTable,
                    a.collectionTable
                  );
                  S.fills = Z, await t.log(
                    `  DEBUG: Got ${Z.length} fill(s) from main component`
                  );
                } else
                  await t.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (j) {
                await t.warning(
                  `  Failed to get fills: ${j}`
                );
              }
            }
            const J = e.selectionColor, ne = o.selectionColor;
            J !== void 0 && await t.log(
              `  DEBUG: Instance "${l}" -> selectionColor: ${JSON.stringify(J)}`
            ), ne !== void 0 && await t.log(
              `  DEBUG: Main component "${p}" -> selectionColor: ${JSON.stringify(ne)}`
            );
            const oe = Object.keys(e).filter(
              (j) => !j.startsWith("_") && j !== "parent" && j !== "removed" && typeof e[j] != "function" && j !== "type" && j !== "id" && j !== "name"
            ), ce = Object.keys(o).filter(
              (j) => !j.startsWith("_") && j !== "parent" && j !== "removed" && typeof o[j] != "function" && j !== "type" && j !== "id" && j !== "name"
            ), pe = [
              .../* @__PURE__ */ new Set([...oe, ...ce])
            ].filter(
              (j) => j.toLowerCase().includes("selection") || j.toLowerCase().includes("select") || j.toLowerCase().includes("color") && !j.toLowerCase().includes("fill") && !j.toLowerCase().includes("stroke")
            );
            if (pe.length > 0) {
              await t.log(
                `  DEBUG: Found selection/color-related properties: ${pe.join(", ")}`
              );
              for (const j of pe)
                try {
                  if (oe.includes(j)) {
                    const Z = e[j];
                    await t.log(
                      `  DEBUG:   Instance.${j}: ${JSON.stringify(Z)}`
                    );
                  }
                  if (ce.includes(j)) {
                    const Z = o[j];
                    await t.log(
                      `  DEBUG:   MainComponent.${j}: ${JSON.stringify(Z)}`
                    );
                  }
                } catch (Z) {
                }
            } else
              await t.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const se = o.boundVariables;
            if (se && typeof se == "object") {
              const j = Object.keys(se);
              if (j.length > 0) {
                await t.log(
                  `  DEBUG: Main component "${p}" -> boundVariables keys: ${j.join(", ")}`
                );
                for (const Z of j) {
                  const Y = se[Z], Q = (Y == null ? void 0 : Y.type) || typeof Y;
                  await t.log(
                    `  DEBUG:   Main component boundVariables.${Z}: type=${Q}, value=${JSON.stringify(Y)}`
                  );
                }
              }
            }
            if (N && Object.keys(N).length > 0) {
              await t.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(N).length} key(s))`
              );
              const { extractBoundVariables: j } = await Promise.resolve().then(() => ze), Z = await j(
                N,
                a.variableTable,
                a.collectionTable
              );
              S.boundVariables || (S.boundVariables = {});
              for (const [Y, Q] of Object.entries(
                Z
              ))
                Q !== void 0 && (S.boundVariables[Y] !== void 0 && await t.log(
                  `  DEBUG: Structure already has boundVariables.${Y} from baseProps, but instance also has it - using instance's boundVariables.${Y}`
                ), S.boundVariables[Y] = Q, await t.log(
                  `  DEBUG: Set boundVariables.${Y} in structure: ${JSON.stringify(Q)}`
                ));
              Z.fills !== void 0 ? await t.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : U && await t.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), Z.backgrounds !== void 0 ? await t.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(Z.backgrounds)}`
              ) : N && N.backgrounds !== void 0 && await t.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (se && Object.keys(se).length > 0) {
              await t.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(se).length} key(s))`
              );
              const { extractBoundVariables: j } = await Promise.resolve().then(() => ze), Z = await j(
                se,
                a.variableTable,
                a.collectionTable
              );
              S.boundVariables || (S.boundVariables = {});
              for (const [Y, Q] of Object.entries(
                Z
              ))
                Q !== void 0 && (S.boundVariables[Y] === void 0 ? (S.boundVariables[Y] = Q, await t.log(
                  `  DEBUG: Added boundVariables.${Y} from main component (not in instance): ${JSON.stringify(Q)}`
                )) : await t.log(
                  `  DEBUG: Skipped boundVariables.${Y} from main component (instance already has it)`
                ));
            }
            await t.log(
              `  DEBUG: Final structure for "${p}": hasFills=${!!S.fills}, fillsCount=${((s = S.fills) == null ? void 0 : s.length) || 0}, hasBoundVars=${!!S.boundVariables}, boundVarsKeys=${S.boundVariables ? Object.keys(S.boundVariables).join(", ") : "none"}`
            ), (c = S.boundVariables) != null && c.fills && await t.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(S.boundVariables.fills)}`
            );
          } catch (N) {
            await t.warning(
              `  Failed to handle bound variables for fills: ${N}`
            );
          }
          P.structure = S, E ? await t.log(
            `  Extracted structure for detached component "${p}" (ID: ${o.id.substring(0, 8)}...)`
          ) : await t.log(
            `  Extracted structure from instance for remote component "${p}" (preserving size overrides: ${e.width}x${e.height})`
          ), await t.log(
            `  Found INSTANCE: "${l}" -> REMOTE component "${p}" (ID: ${o.id.substring(0, 8)}...)${E ? " [DETACHED]" : ""}`
          );
        } catch (M) {
          const x = `Failed to extract structure for remote component "${p}": ${M instanceof Error ? M.message : String(M)}`;
          console.error(x, M), await t.error(x);
        }
    }
    const B = a.instanceTable.addInstance(P);
    n._instanceRef = B, i.add("_instanceRef");
  }
  return n;
}
class De {
  constructor() {
    $e(this, "instanceMap");
    // unique key -> index
    $e(this, "instances");
    // index -> instance data
    $e(this, "nextIndex");
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
    const n = new De(), i = Object.entries(a).sort(
      (s, c) => parseInt(s[0], 10) - parseInt(c[0], 10)
    );
    for (const [s, c] of i) {
      const o = parseInt(s, 10), l = n.generateKey(c);
      n.instanceMap.set(l, o), n.instances[o] = c, n.nextIndex = Math.max(n.nextIndex, o + 1);
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
function Na() {
  const e = {};
  for (const [a, n] of Object.entries(Rt))
    e[n] = a;
  return e;
}
function Nt(e) {
  var a;
  return (a = Rt[e]) != null ? a : e;
}
function Ca(e) {
  var a;
  return typeof e == "number" ? (a = Na()[e]) != null ? a : e.toString() : e;
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
}, st = {};
for (const [e, a] of Object.entries(xt))
  st[a] = e;
class Qe {
  constructor() {
    $e(this, "shortToLong");
    $e(this, "longToShort");
    this.shortToLong = ee({}, st), this.longToShort = ee({}, xt);
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
      for (const [s, c] of Object.entries(a)) {
        const o = this.getShortName(s);
        if (o !== s && !i.has(o)) {
          let l = this.compressObject(c);
          o === "type" && typeof l == "string" && (l = Nt(l)), n[o] = l;
        } else {
          let l = this.compressObject(c);
          s === "type" && typeof l == "string" && (l = Nt(l)), n[s] = l;
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
        const c = this.getLongName(i);
        let o = this.expandObject(s);
        (c === "type" || i === "type") && (typeof o == "number" || typeof o == "string") && (o = Ca(o)), n[c] = o;
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
    return ee({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(a) {
    const n = new Qe();
    n.shortToLong = ee(ee({}, st), a), n.longToShort = {};
    for (const [i, s] of Object.entries(
      n.shortToLong
    ))
      n.longToShort[s] = i;
    return n;
  }
}
function Aa(e, a) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const n = {};
  e.metadata && (n.metadata = e.metadata);
  for (const [i, s] of Object.entries(e))
    i !== "metadata" && (n[i] = a.compressObject(s));
  return n;
}
function Ia(e, a) {
  return a.expandObject(e);
}
function Xe(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function et(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((n) => {
    a += et(n);
  }), a;
}
async function tt(e, a = /* @__PURE__ */ new WeakSet(), n = {}) {
  var u, d, b, g, y, $, R;
  if (!e || typeof e != "object")
    return e;
  const i = (u = n.maxNodes) != null ? u : 1e4, s = (d = n.nodeCount) != null ? d : 0;
  if (s >= i)
    return await t.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: s
    };
  const c = {
    visited: (b = n.visited) != null ? b : /* @__PURE__ */ new WeakSet(),
    depth: (g = n.depth) != null ? g : 0,
    maxDepth: (y = n.maxDepth) != null ? y : 100,
    nodeCount: s + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: n.variableTable,
    collectionTable: n.collectionTable,
    instanceTable: n.instanceTable,
    detachedComponentsHandled: ($ = n.detachedComponentsHandled) != null ? $ : /* @__PURE__ */ new Set(),
    exportedIds: (R = n.exportedIds) != null ? R : /* @__PURE__ */ new Map()
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), c.visited = a;
  const o = {}, l = await Ot(e, c);
  if (Object.assign(o, l), o.id && c.exportedIds) {
    const P = c.exportedIds.get(o.id);
    if (P !== void 0) {
      const B = o.name || "Unnamed";
      if (P !== B) {
        const V = `Duplicate ID detected during export: ID "${o.id.substring(0, 8)}..." is used by both "${P}" and "${B}". Each node must have a unique ID.`;
        throw await t.error(V), new Error(V);
      }
      await t.warning(
        `Node "${B}" (ID: ${o.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      c.exportedIds.set(o.id, o.name || "Unnamed");
  }
  const p = e.type;
  if (p)
    switch (p) {
      case "FRAME":
      case "COMPONENT": {
        const P = await ot(e);
        Object.assign(o, P);
        break;
      }
      case "INSTANCE": {
        const P = await va(
          e,
          c
        );
        Object.assign(o, P);
        const B = await ot(
          e
        );
        Object.assign(o, B);
        break;
      }
      case "TEXT": {
        const P = await ua(e);
        Object.assign(o, P);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const P = await ba(e);
        Object.assign(o, P);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const P = await wa(e);
        Object.assign(o, P);
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
  for (const P of f)
    typeof e[P] != "function" && (m.has(P) || c.unhandledKeys.add(P));
  c.unhandledKeys.size > 0 && (o._unhandledKeys = Array.from(c.unhandledKeys).sort());
  const h = o._instanceRef !== void 0 && c.instanceTable && p === "INSTANCE";
  let r = !1;
  if (h) {
    const P = c.instanceTable.getInstanceByIndex(
      o._instanceRef
    );
    P && P.instanceType === "normal" && (r = !0, await t.log(
      `  Skipping children extraction for normal instance "${o.name || "Unnamed"}" - will be resolved from referenced component`
    ));
  }
  if (!r && e.children && Array.isArray(e.children)) {
    const P = c.maxDepth;
    if (c.depth >= P)
      o.children = {
        _truncated: !0,
        _reason: `Maximum depth (${P}) reached`,
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
      const B = ye(ee({}, c), {
        depth: c.depth + 1
      }), V = [];
      let I = !1;
      for (const E of e.children) {
        if (B.nodeCount >= i) {
          o.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: V.length,
            _total: e.children.length,
            children: V
          }, I = !0;
          break;
        }
        const T = await tt(E, a, B);
        V.push(T), B.nodeCount && (c.nodeCount = B.nodeCount);
      }
      I || (o.children = V);
    }
  }
  return o;
}
async function Ye(e, a = /* @__PURE__ */ new Set(), n = !1, i = /* @__PURE__ */ new Set()) {
  n || (await t.clear(), await t.log("=== Starting Page Export ==="));
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
    const c = figma.root.children;
    if (await t.log(`Loaded ${c.length} page(s)`), s < 0 || s >= c.length)
      return await t.error(
        `Invalid page index: ${s} (valid range: 0-${c.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const o = c[s], l = o.id;
    if (e.skipPrompts) {
      if (i.has(l))
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
      i.add(l);
    } else {
      if (a.has(l))
        return await t.log(
          `Page "${o.name}" has already been processed, skipping...`
        ), {
          type: "exportPage",
          success: !1,
          error: !0,
          message: "Page already processed",
          data: {}
        };
      a.add(l);
    }
    await t.log(
      `Selected page: "${o.name}" (index: ${s})`
    ), await t.log(
      "Initializing variable, collection, and instance tables..."
    );
    const p = new He(), f = new je(), m = new De();
    await t.log("Extracting node data from page..."), await t.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await t.log(
      "Collections will be discovered as variables are processed:"
    );
    const h = await tt(
      o,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: p,
        collectionTable: f,
        instanceTable: m
      }
    );
    await t.log("Node extraction finished");
    const r = et(h), u = p.getSize(), d = f.getSize(), b = m.getSize();
    await t.log("Extraction complete:"), await t.log(`  - Total nodes: ${r}`), await t.log(`  - Unique variables: ${u}`), await t.log(`  - Unique collections: ${d}`), await t.log(`  - Unique instances: ${b}`);
    const g = m.getSerializedTable(), y = /* @__PURE__ */ new Map();
    for (const [z, K] of Object.entries(g))
      if (K.instanceType === "remote") {
        const H = parseInt(z, 10);
        y.set(H, K);
      }
    if (y.size > 0) {
      await t.error(
        `Found ${y.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const z = (ne, oe, ce = [], pe = !1) => {
        const se = [];
        if (!ne || typeof ne != "object")
          return se;
        if (pe || ne.type === "PAGE") {
          const Q = ne.children || ne.child;
          if (Array.isArray(Q))
            for (const he of Q)
              he && typeof he == "object" && se.push(
                ...z(
                  he,
                  oe,
                  [],
                  !1
                )
              );
          return se;
        }
        const j = ne.name || "";
        if (typeof ne._instanceRef == "number" && ne._instanceRef === oe) {
          const Q = j || "(unnamed)", he = ce.length > 0 ? [...ce, Q] : [Q];
          return se.push({
            path: he,
            nodeName: Q
          }), se;
        }
        const Z = j ? [...ce, j] : ce, Y = ne.children || ne.child;
        if (Array.isArray(Y))
          for (const Q of Y)
            Q && typeof Q == "object" && se.push(
              ...z(
                Q,
                oe,
                Z,
                !1
              )
            );
        return se;
      }, K = [];
      let H = 1;
      for (const [ne, oe] of y.entries()) {
        const ce = oe.componentName || "(unnamed)", pe = oe.componentSetName, se = z(
          h,
          ne,
          [],
          !0
        );
        let j = "";
        se.length > 0 ? j = `
   Location(s): ${se.map((he) => {
          const Te = he.path.length > 0 ? he.path.join(" → ") : "page root";
          return `"${he.nodeName}" at ${Te}`;
        }).join(", ")}` : j = `
   Location: (unable to determine - instance may be deeply nested)`;
        const Z = pe ? `Component: "${ce}" (from component set "${pe}")` : `Component: "${ce}"`, Y = oe.remoteLibraryName ? `
   Library: ${oe.remoteLibraryName}` : "";
        K.push(
          `${H}. ${Z}${Y}${j}`
        ), H++;
      }
      const J = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${y.size} remote instance(s):
${K.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw await t.error(J), new Error(J);
    }
    if (d > 0) {
      await t.log("Collections found:");
      const z = f.getTable();
      for (const [K, H] of Object.values(z).entries()) {
        const J = H.collectionGuid ? ` (GUID: ${H.collectionGuid.substring(0, 8)}...)` : "";
        await t.log(
          `  ${K}: ${H.collectionName}${J} - ${H.modes.length} mode(s)`
        );
      }
    }
    await t.log("Checking for referenced component pages...");
    const $ = [], R = [], P = Object.values(g).filter(
      (z) => z.instanceType === "normal"
    );
    if (P.length > 0) {
      await t.log(
        `Found ${P.length} normal instance(s) to check`
      );
      const z = /* @__PURE__ */ new Map();
      for (const K of P)
        if (K.componentPageName) {
          const H = c.find((J) => J.name === K.componentPageName);
          if (H && !a.has(H.id))
            z.has(H.id) || z.set(H.id, H);
          else if (!H) {
            const J = `Normal instance references component "${K.componentName || "(unnamed)"}" on page "${K.componentPageName}", but that page was not found. Cannot export.`;
            throw await t.error(J), new Error(J);
          }
        } else {
          const H = `Normal instance references component "${K.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await t.error(H), new Error(H);
        }
      await t.log(
        `Found ${z.size} unique referenced page(s)`
      );
      for (const [K, H] of z.entries()) {
        const J = H.name;
        if (a.has(K)) {
          await t.log(`Skipping "${J}" - already processed`);
          continue;
        }
        const ne = H.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let oe = !1;
        if (ne)
          try {
            const j = JSON.parse(ne);
            oe = !!(j.id && j.version !== void 0);
          } catch (j) {
          }
        const ce = c.findIndex(
          (j) => j.id === H.id
        );
        if (ce === -1)
          throw await t.error(
            `Could not find page index for "${J}"`
          ), new Error(`Could not find page index for "${J}"`);
        const pe = Array.from(P).find(
          (j) => j.componentPageName === J
        ), se = pe == null ? void 0 : pe.componentName;
        if (e.skipPrompts) {
          K === l ? await t.log(
            `Skipping "${J}" - this is the original page being published`
          ) : R.find(
            (Z) => Z.pageId === K
          ) || (R.push({
            pageId: K,
            pageName: J,
            pageIndex: ce,
            hasMetadata: oe,
            componentName: se
          }), await t.log(
            `Discovered referenced page: "${J}" (will be handled by wizard)`
          )), await t.log(
            `Checking dependencies of "${J}" for transitive dependencies...`
          );
          try {
            const j = await Ye(
              {
                pageIndex: ce,
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
            if (j.success && j.data) {
              const Z = j.data;
              if (Z.discoveredReferencedPages)
                for (const Y of Z.discoveredReferencedPages) {
                  if (Y.pageId === l) {
                    await t.log(
                      `  Skipping "${Y.pageName}" - this is the original page being published`
                    );
                    continue;
                  }
                  R.find(
                    (he) => he.pageId === Y.pageId
                  ) || (R.push(Y), await t.log(
                    `  Discovered transitive dependency: "${Y.pageName}" (from ${J})`
                  ));
                }
            }
          } catch (j) {
            await t.warning(
              `Could not discover dependencies of "${J}": ${j instanceof Error ? j.message : String(j)}`
            );
          }
        } else {
          const j = `Do you want to also publish referenced component "${J}"?`;
          try {
            await Be.prompt(j, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 3e5
              // 5 minutes
            }), await t.log(`Exporting referenced page: "${J}"`);
            const Z = c.findIndex(
              (Q) => Q.id === H.id
            );
            if (Z === -1)
              throw await t.error(
                `Could not find page index for "${J}"`
              ), new Error(`Could not find page index for "${J}"`);
            const Y = await Ye(
              {
                pageIndex: Z
              },
              a,
              // Pass the same set to track all processed pages
              !0,
              // Mark as recursive call
              i
              // Pass discovered pages set (empty during actual export)
            );
            if (Y.success && Y.data) {
              const Q = Y.data;
              $.push(Q), await t.log(
                `Successfully exported referenced page: "${J}"`
              );
            } else
              throw new Error(
                `Failed to export referenced page "${J}": ${Y.message}`
              );
          } catch (Z) {
            if (Z instanceof Error && Z.message === "User cancelled")
              if (oe)
                await t.log(
                  `User declined to publish "${J}", but page has existing metadata. Continuing with existing metadata.`
                );
              else
                throw await t.error(
                  `Export cancelled: Referenced page "${J}" has no metadata and user declined to publish it.`
                ), new Error(
                  `Cannot continue export: Referenced component "${J}" has no metadata. Please publish it first or choose to publish it now.`
                );
            else
              throw Z;
          }
        }
      }
    }
    await t.log("Creating string table...");
    const B = new Qe();
    await t.log("Getting page metadata...");
    const V = o.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let I = "", E = 0;
    if (V)
      try {
        const z = JSON.parse(V);
        I = z.id || "", E = z.version || 0;
      } catch (z) {
        await t.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!I) {
      await t.log("Generating new GUID for page..."), I = await lt();
      const z = {
        _ver: 1,
        id: I,
        name: o.name,
        version: E,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      o.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(z)
      );
    }
    await t.log("Creating export data structure...");
    const T = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: I,
        version: E,
        name: o.name,
        pluginVersion: "1.0.0"
      },
      stringTable: B.getSerializedTable(),
      collections: f.getSerializedTable(),
      variables: p.getSerializedTable(),
      instances: m.getSerializedTable(),
      pageData: h
    };
    await t.log("Compressing JSON data...");
    const M = Aa(T, B);
    await t.log("Serializing to JSON...");
    const x = JSON.stringify(M, null, 2), v = (x.length / 1024).toFixed(2), S = Xe(o.name).trim().replace(/\s+/g, "_") + ".figma.json";
    await t.log(`JSON serialization complete: ${v} KB`), await t.log(`Export file: ${S}`), await t.log("=== Export Complete ===");
    const N = JSON.parse(x);
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: S,
        pageData: N,
        pageName: o.name,
        additionalPages: $,
        // Populated with referenced component pages
        discoveredReferencedPages: R.length > 0 ? (
          // Filter out the original page - it shouldn't be in the discovered list since it's the one being published
          R.filter((z) => z.pageId !== l)
        ) : void 0
        // Only include if there are discovered pages
      }
    };
  } catch (s) {
    const c = s instanceof Error ? s.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", s), console.error("Error message:", c), await t.error(`Export failed: ${c}`), s instanceof Error && s.stack && (console.error("Stack trace:", s.stack), await t.error(`Stack trace: ${s.stack}`));
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
const Ta = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: et,
  exportPage: Ye,
  extractNodeData: tt
}, Symbol.toStringTag, { value: "Module" }));
function me(e) {
  return e.replace(/[^a-zA-Z0-9]/g, "");
}
const kt = /* @__PURE__ */ new Map();
async function Re(e, a) {
  if (a.length === 0)
    return;
  const n = e.modes.find(
    (i) => i.name === "Mode 1" || i.name === "Default"
  );
  if (n && !a.includes(n.name)) {
    const i = a[0];
    try {
      const s = n.name;
      e.renameMode(n.modeId, i), kt.set(`${e.id}:${s}`, i), await t.log(
        `  Renamed default mode "${s}" to "${i}"`
      );
    } catch (s) {
      await t.warning(
        `  Failed to rename default mode "${n.name}" to "${i}": ${s}`
      );
    }
  }
  for (const i of a)
    e.modes.find((c) => c.name === i) || e.addMode(i);
}
const Ne = "recursica:collectionId";
async function qe(e) {
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
      Ne
    );
    if (n && n.trim() !== "")
      return n;
    const i = await lt();
    return e.setSharedPluginData("recursica", Ne, i), i;
  }
}
function Pa(e, a) {
  const n = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(n))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Va(e) {
  let a;
  const n = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], s = e.isLocal;
  if (s === !1 || s === void 0 && i.includes(n))
    try {
      const l = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((p) => p.name.trim().toLowerCase() === n);
      if (l) {
        Pa(e.collectionName, !1);
        const p = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          l.key
        );
        if (p.length > 0) {
          const f = await figma.variables.importVariableByKeyAsync(p[0].key), m = await figma.variables.getVariableCollectionByIdAsync(
            f.variableCollectionId
          );
          if (m) {
            if (a = m, e.collectionGuid) {
              const h = a.getSharedPluginData(
                "recursica",
                Ne
              );
              (!h || h.trim() === "") && a.setSharedPluginData(
                "recursica",
                Ne,
                e.collectionGuid
              );
            } else
              await qe(a);
            return await Re(a, e.modes), { collection: a };
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
    let l;
    if (e.collectionGuid && (l = o.find((p) => p.getSharedPluginData("recursica", Ne) === e.collectionGuid)), l || (l = o.find(
      (p) => p.name === e.collectionName
    )), l)
      if (a = l, e.collectionGuid) {
        const p = a.getSharedPluginData(
          "recursica",
          Ne
        );
        (!p || p.trim() === "") && a.setSharedPluginData(
          "recursica",
          Ne,
          e.collectionGuid
        );
      } else
        await qe(a);
    else
      a = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? a.setSharedPluginData(
        "recursica",
        Ne,
        e.collectionGuid
      ) : await qe(a);
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
    ), h = await figma.variables.getVariableCollectionByIdAsync(
      m.variableCollectionId
    );
    if (!h)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (a = h, e.collectionGuid) {
      const r = a.getSharedPluginData(
        "recursica",
        Ne
      );
      (!r || r.trim() === "") && a.setSharedPluginData(
        "recursica",
        Ne,
        e.collectionGuid
      );
    } else
      qe(a);
  }
  return await Re(a, e.modes), { collection: a };
}
async function dt(e, a) {
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
async function Oa(e, a, n, i, s) {
  await t.log(
    `Restoring values for variable "${e.name}" (type: ${e.resolvedType}):`
  ), await t.log(
    `  valuesByMode keys: ${Object.keys(a).join(", ")}`
  );
  for (const [c, o] of Object.entries(a)) {
    const l = kt.get(`${i.id}:${c}`) || c;
    let p = i.modes.find((m) => m.name === l);
    if (p || (p = i.modes.find((m) => m.name === c)), !p) {
      await t.warning(
        `Mode "${c}" (mapped: "${l}") not found in collection "${i.name}" for variable "${e.name}". Available modes: ${i.modes.map((m) => m.name).join(", ")}. Skipping.`
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
        const r = e.valuesByMode[f];
        if (await t.log(
          `  Set color value for "${e.name}" mode "${c}": r=${h.r.toFixed(3)}, g=${h.g.toFixed(3)}, b=${h.b.toFixed(3)}${h.a !== void 0 ? `, a=${h.a.toFixed(3)}` : ""}`
        ), await t.log(
          `  Read back value: ${JSON.stringify(r)}`
        ), typeof r == "object" && r !== null && "r" in r && "g" in r && "b" in r) {
          const u = r, d = Math.abs(u.r - h.r) < 1e-3, b = Math.abs(u.g - h.g) < 1e-3, g = Math.abs(u.b - h.b) < 1e-3;
          !d || !b || !g ? await t.warning(
            `  ⚠️ Value mismatch! Set: r=${h.r}, g=${h.g}, b=${h.b}, Read back: r=${u.r}, g=${u.g}, b=${u.b}`
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
        let h = null;
        const r = n.getVariableByIndex(
          m._varRef
        );
        if (r) {
          let u = null;
          if (s && r._colRef !== void 0) {
            const d = s.getCollectionByIndex(
              r._colRef
            );
            d && (u = (await Va(d)).collection);
          }
          u && (h = await dt(
            u,
            r.variableName
          ));
        }
        if (h) {
          const u = {
            type: "VARIABLE_ALIAS",
            id: h.id
          };
          e.setValueForMode(f, u);
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
async function ct(e, a, n, i) {
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
  if (e.valuesByMode && await Oa(
    s,
    e.valuesByMode,
    n,
    a,
    // Pass collection to look up modes by name
    i
  ), e.valuesByMode && s.valuesByMode) {
    await t.log(`  Verifying values for "${e.variableName}":`);
    for (const [c, o] of Object.entries(
      e.valuesByMode
    )) {
      const l = a.modes.find((p) => p.name === c);
      if (l) {
        const p = s.valuesByMode[l.modeId];
        await t.log(
          `    Mode "${c}": expected=${JSON.stringify(o)}, actual=${JSON.stringify(p)}`
        );
      }
    }
  }
  return s;
}
async function Ma(e, a, n, i) {
  const s = a.getVariableByIndex(e);
  if (!s || s._colRef === void 0)
    return null;
  const c = i.get(String(s._colRef));
  if (!c)
    return null;
  const o = await dt(
    c,
    s.variableName
  );
  if (o) {
    let l;
    if (typeof s.variableType == "number" ? l = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[s.variableType] || String(s.variableType) : l = s.variableType, Lt(o, l))
      return o;
  }
  return await ct(
    s,
    c,
    a,
    n
  );
}
async function Ra(e, a, n, i) {
  if (!(!a || typeof a != "object"))
    try {
      const s = e[n];
      if (!s || !Array.isArray(s))
        return;
      const c = a[n];
      if (Array.isArray(c))
        for (let o = 0; o < c.length && o < s.length; o++) {
          const l = c[o];
          if (l && typeof l == "object") {
            if (s[o].boundVariables || (s[o].boundVariables = {}), Ve(l)) {
              const p = l._varRef;
              if (p !== void 0) {
                const f = i.get(String(p));
                f && (s[o].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: f.id
                });
              }
            } else
              for (const [p, f] of Object.entries(
                l
              ))
                if (Ve(f)) {
                  const m = f._varRef;
                  if (m !== void 0) {
                    const h = i.get(String(m));
                    h && (s[o].boundVariables[p] = {
                      type: "VARIABLE_ALIAS",
                      id: h.id
                    });
                  }
                }
          }
        }
    } catch (s) {
      console.log(`Error restoring bound variables for ${n}:`, s);
    }
}
function xa(e, a, n = !1) {
  const i = aa(a);
  if (e.visible === void 0 && (e.visible = i.visible), e.locked === void 0 && (e.locked = i.locked), e.opacity === void 0 && (e.opacity = i.opacity), e.rotation === void 0 && (e.rotation = i.rotation), e.blendMode === void 0 && (e.blendMode = i.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const s = fe;
    e.layoutMode === void 0 && (e.layoutMode = s.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = s.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = s.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = s.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = s.counterAxisAlignItems), n || (e.paddingLeft === void 0 && (e.paddingLeft = s.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = s.paddingRight), e.paddingTop === void 0 && (e.paddingTop = s.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = s.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = s.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = s.counterAxisSpacing));
  }
  if (a === "TEXT") {
    const s = ve;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = s.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = s.textAlignVertical), e.textCase === void 0 && (e.textCase = s.textCase), e.textDecoration === void 0 && (e.textDecoration = s.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = s.textAutoResize);
  }
}
async function Ue(e, a, n = null, i = null, s = null, c = null, o = null, l = !1, p = null, f = null, m = null, h = null) {
  var I, E, T, M, x, v, G, S, N, U, z, K, H, J, ne, oe, ce, pe, se, j, Z, Y, Q, he, Te, Ge, Oe, mt, ft, ut, ht, yt, bt, wt, $t;
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
        let F = 0, w = 0;
        for (const [A, L] of Object.entries(C))
          try {
            const k = L.type;
            let O = null;
            if (typeof k == "string" ? (k === "TEXT" || k === "BOOLEAN" || k === "INSTANCE_SWAP" || k === "VARIANT") && (O = k) : typeof k == "number" && (O = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[k] || null), !O) {
              await t.warning(
                `  Unknown property type ${k} (${typeof k}) for property "${A}" in component "${e.name || "Unnamed"}"`
              ), w++;
              continue;
            }
            const _ = L.defaultValue, W = A.split("#")[0];
            r.addComponentProperty(
              W,
              O,
              _
            ), F++;
          } catch (k) {
            await t.warning(
              `  Failed to add component property "${A}" to "${e.name || "Unnamed"}": ${k}`
            ), w++;
          }
        F > 0 && await t.log(
          `  Added ${F} component property definition(s) to "${e.name || "Unnamed"}"${w > 0 ? ` (${w} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const C = e.children ? e.children.filter((A) => A.type === "COMPONENT").length : 0;
      await t.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${C} component variant(s)`
      );
      const F = [];
      let w = null;
      if (e.children && Array.isArray(e.children)) {
        w = figma.createFrame(), w.name = `_temp_${e.name || "COMPONENT_SET"}`, w.visible = !1, ((a == null ? void 0 : a.type) === "PAGE" ? a : figma.currentPage).appendChild(w);
        for (const L of e.children)
          if (L.type === "COMPONENT" && !L._truncated)
            try {
              const k = await Ue(
                L,
                w,
                // Use temp parent for now
                n,
                i,
                s,
                c,
                o,
                l,
                p,
                f,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                h
              );
              k && k.type === "COMPONENT" && (F.push(k), await t.log(
                `  Created component variant: "${k.name || "Unnamed"}"`
              ));
            } catch (k) {
              await t.warning(
                `  Failed to create component variant "${L.name || "Unnamed"}": ${k}`
              );
            }
      }
      if (F.length > 0)
        try {
          const A = a || figma.currentPage, L = figma.combineAsVariants(
            F,
            A
          );
          e.name && (L.name = e.name), e.x !== void 0 && (L.x = e.x), e.y !== void 0 && (L.y = e.y), w && w.parent && w.remove(), await t.log(
            `  ✓ Successfully created COMPONENT_SET "${L.name}" with ${F.length} variant(s)`
          ), r = L;
        } catch (A) {
          if (await t.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${A}. Falling back to frame.`
          ), r = figma.createFrame(), e.name && (r.name = e.name), w && w.children.length > 0) {
            for (const L of w.children)
              r.appendChild(L);
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
      else if (e._instanceRef !== void 0 && s && o) {
        const C = s.getInstanceByIndex(
          e._instanceRef
        );
        if (C && C.instanceType === "internal")
          if (C.componentNodeId)
            if (C.componentNodeId === e.id)
              await t.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), r = figma.createFrame(), e.name && (r.name = e.name);
            else {
              const F = o.get(
                C.componentNodeId
              );
              if (!F) {
                const w = Array.from(o.keys()).slice(
                  0,
                  20
                );
                await t.error(
                  `Component not found for internal instance "${e.name}" (ID: ${C.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await t.error(
                  `Looking for component ID: ${C.componentNodeId}`
                ), await t.error(
                  `Available IDs in mapping (first 20): ${w.map((_) => _.substring(0, 8) + "...").join(", ")}`
                );
                const A = (_, W) => {
                  if (_.type === "COMPONENT" && _.id === W)
                    return !0;
                  if (_.children && Array.isArray(_.children)) {
                    for (const D of _.children)
                      if (!D._truncated && A(D, W))
                        return !0;
                  }
                  return !1;
                }, L = A(
                  e,
                  C.componentNodeId
                );
                await t.error(
                  `Component ID ${C.componentNodeId.substring(0, 8)}... exists in current node tree: ${L}`
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
                  (_) => _.startsWith(C.componentNodeId.substring(0, 8))
                );
                k.length > 0 && await t.error(
                  `Found IDs with matching prefix: ${k.map((_) => _.substring(0, 8) + "...").join(", ")}`
                );
                const O = `Component not found for internal instance "${e.name}" (ID: ${C.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${w.map((_) => _.substring(0, 8) + "...").join(", ")}`;
                throw new Error(O);
              }
              if (F && F.type === "COMPONENT") {
                if (r = F.createInstance(), await t.log(
                  `✓ Created internal instance "${e.name}" from component "${C.componentName}"`
                ), C.variantProperties && Object.keys(C.variantProperties).length > 0)
                  try {
                    let w = null;
                    if (F.parent && F.parent.type === "COMPONENT_SET")
                      w = F.parent.componentPropertyDefinitions, await t.log(
                        `  DEBUG: Component "${C.componentName}" is inside component set "${F.parent.name}" with ${Object.keys(w || {}).length} property definitions`
                      );
                    else {
                      const A = await r.getMainComponentAsync();
                      if (A) {
                        const L = A.type;
                        await t.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${F.parent ? F.parent.type : "N/A"}, mainComponent type: ${L}, mainComponent parent: ${A.parent ? A.parent.type : "N/A"}`
                        ), L === "COMPONENT_SET" ? w = A.componentPropertyDefinitions : L === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? (w = A.parent.componentPropertyDefinitions, await t.log(
                          `  DEBUG: Found component set parent "${A.parent.name}" with ${Object.keys(w || {}).length} property definitions`
                        )) : await t.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${C.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (w) {
                      const A = {};
                      for (const [L, k] of Object.entries(
                        C.variantProperties
                      )) {
                        const O = L.split("#")[0];
                        w[O] && (A[O] = k);
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
                      const L = w.type;
                      if (L === "COMPONENT_SET" ? A = w.componentPropertyDefinitions : L === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? A = w.parent.componentPropertyDefinitions : L === "COMPONENT" && (A = w.componentPropertyDefinitions), A)
                        for (const [k, O] of Object.entries(
                          C.componentProperties
                        )) {
                          const _ = k.split("#")[0];
                          if (A[_])
                            try {
                              let W = O;
                              O && typeof O == "object" && "value" in O && (W = O.value), r.setProperties({
                                [_]: W
                              });
                            } catch (W) {
                              const D = `Failed to set component property "${_}" for internal instance "${e.name}": ${W}`;
                              throw await t.error(D), new Error(D);
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
              } else if (!r && F) {
                const w = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${C.componentNodeId.substring(0, 8)}...).`;
                throw await t.error(w), new Error(w);
              }
            }
          else {
            const F = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await t.error(F), new Error(F);
          }
        else if (C && C.instanceType === "remote")
          if (p) {
            const F = p.get(
              e._instanceRef
            );
            if (F) {
              if (r = F.createInstance(), await t.log(
                `✓ Created remote instance "${e.name}" from component "${C.componentName}" on REMOTES page`
              ), C.variantProperties && Object.keys(C.variantProperties).length > 0)
                try {
                  const w = await r.getMainComponentAsync();
                  if (w) {
                    let A = null;
                    const L = w.type;
                    if (L === "COMPONENT_SET" ? A = w.componentPropertyDefinitions : L === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? A = w.parent.componentPropertyDefinitions : await t.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), A) {
                      const k = {};
                      for (const [O, _] of Object.entries(
                        C.variantProperties
                      )) {
                        const W = O.split("#")[0];
                        A[W] && (k[W] = _);
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
                    const L = w.type;
                    if (L === "COMPONENT_SET" ? A = w.componentPropertyDefinitions : L === "COMPONENT" && w.parent && w.parent.type === "COMPONENT_SET" ? A = w.parent.componentPropertyDefinitions : L === "COMPONENT" && (A = w.componentPropertyDefinitions), A)
                      for (const [k, O] of Object.entries(
                        C.componentProperties
                      )) {
                        const _ = k.split("#")[0];
                        if (A[_])
                          try {
                            let W = O;
                            O && typeof O == "object" && "value" in O && (W = O.value), r.setProperties({
                              [_]: W
                            });
                          } catch (W) {
                            const D = `Failed to set component property "${_}" for remote instance "${e.name}": ${W}`;
                            throw await t.error(D), new Error(D);
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
            const F = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await t.error(F), new Error(F);
          }
        else if ((C == null ? void 0 : C.instanceType) === "normal") {
          if (!C.componentPageName) {
            const O = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw await t.error(O), new Error(O);
          }
          await figma.loadAllPagesAsync();
          const F = figma.root.children.find(
            (O) => O.name === C.componentPageName
          );
          if (!F) {
            await t.log(
              `  Deferring normal instance "${e.name}" - referenced page "${C.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const O = figma.createFrame();
            if (O.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (O.x = e.x), e.y !== void 0 && (O.y = e.y), e.width !== void 0 && e.height !== void 0 ? O.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && O.resize(e.w, e.h), f) {
              const _ = {
                placeholderFrameId: O.id,
                instanceEntry: C,
                nodeData: e,
                parentNodeId: a.id,
                instanceIndex: e._instanceRef
              };
              f.push(_), await t.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${f.length})`
              );
            } else
              await t.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            r = O;
            break;
          }
          let w = null;
          const A = (O, _, W, D, q) => {
            if (_.length === 0) {
              let ae = null;
              for (const re of O.children || [])
                if (re.type === "COMPONENT") {
                  if (re.name === W)
                    if (ae || (ae = re), D)
                      try {
                        const le = re.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (le && JSON.parse(le).id === D)
                          return re;
                      } catch (le) {
                      }
                    else
                      return re;
                } else if (re.type === "COMPONENT_SET") {
                  if (q && re.name !== q)
                    continue;
                  for (const le of re.children || [])
                    if (le.type === "COMPONENT" && le.name === W)
                      if (ae || (ae = le), D)
                        try {
                          const Me = le.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Me && JSON.parse(Me).id === D)
                            return le;
                        } catch (Me) {
                        }
                      else
                        return le;
                }
              return ae;
            }
            const [ie, ...te] = _;
            for (const ae of O.children || [])
              if (ae.name === ie) {
                if (te.length === 0 && ae.type === "COMPONENT_SET") {
                  if (q && ae.name !== q)
                    continue;
                  for (const re of ae.children || [])
                    if (re.type === "COMPONENT" && re.name === W) {
                      if (D)
                        try {
                          const le = re.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (le && JSON.parse(le).id === D)
                            return re;
                        } catch (le) {
                        }
                      return re;
                    }
                  return null;
                }
                return A(
                  ae,
                  te,
                  W,
                  D,
                  q
                );
              }
            return null;
          };
          await t.log(
            `  Looking for component "${C.componentName}" on page "${C.componentPageName}"${C.path && C.path.length > 0 ? ` at path [${C.path.join(" → ")}]` : " at page root"}${C.componentGuid ? ` (GUID: ${C.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const L = [], k = (O, _ = 0) => {
            const W = "  ".repeat(_);
            if (O.type === "COMPONENT")
              L.push(`${W}COMPONENT: "${O.name}"`);
            else if (O.type === "COMPONENT_SET") {
              L.push(
                `${W}COMPONENT_SET: "${O.name}"`
              );
              for (const D of O.children || [])
                D.type === "COMPONENT" && L.push(
                  `${W}  └─ COMPONENT: "${D.name}"`
                );
            }
            for (const D of O.children || [])
              k(D, _ + 1);
          };
          if (k(F), L.length > 0 ? await t.log(
            `  Available components on page "${C.componentPageName}":
${L.slice(0, 20).join(`
`)}${L.length > 20 ? `
  ... and ${L.length - 20} more` : ""}`
          ) : await t.warning(
            `  No components found on page "${C.componentPageName}"`
          ), w = A(
            F,
            C.path || [],
            C.componentName,
            C.componentGuid,
            C.componentSetName
          ), w && C.componentGuid)
            try {
              const O = w.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (O) {
                const _ = JSON.parse(O);
                _.id !== C.componentGuid ? await t.warning(
                  `  Found component "${C.componentName}" by name but GUID verification failed (expected ${C.componentGuid.substring(0, 8)}..., got ${_.id ? _.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : await t.log(
                  `  Found component "${C.componentName}" with matching GUID ${C.componentGuid.substring(0, 8)}...`
                );
              } else
                await t.warning(
                  `  Found component "${C.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (O) {
              await t.warning(
                `  Found component "${C.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!w) {
            await t.log(
              `  Deferring normal instance "${e.name}" - component "${C.componentName}" not found on page "${C.componentPageName}" (may not be created yet due to circular reference)`
            );
            const O = figma.createFrame();
            if (O.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (O.x = e.x), e.y !== void 0 && (O.y = e.y), e.width !== void 0 && e.height !== void 0 ? O.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && O.resize(e.w, e.h), f) {
              const _ = {
                placeholderFrameId: O.id,
                instanceEntry: C,
                nodeData: e,
                parentNodeId: a.id,
                instanceIndex: e._instanceRef
              };
              f.push(_), await t.log(
                `  [DEBUG] Added deferred instance "${e.name}" to array (array length: ${f.length})`
              );
            } else
              await t.log(
                `  [DEBUG] deferredInstances array is null/undefined - cannot store deferred instance "${e.name}"`
              );
            r = O;
            break;
          }
          if (r = w.createInstance(), await t.log(
            `  Created normal instance "${e.name}" from component "${C.componentName}" on page "${C.componentPageName}"`
          ), C.variantProperties && Object.keys(C.variantProperties).length > 0)
            try {
              const O = await r.getMainComponentAsync();
              if (O) {
                let _ = null;
                const W = O.type;
                if (W === "COMPONENT_SET" ? _ = O.componentPropertyDefinitions : W === "COMPONENT" && O.parent && O.parent.type === "COMPONENT_SET" ? _ = O.parent.componentPropertyDefinitions : await t.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), _) {
                  const D = {};
                  for (const [q, ie] of Object.entries(
                    C.variantProperties
                  )) {
                    const te = q.split("#")[0];
                    _[te] && (D[te] = ie);
                  }
                  Object.keys(D).length > 0 && r.setProperties(D);
                }
              }
            } catch (O) {
              await t.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${O}`
              );
            }
          if (C.componentProperties && Object.keys(C.componentProperties).length > 0)
            try {
              const O = await r.getMainComponentAsync();
              if (O) {
                let _ = null;
                const W = O.type;
                if (W === "COMPONENT_SET" ? _ = O.componentPropertyDefinitions : W === "COMPONENT" && O.parent && O.parent.type === "COMPONENT_SET" ? _ = O.parent.componentPropertyDefinitions : W === "COMPONENT" && (_ = O.componentPropertyDefinitions), _) {
                  const D = {};
                  for (const [q, ie] of Object.entries(
                    C.componentProperties
                  )) {
                    const te = q.split("#")[0];
                    let ae;
                    if (_[q] ? ae = q : _[te] ? ae = te : ae = Object.keys(_).find(
                      (re) => re.split("#")[0] === te
                    ), ae) {
                      const re = ie && typeof ie == "object" && "value" in ie ? ie.value : ie;
                      D[ae] = re;
                    } else
                      await t.warning(
                        `Component property "${te}" (from "${q}") does not exist on component "${C.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(_).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(D).length > 0)
                    try {
                      await t.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(D).join(", ")}`
                      ), await t.log(
                        `  Available component properties: ${Object.keys(_).join(", ")}`
                      ), r.setProperties(D), await t.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(D).join(", ")}`
                      );
                    } catch (q) {
                      await t.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${q}`
                      ), await t.warning(
                        `  Properties attempted: ${JSON.stringify(D)}`
                      ), await t.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(_))}`
                      );
                    }
                }
              } else
                await t.warning(
                  `Cannot set component properties for normal instance "${e.name}" - main component not found`
                );
            } catch (O) {
              await t.warning(
                `Failed to set component properties for normal instance "${e.name}": ${O}`
              );
            }
          if (e.width !== void 0 && e.height !== void 0)
            try {
              r.resize(e.width, e.height);
            } catch (O) {
              await t.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const F = `Instance "${e.name}" has unknown or missing instance type: ${(C == null ? void 0 : C.instanceType) || "unknown"}`;
          throw await t.error(F), new Error(F);
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
      const C = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await t.error(C), new Error(C);
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
  const u = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  xa(
    r,
    e.type || "FRAME",
    u
  ), e.name !== void 0 && (r.name = e.name || "Unnamed Node");
  const d = m && m.layoutMode !== void 0 && m.layoutMode !== "NONE", b = a && "layoutMode" in a && a.layoutMode !== "NONE";
  d || b || (e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y));
  const y = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height), $ = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && await t.log(
    `  [ISSUE #3 DEBUG] "${$}" has preserveRatio in nodeData: ${e.preserveRatio}`
  ), e.constraints !== void 0 && await t.log(
    `  [ISSUE #4 DEBUG] "${$}" has constraints in nodeData: ${JSON.stringify(e.constraints)}`
  ), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && await t.log(
    `  [ISSUE #4 DEBUG] "${$}" has constraintHorizontal: ${e.constraintHorizontal}, constraintVertical: ${e.constraintVertical}`
  ), e.type !== "VECTOR" && e.width !== void 0 && e.height !== void 0 && !y) {
    const C = r.preserveRatio;
    C !== void 0 && await t.log(
      `  [ISSUE #3 DEBUG] "${$}" preserveRatio before resize: ${C}`
    ), r.resize(e.width, e.height);
    const F = r.preserveRatio;
    F !== void 0 ? await t.log(
      `  [ISSUE #3 DEBUG] "${$}" preserveRatio after resize: ${F}`
    ) : e.preserveRatio !== void 0 && await t.warning(
      `  ⚠️ ISSUE #3: "${$}" preserveRatio was in nodeData (${e.preserveRatio}) but not set on node!`
    );
    const w = e.constraintHorizontal || ((I = e.constraints) == null ? void 0 : I.horizontal), A = e.constraintVertical || ((E = e.constraints) == null ? void 0 : E.vertical);
    (w !== void 0 || A !== void 0) && await t.log(
      `  [ISSUE #4] "${$}" (${e.type}) - Expected constraints from JSON: H=${w || "undefined"}, V=${A || "undefined"}`
    );
    const L = (T = r.constraints) == null ? void 0 : T.horizontal, k = (M = r.constraints) == null ? void 0 : M.vertical;
    (w !== void 0 || A !== void 0) && await t.log(
      `  [ISSUE #4] "${$}" (${e.type}) - Constraints after resize (before setting): H=${L || "undefined"}, V=${k || "undefined"}`
    );
    const O = e.constraintHorizontal !== void 0 || ((x = e.constraints) == null ? void 0 : x.horizontal) !== void 0, _ = e.constraintVertical !== void 0 || ((v = e.constraints) == null ? void 0 : v.vertical) !== void 0;
    if (O || _) {
      const q = e.constraintHorizontal || ((G = e.constraints) == null ? void 0 : G.horizontal), ie = e.constraintVertical || ((S = e.constraints) == null ? void 0 : S.vertical), te = q || L || "MIN", ae = ie || k || "MIN";
      try {
        await t.log(
          `  [ISSUE #4] Setting constraints for "${$}" (${e.type}): H=${te} (from ${q || "default"}), V=${ae} (from ${ie || "default"})`
        ), r.constraints = {
          horizontal: te,
          vertical: ae
        };
        const re = (N = r.constraints) == null ? void 0 : N.horizontal, le = (U = r.constraints) == null ? void 0 : U.vertical;
        re === te && le === ae ? await t.log(
          `  [ISSUE #4] ✓ Constraints set successfully: H=${re}, V=${le} for "${$}"`
        ) : await t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${te}, V=${ae}, got H=${re || "undefined"}, V=${le || "undefined"} for "${$}"`
        );
      } catch (re) {
        await t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${$}" (${e.type}): ${re instanceof Error ? re.message : String(re)}`
        );
      }
    }
    const W = r.constraintHorizontal, D = r.constraintVertical;
    (w !== void 0 || A !== void 0) && (await t.log(
      `  [ISSUE #4] "${$}" (${e.type}) - Final constraints: H=${W || "undefined"}, V=${D || "undefined"}`
    ), w !== void 0 && W !== w && await t.warning(
      `  ⚠️ ISSUE #4: "${$}" constraintHorizontal mismatch! Expected: ${w}, Got: ${W || "undefined"}`
    ), A !== void 0 && D !== A && await t.warning(
      `  ⚠️ ISSUE #4: "${$}" constraintVertical mismatch! Expected: ${A}, Got: ${D || "undefined"}`
    ), w !== void 0 && A !== void 0 && W === w && D === A && await t.log(
      `  ✓ ISSUE #4: "${$}" constraints correctly set: H=${W}, V=${D}`
    ));
  } else {
    const C = e.constraintHorizontal || ((z = e.constraints) == null ? void 0 : z.horizontal), F = e.constraintVertical || ((K = e.constraints) == null ? void 0 : K.vertical);
    if ((C !== void 0 || F !== void 0) && (e.type === "VECTOR" ? await t.log(
      `  [ISSUE #4] "${$}" (VECTOR) - Constraints already set earlier (skipping "no resize" path)`
    ) : await t.log(
      `  [ISSUE #4] "${$}" (${e.type}) - Setting constraints (no resize): Expected H=${C || "undefined"}, V=${F || "undefined"}`
    )), e.type !== "VECTOR") {
      const w = e.constraintHorizontal !== void 0 || ((H = e.constraints) == null ? void 0 : H.horizontal) !== void 0, A = e.constraintVertical !== void 0 || ((J = e.constraints) == null ? void 0 : J.vertical) !== void 0;
      if (w || A) {
        const L = e.constraintHorizontal || ((ne = e.constraints) == null ? void 0 : ne.horizontal), k = e.constraintVertical || ((oe = e.constraints) == null ? void 0 : oe.vertical), O = r.constraints || {}, _ = O.horizontal || "MIN", W = O.vertical || "MIN", D = L || _, q = k || W;
        try {
          await t.log(
            `  [ISSUE #4] Setting constraints for "${$}" (${e.type}) (no resize): H=${D} (from ${L || "current"}), V=${q} (from ${k || "current"})`
          ), r.constraints = {
            horizontal: D,
            vertical: q
          };
          const ie = (ce = r.constraints) == null ? void 0 : ce.horizontal, te = (pe = r.constraints) == null ? void 0 : pe.vertical;
          ie === D && te === q ? await t.log(
            `  [ISSUE #4] ✓ Constraints set successfully (no resize): H=${ie}, V=${te} for "${$}"`
          ) : await t.warning(
            `  [ISSUE #4] ⚠️ Constraints set but verification failed (no resize)! Expected H=${D}, V=${q}, got H=${ie || "undefined"}, V=${te || "undefined"} for "${$}"`
          );
        } catch (ie) {
          await t.warning(
            `  [ISSUE #4] ✗ Failed to set constraints for "${$}" (${e.type}) (no resize): ${ie instanceof Error ? ie.message : String(ie)}`
          );
        }
      }
    }
    if (e.type !== "VECTOR" && (C !== void 0 || F !== void 0)) {
      const w = (se = r.constraints) == null ? void 0 : se.horizontal, A = (j = r.constraints) == null ? void 0 : j.vertical;
      await t.log(
        `  [ISSUE #4] "${$}" (${e.type}) - Final constraints (no resize): H=${w || "undefined"}, V=${A || "undefined"}`
      ), C !== void 0 && w !== C && await t.warning(
        `  ⚠️ ISSUE #4: "${$}" constraintHorizontal mismatch! Expected: ${C}, Got: ${w || "undefined"}`
      ), F !== void 0 && A !== F && await t.warning(
        `  ⚠️ ISSUE #4: "${$}" constraintVertical mismatch! Expected: ${F}, Got: ${A || "undefined"}`
      ), C !== void 0 && F !== void 0 && w === C && A === F && await t.log(
        `  ✓ ISSUE #4: "${$}" constraints correctly set (no resize): H=${w}, V=${A}`
      );
    }
  }
  const R = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (!R || !e.boundVariables.opacity) && (r.opacity = e.opacity), e.rotation !== void 0 && (!R || !e.boundVariables.rotation) && (r.rotation = e.rotation), e.blendMode !== void 0 && (!R || !e.boundVariables.blendMode) && (r.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (await t.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((Z = e.id) == null ? void 0 : Z.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && await t.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let C = e.fills;
        const F = e.name || "Unnamed";
        if (Array.isArray(C))
          for (let w = 0; w < C.length; w++) {
            const A = C[w];
            A && typeof A == "object" && A.selectionColor !== void 0 && await t.log(
              `  [ISSUE #2 DEBUG] "${F}" fill[${w}] has selectionColor: ${JSON.stringify(A.selectionColor)}`
            );
          }
        if (Array.isArray(C)) {
          const w = e.name || "Unnamed";
          for (let A = 0; A < C.length; A++) {
            const L = C[A];
            L && typeof L == "object" && L.selectionColor !== void 0 && await t.warning(
              `  ⚠️ ISSUE #2: "${w}" fill[${A}] has selectionColor that will be preserved: ${JSON.stringify(L.selectionColor)}`
            );
          }
          C = C.map((A) => {
            if (A && typeof A == "object") {
              const L = ee({}, A);
              return delete L.boundVariables, L;
            }
            return A;
          });
        }
        if (e.fills && Array.isArray(e.fills) && c) {
          if (e.type === "VECTOR") {
            await t.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let k = 0; k < e.fills.length; k++) {
              const O = e.fills[k];
              if (O && typeof O == "object") {
                const _ = O.boundVariables || O.bndVar;
                _ ? await t.log(
                  `  DEBUG:   fill[${k}] has boundVariables: ${JSON.stringify(_)}`
                ) : await t.log(
                  `  DEBUG:   fill[${k}] has no boundVariables`
                );
              }
            }
          }
          const w = [];
          for (let k = 0; k < C.length; k++) {
            const O = C[k], _ = e.fills[k];
            if (!_ || typeof _ != "object") {
              w.push(O);
              continue;
            }
            const W = _.boundVariables || _.bndVar;
            if (!W) {
              w.push(O);
              continue;
            }
            const D = ee({}, O);
            D.boundVariables = {};
            for (const [q, ie] of Object.entries(W))
              if (e.type === "VECTOR" && await t.log(
                `  DEBUG: Processing fill[${k}].${q} on VECTOR "${r.name || "Unnamed"}": varInfo=${JSON.stringify(ie)}`
              ), Ve(ie)) {
                const te = ie._varRef;
                if (te !== void 0) {
                  if (e.type === "VECTOR") {
                    await t.log(
                      `  DEBUG: Looking up variable reference ${te} in recognizedVariables (map has ${c.size} entries)`
                    );
                    const re = Array.from(
                      c.keys()
                    ).slice(0, 10);
                    await t.log(
                      `  DEBUG: Available variable references (first 10): ${re.join(", ")}`
                    );
                    const le = c.has(String(te));
                    if (await t.log(
                      `  DEBUG: Variable reference ${te} ${le ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !le) {
                      const Me = Array.from(
                        c.keys()
                      ).sort((St, Wt) => parseInt(St) - parseInt(Wt));
                      await t.log(
                        `  DEBUG: All available variable references: ${Me.join(", ")}`
                      );
                    }
                  }
                  let ae = c.get(String(te));
                  ae || (e.type === "VECTOR" && await t.log(
                    `  DEBUG: Variable ${te} not in recognizedVariables. variableTable=${!!n}, collectionTable=${!!i}, recognizedCollections=${!!h}`
                  ), n && i && h ? (await t.log(
                    `  Variable reference ${te} not in recognizedVariables, attempting to resolve from variable table...`
                  ), ae = await Ma(
                    te,
                    n,
                    i,
                    h
                  ) || void 0, ae ? (c.set(String(te), ae), await t.log(
                    `  ✓ Resolved variable ${ae.name} from variable table and added to recognizedVariables`
                  )) : await t.warning(
                    `  Failed to resolve variable ${te} from variable table`
                  )) : e.type === "VECTOR" && await t.warning(
                    `  Cannot resolve variable ${te} from table - missing required parameters`
                  )), ae ? (D.boundVariables[q] = {
                    type: "VARIABLE_ALIAS",
                    id: ae.id
                  }, await t.log(
                    `  ✓ Restored bound variable for fill[${k}].${q} on "${r.name || "Unnamed"}" (${e.type}): variable ${ae.name} (ID: ${ae.id.substring(0, 8)}...)`
                  )) : await t.warning(
                    `  Variable reference ${te} not found in recognizedVariables for fill[${k}].${q} on "${r.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && await t.warning(
                    `  DEBUG: Variable reference ${te} is undefined for fill[${k}].${q} on VECTOR "${r.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && await t.warning(
                  `  DEBUG: fill[${k}].${q} on VECTOR "${r.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(ie)}`
                );
            w.push(D);
          }
          r.fills = w, await t.log(
            `  ✓ Set fills with boundVariables on "${r.name || "Unnamed"}" (${e.type})`
          );
          const A = r.fills, L = e.name || "Unnamed";
          if (Array.isArray(A))
            for (let k = 0; k < A.length; k++) {
              const O = A[k];
              O && typeof O == "object" && O.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${L}" fill[${k}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify(O.selectionColor)}`
              );
            }
        } else {
          r.fills = C;
          const w = r.fills, A = e.name || "Unnamed";
          if (Array.isArray(w))
            for (let L = 0; L < w.length; L++) {
              const k = w[L];
              k && typeof k == "object" && k.selectionColor !== void 0 && await t.warning(
                `  ⚠️ ISSUE #2: "${A}" fill[${L}] has selectionColor AFTER setting: ${JSON.stringify(k.selectionColor)}`
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
  const P = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!P || !e.boundVariables.strokeWeight) && (r.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!P || !e.boundVariables.strokeWeight) && (r.strokeWeight = 0), e.strokeAlign !== void 0 && (!P || !e.boundVariables.strokeAlign) && (r.strokeAlign = e.strokeAlign);
  const B = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!B || !e.boundVariables.cornerRadius) && (r.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (r.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
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
        const A = e.boundVariables[w];
        if (A && Ve(A)) {
          const L = A._varRef;
          if (L !== void 0) {
            const k = c.get(String(L));
            if (k) {
              const O = {
                type: "VARIABLE_ALIAS",
                id: k.id
              };
              r.boundVariables || (r.boundVariables = {});
              const _ = r[w], W = (Y = r.boundVariables) == null ? void 0 : Y[w];
              await t.log(
                `  DEBUG: Attempting to set bound variable for ${w} on "${e.name || "Unnamed"}": current value=${_}, current boundVar=${JSON.stringify(W)}`
              );
              try {
                r.setBoundVariable(w, null);
              } catch (q) {
              }
              try {
                r.setBoundVariable(w, k);
                const q = (Q = r.boundVariables) == null ? void 0 : Q[w];
                await t.log(
                  `  DEBUG: Immediately after setting ${w} bound variable: ${JSON.stringify(q)}`
                );
              } catch (q) {
                await t.warning(
                  `  Error setting bound variable for ${w}: ${q instanceof Error ? q.message : String(q)}`
                );
              }
              const D = (he = r.boundVariables) == null ? void 0 : he[w];
              if (w === "itemSpacing") {
                const q = r[w], ie = (Te = r.boundVariables) == null ? void 0 : Te[w];
                await t.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${e.name || "Unnamed"}":`
                ), await t.log(
                  `    - Expected variable ref: ${L}`
                ), await t.log(
                  `    - Final itemSpacing value: ${q}`
                ), await t.log(
                  `    - Final boundVariable: ${JSON.stringify(ie)}`
                ), await t.log(
                  `    - Variable found: ${k ? `Yes (ID: ${k.id})` : "No"}`
                ), !D || !D.id ? await t.warning(
                  "    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!"
                ) : await t.log(
                  "    ✓ itemSpacing variable binding SUCCESS"
                );
              }
              D && typeof D == "object" && D.type === "VARIABLE_ALIAS" && D.id === k.id ? await t.log(
                `  ✓ Set bound variable for ${w} on "${e.name || "Unnamed"}" (${e.type}): variable ${k.name} (ID: ${k.id.substring(0, 8)}...)`
              ) : await t.warning(
                `  Failed to set bound variable for ${w} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(O)}, Got: ${JSON.stringify(D)}`
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
    if (e.paddingLeft !== void 0 && (!C || !e.boundVariables.paddingLeft) && (r.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!C || !e.boundVariables.paddingRight) && (r.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!C || !e.boundVariables.paddingTop) && (r.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!C || !e.boundVariables.paddingBottom) && (r.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && r.layoutMode !== void 0 && r.layoutMode !== "NONE") {
      const F = ((Ge = r.boundVariables) == null ? void 0 : Ge.itemSpacing) !== void 0;
      !F && (!C || !e.boundVariables.itemSpacing) ? r.itemSpacing !== e.itemSpacing && (await t.log(
        `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
      ), r.itemSpacing = e.itemSpacing) : F && await t.log(
        `  Skipping late setting of itemSpacing for "${e.name || "Unnamed"}" - already bound to variable`
      );
    }
    e.counterAxisSpacing !== void 0 && (!C || !e.boundVariables.counterAxisSpacing) && r.layoutMode !== void 0 && r.layoutMode !== "NONE" && (r.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (r.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (r.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (r.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (r.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: A } = await Promise.resolve().then(() => ya), L = e.fillGeometry.map((k) => {
          const O = k.data;
          return {
            data: A(O),
            windingRule: k.windingRule || k.windRule || "NONZERO"
          };
        });
        for (let k = 0; k < e.fillGeometry.length; k++) {
          const O = e.fillGeometry[k].data, _ = L[k].data;
          O !== _ && await t.log(
            `  Normalized path ${k + 1} for "${e.name || "Unnamed"}": ${O.substring(0, 50)}... -> ${_.substring(0, 50)}...`
          );
        }
        r.vectorPaths = L, await t.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${L.length} path(s))`
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
    const F = e.constraintHorizontal || ((Oe = e.constraints) == null ? void 0 : Oe.horizontal), w = e.constraintVertical || ((mt = e.constraints) == null ? void 0 : mt.vertical);
    if (F !== void 0 || w !== void 0) {
      await t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Setting constraints immediately after size: Expected H=${F || "undefined"}, V=${w || "undefined"}`
      );
      const A = r.constraints || {}, L = A.horizontal || "MIN", k = A.vertical || "MIN", O = F || L, _ = w || k;
      try {
        r.constraints = {
          horizontal: O,
          vertical: _
        };
        const q = (ft = r.constraints) == null ? void 0 : ft.horizontal, ie = (ut = r.constraints) == null ? void 0 : ut.vertical;
        q === O && ie === _ ? await t.log(
          `  [ISSUE #4] ✓ Constraints set successfully for "${e.name || "Unnamed"}" (VECTOR): H=${q}, V=${ie}`
        ) : await t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${O}, V=${_}, got H=${q || "undefined"}, V=${ie || "undefined"} for "${e.name || "Unnamed"}"`
        );
      } catch (q) {
        await t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${e.name || "Unnamed"}" (VECTOR): ${q instanceof Error ? q.message : String(q)}`
        );
      }
      const W = (ht = r.constraints) == null ? void 0 : ht.horizontal, D = (yt = r.constraints) == null ? void 0 : yt.vertical;
      await t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Final constraints after immediate setting: H=${W || "undefined"}, V=${D || "undefined"}`
      ), F !== void 0 && W !== F && await t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintHorizontal mismatch! Expected: ${F}, Got: ${W || "undefined"}`
      ), w !== void 0 && D !== w && await t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintVertical mismatch! Expected: ${w}, Got: ${D || "undefined"}`
      ), F !== void 0 && w !== void 0 && W === F && D === w && await t.log(
        `  ✓ ISSUE #4: "${e.name || "Unnamed"}" (VECTOR) constraints correctly set: H=${W}, V=${D}`
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
      const C = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
      e.fontSize !== void 0 && (!C || !e.boundVariables.fontSize) && (r.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (r.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (r.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!C || !e.boundVariables.letterSpacing) && (r.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!C || !e.boundVariables.lineHeight) && (r.lineHeight = e.lineHeight), e.textCase !== void 0 && (r.textCase = e.textCase), e.textDecoration !== void 0 && (r.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (r.textAutoResize = e.textAutoResize);
    } catch (C) {
      console.log("Error setting text properties: " + C);
      try {
        r.characters = e.characters;
      } catch (F) {
        console.log("Could not set text characters: " + F);
      }
    }
  if (e.boundVariables && c) {
    const C = [
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom",
      "itemSpacing"
    ];
    for (const [F, w] of Object.entries(
      e.boundVariables
    ))
      if (F !== "fills" && !C.includes(F) && Ve(w) && n && c) {
        const A = w._varRef;
        if (A !== void 0) {
          const L = c.get(String(A));
          if (L)
            try {
              const k = {
                type: "VARIABLE_ALIAS",
                id: L.id
              };
              r.boundVariables || (r.boundVariables = {});
              const O = r[F];
              O !== void 0 && r.boundVariables[F] === void 0 && await t.warning(
                `  Property ${F} has direct value ${O} which may prevent bound variable from being set`
              ), r.boundVariables[F] = k;
              const W = (bt = r.boundVariables) == null ? void 0 : bt[F];
              if (W && typeof W == "object" && W.type === "VARIABLE_ALIAS" && W.id === L.id)
                await t.log(
                  `  ✓ Set bound variable for ${F} on "${e.name || "Unnamed"}" (${e.type}): variable ${L.name} (ID: ${L.id.substring(0, 8)}...)`
                );
              else {
                const D = (wt = r.boundVariables) == null ? void 0 : wt[F];
                await t.warning(
                  `  Failed to set bound variable for ${F} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${O}, Expected: ${JSON.stringify(k)}, Got: ${JSON.stringify(D)}`
                );
              }
            } catch (k) {
              await t.warning(
                `  Error setting bound variable for ${F} on "${e.name || "Unnamed"}": ${k}`
              );
            }
          else
            await t.warning(
              `  Variable reference ${A} not found in recognizedVariables for ${F} on "${e.name || "Unnamed"}"`
            );
        }
      }
  }
  if (e.boundVariables && c && (e.boundVariables.width || e.boundVariables.height)) {
    const C = e.boundVariables.width, F = e.boundVariables.height;
    if (C && Ve(C)) {
      const w = C._varRef;
      if (w !== void 0) {
        const A = c.get(String(w));
        if (A) {
          const L = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.width = L;
        }
      }
    }
    if (F && Ve(F)) {
      const w = F._varRef;
      if (w !== void 0) {
        const A = c.get(String(w));
        if (A) {
          const L = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          r.boundVariables || (r.boundVariables = {}), r.boundVariables.height = L;
        }
      }
    }
  }
  const V = e.id && o && o.has(e.id) && r.type === "COMPONENT" && r.children && r.children.length > 0;
  if (e.children && Array.isArray(e.children) && r.type !== "INSTANCE" && !V) {
    const C = (w) => {
      const A = [];
      for (const L of w)
        L._truncated || (L.type === "COMPONENT" ? (A.push(L), L.children && Array.isArray(L.children) && A.push(...C(L.children))) : L.children && Array.isArray(L.children) && A.push(...C(L.children)));
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
    const F = C(e.children);
    await t.log(
      `  First pass: Creating ${F.length} COMPONENT node(s) (without children)...`
    );
    for (const w of F)
      await t.log(
        `  Collected COMPONENT "${w.name || "Unnamed"}" (ID: ${w.id ? w.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const w of F)
      if (w.id && o && !o.has(w.id)) {
        const A = figma.createComponent();
        if (w.name !== void 0 && (A.name = w.name || "Unnamed Node"), w.componentPropertyDefinitions) {
          const L = w.componentPropertyDefinitions;
          let k = 0, O = 0;
          for (const [_, W] of Object.entries(L))
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
              }[W.type];
              if (!q) {
                await t.warning(
                  `  Unknown property type ${W.type} for property "${_}" in component "${w.name || "Unnamed"}"`
                ), O++;
                continue;
              }
              const ie = W.defaultValue, te = _.split("#")[0];
              A.addComponentProperty(
                te,
                q,
                ie
              ), k++;
            } catch (D) {
              await t.warning(
                `  Failed to add component property "${_}" to "${w.name || "Unnamed"}" in first pass: ${D}`
              ), O++;
            }
          k > 0 && await t.log(
            `  Added ${k} component property definition(s) to "${w.name || "Unnamed"}" in first pass${O > 0 ? ` (${O} failed)` : ""}`
          );
        }
        o.set(w.id, A), await t.log(
          `  Created COMPONENT "${w.name || "Unnamed"}" (ID: ${w.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const w of e.children) {
      if (w._truncated)
        continue;
      const A = await Ue(
        w,
        r,
        n,
        i,
        s,
        c,
        o,
        l,
        p,
        f,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        h
      );
      if (A && A.parent !== r) {
        if (A.parent && typeof A.parent.removeChild == "function")
          try {
            A.parent.removeChild(A);
          } catch (L) {
            await t.warning(
              `Failed to remove child "${A.name || "Unnamed"}" from parent "${A.parent.name || "Unnamed"}": ${L}`
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
    const C = (($t = r.boundVariables) == null ? void 0 : $t.itemSpacing) !== void 0, F = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing;
    if (C)
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
async function ka(e, a, n) {
  let i = 0, s = 0, c = 0;
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
        s++;
        continue;
      }
      const m = a.getSerializedTable();
      let h = null, r;
      if (n._instanceTableMap ? (r = n._instanceTableMap.get(
        p.id
      ), r !== void 0 ? (h = m[r], await t.log(
        `  Found instance table index ${r} for instance "${p.name}" (ID: ${p.id.substring(0, 8)}...)`
      )) : await t.log(
        `  No instance table index mapping found for instance "${p.name}" (ID: ${p.id.substring(0, 8)}...), using fallback matching`
      )) : await t.log(
        `  No instance table map found, using fallback matching for instance "${p.name}"`
      ), !h) {
        for (const [d, b] of Object.entries(m))
          if (b.instanceType === "internal" && b.componentNodeId && n.has(b.componentNodeId)) {
            const g = n.get(b.componentNodeId);
            if (g && g.id === f.id) {
              h = b, await t.log(
                `  Matched instance "${p.name}" to instance table entry ${d} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!h) {
        await t.log(
          `  No matching entry found for instance "${p.name}" (main component: ${f.name}, ID: ${f.id.substring(0, 8)}...)`
        ), s++;
        continue;
      }
      if (!h.variantProperties) {
        await t.log(
          `  Instance table entry for "${p.name}" has no variant properties`
        ), s++;
        continue;
      }
      await t.log(
        `  Instance "${p.name}" matched to entry with variant properties: ${JSON.stringify(h.variantProperties)}`
      );
      let u = null;
      if (f.parent && f.parent.type === "COMPONENT_SET" && (u = f.parent.componentPropertyDefinitions), u) {
        const d = {};
        for (const [b, g] of Object.entries(
          h.variantProperties
        )) {
          const y = b.split("#")[0];
          u[y] && (d[y] = g);
        }
        Object.keys(d).length > 0 ? (p.setProperties(d), i++, await t.log(
          `  ✓ Set variant properties on instance "${p.name}": ${JSON.stringify(d)}`
        )) : s++;
      } else
        s++;
    } catch (f) {
      c++, await t.warning(
        `  Failed to set variant properties on instance "${p.name}": ${f}`
      );
    }
  await t.log(
    `  Variant properties set: ${i} processed, ${s} skipped, ${c} errors`
  );
}
async function Ct(e) {
  await figma.loadAllPagesAsync();
  const a = figma.root.children, n = new Set(a.map((c) => c.name));
  if (!n.has(e))
    return e;
  let i = 1, s = `${e}_${i}`;
  for (; n.has(s); )
    i++, s = `${e}_${i}`;
  return s;
}
async function La(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), n = new Set(a.map((c) => c.name));
  if (!n.has(e))
    return e;
  let i = 1, s = `${e}_${i}`;
  for (; n.has(s); )
    i++, s = `${e}_${i}`;
  return s;
}
async function Fa(e, a) {
  const n = /* @__PURE__ */ new Set();
  for (const c of e.variableIds)
    try {
      const o = await figma.variables.getVariableByIdAsync(c);
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
function Lt(e, a) {
  const n = e.resolvedType.toUpperCase(), i = a.toUpperCase();
  return n === i;
}
async function Ba(e) {
  const a = await figma.variables.getLocalVariableCollectionsAsync(), n = we(e.collectionName);
  if (Ie(e.collectionName)) {
    for (const i of a)
      if (we(i.name) === n)
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
        Ne
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
function Ua(e) {
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
function gt(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let a;
  try {
    a = Qe.fromTable(e.stringTable);
  } catch (i) {
    return {
      success: !1,
      error: `Failed to load string table: ${i instanceof Error ? i.message : "Unknown error"}`
    };
  }
  const n = Ia(e, a);
  return {
    success: !0,
    stringTable: a,
    expandedJsonData: n
  };
}
function Ga(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: je.fromTable(
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
async function za(e, a) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = e.getTable();
  for (const [o, l] of Object.entries(c)) {
    if (l.isLocal === !1) {
      await t.log(
        `Skipping remote collection: "${l.collectionName}" (index ${o})`
      );
      continue;
    }
    const p = we(l.collectionName), f = a == null ? void 0 : a.get(p);
    if (f) {
      await t.log(
        `✓ Using pre-created collection: "${p}" (index ${o})`
      ), n.set(o, f);
      continue;
    }
    const m = await Ba(l);
    m.matchType === "recognized" ? (await t.log(
      `✓ Recognized collection by GUID: "${l.collectionName}" (index ${o})`
    ), n.set(o, m.collection)) : m.matchType === "potential" ? (await t.log(
      `? Potential match by name: "${l.collectionName}" (index ${o})`
    ), i.set(o, {
      entry: l,
      collection: m.collection
    })) : (await t.log(
      `✗ No match found for collection: "${l.collectionName}" (index ${o}) - will create new`
    ), s.set(o, l));
  }
  return await t.log(
    `Collection matching complete: ${n.size} recognized, ${i.size} potential matches, ${s.size} to create`
  ), {
    recognizedCollections: n,
    potentialMatches: i,
    collectionsToCreate: s
  };
}
async function _a(e, a, n, i) {
  if (e.size !== 0) {
    if (i) {
      await t.log(
        `Using wizard selections for ${e.size} potential match(es)...`
      );
      for (const [s, { entry: c, collection: o }] of e.entries()) {
        const l = we(
          c.collectionName
        ).toLowerCase();
        let p = !1;
        l === "tokens" || l === "token" ? p = i.tokens === "existing" : l === "theme" || l === "themes" ? p = i.theme === "existing" : (l === "layer" || l === "layers") && (p = i.layers === "existing");
        const f = Ie(c.collectionName) ? we(c.collectionName) : o.name;
        p ? (await t.log(
          `✓ Wizard selection: Using existing collection "${f}" (index ${s})`
        ), a.set(s, o), await Re(o, c.modes), await t.log(
          `  ✓ Ensured modes for collection "${f}" (${c.modes.length} mode(s))`
        )) : (await t.log(
          `✗ Wizard selection: Will create new collection for "${c.collectionName}" (index ${s})`
        ), n.set(s, c));
      }
      return;
    }
    await t.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [s, { entry: c, collection: o }] of e.entries())
      try {
        const l = Ie(c.collectionName) ? we(c.collectionName) : o.name, p = `Found existing "${l}" variable collection. Should I use it?`;
        await t.log(
          `Prompting user about potential match: "${l}"`
        ), await Be.prompt(p, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await t.log(
          `✓ User confirmed: Using existing collection "${l}" (index ${s})`
        ), a.set(s, o), await Re(o, c.modes), await t.log(
          `  ✓ Ensured modes for collection "${l}" (${c.modes.length} mode(s))`
        );
      } catch (l) {
        await t.log(
          `✗ User rejected: Will create new collection for "${c.collectionName}" (index ${s})`
        ), n.set(s, c);
      }
  }
}
async function ja(e, a, n) {
  if (e.size === 0)
    return;
  await t.log("Ensuring modes exist for recognized collections...");
  const i = a.getTable();
  for (const [s, c] of e.entries()) {
    const o = i[s];
    o && (n.has(s) || (await Re(c, o.modes), await t.log(
      `  ✓ Ensured modes for collection "${c.name}" (${o.modes.length} mode(s))`
    )));
  }
}
async function Ha(e, a, n, i) {
  if (e.size !== 0) {
    await t.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [s, c] of e.entries()) {
      const o = we(c.collectionName), l = i == null ? void 0 : i.get(o);
      if (l) {
        await t.log(
          `Reusing pre-created collection: "${o}" (index ${s}, id: ${l.id.substring(0, 8)}...)`
        ), a.set(s, l), await Re(l, c.modes), n.push(l);
        continue;
      }
      const p = await La(o);
      p !== o ? await t.log(
        `Creating collection: "${p}" (normalized: "${o}" - name conflict resolved)`
      ) : await t.log(`Creating collection: "${p}"`);
      const f = figma.variables.createVariableCollection(p);
      n.push(f);
      let m;
      if (Ie(c.collectionName)) {
        const h = Ze(c.collectionName);
        h && (m = h);
      } else c.collectionGuid && (m = c.collectionGuid);
      m && (f.setSharedPluginData(
        "recursica",
        Ne,
        m
      ), await t.log(
        `  Stored GUID: ${m.substring(0, 8)}...`
      )), await Re(f, c.modes), await t.log(
        `  ✓ Created collection "${p}" with ${c.modes.length} mode(s)`
      ), a.set(s, f);
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
      variableTable: He.fromTable(e.variables)
    };
  } catch (a) {
    return {
      success: !1,
      error: `Failed to load variables table: ${a instanceof Error ? a.message : "Unknown error"}`
    };
  }
}
async function Ja(e, a, n, i) {
  const s = /* @__PURE__ */ new Map(), c = [], o = new Set(
    i.map((h) => h.id)
  );
  await t.log("Matching and creating variables in collections...");
  const l = e.getTable(), p = /* @__PURE__ */ new Map();
  for (const [h, r] of Object.entries(l)) {
    if (r._colRef === void 0)
      continue;
    const u = n.get(String(r._colRef));
    if (!u)
      continue;
    p.has(u.id) || p.set(u.id, {
      collectionName: u.name,
      existing: 0,
      created: 0
    });
    const d = p.get(u.id), b = o.has(
      u.id
    );
    let g;
    typeof r.variableType == "number" ? g = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[r.variableType] || String(r.variableType) : g = r.variableType;
    const y = await dt(
      u,
      r.variableName
    );
    if (y)
      if (Lt(y, g))
        s.set(h, y), d.existing++;
      else {
        await t.warning(
          `Type mismatch for variable "${r.variableName}" in collection "${u.name}": expected ${g}, found ${y.resolvedType}. Creating new variable with incremented name.`
        );
        const $ = await Fa(
          u,
          r.variableName
        ), R = await ct(
          ye(ee({}, r), {
            variableName: $,
            variableType: g
          }),
          u,
          e,
          a
        );
        b || c.push(R), s.set(h, R), d.created++;
      }
    else {
      const $ = await ct(
        ye(ee({}, r), {
          variableType: g
        }),
        u,
        e,
        a
      );
      b || c.push($), s.set(h, $), d.created++;
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
      const r = await figma.variables.getVariableCollectionByIdAsync(
        h.variableCollectionId
      );
      if (!r) {
        await t.warning(
          `  ⚠️ Variable "${h.name}" has no variableCollection (ID: ${h.variableCollectionId})`
        );
        continue;
      }
      const u = r.modes;
      if (!u || u.length === 0) {
        await t.warning(
          `  ⚠️ Variable "${h.name}" collection has no modes`
        );
        continue;
      }
      for (const d of u) {
        const b = h.valuesByMode[d.modeId];
        if (b && typeof b == "object" && "r" in b) {
          const g = b;
          Math.abs(g.r - 1) < 0.01 && Math.abs(g.g - 1) < 0.01 && Math.abs(g.b - 1) < 0.01 ? (m++, await t.warning(
            `  ⚠️ Variable "${h.name}" mode "${d.name}" is WHITE: r=${g.r.toFixed(3)}, g=${g.g.toFixed(3)}, b=${g.b.toFixed(3)}`
          )) : (f++, await t.log(
            `  ✓ Variable "${h.name}" mode "${d.name}" has color: r=${g.r.toFixed(3)}, g=${g.g.toFixed(3)}, b=${g.b.toFixed(3)}`
          ));
        } else b && typeof b == "object" && "type" in b || await t.warning(
          `  ⚠️ Variable "${h.name}" mode "${d.name}" has unexpected value type: ${JSON.stringify(b)}`
        );
      }
    }
  return await t.log(
    `Final verification complete: ${f} color variables verified, ${m} white variables found`
  ), {
    recognizedVariables: s,
    newlyCreatedVariables: c
  };
}
function Wa(e) {
  if (!e.instances)
    return null;
  try {
    return De.fromTable(e.instances);
  } catch (a) {
    return null;
  }
}
function Ka(e) {
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
function pt(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = Ka(e.type));
  const a = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (a && (a === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const n of e.children)
      pt(n);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function qa(e, a) {
  const n = /* @__PURE__ */ new Set();
  for (const c of e.children)
    (c.type === "FRAME" || c.type === "COMPONENT") && n.add(c.name);
  if (!n.has(a))
    return a;
  let i = 1, s = `${a}_${i}`;
  for (; n.has(s); )
    i++, s = `${a}_${i}`;
  return s;
}
async function Xa(e, a, n, i, s, c = "") {
  var d;
  const o = e.getSerializedTable(), l = Object.values(o).filter(
    (b) => b.instanceType === "remote"
  ), p = /* @__PURE__ */ new Map();
  if (l.length === 0)
    return await t.log("No remote instances found"), p;
  await t.log(
    `Processing ${l.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const f = figma.root.children, m = c ? `${c} REMOTES` : "REMOTES";
  let h = f.find(
    (b) => b.name === "REMOTES" || b.name === m
  );
  if (h ? (await t.log("Found existing REMOTES page"), c && !h.name.startsWith(c) && (h.name = m)) : (h = figma.createPage(), h.name = m, await t.log("Created REMOTES page")), l.length > 0 && (h.setPluginData("RecursicaUnderReview", "true"), await t.log("Marked REMOTES page as under review")), !h.children.some(
    (b) => b.type === "FRAME" && b.name === "Title"
  )) {
    const b = { family: "Inter", style: "Bold" }, g = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(b), await figma.loadFontAsync(g);
    const y = figma.createFrame();
    y.name = "Title", y.layoutMode = "VERTICAL", y.paddingTop = 20, y.paddingBottom = 20, y.paddingLeft = 20, y.paddingRight = 20, y.fills = [];
    const $ = figma.createText();
    $.fontName = b, $.characters = "REMOTE INSTANCES", $.fontSize = 24, $.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], y.appendChild($);
    const R = figma.createText();
    R.fontName = g, R.characters = "These are remotely connected component instances found in our different component pages.", R.fontSize = 14, R.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], y.appendChild(R), h.appendChild(y), await t.log("Created title and description on REMOTES page");
  }
  const u = /* @__PURE__ */ new Map();
  for (const [b, g] of Object.entries(o)) {
    if (g.instanceType !== "remote")
      continue;
    const y = parseInt(b, 10);
    if (await t.log(
      `Processing remote instance ${y}: "${g.componentName}"`
    ), !g.structure) {
      await t.warning(
        `Remote instance "${g.componentName}" missing structure data, skipping`
      );
      continue;
    }
    pt(g.structure);
    const $ = g.structure.children !== void 0, R = g.structure.child !== void 0, P = g.structure.children ? g.structure.children.length : g.structure.child ? g.structure.child.length : 0;
    await t.log(
      `  Structure type: ${g.structure.type || "unknown"}, has children: ${P} (children key: ${$}, child key: ${R})`
    );
    let B = g.componentName;
    if (g.path && g.path.length > 0) {
      const I = g.path.filter((E) => E !== "").join(" / ");
      I && (B = `${I} / ${g.componentName}`);
    }
    const V = await qa(
      h,
      B
    );
    V !== B && await t.log(
      `Component name conflict: "${B}" -> "${V}"`
    );
    try {
      if (g.structure.type !== "COMPONENT") {
        await t.warning(
          `Remote instance "${g.componentName}" structure is not a COMPONENT (type: ${g.structure.type}), creating frame fallback`
        );
        const E = figma.createFrame();
        E.name = V;
        const T = await Ue(
          g.structure,
          E,
          a,
          n,
          null,
          i,
          u,
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
        T ? (E.appendChild(T), h.appendChild(E), await t.log(
          `✓ Created remote instance frame fallback: "${V}"`
        )) : E.remove();
        continue;
      }
      const I = figma.createComponent();
      I.name = V, h.appendChild(I), await t.log(
        `  Created component node: "${V}"`
      );
      try {
        if (g.structure.componentPropertyDefinitions) {
          const S = g.structure.componentPropertyDefinitions;
          let N = 0, U = 0;
          for (const [z, K] of Object.entries(S))
            try {
              const J = {
                2: "TEXT",
                // Text property
                25: "BOOLEAN",
                // Boolean property
                27: "INSTANCE_SWAP",
                // Instance swap property
                26: "VARIANT"
                // Variant property
              }[K.type];
              if (!J) {
                await t.warning(
                  `  Unknown property type ${K.type} for property "${z}" in component "${g.componentName}"`
                ), U++;
                continue;
              }
              const ne = K.defaultValue, oe = z.split("#")[0];
              I.addComponentProperty(
                oe,
                J,
                ne
              ), N++;
            } catch (H) {
              await t.warning(
                `  Failed to add component property "${z}" to "${g.componentName}": ${H}`
              ), U++;
            }
          N > 0 && await t.log(
            `  Added ${N} component property definition(s) to "${g.componentName}"${U > 0 ? ` (${U} failed)` : ""}`
          );
        }
        g.structure.name !== void 0 && (I.name = g.structure.name);
        const E = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.width || g.structure.boundVariables.height);
        g.structure.width !== void 0 && g.structure.height !== void 0 && !E && I.resize(g.structure.width, g.structure.height), g.structure.x !== void 0 && (I.x = g.structure.x), g.structure.y !== void 0 && (I.y = g.structure.y);
        const T = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        if (g.structure.visible !== void 0 && (I.visible = g.structure.visible), g.structure.opacity !== void 0 && (!T || !g.structure.boundVariables.opacity) && (I.opacity = g.structure.opacity), g.structure.rotation !== void 0 && (!T || !g.structure.boundVariables.rotation) && (I.rotation = g.structure.rotation), g.structure.blendMode !== void 0 && (!T || !g.structure.boundVariables.blendMode) && (I.blendMode = g.structure.blendMode), g.structure.fills !== void 0)
          try {
            let S = g.structure.fills;
            Array.isArray(S) && (S = S.map((N) => {
              if (N && typeof N == "object") {
                const U = ee({}, N);
                return delete U.boundVariables, U;
              }
              return N;
            })), I.fills = S, (d = g.structure.boundVariables) != null && d.fills && i && await Ra(
              I,
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
            I.strokes = g.structure.strokes;
          } catch (S) {
            await t.warning(
              `Error setting strokes for remote component "${g.componentName}": ${S}`
            );
          }
        const M = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.strokeWeight || g.structure.boundVariables.strokeAlign);
        g.structure.strokeWeight !== void 0 && (!M || !g.structure.boundVariables.strokeWeight) && (I.strokeWeight = g.structure.strokeWeight), g.structure.strokeAlign !== void 0 && (!M || !g.structure.boundVariables.strokeAlign) && (I.strokeAlign = g.structure.strokeAlign), g.structure.layoutMode !== void 0 && (I.layoutMode = g.structure.layoutMode), g.structure.primaryAxisSizingMode !== void 0 && (I.primaryAxisSizingMode = g.structure.primaryAxisSizingMode), g.structure.counterAxisSizingMode !== void 0 && (I.counterAxisSizingMode = g.structure.counterAxisSizingMode);
        const x = g.structure.boundVariables && typeof g.structure.boundVariables == "object";
        g.structure.paddingLeft !== void 0 && (!x || !g.structure.boundVariables.paddingLeft) && (I.paddingLeft = g.structure.paddingLeft), g.structure.paddingRight !== void 0 && (!x || !g.structure.boundVariables.paddingRight) && (I.paddingRight = g.structure.paddingRight), g.structure.paddingTop !== void 0 && (!x || !g.structure.boundVariables.paddingTop) && (I.paddingTop = g.structure.paddingTop), g.structure.paddingBottom !== void 0 && (!x || !g.structure.boundVariables.paddingBottom) && (I.paddingBottom = g.structure.paddingBottom), g.structure.itemSpacing !== void 0 && (!x || !g.structure.boundVariables.itemSpacing) && (I.itemSpacing = g.structure.itemSpacing);
        const v = g.structure.boundVariables && typeof g.structure.boundVariables == "object" && (g.structure.boundVariables.cornerRadius || g.structure.boundVariables.topLeftRadius || g.structure.boundVariables.topRightRadius || g.structure.boundVariables.bottomLeftRadius || g.structure.boundVariables.bottomRightRadius);
        if (g.structure.cornerRadius !== void 0 && (!v || !g.structure.boundVariables.cornerRadius) && (I.cornerRadius = g.structure.cornerRadius), g.structure.boundVariables && i) {
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
            if (S[U] && Ve(S[U])) {
              const z = S[U]._varRef;
              if (z !== void 0) {
                const K = i.get(String(z));
                if (K) {
                  const H = {
                    type: "VARIABLE_ALIAS",
                    id: K.id
                  };
                  I.boundVariables || (I.boundVariables = {}), I.boundVariables[U] = H;
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
            const U = await Ue(
              N,
              I,
              a,
              n,
              null,
              i,
              u,
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
            U ? (I.appendChild(U), await t.log(
              `  ✓ Appended child "${N.name || "Unnamed"}" to component "${g.componentName}"`
            )) : await t.warning(
              `  ✗ Failed to create child "${N.name || "Unnamed"}" (type: ${N.type})`
            );
          }
        }
        p.set(y, I), await t.log(
          `✓ Created remote component: "${V}" (index ${y})`
        );
      } catch (E) {
        await t.warning(
          `Error populating remote component "${g.componentName}": ${E instanceof Error ? E.message : "Unknown error"}`
        ), I.remove();
      }
    } catch (I) {
      await t.warning(
        `Error recreating remote instance "${g.componentName}": ${I instanceof Error ? I.message : "Unknown error"}`
      );
    }
  }
  return await t.log(
    `Remote instance processing complete: ${p.size} component(s) created`
  ), p;
}
async function Ya(e, a, n, i, s, c, o = null, l = null, p = !1, f = null, m = !1, h = !1, r = "") {
  await t.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const u = figma.root.children, d = "RecursicaPublishedMetadata";
  let b = null;
  for (const T of u) {
    const M = T.getPluginData(d);
    if (M)
      try {
        if (JSON.parse(M).id === e.guid) {
          b = T;
          break;
        }
      } catch (x) {
        continue;
      }
  }
  let g = !1;
  if (b && !p && !m) {
    let T;
    try {
      const v = b.getPluginData(d);
      v && (T = JSON.parse(v).version);
    } catch (v) {
    }
    const M = T !== void 0 ? ` v${T}` : "", x = `Found existing component "${b.name}${M}". Should I use it or create a copy?`;
    await t.log(
      `Found existing page with same GUID: "${b.name}". Prompting user...`
    );
    try {
      await Be.prompt(x, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), g = !0, await t.log(
        `User chose to use existing page: "${b.name}"`
      );
    } catch (v) {
      await t.log(
        "User chose to create a copy. Will create new page."
      );
    }
  }
  if (g && b)
    return await figma.setCurrentPageAsync(b), await t.log(
      `Using existing page: "${b.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), await t.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${b.name}"`
    ), {
      success: !0,
      page: b,
      // Include pageId so it can be tracked in importedPages
      pageId: b.id
    };
  const y = u.find((T) => T.name === e.name);
  y && await t.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let $;
  if (b || y) {
    const T = `__${e.name}`;
    $ = await Ct(T), await t.log(
      `Creating scratch page: "${$}" (will be renamed to "${e.name}" on success)`
    );
  } else
    $ = e.name, await t.log(`Creating page: "${$}"`);
  const R = figma.createPage();
  if (R.name = $, await figma.setCurrentPageAsync(R), await t.log(`Switched to page: "${$}"`), !a.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await t.log("Recreating page structure...");
  const P = a.pageData;
  if (P.backgrounds !== void 0)
    try {
      R.backgrounds = P.backgrounds, await t.log(
        `Set page background: ${JSON.stringify(P.backgrounds)}`
      );
    } catch (T) {
      await t.warning(`Failed to set page background: ${T}`);
    }
  pt(P);
  const B = /* @__PURE__ */ new Map(), V = (T, M = []) => {
    if (T.type === "COMPONENT" && T.id && M.push(T.id), T.children && Array.isArray(T.children))
      for (const x of T.children)
        x._truncated || V(x, M);
    return M;
  }, I = V(P);
  if (await t.log(
    `Found ${I.length} COMPONENT node(s) in page data`
  ), I.length > 0 && (await t.log(
    `Component IDs in page data (first 20): ${I.slice(0, 20).map((T) => T.substring(0, 8) + "...").join(", ")}`
  ), P._allComponentIds = I), P.children && Array.isArray(P.children))
    for (const T of P.children) {
      const M = await Ue(
        T,
        R,
        n,
        i,
        s,
        c,
        B,
        !1,
        // isRemoteStructure: false - we're creating the main page
        o,
        l,
        P,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        f
      );
      M && R.appendChild(M);
    }
  await t.log("Page structure recreated successfully"), s && (await t.log(
    "Third pass: Setting variant properties on instances..."
  ), await ka(
    R,
    s,
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
  if (R.setPluginData(d, JSON.stringify(E)), await t.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), $.startsWith("__")) {
    let T;
    h ? T = r ? `${r} ${e.name}` : e.name : T = await Ct(e.name), R.name = T, await t.log(`Renamed page from "${$}" to "${T}"`);
  } else h && r && (R.name.startsWith(r) || (R.name = `${r} ${R.name}`));
  return {
    success: !0,
    page: R,
    deferredInstances: l || void 0
  };
}
async function Ft(e) {
  var i, s, c;
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
    const l = Ua(o);
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
    const f = gt(o);
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
    const h = Ga(m);
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
    const r = h.collectionTable;
    await t.log(
      `Loaded collections table with ${r.getSize()} collection(s)`
    ), await t.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: u, potentialMatches: d, collectionsToCreate: b } = await za(r, e.preCreatedCollections);
    await _a(
      d,
      u,
      b,
      e.collectionChoices
    ), await ja(
      u,
      r,
      d
    ), await Ha(
      b,
      u,
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
    const y = g.variableTable;
    await t.log(
      `Loaded variables table with ${y.getSize()} variable(s)`
    );
    const { recognizedVariables: $, newlyCreatedVariables: R } = await Ja(
      y,
      r,
      u,
      n
    );
    await t.log("Loading instance table...");
    const P = Wa(m);
    if (P) {
      const z = P.getSerializedTable(), K = Object.values(z).filter(
        (J) => J.instanceType === "internal"
      ), H = Object.values(z).filter(
        (J) => J.instanceType === "remote"
      );
      await t.log(
        `Loaded instance table with ${P.getSize()} instance(s) (${K.length} internal, ${H.length} remote)`
      );
    } else
      await t.log("No instance table found in JSON");
    const B = [], V = (i = e.isMainPage) != null ? i : !0, I = (s = e.alwaysCreateCopy) != null ? s : !1, E = (c = e.skipUniqueNaming) != null ? c : !1, T = e.constructionIcon || "";
    let M = null;
    P && (M = await Xa(
      P,
      y,
      r,
      $,
      u,
      T
    ));
    const x = await Ya(
      p,
      m,
      y,
      r,
      P,
      $,
      M,
      B,
      V,
      u,
      I,
      E,
      T
    );
    if (!x.success)
      return await t.error(x.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: x.error,
        data: {}
      };
    const v = x.page, G = $.size + R.length, S = x.deferredInstances || B, N = (S == null ? void 0 : S.length) || 0;
    if (await t.log("=== Import Complete ==="), await t.log(
      `Successfully processed ${u.size} collection(s), ${G} variable(s), and created page "${v.name}"${N > 0 ? ` (${N} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), N > 0) {
      await t.log(
        `  [DEBUG] Returning ${N} deferred instance(s) in response`
      );
      for (const z of S)
        await t.log(
          `    - "${z.nodeData.name}" from page "${z.instanceEntry.componentPageName}"`
        );
    }
    const U = x.pageId || v.id;
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
          collectionIds: n.map((z) => z.id),
          variableIds: R.map((z) => z.id)
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
async function Bt(e, a = "") {
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  await t.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let n = 0, i = 0;
  const s = [];
  await figma.loadAllPagesAsync();
  for (const c of e)
    try {
      const { placeholderFrameId: o, instanceEntry: l, nodeData: p, parentNodeId: f } = c, m = await figma.getNodeByIdAsync(
        o
      ), h = await figma.getNodeByIdAsync(
        f
      );
      if (!m || !h) {
        const y = `Deferred instance "${p.name}" - could not find placeholder frame (${o}) or parent node (${f})`;
        await t.error(y), s.push(y), i++;
        continue;
      }
      let r = figma.root.children.find((y) => {
        const $ = y.name === l.componentPageName, R = a && y.name === `${a} ${l.componentPageName}`;
        return $ || R;
      });
      if (!r) {
        const y = me(
          l.componentPageName
        );
        r = figma.root.children.find(($) => me($.name) === y);
      }
      if (!r && a) {
        const y = figma.root.children.map(($) => $.name).slice(0, 10);
        await t.log(
          `  [DEBUG] Looking for page "${l.componentPageName}" (or "${a} ${l.componentPageName}"). Available pages (first 10): ${y.join(", ")}`
        );
      }
      if (!r) {
        const y = a ? `"${l.componentPageName}" or "${a} ${l.componentPageName}"` : `"${l.componentPageName}"`, $ = `Deferred instance "${p.name}" still cannot find referenced page (tried: ${y}, and clean name matching)`;
        await t.error($), s.push($), i++;
        continue;
      }
      const u = (y, $, R, P, B) => {
        if ($.length === 0) {
          let T = null;
          const M = me(R);
          for (const x of y.children || [])
            if (x.type === "COMPONENT") {
              const v = x.name === R, G = me(x.name) === M;
              if (v || G) {
                if (T || (T = x), v && P)
                  try {
                    const S = x.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (S && JSON.parse(S).id === P)
                      return x;
                  } catch (S) {
                  }
                else if (v)
                  return x;
              }
            } else if (x.type === "COMPONENT_SET") {
              if (B) {
                const v = x.name === B, G = me(x.name) === me(B);
                if (!v && !G)
                  continue;
              }
              for (const v of x.children || [])
                if (v.type === "COMPONENT") {
                  const G = v.name === R, S = me(v.name) === M;
                  if (G || S) {
                    if (T || (T = v), G && P)
                      try {
                        const N = v.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (N && JSON.parse(N).id === P)
                          return v;
                      } catch (N) {
                      }
                    else if (G)
                      return v;
                  }
                }
            }
          return T;
        }
        const [V, ...I] = $, E = me(V);
        for (const T of y.children || []) {
          const M = T.name === V, x = me(T.name) === E;
          if (M || x) {
            if (I.length === 0) {
              if (T.type === "COMPONENT_SET") {
                if (B) {
                  const S = T.name === B, N = me(T.name) === me(B);
                  if (!S && !N)
                    continue;
                }
                const v = me(R);
                let G = null;
                for (const S of T.children || [])
                  if (S.type === "COMPONENT") {
                    const N = S.name === R, U = me(S.name) === v;
                    if (N || U) {
                      if (G || (G = S), P)
                        try {
                          const z = S.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (z && JSON.parse(z).id === P)
                            return S;
                        } catch (z) {
                        }
                      if (N)
                        return S;
                    }
                  }
                return G || null;
              }
              return null;
            }
            return I.length > 0 ? u(
              T,
              I,
              R,
              P,
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
      const d = r.children.slice(0, 10).map((y) => `${y.type}: "${y.name}"${y.type === "COMPONENT_SET" ? ` (${y.children.length} variants)` : ""}`);
      await t.log(
        `  [DEBUG] Top-level nodes on page "${r.name}" (first 10): ${d.join(", ")}`
      );
      let b = u(
        r,
        l.path || [],
        l.componentName,
        l.componentGuid,
        l.componentSetName
      );
      if (!b && l.componentSetName) {
        await t.log(
          `  [DEBUG] Path-based search failed, trying recursive search for COMPONENT_SET "${l.componentSetName}"`
        );
        const y = ($, R = 0) => {
          if (R > 5) return null;
          for (const P of $.children || []) {
            if (P.type === "COMPONENT_SET") {
              const B = P.name === l.componentSetName, V = me(P.name) === me(l.componentSetName || "");
              if (B || V) {
                const I = me(
                  l.componentName
                );
                for (const E of P.children || [])
                  if (E.type === "COMPONENT") {
                    const T = E.name === l.componentName, M = me(E.name) === I;
                    if (T || M) {
                      if (l.componentGuid)
                        try {
                          const x = E.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (x && JSON.parse(x).id === l.componentGuid)
                            return E;
                        } catch (x) {
                        }
                      return E;
                    }
                  }
              }
            }
            if (P.type === "FRAME" || P.type === "GROUP") {
              const B = y(P, R + 1);
              if (B) return B;
            }
          }
          return null;
        };
        b = y(r), b && await t.log(
          `  [DEBUG] Found component via recursive search: "${b.name}"`
        );
      }
      if (!b) {
        const y = l.path && l.path.length > 0 ? ` at path [${l.path.join(" → ")}]` : " at page root", $ = [], R = (B, V = 0) => {
          if (!(V > 3) && ((B.type === "COMPONENT" || B.type === "COMPONENT_SET") && $.push(
            `${B.type}: "${B.name}"${B.type === "COMPONENT_SET" ? ` (${B.children.length} variants)` : ""}`
          ), B.children && Array.isArray(B.children)))
            for (const I of B.children.slice(0, 10))
              R(I, V + 1);
        };
        R(r), await t.log(
          `  [DEBUG] Available components on page "${r.name}" (first 20): ${$.slice(0, 20).join(", ")}`
        );
        const P = `Deferred instance "${p.name}" still cannot find component "${l.componentName}" on page "${l.componentPageName}"${y}`;
        await t.error(P), s.push(P), i++;
        continue;
      }
      const g = b.createInstance();
      if (g.name = p.name || m.name.replace("[Deferred: ", "").replace("]", ""), g.x = m.x, g.y = m.y, m.width !== void 0 && m.height !== void 0 && g.resize(m.width, m.height), l.variantProperties && Object.keys(l.variantProperties).length > 0)
        try {
          const y = await g.getMainComponentAsync();
          if (y) {
            let $ = null;
            const R = y.type;
            if (R === "COMPONENT_SET" ? $ = y.componentPropertyDefinitions : R === "COMPONENT" && y.parent && y.parent.type === "COMPONENT_SET" ? $ = y.parent.componentPropertyDefinitions : await t.warning(
              `Cannot set variant properties for resolved instance "${p.name}" - main component is not a COMPONENT_SET or variant`
            ), $) {
              const P = {};
              for (const [B, V] of Object.entries(
                l.variantProperties
              )) {
                const I = B.split("#")[0];
                $[I] && (P[I] = V);
              }
              Object.keys(P).length > 0 && g.setProperties(P);
            }
          }
        } catch (y) {
          await t.warning(
            `Failed to set variant properties for resolved instance "${p.name}": ${y}`
          );
        }
      if (l.componentProperties && Object.keys(l.componentProperties).length > 0)
        try {
          const y = await g.getMainComponentAsync();
          if (y) {
            let $ = null;
            const R = y.type;
            if (R === "COMPONENT_SET" ? $ = y.componentPropertyDefinitions : R === "COMPONENT" && y.parent && y.parent.type === "COMPONENT_SET" ? $ = y.parent.componentPropertyDefinitions : R === "COMPONENT" && ($ = y.componentPropertyDefinitions), $)
              for (const [P, B] of Object.entries(
                l.componentProperties
              )) {
                const V = P.split("#")[0];
                if ($[V])
                  try {
                    g.setProperties({
                      [V]: B
                    });
                  } catch (I) {
                    await t.warning(
                      `Failed to set component property "${V}" for resolved instance "${p.name}": ${I}`
                    );
                  }
              }
          }
        } catch (y) {
          await t.warning(
            `Failed to set component properties for resolved instance "${p.name}": ${y}`
          );
        }
      if ("children" in h && "insertChild" in h) {
        const y = h.children.indexOf(m);
        h.insertChild(y, g), m.remove();
      } else {
        const y = `Parent node does not support children operations for deferred instance "${p.name}"`;
        await t.error(y), s.push(y);
        continue;
      }
      await t.log(
        `  ✓ Resolved deferred instance "${p.name}" from component "${l.componentName}" on page "${l.componentPageName}"`
      ), n++;
    } catch (o) {
      const l = o instanceof Error ? o.message : String(o), p = `Failed to resolve deferred instance "${c.nodeData.name}": ${l}`;
      await t.error(p), s.push(p), i++;
    }
  return await t.log(
    `=== Deferred Resolution Complete: ${n} resolved, ${i} failed ===`
  ), { resolved: n, failed: i, errors: s };
}
async function Za(e) {
  await t.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: a, collectionIds: n, variableIds: i } = e;
    let s = 0;
    for (const l of i)
      try {
        const p = await figma.variables.getVariableByIdAsync(l);
        if (p) {
          const f = p.variableCollectionId;
          n.includes(f) || (p.remove(), s++);
        }
      } catch (p) {
        await t.warning(
          `Could not delete variable ${l.substring(0, 8)}...: ${p}`
        );
      }
    let c = 0;
    for (const l of n)
      try {
        const p = await figma.variables.getVariableCollectionByIdAsync(l);
        p && (p.remove(), c++);
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
async function Ut(e) {
  const a = [];
  for (const { fileName: n, jsonData: i } of e)
    try {
      const s = gt(i);
      if (!s.success || !s.expandedJsonData) {
        await t.warning(
          `Skipping ${n} - failed to expand JSON: ${s.error || "Unknown error"}`
        );
        continue;
      }
      const c = s.expandedJsonData, o = c.metadata;
      if (!o || !o.name || !o.guid) {
        await t.warning(
          `Skipping ${n} - missing or invalid metadata`
        );
        continue;
      }
      const l = [];
      if (c.instances) {
        const f = De.fromTable(
          c.instances
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
    } catch (s) {
      await t.error(
        `Error processing ${n}: ${s instanceof Error ? s.message : String(s)}`
      );
    }
  return a;
}
function Gt(e) {
  const a = [], n = [], i = [], s = /* @__PURE__ */ new Map();
  for (const f of e)
    s.set(f.pageName, f);
  const c = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), l = [], p = (f) => {
    if (c.has(f.pageName))
      return !1;
    if (o.has(f.pageName)) {
      const m = l.findIndex(
        (h) => h.pageName === f.pageName
      );
      if (m !== -1) {
        const h = l.slice(m).concat([f]);
        return n.push(h), !0;
      }
      return !1;
    }
    o.add(f.pageName), l.push(f);
    for (const m of f.dependencies) {
      const h = s.get(m);
      h && p(h);
    }
    return o.delete(f.pageName), l.pop(), c.add(f.pageName), a.push(f), !1;
  };
  for (const f of e)
    c.has(f.pageName) || p(f);
  for (const f of e)
    for (const m of f.dependencies)
      s.has(m) || i.push(
        `Page "${f.pageName}" (${f.fileName}) depends on "${m}" which is not in the import set`
      );
  return { order: a, cycles: n, errors: i };
}
async function zt(e) {
  await t.log("=== Building Dependency Graph ===");
  const a = await Ut(e);
  await t.log("=== Resolving Import Order ===");
  const n = Gt(a);
  if (n.cycles.length > 0) {
    await t.log(
      `Detected ${n.cycles.length} circular dependency cycle(s):`
    );
    for (const i of n.cycles) {
      const s = i.map((c) => `"${c.pageName}"`).join(" → ");
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
async function _t(e) {
  var $, R, P, B, V, I;
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
  } = await zt(a);
  s.length > 0 && await t.warning(
    `Found ${s.length} dependency warning(s) - some dependencies may be missing`
  ), i.length > 0 && await t.log(
    `Detected ${i.length} circular dependency cycle(s) - will use deferred resolution`
  );
  const c = /* @__PURE__ */ new Map();
  if (await t.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    await t.log("=== Pre-creating Collections ==="), await t.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const E = "recursica:collectionId", T = async (x) => {
      const v = await figma.variables.getLocalVariableCollectionsAsync(), G = new Set(v.map((U) => U.name));
      if (!G.has(x))
        return x;
      let S = 1, N = `${x}_${S}`;
      for (; G.has(N); )
        S++, N = `${x}_${S}`;
      return N;
    }, M = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: x, normalizedName: v } of M)
      if (x === "new") {
        await t.log(
          `Processing collection type: "${v}" (choice: "new") - will create new collection`
        );
        const G = await T(v), S = figma.variables.createVariableCollection(G);
        if (Ie(v)) {
          const N = Ze(v);
          N && (S.setSharedPluginData(
            "recursica",
            E,
            N
          ), await t.log(
            `  Stored fixed GUID: ${N.substring(0, 8)}...`
          ));
        }
        c.set(v, S), await t.log(
          `✓ Pre-created collection: "${G}" (normalized: "${v}", id: ${S.id.substring(0, 8)}...)`
        );
      } else
        await t.log(
          `Skipping collection type: "${v}" (choice: "existing")`
        );
    c.size > 0 && await t.log(
      `Pre-created ${c.size} collection(s) for reuse across all imports`
    );
  }
  await t.log("=== Importing Pages in Order ===");
  let o = 0, l = 0;
  const p = [...s], f = [], m = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, h = [];
  if (c.size > 0)
    for (const E of c.values())
      m.collectionIds.push(E.id), await t.log(
        `Tracking pre-created collection: "${E.name}" (${E.id.substring(0, 8)}...)`
      );
  const r = e.mainFileName;
  for (let E = 0; E < n.length; E++) {
    const T = n[E], M = r ? T.fileName === r : E === n.length - 1;
    await t.log(
      `[${E + 1}/${n.length}] Importing ${T.fileName} ("${T.pageName}")${M ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const x = E === 0, v = await Ft({
        jsonData: T.jsonData,
        isMainPage: M,
        clearConsole: x,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: ($ = e.skipUniqueNaming) != null ? $ : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: c
        // Pass pre-created collections for reuse
      });
      if (v.success) {
        if (o++, (R = v.data) != null && R.deferredInstances) {
          const G = v.data.deferredInstances;
          Array.isArray(G) && (await t.log(
            `  [DEBUG] Collected ${G.length} deferred instance(s) from ${T.fileName}`
          ), f.push(...G));
        } else
          await t.log(
            `  [DEBUG] No deferred instances in response for ${T.fileName}`
          );
        if ((P = v.data) != null && P.createdEntities) {
          const G = v.data.createdEntities;
          G.pageIds && m.pageIds.push(...G.pageIds), G.collectionIds && m.collectionIds.push(...G.collectionIds), G.variableIds && m.variableIds.push(...G.variableIds);
          const S = ((B = G.pageIds) == null ? void 0 : B[0]) || ((V = v.data) == null ? void 0 : V.pageId);
          (I = v.data) != null && I.pageName && S && h.push({
            name: v.data.pageName,
            pageId: S
          });
        }
      } else
        l++, p.push(
          `Failed to import ${T.fileName}: ${v.message || "Unknown error"}`
        );
    } catch (x) {
      l++;
      const v = x instanceof Error ? x.message : String(x);
      p.push(`Failed to import ${T.fileName}: ${v}`);
    }
  }
  if (f.length > 0) {
    await t.log(
      `=== Resolving ${f.length} Deferred Instance(s) ===`
    );
    try {
      const E = await Bt(
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
  const u = Array.from(
    new Set(m.collectionIds)
  ), d = Array.from(
    new Set(m.variableIds)
  ), b = Array.from(new Set(m.pageIds));
  if (await t.log("=== Import Summary ==="), await t.log(
    `  Imported: ${o}, Failed: ${l}, Deferred instances: ${f.length}`
  ), await t.log(
    `  Collections in allCreatedEntityIds: ${m.collectionIds.length}, Unique: ${u.length}`
  ), u.length > 0) {
    await t.log(
      `  Created ${u.length} collection(s)`
    );
    for (const E of u)
      try {
        const T = await figma.variables.getVariableCollectionByIdAsync(E);
        T && await t.log(
          `    - "${T.name}" (${E.substring(0, 8)}...)`
        );
      } catch (T) {
      }
  }
  const g = l === 0, y = g ? `Successfully imported ${o} page(s)${f.length > 0 ? ` (${f.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${l} failure(s). ${p.join("; ")}`;
  return {
    type: "importPagesInOrder",
    success: g,
    error: !g,
    message: y,
    data: {
      imported: o,
      failed: l,
      deferred: f.length,
      errors: p,
      importedPages: h,
      createdEntities: {
        pageIds: b,
        collectionIds: u,
        variableIds: d
      }
    }
  };
}
async function Qa(e) {
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
    const s = await tt(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + n + ")"
    );
    const c = JSON.stringify(s, null, 2), o = JSON.parse(c), l = "Copy - " + o.name, p = figma.createPage();
    if (p.name = l, figma.root.appendChild(p), o.children && o.children.length > 0) {
      let h = function(u) {
        u.forEach((d) => {
          const b = (d.x || 0) + (d.width || 0);
          b > r && (r = b), d.children && d.children.length > 0 && h(d.children);
        });
      };
      console.log(
        "Recreating " + o.children.length + " top-level children..."
      );
      let r = 0;
      h(o.children), console.log("Original content rightmost edge: " + r);
      for (const u of o.children)
        await Ue(u, p, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const f = et(o);
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
async function en(e) {
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
async function tn(e) {
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
async function an(e) {
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
async function nn(e) {
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
async function on(e) {
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
async function rn(e) {
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
async function sn(e) {
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
function ue(e, a = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: a
  };
}
function Ee(e, a, n = {}) {
  const i = a instanceof Error ? a.message : a;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: n
  };
}
const jt = "RecursicaPublishedMetadata";
async function cn(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (l) => l.id === a.id
    ), s = a.getPluginData(jt);
    if (!s) {
      const f = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: Xe(a.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return ue("getComponentMetadata", f);
    }
    const o = {
      componentMetadata: JSON.parse(s),
      currentPageIndex: i
    };
    return ue("getComponentMetadata", o);
  } catch (a) {
    return console.error("Error getting component metadata:", a), Ee(
      "getComponentMetadata",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function ln(e) {
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
      const c = s, o = c.getPluginData(jt);
      if (o)
        try {
          const l = JSON.parse(o);
          n.push(l);
        } catch (l) {
          console.warn(
            `Failed to parse metadata for page "${c.name}":`,
            l
          );
          const f = {
            _ver: 1,
            id: "",
            name: Xe(c.name),
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
          name: Xe(c.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        n.push(p);
      }
    }
    return ue("getAllComponents", {
      components: n
    });
  } catch (a) {
    return console.error("Error getting all components:", a), Ee(
      "getAllComponents",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function dn(e) {
  try {
    const a = e.requestId, n = e.action;
    return !a || !n ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Be.handleResponse({ requestId: a, action: n }), {
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
async function gn(e) {
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
const be = "RecursicaPrimaryImport", ge = "RecursicaUnderReview", Ht = "---", Dt = "---", Se = "RecursicaImportDivider", ke = "start", Le = "end", Ae = "⚠️";
async function pn(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    for (const i of a) {
      if (i.type !== "PAGE")
        continue;
      const s = i.getPluginData(be);
      if (s)
        try {
          const o = JSON.parse(s), l = {
            exists: !0,
            pageId: i.id,
            metadata: o
          };
          return ue(
            "checkForExistingPrimaryImport",
            l
          );
        } catch (o) {
          await t.warning(
            `Failed to parse primary import metadata on page "${i.name}": ${o}`
          );
          continue;
        }
      if (i.getPluginData(ge) === "true") {
        const o = i.getPluginData(be);
        if (o)
          try {
            const l = JSON.parse(o), p = {
              exists: !0,
              pageId: i.id,
              metadata: l
            };
            return ue(
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
    return ue("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (a) {
    return console.error("Error checking for existing primary import:", a), Ee(
      "checkForExistingPrimaryImport",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function mn(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children.find(
      (l) => l.type === "PAGE" && l.getPluginData(Se) === ke
    ), n = figma.root.children.find(
      (l) => l.type === "PAGE" && l.getPluginData(Se) === Le
    );
    if (a && n) {
      const l = {
        startDividerId: a.id,
        endDividerId: n.id
      };
      return ue("createImportDividers", l);
    }
    const i = figma.createPage();
    i.name = Ht, i.setPluginData(Se, ke), i.setPluginData(ge, "true");
    const s = figma.createPage();
    s.name = Dt, s.setPluginData(Se, Le), s.setPluginData(ge, "true");
    const c = figma.root.children.indexOf(i);
    figma.root.insertChild(c + 1, s), await t.log("Created import dividers");
    const o = {
      startDividerId: i.id,
      endDividerId: s.id
    };
    return ue("createImportDividers", o);
  } catch (a) {
    return console.error("Error creating import dividers:", a), Ee(
      "createImportDividers",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function fn(e) {
  var a, n, i, s, c, o, l;
  try {
    await t.log("=== Starting Single Component Import ==="), await t.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let p = figma.root.children.find(
      (S) => S.type === "PAGE" && S.getPluginData(Se) === ke
    );
    p || (p = figma.createPage(), p.name = Ht, p.setPluginData(Se, ke), p.setPluginData(ge, "true"), await t.log("Created start divider"));
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
    const h = await _t({
      jsonFiles: m,
      mainFileName: `${e.mainComponent.name}.json`,
      collectionChoices: {
        tokens: e.wizardSelections.tokensCollection,
        theme: e.wizardSelections.themeCollection,
        layers: e.wizardSelections.layersCollection
      },
      skipUniqueNaming: !0,
      // Don't add _<number> suffix for wizard imports
      constructionIcon: Ae
      // Add construction icon to page names
    });
    if (!h.success)
      throw new Error(
        h.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const r = figma.root.children;
    let u = r.find(
      (S) => S.type === "PAGE" && S.getPluginData(Se) === Le
    );
    if (!u) {
      u = figma.createPage(), u.name = Dt, u.setPluginData(
        Se,
        Le
      ), u.setPluginData(ge, "true");
      let S = r.length;
      for (let N = r.length - 1; N >= 0; N--) {
        const U = r[N];
        if (U.type === "PAGE" && U.getPluginData(Se) !== ke && U.getPluginData(Se) !== Le) {
          S = N + 1;
          break;
        }
      }
      figma.root.insertChild(S, u), await t.log("Created end divider");
    }
    await t.log(
      `Import result data structure: ${JSON.stringify(Object.keys(h.data || {}))}`
    );
    const d = h.data;
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
    const b = "RecursicaPublishedMetadata", g = e.mainComponent.guid;
    await t.log(
      `Looking for main page by GUID: ${g.substring(0, 8)}...`
    );
    let y, $ = null;
    for (const S of d.importedPages)
      try {
        const N = await figma.getNodeByIdAsync(
          S.pageId
        );
        if (N && N.type === "PAGE") {
          const U = N.getPluginData(b);
          if (U)
            try {
              if (JSON.parse(U).id === g) {
                y = S.pageId, $ = N, await t.log(
                  `Found main page by GUID: "${N.name}" (ID: ${S.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (z) {
            }
        }
      } catch (N) {
        await t.warning(
          `Error checking page ${S.pageId}: ${N}`
        );
      }
    if (!y) {
      await t.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const S = figma.root.children;
      for (const N of S)
        if (N.type === "PAGE") {
          const U = N.getPluginData(b);
          if (U)
            try {
              if (JSON.parse(U).id === g) {
                y = N.id, $ = N, await t.log(
                  `Found main page by GUID in all pages: "${N.name}" (ID: ${N.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (z) {
            }
        }
    }
    if (!y || !$) {
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
          N.setPluginData(ge, "true");
          const U = N.name.replace(/_\d+$/, "");
          if (!U.startsWith(Ae))
            N.name = `${Ae} ${U}`;
          else {
            const z = U.replace(Ae, "").trim();
            N.name = `${Ae} ${z}`;
          }
        }
      } catch (N) {
        await t.warning(
          `Failed to mark page ${S.pageId} as under review: ${N}`
        );
      }
    await figma.loadAllPagesAsync();
    const R = figma.root.children, P = R.find(
      (S) => S.type === "PAGE" && (S.name === "REMOTES" || S.name === `${Ae} REMOTES`)
    );
    P && (P.setPluginData(ge, "true"), P.name.startsWith(Ae) || (P.name = `${Ae} REMOTES`), await t.log(
      "Marked REMOTES page as under review and ensured construction icon"
    ));
    const B = R.find(
      (S) => S.type === "PAGE" && S.getPluginData(Se) === ke
    ), V = R.find(
      (S) => S.type === "PAGE" && S.getPluginData(Se) === Le
    );
    if (B && V) {
      const S = R.indexOf(B), N = R.indexOf(V);
      for (let U = S + 1; U < N; U++) {
        const z = R[U];
        z.type === "PAGE" && z.getPluginData(ge) !== "true" && (z.setPluginData(ge, "true"), await t.log(
          `Marked page "${z.name}" as under review (found between dividers)`
        ));
      }
    }
    const I = [], E = [];
    if (await t.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs in result: ${((c = (s = d == null ? void 0 : d.createdEntities) == null ? void 0 : s.collectionIds) == null ? void 0 : c.length) || 0}`
    ), (o = d == null ? void 0 : d.createdEntities) != null && o.collectionIds) {
      await t.log(
        `[EXTRACTION] Collection IDs to process: ${d.createdEntities.collectionIds.map((S) => S.substring(0, 8) + "...").join(", ")}`
      );
      for (const S of d.createdEntities.collectionIds)
        try {
          const N = await figma.variables.getVariableCollectionByIdAsync(S);
          N ? (I.push({
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
      `[EXTRACTION] Total collections extracted: ${I.length}`
    ), I.length > 0 && await t.log(
      `[EXTRACTION] Extracted collections: ${I.map((S) => `"${S.collectionName}" (${S.collectionId.substring(0, 8)}...)`).join(", ")}`
    );
    const T = new Set(
      I.map((S) => S.collectionId)
    );
    if ((l = d == null ? void 0 : d.createdEntities) != null && l.variableIds)
      for (const S of d.createdEntities.variableIds)
        try {
          const N = await figma.variables.getVariableByIdAsync(S);
          if (N && N.resolvedType && !T.has(N.variableCollectionId)) {
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
    const M = {
      componentGuid: e.mainComponent.guid,
      componentVersion: e.mainComponent.version,
      componentName: e.mainComponent.name,
      importDate: (/* @__PURE__ */ new Date()).toISOString(),
      wizardSelections: e.wizardSelections,
      variableSummary: e.variableSummary,
      createdCollections: I,
      createdVariables: E,
      importError: void 0
      // No error yet
    };
    await t.log(
      `Storing metadata with ${I.length} collection(s) and ${E.length} variable(s)`
    ), $.setPluginData(
      be,
      JSON.stringify(M)
    ), $.setPluginData(ge, "true"), await t.log(
      "Stored primary import metadata on main page and marked as under review"
    );
    const x = [];
    d.importedPages && x.push(
      ...d.importedPages.map((S) => S.pageId)
    ), await t.log("=== Single Component Import Complete ==="), M.importError = void 0, await t.log(
      `[METADATA] About to store metadata with ${I.length} collection(s) and ${E.length} variable(s)`
    ), I.length > 0 && await t.log(
      `[METADATA] Collections to store: ${I.map((S) => `"${S.collectionName}" (${S.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), $.setPluginData(
      be,
      JSON.stringify(M)
    ), await t.log(
      `[METADATA] Stored metadata: ${I.length} collection(s), ${E.length} variable(s)`
    );
    const v = $.getPluginData(be);
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
      importedPageIds: x,
      createdCollections: I,
      createdVariables: E
    };
    return ue("importSingleComponentWithWizard", G);
  } catch (p) {
    const f = p instanceof Error ? p.message : "Unknown error occurred";
    await t.error(`Import failed: ${f}`);
    try {
      await figma.loadAllPagesAsync();
      const m = figma.root.children;
      let h = null;
      for (const r of m) {
        if (r.type !== "PAGE") continue;
        const u = r.getPluginData(be);
        if (u)
          try {
            if (JSON.parse(u).componentGuid === e.mainComponent.guid) {
              h = r;
              break;
            }
          } catch (d) {
          }
      }
      if (h) {
        const r = h.getPluginData(be);
        if (r)
          try {
            const u = JSON.parse(r);
            await t.log(
              `[CATCH] Found existing metadata with ${u.createdCollections.length} collection(s) and ${u.createdVariables.length} variable(s)`
            ), u.importError = f, h.setPluginData(
              be,
              JSON.stringify(u)
            ), await t.log(
              `[CATCH] Updated existing metadata with error. Collections: ${u.createdCollections.length}, Variables: ${u.createdVariables.length}`
            );
          } catch (u) {
            await t.warning(
              `[CATCH] Failed to update metadata: ${u}`
            );
          }
      } else {
        await t.log(
          "No existing metadata found, attempting to collect created entities for cleanup..."
        );
        const r = [];
        for (const b of m) {
          if (b.type !== "PAGE") continue;
          b.getPluginData(ge) === "true" && r.push(b);
        }
        const u = [];
        if (e.wizardSelections) {
          const b = await figma.variables.getLocalVariableCollectionsAsync(), g = [
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
          for (const { choice: y, normalizedName: $ } of g)
            if (y === "new") {
              const R = b.filter((P) => we(P.name) === $);
              if (R.length > 0) {
                const P = R[0];
                u.push({
                  collectionId: P.id,
                  collectionName: P.name
                }), await t.log(
                  `Found created collection: "${P.name}" (${P.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const d = [];
        if (r.length > 0) {
          const b = r[0], g = {
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
            createdCollections: u,
            createdVariables: d,
            importError: f
          };
          b.setPluginData(
            be,
            JSON.stringify(g)
          ), await t.log(
            `Created fallback metadata with ${u.length} collection(s) and error information`
          );
        }
      }
    } catch (m) {
      await t.warning(
        `Failed to store error metadata: ${m instanceof Error ? m.message : String(m)}`
      );
    }
    return Ee(
      "importSingleComponentWithWizard",
      p instanceof Error ? p : new Error(String(p))
    );
  }
}
async function Jt(e) {
  try {
    await t.log("=== Starting Import Group Deletion ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const n = a.getPluginData(be);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await t.log(
      `Found metadata: ${i.createdCollections.length} collection(s), ${i.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const s = figma.root.children, c = [];
    for (const r of s) {
      if (r.type !== "PAGE")
        continue;
      r.getPluginData(ge) === "true" && (c.push(r), await t.log(
        `Found page to delete: "${r.name}" (under review)`
      ));
    }
    await t.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let o = 0;
    for (const r of i.createdVariables)
      try {
        const u = await figma.variables.getVariableByIdAsync(
          r.variableId
        );
        u ? (u.remove(), o++, await t.log(
          `Deleted variable: ${r.variableName} from collection ${r.collectionName}`
        )) : await t.warning(
          `Variable ${r.variableName} (${r.variableId}) not found - may have already been deleted`
        );
      } catch (u) {
        await t.warning(
          `Failed to delete variable ${r.variableName}: ${u instanceof Error ? u.message : String(u)}`
        );
      }
    await t.log(
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let l = 0;
    for (const r of i.createdCollections)
      try {
        const u = await figma.variables.getVariableCollectionByIdAsync(
          r.collectionId
        );
        u ? (u.remove(), l++, await t.log(
          `Deleted collection: ${r.collectionName} (${r.collectionId})`
        )) : await t.warning(
          `Collection ${r.collectionName} (${r.collectionId}) not found - may have already been deleted`
        );
      } catch (u) {
        await t.warning(
          `Failed to delete collection ${r.collectionName}: ${u instanceof Error ? u.message : String(u)}`
        );
      }
    const p = c.map((r) => ({
      page: r,
      name: r.name,
      id: r.id
    })), f = figma.currentPage;
    if (p.some(
      (r) => r.id === f.id
    )) {
      await figma.loadAllPagesAsync();
      const u = figma.root.children.find(
        (d) => d.type === "PAGE" && !p.some((b) => b.id === d.id)
      );
      u ? (await figma.setCurrentPageAsync(u), await t.log(
        `Switched away from page "${f.name}" before deletion`
      )) : await t.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: r, name: u } of p)
      try {
        let d = !1;
        try {
          await figma.loadAllPagesAsync(), d = figma.root.children.some((g) => g.id === r.id);
        } catch (b) {
          d = !1;
        }
        if (!d) {
          await t.log(`Page "${u}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === r.id) {
          await figma.loadAllPagesAsync();
          const g = figma.root.children.find(
            (y) => y.type === "PAGE" && y.id !== r.id && !p.some(($) => $.id === y.id)
          );
          g && await figma.setCurrentPageAsync(g);
        }
        r.remove(), await t.log(`Deleted page: "${u}"`);
      } catch (d) {
        await t.warning(
          `Failed to delete page "${u}": ${d instanceof Error ? d.message : String(d)}`
        );
      }
    await t.log("=== Import Group Deletion Complete ===");
    const h = {
      success: !0,
      deletedPages: c.length,
      deletedCollections: l,
      deletedVariables: o
    };
    return ue("deleteImportGroup", h);
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Delete failed: ${n}`), Ee(
      "deleteImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function un(e) {
  try {
    await t.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const a = figma.root.children;
    let n = null;
    for (const f of a) {
      if (f.type !== "PAGE")
        continue;
      if (f.getPluginData(be)) {
        n = f;
        break;
      }
    }
    if (n)
      return await t.log(
        "Found page with metadata, using deleteImportGroup"
      ), await Jt({ pageId: n.id });
    await t.log(
      "No primary metadata found, looking for pages with UNDER_REVIEW_KEY or PAGE_METADATA_KEY"
    );
    const i = "RecursicaPublishedMetadata", s = [];
    for (const f of a) {
      if (f.type !== "PAGE")
        continue;
      const m = f.getPluginData(ge), h = f.getPluginData(i);
      (m === "true" || h) && (s.push({ id: f.id, name: f.name }), await t.log(
        `Found page to delete: "${f.name}" (underReview: ${m === "true"}, hasMetadata: ${!!h})`
      ));
    }
    const c = figma.currentPage;
    if (s.some(
      (f) => f.id === c.id
    )) {
      await figma.loadAllPagesAsync();
      const m = figma.root.children.find(
        (h) => h.type === "PAGE" && !s.some((r) => r.id === h.id)
      );
      m && (await figma.setCurrentPageAsync(m), await t.log(
        `Switched away from page "${c.name}" before deletion`
      ));
    }
    let l = 0;
    for (const f of s)
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
            (u) => u.type === "PAGE" && u.id !== m.id && !s.some((d) => d.id === u.id)
          );
          r && await figma.setCurrentPageAsync(r);
        }
        m.remove(), l++, await t.log(`Deleted page: "${f.name}"`);
      } catch (m) {
        await t.warning(
          `Failed to delete page "${f.name}" (${f.id.substring(0, 8)}...): ${m instanceof Error ? m.message : String(m)}`
        );
      }
    return await t.log("=== Failed Import Cleanup Complete ==="), ue("cleanupFailedImport", {
      success: !0,
      deletedPages: l,
      deletedCollections: 0,
      // Can't clean up without metadata
      deletedVariables: 0
      // Can't clean up without metadata
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Cleanup failed: ${n}`), Ee(
      "cleanupFailedImport",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function hn(e) {
  try {
    await t.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Page not found");
    a.setPluginData(be, ""), a.setPluginData(ge, "");
    const n = figma.root.children;
    for (const s of n)
      if (s.type === "PAGE" && s.getPluginData(ge) === "true") {
        const o = s.getPluginData(be);
        if (o)
          try {
            JSON.parse(o), s.setPluginData(ge, "");
          } catch (l) {
            s.setPluginData(ge, "");
          }
        else
          s.setPluginData(ge, "");
      }
    return await t.log(
      "Cleared import metadata from page and related pages"
    ), ue("clearImportMetadata", {
      success: !0
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Clear metadata failed: ${n}`), Ee(
      "clearImportMetadata",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function yn(e) {
  try {
    await t.log("=== Summarizing Variables for Wizard ===");
    const a = [];
    for (const { fileName: u, jsonData: d } of e.jsonFiles)
      try {
        const b = gt(d);
        if (!b.success || !b.expandedJsonData) {
          await t.warning(
            `Skipping ${u} - failed to expand JSON: ${b.error || "Unknown error"}`
          );
          continue;
        }
        const g = b.expandedJsonData;
        if (!g.collections)
          continue;
        const $ = je.fromTable(
          g.collections
        );
        if (!g.variables)
          continue;
        const P = He.fromTable(g.variables).getTable();
        for (const B of Object.values(P)) {
          if (B._colRef === void 0)
            continue;
          const V = $.getCollectionByIndex(
            B._colRef
          );
          if (V) {
            const E = we(
              V.collectionName
            ).toLowerCase();
            (E === "tokens" || E === "theme" || E === "layer") && a.push({
              name: B.variableName,
              collectionName: E
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (b) {
        await t.warning(
          `Error processing ${u}: ${b instanceof Error ? b.message : String(b)}`
        );
        continue;
      }
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let i = null, s = null, c = null;
    for (const u of n) {
      const b = we(u.name).toLowerCase();
      (b === "tokens" || b === "token") && !i ? i = u : (b === "theme" || b === "themes") && !s ? s = u : (b === "layer" || b === "layers") && !c && (c = u);
    }
    const o = a.filter(
      (u) => u.collectionName === "tokens"
    ), l = a.filter((u) => u.collectionName === "theme"), p = a.filter((u) => u.collectionName === "layer"), f = {
      existing: 0,
      new: 0
    }, m = {
      existing: 0,
      new: 0
    }, h = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && i) {
      const u = /* @__PURE__ */ new Set();
      for (const d of i.variableIds)
        try {
          const b = figma.variables.getVariableById(d);
          b && u.add(b.name);
        } catch (b) {
          continue;
        }
      for (const d of o)
        u.has(d.name) ? f.existing++ : f.new++;
    } else
      f.new = o.length;
    if (e.themeCollection === "existing" && s) {
      const u = /* @__PURE__ */ new Set();
      for (const d of s.variableIds)
        try {
          const b = figma.variables.getVariableById(d);
          b && u.add(b.name);
        } catch (b) {
          continue;
        }
      for (const d of l)
        u.has(d.name) ? m.existing++ : m.new++;
    } else
      m.new = l.length;
    if (e.layersCollection === "existing" && c) {
      const u = /* @__PURE__ */ new Set();
      for (const d of c.variableIds)
        try {
          const b = figma.variables.getVariableById(d);
          b && u.add(b.name);
        } catch (b) {
          continue;
        }
      for (const d of p)
        u.has(d.name) ? h.existing++ : h.new++;
    } else
      h.new = p.length;
    return await t.log(
      `Variable summary: Tokens - ${f.existing} existing, ${f.new} new; Theme - ${m.existing} existing, ${m.new} new; Layers - ${h.existing} existing, ${h.new} new`
    ), ue("summarizeVariablesForWizard", {
      tokens: f,
      theme: m,
      layers: h
    });
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Summarize failed: ${n}`), Ee(
      "summarizeVariablesForWizard",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function bn(e) {
  try {
    const a = "recursica:collectionId", i = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((s) => {
        const c = s.getSharedPluginData("recursica", a);
        return {
          id: s.id,
          name: s.name,
          guid: c || void 0
        };
      })
    };
    return ue(
      "getLocalVariableCollections",
      i
    );
  } catch (a) {
    return Ee(
      "getLocalVariableCollections",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function wn(e) {
  try {
    const a = "recursica:collectionId", n = [];
    for (const s of e.collectionIds)
      try {
        const c = await figma.variables.getVariableCollectionByIdAsync(s);
        if (c) {
          const o = c.getSharedPluginData(
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
      } catch (c) {
        await t.warning(
          `Failed to get GUID for collection ${s}: ${c instanceof Error ? c.message : String(c)}`
        ), n.push({
          collectionId: s,
          guid: null
        });
      }
    return ue(
      "getCollectionGuids",
      {
        collectionGuids: n
      }
    );
  } catch (a) {
    return Ee(
      "getCollectionGuids",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function $n(e) {
  try {
    await t.log("=== Starting Import Group Merge ==="), await figma.loadAllPagesAsync();
    const a = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!a || a.type !== "PAGE")
      throw new Error("Main page not found");
    const n = a.getPluginData(be);
    if (!n)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(n);
    await t.log(
      `Found metadata for component: ${i.componentName} (Version: ${i.componentVersion})`
    );
    let s = 0, c = 0;
    const o = "recursica:collectionId";
    for (const g of e.collectionChoices)
      if (g.choice === "merge")
        try {
          const y = await figma.variables.getVariableCollectionByIdAsync(
            g.newCollectionId
          );
          if (!y) {
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
            const E = y.getSharedPluginData(
              "recursica",
              o
            );
            if (E) {
              const T = await figma.variables.getLocalVariableCollectionsAsync();
              for (const M of T)
                if (M.getSharedPluginData(
                  "recursica",
                  o
                ) === E && M.id !== g.newCollectionId) {
                  $ = M;
                  break;
                }
              if (!$ && (E === Pe.LAYER || E === Pe.TOKENS || E === Pe.THEME)) {
                let M;
                E === Pe.LAYER ? M = Ce.LAYER : E === Pe.TOKENS ? M = Ce.TOKENS : M = Ce.THEME;
                for (const x of T)
                  if (x.getSharedPluginData(
                    "recursica",
                    o
                  ) === E && x.name === M && x.id !== g.newCollectionId) {
                    $ = x;
                    break;
                  }
                $ || ($ = figma.variables.createVariableCollection(M), $.setSharedPluginData(
                  "recursica",
                  o,
                  E
                ), await t.log(
                  `Created new standard collection: "${M}"`
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
            `Merging collection "${y.name}" (${g.newCollectionId.substring(0, 8)}...) into "${$.name}" (${$.id.substring(0, 8)}...)`
          );
          const R = y.variableIds.map(
            (E) => figma.variables.getVariableByIdAsync(E)
          ), P = await Promise.all(R), B = $.variableIds.map(
            (E) => figma.variables.getVariableByIdAsync(E)
          ), V = await Promise.all(B), I = new Set(
            V.filter((E) => E !== null).map((E) => E.name)
          );
          for (const E of P)
            if (E)
              try {
                if (I.has(E.name)) {
                  await t.warning(
                    `Variable "${E.name}" already exists in collection "${$.name}", skipping`
                  );
                  continue;
                }
                const T = figma.variables.createVariable(
                  E.name,
                  $,
                  E.resolvedType
                );
                for (const M of $.modes) {
                  const x = M.modeId;
                  let v = E.valuesByMode[x];
                  if (v === void 0 && y.modes.length > 0) {
                    const G = y.modes[0].modeId;
                    v = E.valuesByMode[G];
                  }
                  v !== void 0 && T.setValueForMode(x, v);
                }
                await t.log(
                  `  ✓ Copied variable "${E.name}" to collection "${$.name}"`
                );
              } catch (T) {
                await t.warning(
                  `Failed to copy variable "${E.name}": ${T instanceof Error ? T.message : String(T)}`
                );
              }
          y.remove(), s++, await t.log(
            `✓ Merged and deleted collection: ${y.name}`
          );
        } catch (y) {
          await t.warning(
            `Failed to merge collection: ${y instanceof Error ? y.message : String(y)}`
          );
        }
      else
        c++, await t.log(`Kept collection: ${g.newCollectionId}`);
    await t.log("Removing dividers...");
    const l = figma.root.children, p = [];
    for (const g of l) {
      if (g.type !== "PAGE") continue;
      const y = g.getPluginData(Se);
      (y === "start" || y === "end") && p.push(g);
    }
    const f = figma.currentPage;
    if (p.some((g) => g.id === f.id))
      if (a && a.id !== f.id)
        figma.currentPage = a;
      else {
        const g = l.find(
          (y) => y.type === "PAGE" && !p.some(($) => $.id === y.id)
        );
        g && (figma.currentPage = g);
      }
    const m = p.map((g) => g.name);
    for (const g of p)
      try {
        g.remove();
      } catch (y) {
        await t.warning(
          `Failed to delete divider: ${y instanceof Error ? y.message : String(y)}`
        );
      }
    for (const g of m)
      await t.log(`Deleted divider: ${g}`);
    await t.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const h = figma.root.children;
    let r = 0;
    const u = "RecursicaPublishedMetadata", d = [];
    for (const g of h)
      if (g.type === "PAGE")
        try {
          if (g.getPluginData(ge) === "true") {
            const $ = g.getPluginData(u);
            let R = {};
            if ($)
              try {
                R = JSON.parse($);
              } catch (P) {
              }
            d.push({
              pageId: g.id,
              pageName: g.name,
              pageMetadata: R
            });
          }
        } catch (y) {
          await t.warning(
            `Failed to process page: ${y instanceof Error ? y.message : String(y)}`
          );
        }
    for (const g of d)
      try {
        const y = await figma.getNodeByIdAsync(
          g.pageId
        );
        if (!y || y.type !== "PAGE") {
          await t.warning(
            `Page ${g.pageId} not found, skipping rename`
          );
          continue;
        }
        let $ = y.name;
        if ($.startsWith(Ae) && ($ = $.substring(Ae.length).trim()), $ === "REMOTES" || $.includes("REMOTES")) {
          y.name = "REMOTES", r++, await t.log(`Renamed page: "${y.name}" -> "REMOTES"`);
          continue;
        }
        const P = g.pageMetadata.name && g.pageMetadata.name.length > 0 && !g.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? g.pageMetadata.name : i.componentName || $, B = g.pageMetadata.version !== void 0 ? g.pageMetadata.version : i.componentVersion, V = `${P} (VERSION: ${B})`;
        y.name = V, r++, await t.log(`Renamed page: "${$}" -> "${V}"`);
      } catch (y) {
        await t.warning(
          `Failed to rename page ${g.pageId}: ${y instanceof Error ? y.message : String(y)}`
        );
      }
    if (await t.log("Clearing import metadata..."), a)
      try {
        a.setPluginData(be, "");
      } catch (g) {
        await t.warning(
          `Failed to clear primary import metadata: ${g instanceof Error ? g.message : String(g)}`
        );
      }
    for (const g of d)
      try {
        const y = await figma.getNodeByIdAsync(
          g.pageId
        );
        y && y.type === "PAGE" && y.setPluginData(ge, "");
      } catch (y) {
        await t.warning(
          `Failed to clear under review metadata for page ${g.pageId}: ${y instanceof Error ? y.message : String(y)}`
        );
      }
    const b = {
      mergedCollections: s,
      keptCollections: c,
      pagesRenamed: r
    };
    return await t.log(
      `=== Merge Complete ===
  Merged: ${s} collection(s)
  Kept: ${c} collection(s)
  Renamed: ${r} page(s)`
    ), ue(
      "mergeImportGroup",
      b
    );
  } catch (a) {
    return await t.error(
      `Merge failed: ${a instanceof Error ? a.message : String(a)}`
    ), Ee(
      "mergeImportGroup",
      a instanceof Error ? a : new Error(String(a))
    );
  }
}
async function Sn(e) {
  var a, n, i, s, c;
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
    const h = [];
    await t.log(
      `
--- Approach 1: Set layoutMode, then immediately bind ---`
    );
    try {
      const d = figma.createFrame();
      d.name = "Test Frame 1 - Immediate Bind", l.appendChild(d), d.layoutMode = "VERTICAL", await t.log("  Set layoutMode to VERTICAL"), d.setBoundVariable("itemSpacing", m), await t.log(
        "  Set bound variable immediately after layoutMode"
      );
      const b = (a = d.boundVariables) == null ? void 0 : a.itemSpacing, g = d.itemSpacing, y = b !== void 0;
      await t.log(`  Result: ${y ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(b)}`), h.push({
        approach: "1 - Immediate bind after layoutMode",
        success: y,
        message: y ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: b
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 1 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), h.push({
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
      const b = (n = d.boundVariables) == null ? void 0 : n.itemSpacing, g = d.itemSpacing, y = b !== void 0;
      await t.log(`  Result: ${y ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(b)}`), h.push({
        approach: "2 - Clear then bind",
        success: y,
        message: y ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: b
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 2 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), h.push({
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
      const b = (i = d.boundVariables) == null ? void 0 : i.itemSpacing, g = d.itemSpacing, y = b !== void 0;
      await t.log(`  Result: ${y ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(b)}`), h.push({
        approach: "3 - Bind before layoutMode",
        success: y,
        message: y ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: b
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 3 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), h.push({
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
      const b = (s = d.boundVariables) == null ? void 0 : s.itemSpacing, g = d.itemSpacing, y = b !== void 0;
      await t.log(`  Result: ${y ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(b)}`), h.push({
        approach: "4 - Remove then bind",
        success: y,
        message: y ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: b
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 4 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), h.push({
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
      const b = (c = d.boundVariables) == null ? void 0 : c.itemSpacing, g = d.itemSpacing, y = b !== void 0;
      await t.log(`  Result: ${y ? "SUCCESS" : "FAILED"}`), await t.log(`  itemSpacing value: ${g}`), await t.log(`  boundVariable: ${JSON.stringify(b)}`), h.push({
        approach: "5 - Wait then bind",
        success: y,
        message: y ? "Variable binding succeeded" : "Variable binding failed",
        details: {
          itemSpacing: g,
          boundVariable: b
        }
      });
    } catch (d) {
      await t.error(
        `  Approach 5 failed with error: ${d instanceof Error ? d.message : String(d)}`
      ), h.push({
        approach: "5 - Wait then bind",
        success: !1,
        message: `Error: ${d instanceof Error ? d.message : String(d)}`
      });
    }
    await t.log(`
=== Test Summary ===`);
    const r = h.filter((d) => d.success), u = h.filter((d) => !d.success);
    await t.log(
      `Successful approaches: ${r.length}/${h.length}`
    );
    for (const d of h)
      await t.log(
        `  ${d.approach}: ${d.success ? "✓ SUCCESS" : "✗ FAILED"} - ${d.message}`
      );
    return {
      success: r.length > 0,
      message: `Test completed: ${r.length}/${h.length} approaches succeeded`,
      details: {
        results: h,
        successfulApproaches: r.map((d) => d.approach),
        failedApproaches: u.map((d) => d.approach)
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
  var a, n, i, s, c, o, l, p;
  try {
    await t.log(
      "=== Test: itemSpacing Variable Binding - Import Simulation ==="
    );
    const f = await figma.getNodeByIdAsync(e);
    if (!f || f.type !== "PAGE")
      throw new Error("Test page not found");
    const m = f.children.find(
      (J) => J.type === "FRAME" && J.name === "Test"
    );
    if (!m)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const h = figma.variables.createVariableCollection("Test"), r = h.modes[0], u = figma.variables.createVariable(
      "Spacing",
      h,
      "FLOAT"
    );
    u.setValueForMode(r.modeId, 16), await t.log(
      `Created variable: "${u.name}" = ${u.valuesByMode[r.modeId]} in collection "${h.name}"`
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
    } catch (J) {
    }
    d.setBoundVariable("itemSpacing", u), await t.log(
      "  Called setBoundVariable('itemSpacing', variable)"
    );
    const b = (a = d.boundVariables) == null ? void 0 : a.itemSpacing, g = d.itemSpacing;
    if (await t.log(
      `  After setting binding: itemSpacing=${g}, boundVar=${JSON.stringify(b)}`
    ), !b)
      return {
        success: !1,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: g,
          boundVariable: b
        }
      };
    await t.log("  Setting other layout properties..."), d.primaryAxisSizingMode = "AUTO", d.counterAxisSizingMode = "AUTO", d.primaryAxisAlignItems = "MIN", d.counterAxisAlignItems = "MIN", await t.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems"
    );
    const y = (n = d.boundVariables) == null ? void 0 : n.itemSpacing, $ = d.itemSpacing;
    await t.log(
      `  After layout properties: itemSpacing=${$}, boundVar=${JSON.stringify(y)}`
    ), await t.log("  Setting padding properties..."), d.paddingLeft = 0, d.paddingRight = 0, d.paddingTop = 0, d.paddingBottom = 0, await t.log("  Set padding to 0");
    const R = (i = d.boundVariables) == null ? void 0 : i.itemSpacing, P = d.itemSpacing;
    await t.log(
      `  After padding: itemSpacing=${P}, boundVar=${JSON.stringify(R)}`
    ), await t.log("  Simulating 'late setting' code...");
    const B = 0, V = !0, I = { itemSpacing: !0 }, E = ((s = d.boundVariables) == null ? void 0 : s.itemSpacing) !== void 0;
    B !== void 0 && d.layoutMode !== void 0 && (!E && (!V || !I.itemSpacing) || E && await t.log(
      "  ✓ Late setting correctly skipped (binding exists)"
    ));
    const T = (c = d.boundVariables) == null ? void 0 : c.itemSpacing, M = d.itemSpacing;
    await t.log(
      `  After late setting: itemSpacing=${M}, boundVar=${JSON.stringify(T)}`
    ), await t.log("  Appending children (might reset itemSpacing)...");
    const x = figma.createFrame();
    x.name = "Child 1", x.resize(50, 50), d.appendChild(x);
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
    const z = (p = d.boundVariables) == null ? void 0 : p.itemSpacing, K = d.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${K}, boundVar=${JSON.stringify(z)}`
    );
    const H = z !== void 0 && z.id === u.id;
    return await t.log(`
=== Import Simulation Summary ===`), await t.log(
      `Result: ${H ? "SUCCESS" : "FAILED"} - Binding ${H ? "survived" : "was lost"} through import simulation`
    ), {
      success: H,
      message: H ? "Variable binding survived the import simulation" : "Variable binding was lost during import simulation",
      details: {
        afterSet: {
          itemSpacing: g,
          boundVariable: b
        },
        afterLayout: {
          itemSpacing: $,
          boundVariable: y
        },
        afterPadding: {
          itemSpacing: P,
          boundVariable: R
        },
        afterLate: {
          itemSpacing: M,
          boundVariable: T
        },
        afterChildren: {
          itemSpacing: S,
          boundVariable: G
        },
        final: {
          itemSpacing: K,
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
async function vn(e) {
  var a, n, i, s;
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
      (V) => V.type === "FRAME" && V.name === "Test"
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
      m.boundVariables = ye(ee({}, m.boundVariables || {}), {
        itemSpacing: {
          type: "VARIABLE_ALIAS",
          id: f.id
        }
      }), await t.log(
        "  Called (frame as any).boundVariables.itemSpacing = alias (BROKEN APPROACH)"
      );
    } catch (V) {
      await t.log(
        `  Direct assignment failed (expected): ${V instanceof Error ? V.message : String(V)}`
      );
    }
    const h = (a = m.boundVariables) == null ? void 0 : a.itemSpacing, r = m.itemSpacing;
    await t.log(
      `  After broken set: itemSpacing=${r}, boundVar=${JSON.stringify(h)}`
    ), await t.log(
      "  Attempting to fix by using setBoundVariable() API..."
    );
    try {
      m.setBoundVariable("itemSpacing", f), await t.log(
        "  Called setBoundVariable('itemSpacing', variable)"
      );
    } catch (V) {
      await t.log(
        `  setBoundVariable failed: ${V instanceof Error ? V.message : String(V)}`
      );
    }
    const u = (n = m.boundVariables) == null ? void 0 : n.itemSpacing, d = m.itemSpacing;
    await t.log(
      `  After correct set: itemSpacing=${d}, boundVar=${JSON.stringify(u)}`
    ), await t.log(
      "  ⚠️ BROKEN: Simulating 'late setting' code WITHOUT checking if bound..."
    );
    const b = 0;
    b !== void 0 && m.layoutMode !== void 0 && (await t.log(
      "  ⚠️ Late setting OVERRIDING itemSpacing without checking if bound!"
    ), m.itemSpacing = b);
    const g = (i = m.boundVariables) == null ? void 0 : i.itemSpacing, y = m.itemSpacing;
    await t.log(
      `  After broken late setting: itemSpacing=${y}, boundVar=${JSON.stringify(g)}`
    ), await t.log(
      "  ⚠️ BROKEN: Simulating 'FINAL FIX' code WITHOUT checking if bound..."
    );
    const $ = 0;
    (m.layoutMode === "VERTICAL" || m.layoutMode === "HORIZONTAL") && $ !== void 0 && (await t.log(
      "  ⚠️ FINAL FIX OVERRIDING itemSpacing without checking if bound!"
    ), m.itemSpacing = $);
    const R = (s = m.boundVariables) == null ? void 0 : s.itemSpacing, P = m.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${P}, boundVar=${JSON.stringify(R)}`
    );
    const B = R === void 0;
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
          boundVariable: h
        },
        afterCorrectSet: {
          itemSpacing: d,
          boundVariable: u
        },
        afterLate: {
          itemSpacing: y,
          boundVariable: g
        },
        final: {
          itemSpacing: P,
          boundVariable: R
        },
        bindingLost: B
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
async function Nn(e) {
  var a, n, i, s, c, o, l, p;
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
      (J) => J.type === "FRAME" && J.name === "Test"
    );
    if (!m)
      throw new Error("Test frame container not found on page");
    await t.log("Creating test variable collection and variable...");
    const h = figma.variables.createVariableCollection("Test"), r = h.modes[0], u = figma.variables.createVariable(
      "Spacing",
      h,
      "FLOAT"
    );
    u.setValueForMode(r.modeId, 16), await t.log(
      `Created variable: "${u.name}" = ${u.valuesByMode[r.modeId]} in collection "${h.name}"`
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
    } catch (J) {
    }
    d.setBoundVariable("itemSpacing", u), await t.log(
      "  Called setBoundVariable('itemSpacing', variable) (CORRECT APPROACH)"
    );
    const b = (a = d.boundVariables) == null ? void 0 : a.itemSpacing, g = d.itemSpacing;
    if (await t.log(
      `  After setting binding: itemSpacing=${g}, boundVar=${JSON.stringify(b)}`
    ), !b)
      return {
        success: !1,
        message: "Binding failed immediately after setBoundVariable()",
        details: {
          itemSpacing: g,
          boundVariable: b
        }
      };
    await t.log("  Setting other layout properties..."), d.primaryAxisSizingMode = "AUTO", d.counterAxisSizingMode = "AUTO", d.primaryAxisAlignItems = "MIN", d.counterAxisAlignItems = "MIN", await t.log(
      "  Set primaryAxisSizingMode, counterAxisSizingMode, alignItems"
    );
    const y = (n = d.boundVariables) == null ? void 0 : n.itemSpacing, $ = d.itemSpacing;
    await t.log(
      `  After layout properties: itemSpacing=${$}, boundVar=${JSON.stringify(y)}`
    ), await t.log("  Setting padding properties..."), d.paddingLeft = 0, d.paddingRight = 0, d.paddingTop = 0, d.paddingBottom = 0, await t.log("  Set padding to 0");
    const R = (i = d.boundVariables) == null ? void 0 : i.itemSpacing, P = d.itemSpacing;
    await t.log(
      `  After padding: itemSpacing=${P}, boundVar=${JSON.stringify(R)}`
    ), await t.log(
      "  ✓ FIXED: Simulating 'late setting' code WITH check if bound..."
    );
    const B = 0, V = !0, I = { itemSpacing: !0 }, E = ((s = d.boundVariables) == null ? void 0 : s.itemSpacing) !== void 0;
    B !== void 0 && d.layoutMode !== void 0 && (!E && (!V || !I.itemSpacing) || E && await t.log(
      "  ✓ Late setting correctly skipped (binding exists) - FIXED!"
    ));
    const T = (c = d.boundVariables) == null ? void 0 : c.itemSpacing, M = d.itemSpacing;
    await t.log(
      `  After fixed late setting: itemSpacing=${M}, boundVar=${JSON.stringify(T)}`
    ), await t.log("  Appending children (might reset itemSpacing)...");
    const x = figma.createFrame();
    x.name = "Child 1", x.resize(50, 50), d.appendChild(x);
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
    const z = (p = d.boundVariables) == null ? void 0 : p.itemSpacing, K = d.itemSpacing;
    await t.log(
      `  FINAL: itemSpacing=${K}, boundVar=${JSON.stringify(z)}`
    );
    const H = z !== void 0 && z.id === u.id;
    return await t.log(`
=== Fix Demonstration Summary ===`), await t.log(
      `Result: ${H ? "SUCCESS ✓" : "FAILED ✗"} - Binding ${H ? "survived" : "was lost"} through fixed import simulation`
    ), {
      success: H,
      message: H ? "Fix demonstrated: Binding survived using new fixed approach" : "Fix failed: Binding was lost (unexpected)",
      details: {
        afterSet: {
          itemSpacing: g,
          boundVariable: b
        },
        afterLayout: {
          itemSpacing: $,
          boundVariable: y
        },
        afterPadding: {
          itemSpacing: P,
          boundVariable: R
        },
        afterLate: {
          itemSpacing: M,
          boundVariable: T
        },
        afterChildren: {
          itemSpacing: S,
          boundVariable: G
        },
        final: {
          itemSpacing: K,
          boundVariable: z
        },
        bindingSurvived: H
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
async function Cn(e) {
  var a, n, i, s, c, o, l, p, f, m, h, r;
  try {
    await t.log(
      "=== Test: Constraints Import/Export (Issue #4) ==="
    );
    const u = await figma.getNodeByIdAsync(e);
    if (!u || u.type !== "PAGE")
      throw new Error("Test page not found");
    const d = u.children.find(
      (U) => U.type === "FRAME" && U.name === "Test"
    );
    if (!d)
      throw new Error("Test frame container not found on page");
    await t.log(
      `
--- Step 1: Create frame with SCALE constraints ---`
    );
    const b = figma.createFrame();
    b.name = "Original Frame - SCALE Constraints", b.resize(100, 100), d.appendChild(b), await t.log(
      "  Setting constraints using constraints object API..."
    );
    try {
      b.constraints = {
        horizontal: "SCALE",
        vertical: "SCALE"
      }, await t.log("  ✓ Set constraints using constraints object");
    } catch (U) {
      const z = U instanceof Error ? U.message : String(U);
      throw await t.warning(
        `  ✗ Failed to set constraints: ${z}`
      ), new Error(`Failed to set constraints on frame: ${z}`);
    }
    const g = (a = b.constraints) == null ? void 0 : a.horizontal, y = (n = b.constraints) == null ? void 0 : n.vertical;
    if (await t.log(
      `  Original constraints: H=${g}, V=${y}`
    ), g !== "SCALE" || y !== "SCALE")
      throw new Error(
        `Failed to set SCALE constraints. Got H=${g}, V=${y}`
      );
    const $ = (i = b.constraints) == null ? void 0 : i.horizontal, R = (s = b.constraints) == null ? void 0 : s.vertical;
    if (await t.log(
      `  Original constraints: H=${$}, V=${R}`
    ), $ !== "SCALE" || R !== "SCALE")
      return {
        success: !1,
        message: "Failed to set SCALE constraints on original frame",
        details: {
          constraintHorizontal: $,
          constraintVertical: R
        }
      };
    await t.log(
      `
--- Step 2: Simulate Export (read constraints) ---`
    );
    const P = (c = b.constraints) == null ? void 0 : c.horizontal, B = (o = b.constraints) == null ? void 0 : o.vertical;
    await t.log(
      `  Exported constraints: H=${P}, V=${B}`
    );
    const V = {
      type: "FRAME",
      name: "Imported Frame - Should Have SCALE",
      width: 100,
      height: 100,
      constraintHorizontal: P,
      constraintVertical: B
    };
    await t.log(
      `
--- Step 3: Simulate Import (create frame and set constraints) ---`
    );
    const I = figma.createFrame();
    I.name = "Imported Frame - SCALE Constraints", I.resize(V.width, V.height), d.appendChild(I);
    const E = (l = I.constraints) == null ? void 0 : l.horizontal, T = (p = I.constraints) == null ? void 0 : p.vertical;
    await t.log(
      `  Constraints before setting: H=${E}, V=${T} (expected: MIN, MIN)`
    ), I.constraints = {
      horizontal: P,
      vertical: B
    }, await t.log(
      `  Set constraints using constraints object: H=${P}, V=${B}`
    ), await t.log(`
--- Step 4: Verify Imported Constraints ---`);
    const M = (f = I.constraints) == null ? void 0 : f.horizontal, x = (m = I.constraints) == null ? void 0 : m.vertical;
    await t.log(
      `  Imported constraints: H=${M}, V=${x}`
    ), await t.log("  Expected constraints: H=SCALE, V=SCALE");
    const v = M === "SCALE" && x === "SCALE";
    v ? await t.log("  ✓ Constraints correctly imported as SCALE") : await t.warning(
      `  ⚠️ Constraints mismatch! Expected SCALE, got H=${M}, V=${x}`
    ), await t.log(`
--- Step 5: Test Other Constraint Values ---`);
    const G = [
      { h: "MIN", v: "MIN", name: "MIN/MIN" },
      { h: "CENTER", v: "CENTER", name: "CENTER/CENTER" },
      { h: "MAX", v: "MAX", name: "MAX/MAX" },
      { h: "STRETCH", v: "STRETCH", name: "STRETCH/STRETCH" }
    ], S = [];
    for (const U of G) {
      const z = figma.createFrame();
      z.name = `Test Frame - ${U.name}`, z.resize(50, 50), d.appendChild(z), z.constraints = {
        horizontal: U.h,
        vertical: U.v
      };
      const K = (h = z.constraints) == null ? void 0 : h.horizontal, H = (r = z.constraints) == null ? void 0 : r.vertical, J = K === U.h && H === U.v;
      S.push({
        name: U.name,
        success: J,
        details: {
          expected: { h: U.h, v: U.v },
          actual: { h: K, v: H }
        }
      }), J ? await t.log(
        `  ✓ ${U.name}: Correctly set to H=${K}, V=${H}`
      ) : await t.warning(
        `  ⚠️ ${U.name}: Expected H=${U.h}, V=${U.v}, got H=${K}, V=${H}`
      );
    }
    const N = S.every((U) => U.success);
    return {
      success: v && N,
      message: v && N ? "Constraints correctly exported and imported (SCALE preserved)" : `Constraints test failed: SCALE=${v ? "PASS" : "FAIL"}, Other values=${N ? "PASS" : "FAIL"}`,
      details: {
        original: {
          constraintHorizontal: $,
          constraintVertical: R
        },
        exported: {
          constraintHorizontal: P,
          constraintVertical: B
        },
        imported: {
          constraintHorizontal: M,
          constraintVertical: x
        },
        otherValues: S,
        allTestsPassed: v && N
      }
    };
  } catch (u) {
    const d = u instanceof Error ? u.message : "Unknown error occurred";
    return await t.error(`Constraints test failed: ${d}`), {
      success: !1,
      message: `Test error: ${d}`
    };
  }
}
async function An(e) {
  var a, n, i, s;
  try {
    await t.log(
      "=== Test: Constraints on VECTOR in COMPONENT (FAILURE CASE) ==="
    );
    const c = await figma.getNodeByIdAsync(e);
    if (!c || c.type !== "PAGE")
      throw new Error("Test page not found");
    const o = c.children.find(
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
    let f = !1, m = !1, h, r;
    try {
      p.constraints = {
        horizontal: "SCALE",
        vertical: "SCALE"
      };
      const g = (a = p.constraints) == null ? void 0 : a.horizontal, y = (n = p.constraints) == null ? void 0 : n.vertical;
      g === "SCALE" && y === "SCALE" ? (f = !0, m = !0, await t.log(
        "  ✓ Constraints set successfully using constraints object (unexpected - should have failed with old approach)"
      )) : await t.warning(
        `  ⚠️ Constraints set but values are H=${g || "undefined"}, V=${y || "undefined"}`
      );
    } catch (g) {
      h = g instanceof Error ? g.message : String(g), r = h, await t.warning(
        `  ✗ Failed to set constraints: ${h}`
      );
    }
    await t.log(`
--- Step 5: Verify Final State ---`);
    const u = (i = p.constraints) == null ? void 0 : i.horizontal, d = (s = p.constraints) == null ? void 0 : s.vertical;
    await t.log(
      `  Final constraints: H=${u || "undefined"}, V=${d || "undefined"}`
    );
    const b = f && m && u === "SCALE" && d === "SCALE";
    return b ? await t.log(
      "  ✓ Constraints successfully set using constraints object API (even after appending to COMPONENT)"
    ) : await t.warning(
      `  ⚠️ Constraints could not be set. H=${u || "undefined"}, V=${d || "undefined"}`
    ), {
      success: b,
      message: b ? "Constraints successfully set on VECTOR in COMPONENT using constraints object API (even after appending)" : "Failed to set constraints on VECTOR in COMPONENT",
      details: {
        constraintHSet: f,
        constraintVSet: m,
        constraintHError: h,
        constraintVError: r,
        finalConstraintH: u,
        finalConstraintV: d,
        success: b
      }
    };
  } catch (c) {
    const o = c instanceof Error ? c.message : "Unknown error occurred";
    return await t.error(
      `Constraints vector in component failure test error: ${o}`
    ), {
      success: !1,
      message: `Test error: ${o}`
    };
  }
}
async function In(e) {
  var a, n, i, s;
  try {
    await t.log(
      "=== Test: Constraints on VECTOR in COMPONENT (FIX CASE) ==="
    );
    const c = await figma.getNodeByIdAsync(e);
    if (!c || c.type !== "PAGE")
      throw new Error("Test page not found");
    const o = c.children.find(
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
    let f = !1, m = !1, h, r;
    try {
      p.constraints = {
        horizontal: "SCALE",
        vertical: "SCALE"
      };
      const g = (a = p.constraints) == null ? void 0 : a.horizontal, y = (n = p.constraints) == null ? void 0 : n.vertical;
      g === "SCALE" && y === "SCALE" ? (f = !0, m = !0, await t.log(
        "  ✓ Constraints set successfully using constraints object: H=SCALE, V=SCALE"
      )) : await t.warning(
        `  ⚠️ Constraints set but values are H=${g || "undefined"}, V=${y || "undefined"} (expected SCALE)`
      );
    } catch (g) {
      h = g instanceof Error ? g.message : String(g), r = h, await t.warning(
        `  ✗ Failed to set constraints: ${h}`
      );
    }
    await t.log(`
--- Step 7: Verify constraints are set ---`);
    const u = (i = p.constraints) == null ? void 0 : i.horizontal, d = (s = p.constraints) == null ? void 0 : s.vertical;
    await t.log(
      `  Final constraints: H=${u || "undefined"}, V=${d || "undefined"}`
    ), await t.log("  Expected: H=SCALE, V=SCALE");
    const b = f && m && u === "SCALE" && d === "SCALE";
    return b ? await t.log(
      "  ✓ Constraints correctly set and preserved through all operations"
    ) : await t.warning(
      `  ⚠️ Constraints test failed! Expected SCALE/SCALE, got H=${u || "undefined"}, V=${d || "undefined"}`
    ), {
      success: b,
      message: b ? "Constraints correctly set on VECTOR in COMPONENT when set immediately after creation" : "Failed to set constraints on VECTOR in COMPONENT",
      details: {
        constraintHSet: f,
        constraintVSet: m,
        constraintHError: h,
        constraintVError: r,
        finalConstraintH: u,
        finalConstraintV: d,
        success: b
      }
    };
  } catch (c) {
    const o = c instanceof Error ? c.message : "Unknown error occurred";
    return await t.error(
      `Constraints vector in component fix test error: ${o}`
    ), {
      success: !1,
      message: `Test error: ${o}`
    };
  }
}
async function Tn(e) {
  var a, n, i, s;
  try {
    await t.log(
      "=== Test: Constraints on Standalone VECTOR (not in COMPONENT) ==="
    );
    const c = await figma.getNodeByIdAsync(e);
    if (!c || c.type !== "PAGE")
      throw new Error("Test page not found");
    const o = c.children.find(
      (b) => b.type === "FRAME" && b.name === "Test"
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
    let p = !1, f = !1, m, h;
    await t.log(
      "  Attempting to set constraints using constraints object API..."
    );
    try {
      l.constraints = {
        horizontal: "SCALE",
        vertical: "SCALE"
      };
      const b = (a = l.constraints) == null ? void 0 : a.horizontal, g = (n = l.constraints) == null ? void 0 : n.vertical;
      b === "SCALE" && g === "SCALE" ? (p = !0, f = !0, await t.log(
        "  ✓ Constraints set successfully via constraints object: H=SCALE, V=SCALE"
      )) : await t.warning(
        `  ⚠️ Constraints set but values are H=${b || "undefined"}, V=${g || "undefined"}`
      );
    } catch (b) {
      m = b instanceof Error ? b.message : String(b), h = m, await t.warning(
        `  ✗ Failed to set constraints: ${m}`
      );
    }
    await t.log(`
--- Step 5: Verify Final State ---`);
    const r = (i = l.constraints) == null ? void 0 : i.horizontal, u = (s = l.constraints) == null ? void 0 : s.vertical;
    await t.log(
      `  Final constraints: H=${r || "undefined"}, V=${u || "undefined"}`
    );
    const d = p && f && r === "SCALE" && u === "SCALE";
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
        constraintVError: h,
        finalConstraintH: r,
        finalConstraintV: u,
        success: d
      }
    };
  } catch (c) {
    const o = c instanceof Error ? c.message : "Unknown error occurred";
    return await t.error(
      `Constraints standalone vector test error: ${o}`
    ), {
      success: !1,
      message: `Test error: ${o}`
    };
  }
}
async function Pn(e) {
  try {
    await t.log("=== Starting Test ==="), await figma.loadAllPagesAsync();
    let n = figma.root.children.find(
      (T) => T.type === "PAGE" && T.name === "Test"
    );
    n ? await t.log('Found existing "Test" page') : (n = figma.createPage(), n.name = "Test", await t.log('Created "Test" page')), await figma.setCurrentPageAsync(n);
    const i = n.children.find(
      (T) => T.type === "FRAME" && T.name === "Test"
    );
    i && (await t.log(
      'Found existing "Test" frame, deleting it and all children...'
    ), i.remove(), await t.log('Deleted existing "Test" frame'));
    const s = figma.createFrame();
    s.name = "Test", n.appendChild(s), await t.log('Created new "Test" frame container');
    const c = [];
    await t.log(`
` + "=".repeat(60)), await t.log("TEST 1: Original 5 Approaches"), await t.log("=".repeat(60));
    const o = await Sn(n.id);
    c.push({
      name: "Original 5 Approaches",
      success: o.success,
      message: o.message,
      details: o.details
    }), s.remove();
    const l = figma.createFrame();
    l.name = "Test", n.appendChild(l), await t.log(`
` + "=".repeat(60)), await t.log("TEST 2: Import Simulation"), await t.log("=".repeat(60));
    const p = await En(
      n.id
    );
    c.push({
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
    const m = await vn(
      n.id
    );
    c.push({
      name: "Failure Demonstration",
      success: m.success,
      message: m.message,
      details: m.details
    }), f.remove();
    const h = figma.createFrame();
    h.name = "Test", n.appendChild(h), await t.log(`
` + "=".repeat(60)), await t.log("TEST 4: Fix Demonstration (New Fixed Approach)"), await t.log("=".repeat(60));
    const r = await Nn(n.id);
    c.push({
      name: "Fix Demonstration",
      success: r.success,
      message: r.message,
      details: r.details
    }), h.remove();
    const u = figma.createFrame();
    u.name = "Test", n.appendChild(u), await t.log(`
` + "=".repeat(60)), await t.log("TEST 5: Constraints Import/Export (Issue #4)"), await t.log("=".repeat(60));
    const d = await Cn(n.id);
    c.push({
      name: "Constraints Import/Export",
      success: d.success,
      message: d.message,
      details: d.details
    }), u.remove();
    const b = figma.createFrame();
    b.name = "Test", n.appendChild(b), await t.log(`
` + "=".repeat(60)), await t.log(
      "TEST 6: Constraints on VECTOR in COMPONENT (FAILURE CASE)"
    ), await t.log("=".repeat(60));
    const g = await An(
      n.id
    );
    c.push({
      name: "Constraints VECTOR in COMPONENT (Failure)",
      success: g.success,
      message: g.message,
      details: g.details
    }), b.remove();
    const y = figma.createFrame();
    y.name = "Test", n.appendChild(y), await t.log(`
` + "=".repeat(60)), await t.log(
      "TEST 7: Constraints on VECTOR in COMPONENT (FIX CASE)"
    ), await t.log("=".repeat(60));
    const $ = await In(n.id);
    c.push({
      name: "Constraints VECTOR in COMPONENT (Fix)",
      success: $.success,
      message: $.message,
      details: $.details
    }), y.remove();
    const R = figma.createFrame();
    R.name = "Test", n.appendChild(R), await t.log(`
` + "=".repeat(60)), await t.log(
      "TEST 8: Constraints on Standalone VECTOR (not in COMPONENT)"
    ), await t.log("=".repeat(60));
    const P = await Tn(n.id);
    c.push({
      name: "Constraints VECTOR Standalone",
      success: P.success,
      message: P.message,
      details: P.details
    }), await t.log(`
` + "=".repeat(60)), await t.log("=== ALL TESTS COMPLETE ==="), await t.log("=".repeat(60));
    const B = c.filter((T) => T.success), V = c.filter((T) => !T.success);
    await t.log(
      `Total: ${c.length} | Passed: ${B.length} | Failed: ${V.length}`
    );
    for (const T of c)
      await t.log(
        `  ${T.success ? "✓" : "✗"} ${T.name}: ${T.message}`
      );
    const E = {
      testResults: {
        success: o.success && p.success && m.success && // This "success" means we demonstrated the failure
        r.success && d.success && g.success && // This "success" means we demonstrated the failure
        $.success && P.success,
        message: `All tests completed: ${B.length}/${c.length} passed`,
        details: {
          summary: {
            total: c.length,
            passed: B.length,
            failed: V.length
          },
          tests: c
        }
      },
      allTests: c
    };
    return ue("runTest", E);
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    return await t.error(`Test failed: ${n}`), Ee("runTest", n);
  }
}
const Vn = {
  getCurrentUser: Qt,
  loadPages: ea,
  exportPage: Ye,
  importPage: Ft,
  cleanupCreatedEntities: Za,
  resolveDeferredNormalInstances: Bt,
  determineImportOrder: zt,
  buildDependencyGraph: Ut,
  resolveImportOrder: Gt,
  importPagesInOrder: _t,
  quickCopy: Qa,
  storeAuthData: en,
  loadAuthData: tn,
  clearAuthData: an,
  storeImportData: nn,
  loadImportData: on,
  clearImportData: rn,
  storeSelectedRepo: sn,
  getComponentMetadata: cn,
  getAllComponents: ln,
  pluginPromptResponse: dn,
  switchToPage: gn,
  checkForExistingPrimaryImport: pn,
  createImportDividers: mn,
  importSingleComponentWithWizard: fn,
  deleteImportGroup: Jt,
  clearImportMetadata: hn,
  cleanupFailedImport: un,
  summarizeVariablesForWizard: yn,
  getLocalVariableCollections: bn,
  getCollectionGuids: wn,
  mergeImportGroup: $n,
  runTest: Pn
}, On = Vn;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    la(e);
    return;
  }
  const a = e;
  try {
    const n = a.type, i = On[n];
    if (!i) {
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
    const s = await i(a.data);
    figma.ui.postMessage(ye(ee({}, s), {
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
