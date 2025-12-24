var bn = Object.defineProperty, $n = Object.defineProperties;
var vn = Object.getOwnPropertyDescriptors;
var st = Object.getOwnPropertySymbols;
var Mt = Object.prototype.hasOwnProperty, kt = Object.prototype.propertyIsEnumerable;
var $t = (e, n, o) => n in e ? bn(e, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : e[n] = o, le = (e, n) => {
  for (var o in n || (n = {}))
    Mt.call(n, o) && $t(e, o, n[o]);
  if (st)
    for (var o of st(n))
      kt.call(n, o) && $t(e, o, n[o]);
  return e;
}, Ne = (e, n) => $n(e, vn(n));
var vt = (e, n) => {
  var o = {};
  for (var i in e)
    Mt.call(e, i) && n.indexOf(i) < 0 && (o[i] = e[i]);
  if (e != null && st)
    for (var i of st(e))
      n.indexOf(i) < 0 && kt.call(e, i) && (o[i] = e[i]);
  return o;
};
var Pe = (e, n, o) => $t(e, typeof n != "symbol" ? n + "" : n, o);
async function Sn(e) {
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
async function Cn(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((a, l) => ({
          name: a.name,
          index: l
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
const Ee = {
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
}, we = Ne(le({}, Ee), {
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
}), Me = Ne(le({}, Ee), {
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
}), Ye = Ne(le({}, Ee), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), jt = Ne(le({}, Ee), {
  cornerRadius: 0
}), Nn = Ne(le({}, Ee), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function En(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return we;
    case "TEXT":
      return Me;
    case "VECTOR":
      return Ye;
    case "LINE":
      return Nn;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return jt;
    default:
      return Ee;
  }
}
function ge(e, n) {
  if (Array.isArray(e))
    return Array.isArray(n) ? e.length !== n.length || e.some((o, i) => ge(o, n[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof n == "object" && n !== null) {
      const o = Object.keys(e), i = Object.keys(n);
      return o.length !== i.length ? !0 : o.some(
        (a) => !(a in n) || ge(e[a], n[a])
      );
    }
    return !0;
  }
  return e !== n;
}
const _e = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, Ue = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function Te(e) {
  const n = e.trim(), i = n.replace(/_\d+$/, "").toLowerCase();
  return i === "themes" || i === "theme" ? Ue.THEME : i === "token" || i === "tokens" ? Ue.TOKENS : i === "layer" || i === "layers" ? Ue.LAYER : n;
}
function Ge(e) {
  const n = Te(e);
  return n === Ue.LAYER || n === Ue.TOKENS || n === Ue.THEME;
}
function ft(e) {
  const n = Te(e);
  if (n === Ue.LAYER)
    return _e.LAYER;
  if (n === Ue.TOKENS)
    return _e.TOKENS;
  if (n === Ue.THEME)
    return _e.THEME;
}
class it {
  constructor() {
    Pe(this, "collectionMap");
    // collectionId -> index
    Pe(this, "collections");
    // index -> collection data
    Pe(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    Pe(this, "nextIndex");
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
    const i = Te(
      n.collectionName
    );
    if (Ge(n.collectionName)) {
      const r = this.findCollectionByNormalizedName(i);
      if (r !== void 0) {
        const g = this.collections[r];
        return g.modes = this.mergeModes(
          g.modes,
          n.modes
        ), this.collectionMap.set(o, r), r;
      }
    }
    const a = this.nextIndex++;
    this.collectionMap.set(o, a);
    const l = Ne(le({}, n), {
      collectionName: i
    });
    if (Ge(n.collectionName)) {
      const r = ft(
        n.collectionName
      );
      r && (l.collectionGuid = r), this.normalizedNameMap.set(i, a);
    }
    return this.collections[a] = l, a;
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
      const i = this.collections[o], a = le({
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
    const o = new it(), i = Object.entries(n).sort(
      (l, r) => parseInt(l[0], 10) - parseInt(r[0], 10)
    );
    for (const [l, r] of i) {
      const g = parseInt(l, 10), d = (a = r.isLocal) != null ? a : !0, m = Te(
        r.collectionName || ""
      ), y = r.collectionId || r.collectionGuid || `temp:${g}:${m}`, b = le({
        collectionName: m,
        collectionId: y,
        isLocal: d,
        modes: r.modes || []
      }, r.collectionGuid && {
        collectionGuid: r.collectionGuid
      });
      o.collectionMap.set(y, g), o.collections[g] = b, Ge(m) && o.normalizedNameMap.set(m, g), o.nextIndex = Math.max(
        o.nextIndex,
        g + 1
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
class rt {
  constructor() {
    Pe(this, "variableMap");
    // variableKey -> index
    Pe(this, "variables");
    // index -> variable data
    Pe(this, "nextIndex");
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
      ), l = le(le({
        variableName: i.variableName,
        variableType: An(i.variableType)
      }, i._colRef !== void 0 && { _colRef: i._colRef }), a && { valuesByMode: a });
      n[String(o)] = l;
    }
    return n;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(n) {
    const o = new rt(), i = Object.entries(n).sort(
      (a, l) => parseInt(a[0], 10) - parseInt(l[0], 10)
    );
    for (const [a, l] of i) {
      const r = parseInt(a, 10), g = Pn(l.variableType), d = Ne(le({}, l), {
        variableType: g
        // Always a string after expansion
      });
      o.variables[r] = d, o.nextIndex = Math.max(o.nextIndex, r + 1);
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
function ze(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let On = 0;
const ot = /* @__PURE__ */ new Map();
function xn(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const n = ot.get(e.requestId);
  n && (ot.delete(e.requestId), e.error || !e.guid ? n.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : n.resolve(e.guid));
}
function At() {
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
const He = [], t = {
  clear: () => {
    console.clear(), He.length = 0;
  },
  log: (e) => {
    console.log(e), He.push({
      type: "log",
      message: e
    });
  },
  warning: (e) => {
    console.warn(e), He.push({
      type: "warning",
      message: e
    });
  },
  error: (e) => {
    console.error(e), He.push({
      type: "error",
      message: e
    });
  },
  /**
   * Get all collected logs without clearing the buffer
   */
  getLogs: () => [...He],
  /**
   * Get all collected logs and clear the buffer
   */
  flush: () => {
    const e = [...He];
    return He.length = 0, e;
  }
};
function Rn(e, n) {
  const o = n.modes.find((i) => i.modeId === e);
  return o ? o.name : e;
}
async function Jt(e, n, o, i, a = /* @__PURE__ */ new Set()) {
  const l = {};
  for (const [r, g] of Object.entries(e)) {
    const d = Rn(r, i);
    if (g == null) {
      l[d] = g;
      continue;
    }
    if (typeof g == "string" || typeof g == "number" || typeof g == "boolean") {
      l[d] = g;
      continue;
    }
    if (typeof g == "object" && g !== null && "type" in g && g.type === "VARIABLE_ALIAS" && "id" in g) {
      const m = g.id;
      if (a.has(m)) {
        l[d] = {
          type: "VARIABLE_ALIAS",
          id: m
        };
        continue;
      }
      const y = await figma.variables.getVariableByIdAsync(m);
      if (!y) {
        l[d] = {
          type: "VARIABLE_ALIAS",
          id: m
        };
        continue;
      }
      const b = new Set(a);
      b.add(m);
      const S = await figma.variables.getVariableCollectionByIdAsync(
        y.variableCollectionId
      ), v = y.key;
      if (!v) {
        l[d] = {
          type: "VARIABLE_ALIAS",
          id: m
        };
        continue;
      }
      const I = {
        variableName: y.name,
        variableType: y.resolvedType,
        collectionName: S == null ? void 0 : S.name,
        collectionId: y.variableCollectionId,
        variableKey: v,
        id: m,
        isLocal: !y.remote
      };
      if (S) {
        const C = await Dt(
          S,
          o
        );
        I._colRef = C, y.valuesByMode && (I.valuesByMode = await Jt(
          y.valuesByMode,
          n,
          o,
          S,
          // Pass collection for mode ID to name conversion
          b
        ));
      }
      const s = n.addVariable(I);
      l[d] = {
        type: "VARIABLE_ALIAS",
        id: m,
        _varRef: s
      };
    } else
      l[d] = g;
  }
  return l;
}
const lt = "recursica:collectionId";
async function Vn(e) {
  if (e.remote === !0) {
    const o = e.name.trim().toLowerCase();
    if (!["token", "tokens", "theme", "themes"].includes(o)) {
      const a = `Remote variable collections are not supported. Only "Token", "Tokens", "Theme", or "Themes" collections are allowed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw t.error(a), new Error(a);
    }
    return e.id;
  } else {
    if (Ge(e.name)) {
      const a = ft(e.name);
      if (a) {
        const l = e.getSharedPluginData(
          "recursica",
          lt
        );
        return (!l || l.trim() === "") && e.setSharedPluginData(
          "recursica",
          lt,
          a
        ), a;
      }
    }
    const o = e.getSharedPluginData(
      "recursica",
      lt
    );
    if (o && o.trim() !== "")
      return o;
    const i = await At();
    return e.setSharedPluginData("recursica", lt, i), i;
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
  const a = await Vn(e), l = e.modes.map((m) => m.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: o,
    modes: l,
    collectionGuid: a
  }, g = n.addCollection(r), d = o ? "local" : "remote";
  return t.log(
    `  Added ${d} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), g;
}
async function Ct(e, n, o) {
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
    const l = i.key;
    if (!l)
      return console.log("Variable missing key:", e.id), null;
    const r = await Dt(
      a,
      o
    ), g = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: r,
      // Reference to collection table (v2.4.0+)
      variableKey: l,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (g.valuesByMode = await Jt(
      i.valuesByMode,
      n,
      o,
      a,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const d = n.addVariable(g);
    return Tn(d);
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
      const l = e[a];
      if (l && typeof l == "object" && !Array.isArray(l))
        if (l.type === "VARIABLE_ALIAS") {
          const r = await Ct(
            l,
            n,
            o
          );
          r && (i[a] = r);
        } else
          i[a] = await We(
            l,
            n,
            o
          );
      else Array.isArray(l) ? i[a] = await Promise.all(
        l.map(async (r) => (r == null ? void 0 : r.type) === "VARIABLE_ALIAS" ? await Ct(
          r,
          n,
          o
        ) || r : r && typeof r == "object" ? await We(
          r,
          n,
          o
        ) : r)
      ) : i[a] = l;
    }
  return i;
}
async function Ht(e, n, o) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const a = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? a[l] = await We(
          i[l],
          n,
          o
        ) : a[l] = i[l]);
      return a;
    })
  );
}
async function Wt(e, n, o) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const a = {};
      for (const l in i)
        Object.prototype.hasOwnProperty.call(i, l) && (l === "boundVariables" ? a[l] = await We(
          i[l],
          n,
          o
        ) : a[l] = i[l]);
      return a;
    })
  );
}
const qe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  extractBoundVariables: We,
  resolveVariableAliasMetadata: Ct,
  serializeBackgrounds: Wt,
  serializeFills: Ht
}, Symbol.toStringTag, { value: "Module" }));
async function Kt(e, n) {
  var d, m;
  const o = {}, i = /* @__PURE__ */ new Set();
  e.type && (o.type = e.type, i.add("type")), e.id && (o.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (o.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (o.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (o.y = e.y, i.add("y")), e.width !== void 0 && (o.width = e.width, i.add("width")), e.height !== void 0 && (o.height = e.height, i.add("height"));
  const a = e.name || "Unnamed";
  e.preserveRatio !== void 0 && t.log(
    `[ISSUE #3 EXPORT DEBUG] "${a}" has preserveRatio: ${e.preserveRatio} (NOT being exported - needs to be added!)`
  );
  const l = e.type;
  if (l === "FRAME" || l === "COMPONENT" || l === "INSTANCE" || l === "GROUP" || l === "BOOLEAN_OPERATION" || l === "VECTOR" || l === "STAR" || l === "LINE" || l === "ELLIPSE" || l === "POLYGON" || l === "RECTANGLE" || l === "TEXT") {
    const y = e.constraintHorizontal !== void 0 ? e.constraintHorizontal : (d = e.constraints) == null ? void 0 : d.horizontal, b = e.constraintVertical !== void 0 ? e.constraintVertical : (m = e.constraints) == null ? void 0 : m.vertical;
    y !== void 0 && ge(
      y,
      Ee.constraintHorizontal
    ) && (o.constraintHorizontal = y, i.add("constraintHorizontal")), b !== void 0 && ge(
      b,
      Ee.constraintVertical
    ) && (o.constraintVertical = b, i.add("constraintVertical"));
  }
  if (e.visible !== void 0 && ge(e.visible, Ee.visible) && (o.visible = e.visible, i.add("visible")), e.locked !== void 0 && ge(e.locked, Ee.locked) && (o.locked = e.locked, i.add("locked")), e.opacity !== void 0 && ge(e.opacity, Ee.opacity) && (o.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && ge(e.rotation, Ee.rotation) && (o.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && ge(e.blendMode, Ee.blendMode) && (o.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && ge(e.effects, Ee.effects) && (o.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const y = await Ht(
      e.fills,
      n.variableTable,
      n.collectionTable
    );
    ge(y, Ee.fills) && (o.fills = y), i.add("fills");
  }
  if (e.strokes !== void 0 && ge(e.strokes, Ee.strokes) && (o.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && ge(e.strokeWeight, Ee.strokeWeight) && (o.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && ge(e.strokeAlign, Ee.strokeAlign) && (o.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const y = e.name || "Unnamed", b = Object.keys(e.boundVariables);
    b.length > 0 ? t.log(
      `[ISSUE #2 EXPORT DEBUG] "${y}" (${e.type}) has boundVariables for: ${b.join(", ")}`
    ) : t.log(
      `[ISSUE #2 EXPORT DEBUG] "${y}" (${e.type}) has no boundVariables`
    );
    const S = await We(
      e.boundVariables,
      n.variableTable,
      n.collectionTable
    ), v = Object.keys(S);
    v.length > 0 && t.log(
      `[ISSUE #2 EXPORT DEBUG] "${y}" extracted boundVariables: ${v.join(", ")}`
    ), Object.keys(S).length > 0 && (o.boundVariables = S), i.add("boundVariables");
  }
  if (e.backgrounds !== void 0) {
    const y = await Wt(
      e.backgrounds,
      n.variableTable,
      n.collectionTable
    );
    y && Array.isArray(y) && y.length > 0 && (o.backgrounds = y), i.add("backgrounds");
  }
  const g = e.selectionColor;
  return g !== void 0 && (o.selectionColor = g, i.add("selectionColor")), o;
}
const kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseBaseNodeProperties: Kt
}, Symbol.toStringTag, { value: "Module" }));
async function Nt(e, n) {
  const o = {}, i = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (o.componentPropertyDefinitions = e.componentPropertyDefinitions, i.add("componentPropertyDefinitions"));
    } catch (a) {
    }
  return e.layoutMode !== void 0 && ge(e.layoutMode, we.layoutMode) && (o.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && ge(
    e.primaryAxisSizingMode,
    we.primaryAxisSizingMode
  ) && (o.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && ge(
    e.counterAxisSizingMode,
    we.counterAxisSizingMode
  ) && (o.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && ge(
    e.primaryAxisAlignItems,
    we.primaryAxisAlignItems
  ) && (o.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && ge(
    e.counterAxisAlignItems,
    we.counterAxisAlignItems
  ) && (o.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && ge(e.paddingLeft, we.paddingLeft) && (o.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && ge(e.paddingRight, we.paddingRight) && (o.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && ge(e.paddingTop, we.paddingTop) && (o.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && ge(e.paddingBottom, we.paddingBottom) && (o.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && ge(e.itemSpacing, we.itemSpacing) && (o.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.counterAxisSpacing !== void 0 && ge(
    e.counterAxisSpacing,
    we.counterAxisSpacing
  ) && (o.counterAxisSpacing = e.counterAxisSpacing, i.add("counterAxisSpacing")), e.cornerRadius !== void 0 && ge(e.cornerRadius, we.cornerRadius) && (o.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && ge(e.clipsContent, we.clipsContent) && (o.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && ge(e.layoutWrap, we.layoutWrap) && (o.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && ge(e.layoutGrow, we.layoutGrow) && (o.layoutGrow = e.layoutGrow, i.add("layoutGrow")), o;
}
const Un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseFrameProperties: Nt
}, Symbol.toStringTag, { value: "Module" })), Fe = {
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
  if (e.fontSize !== Fe.fontSize && (o.fontSize = e.fontSize), (e.fontName.family !== Fe.fontName.family || e.fontName.style !== Fe.fontName.style) && (o.fontName = e.fontName), JSON.stringify(e.letterSpacing) !== JSON.stringify(Fe.letterSpacing) && (o.letterSpacing = e.letterSpacing), JSON.stringify(e.lineHeight) !== JSON.stringify(Fe.lineHeight) && (o.lineHeight = e.lineHeight), e.textCase !== Fe.textCase && (o.textCase = e.textCase), e.textDecoration !== Fe.textDecoration && (o.textDecoration = e.textDecoration), e.paragraphSpacing !== Fe.paragraphSpacing && (o.paragraphSpacing = e.paragraphSpacing), e.paragraphIndent !== Fe.paragraphIndent && (o.paragraphIndent = e.paragraphIndent), e.boundVariables) {
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
        let l = n.styleTable.getStyleIndex(a.key);
        if (l < 0) {
          const r = await Ln(a, n);
          l = n.styleTable.addStyle({
            type: "TEXT",
            name: a.name,
            styleKey: a.key,
            textStyle: r,
            boundVariables: r.boundVariables
          }), t.log(
            `  [EXPORT] Added text style "${a.name}" to style table at index ${l} for text node "${e.name || "Unnamed"}"`
          );
        } else
          t.log(
            `  [EXPORT] Reusing existing text style "${a.name}" from style table at index ${l} for text node "${e.name || "Unnamed"}"`
          );
        o._styleRef = l, i.add("_styleRef"), i.add("textStyleId"), t.log(
          `  [EXPORT] ✓ Exported text node "${e.name || "Unnamed"}" with _styleRef=${l} (style: "${a.name}")`
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
  return e.characters !== void 0 && e.characters !== "" && (o.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (o.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (o.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && ge(
    e.textAlignHorizontal,
    Me.textAlignHorizontal
  ) && (o.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && ge(
    e.textAlignVertical,
    Me.textAlignVertical
  ) && (o.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && ge(e.letterSpacing, Me.letterSpacing) && (o.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && ge(e.lineHeight, Me.lineHeight) && (o.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && ge(e.textCase, Me.textCase) && (o.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && ge(e.textDecoration, Me.textDecoration) && (o.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && ge(e.textAutoResize, Me.textAutoResize) && (o.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && ge(
    e.paragraphSpacing,
    Me.paragraphSpacing
  ) && (o.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && ge(e.paragraphIndent, Me.paragraphIndent) && (o.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && ge(e.listOptions, Me.listOptions) && (o.listOptions = e.listOptions, i.add("listOptions")), o;
}
function Bn(e) {
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
  let n = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (o) => Bn(o));
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
function Et(e) {
  return Array.isArray(e) ? e.map((n) => ({
    data: Xt(n.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: n.windRule || n.windingRule || "NONZERO"
  })) : e;
}
const Gn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: Xt,
  normalizeVectorGeometry: Et
}, Symbol.toStringTag, { value: "Module" }));
async function _n(e, n) {
  const o = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && ge(e.fillGeometry, Ye.fillGeometry) && (o.fillGeometry = Et(e.fillGeometry), i.add("fillGeometry")), e.strokeGeometry !== void 0 && ge(e.strokeGeometry, Ye.strokeGeometry) && (o.strokeGeometry = Et(e.strokeGeometry), i.add("strokeGeometry")), e.strokeCap !== void 0 && ge(e.strokeCap, Ye.strokeCap) && (o.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && ge(e.strokeJoin, Ye.strokeJoin) && (o.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && ge(e.dashPattern, Ye.dashPattern) && (o.dashPattern = e.dashPattern, i.add("dashPattern")), o;
}
async function zn(e, n) {
  const o = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && ge(e.cornerRadius, jt.cornerRadius) && (o.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (o.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (o.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (o.pointCount = e.pointCount, i.add("pointCount")), o;
}
const ct = /* @__PURE__ */ new Map();
let jn = 0;
function Jn() {
  return `prompt_${Date.now()}_${++jn}`;
}
const tt = {
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
    var g;
    const o = typeof n == "number" ? { timeoutMs: n } : n, i = (g = o == null ? void 0 : o.timeoutMs) != null ? g : 3e5, a = o == null ? void 0 : o.okLabel, l = o == null ? void 0 : o.cancelLabel, r = Jn();
    return new Promise((d, m) => {
      const y = i === -1 ? null : setTimeout(() => {
        ct.delete(r), m(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      ct.set(r, {
        resolve: d,
        reject: m,
        timeout: y
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: le(le({
          message: e,
          requestId: r
        }, a && { okLabel: a }), l && { cancelLabel: l })
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
    const { requestId: n, action: o } = e, i = ct.get(n);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${n}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), ct.delete(n), o === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
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
  var a, l;
  const o = {}, i = /* @__PURE__ */ new Set();
  if (o._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const r = await e.getMainComponentAsync();
    if (!r) {
      const E = e.name || "(unnamed)", k = e.id;
      if (n.detachedComponentsHandled.has(k))
        t.log(
          `Treating detached instance "${E}" as internal instance (already prompted)`
        );
      else {
        t.warning(
          `Found detached instance: "${E}" (main component is missing)`
        );
        const x = `Found detached instance "${E}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await tt.prompt(x, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), n.detachedComponentsHandled.add(k), t.log(
            `Treating detached instance "${E}" as internal instance`
          );
        } catch (U) {
          if (U instanceof Error && U.message === "User cancelled") {
            const Y = `Export cancelled: Detached instance "${E}" found. Please fix the instance before exporting.`;
            t.error(Y);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (re) {
              console.warn("Could not scroll to instance:", re);
            }
            throw new Error(Y);
          } else
            throw U;
        }
      }
      if (!St(e).page) {
        const x = `Detached instance "${E}" is not on any page. Cannot export.`;
        throw t.error(x), new Error(x);
      }
      let p, f;
      try {
        e.variantProperties && (p = e.variantProperties), e.componentProperties && (f = e.componentProperties);
      } catch (x) {
      }
      const h = le(le({
        instanceType: "internal",
        componentName: E,
        componentNodeId: e.id
      }, p && { variantProperties: p }), f && { componentProperties: f }), w = n.instanceTable.addInstance(h);
      return o._instanceRef = w, i.add("_instanceRef"), t.log(
        `  Exported detached INSTANCE: "${E}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), o;
    }
    const g = e.name || "(unnamed)", d = r.name || "(unnamed)", m = r.remote === !0, b = St(e).page, S = St(r);
    let v = S.page;
    if (!v && m)
      try {
        await figma.loadAllPagesAsync();
        const E = figma.root.children;
        let k = null;
        for (const V of E)
          try {
            if (V.findOne(
              (p) => p.id === r.id
            )) {
              k = V;
              break;
            }
          } catch (O) {
          }
        if (!k) {
          const V = r.id.split(":")[0];
          for (const O of E) {
            const p = O.id.split(":")[0];
            if (V === p) {
              k = O;
              break;
            }
          }
        }
        k && (v = k);
      } catch (E) {
      }
    let I, s = v;
    if (m)
      if (v) {
        const E = Ut(v);
        I = "normal", s = v, E != null && E.id ? t.log(
          `  Component "${d}" is from library but also exists on local page "${v.name}" with metadata. Treating as "normal" instance.`
        ) : t.log(
          `  Component "${d}" is from library and exists on local page "${v.name}" (no metadata). Treating as "normal" instance - page should be published first.`
        );
      } else
        I = "remote", t.log(
          `  Component "${d}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (v && b && v.id === b.id)
      I = "internal";
    else if (v && b && v.id !== b.id)
      I = "normal";
    else if (v && !b)
      I = "normal";
    else if (!m && S.reason === "detached") {
      const E = r.id;
      if (n.detachedComponentsHandled.has(E))
        I = "remote", t.log(
          `Treating detached instance "${g}" -> component "${d}" as remote instance (already prompted)`
        );
      else {
        t.warning(
          `Found detached instance: "${g}" -> component "${d}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (V) {
          console.warn("Could not scroll to component:", V);
        }
        const k = `Found detached instance "${g}" attached to component "${d}". This should be fixed. Continue to publish?`;
        try {
          await tt.prompt(k, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), n.detachedComponentsHandled.add(E), I = "remote", t.log(
            `Treating detached instance "${g}" as remote instance (will be created on REMOTES page)`
          );
        } catch (V) {
          if (V instanceof Error && V.message === "User cancelled") {
            const O = `Export cancelled: Detached instance "${g}" found. The component "${d}" is not on any page. Please fix the instance before exporting.`;
            throw t.error(O), new Error(O);
          } else
            throw V;
        }
      }
    } else
      m || t.warning(
        `  Instance "${g}" -> component "${d}": componentPage is null but component is not remote. Reason: ${S.reason}. Cannot determine instance type.`
      ), I = "normal";
    let C, $;
    try {
      if (e.variantProperties && (C = e.variantProperties, t.log(
        `  Instance "${g}" -> variantProperties from instance: ${JSON.stringify(C)}`
      )), typeof e.getProperties == "function")
        try {
          const E = await e.getProperties();
          E && E.variantProperties && (t.log(
            `  Instance "${g}" -> variantProperties from getProperties(): ${JSON.stringify(E.variantProperties)}`
          ), E.variantProperties && Object.keys(E.variantProperties).length > 0 && (C = E.variantProperties));
        } catch (E) {
          t.log(
            `  Instance "${g}" -> getProperties() not available or failed: ${E}`
          );
        }
      if (e.componentProperties && ($ = e.componentProperties), r.parent && r.parent.type === "COMPONENT_SET") {
        const E = r.parent;
        try {
          const k = E.componentPropertyDefinitions;
          k && t.log(
            `  Component set "${E.name}" has property definitions: ${JSON.stringify(Object.keys(k))}`
          );
          const V = {}, O = d.split(",").map((p) => p.trim());
          for (const p of O) {
            const f = p.split("=").map((h) => h.trim());
            if (f.length >= 2) {
              const h = f[0], w = f.slice(1).join("=").trim();
              k && k[h] && (V[h] = w);
            }
          }
          if (Object.keys(V).length > 0 && t.log(
            `  Parsed variant properties from component name "${d}": ${JSON.stringify(V)}`
          ), C && Object.keys(C).length > 0)
            t.log(
              `  Using variant properties from instance (source of truth): ${JSON.stringify(C)}`
            );
          else if (Object.keys(V).length > 0)
            C = V, t.log(
              `  Using variant properties from component name (fallback): ${JSON.stringify(C)}`
            );
          else if (r.variantProperties) {
            const p = r.variantProperties;
            t.log(
              `  Main component "${d}" has variantProperties: ${JSON.stringify(p)}`
            ), C = p;
          }
        } catch (k) {
          t.warning(
            `  Could not get variant properties from component set: ${k}`
          );
        }
      }
    } catch (E) {
    }
    let c, F;
    try {
      let E = r.parent;
      const k = [];
      let V = 0;
      const O = 20;
      for (; E && V < O; )
        try {
          const p = E.type, f = E.name;
          if (p === "COMPONENT_SET" && !F && (F = f), p === "PAGE")
            break;
          const h = f || "";
          k.unshift(h), (F === "arrow-top-right-on-square" || d === "arrow-top-right-on-square") && t.log(
            `  [PATH BUILD] Added segment: "${h}" (type: ${p}) to path for component "${d}"`
          ), E = E.parent, V++;
        } catch (p) {
          (F === "arrow-top-right-on-square" || d === "arrow-top-right-on-square") && t.warning(
            `  [PATH BUILD] Error building path for "${d}": ${p}`
          );
          break;
        }
      c = k, (F === "arrow-top-right-on-square" || d === "arrow-top-right-on-square") && t.log(
        `  [PATH BUILD] Final path for component "${d}": [${k.join(" → ")}]`
      );
    } catch (E) {
    }
    const _ = le(le(le(le({
      instanceType: I,
      componentName: d
    }, F && { componentSetName: F }), C && { variantProperties: C }), $ && { componentProperties: $ }), I === "normal" ? { path: c || [] } : c && c.length > 0 && {
      path: c
    });
    if (I === "internal") {
      _.componentNodeId = r.id, t.log(
        `  Found INSTANCE: "${g}" -> INTERNAL component "${d}" (ID: ${r.id.substring(0, 8)}...)`
      );
      const E = e.boundVariables, k = r.boundVariables;
      if (E && typeof E == "object") {
        const h = Object.keys(E);
        t.log(
          `  DEBUG: Internal instance "${g}" -> boundVariables keys: ${h.length > 0 ? h.join(", ") : "none"}`
        );
        for (const x of h) {
          const U = E[x], Y = (U == null ? void 0 : U.type) || typeof U;
          t.log(
            `  DEBUG:   boundVariables.${x}: type=${Y}, value=${JSON.stringify(U)}`
          );
        }
        const w = [
          "backgrounds",
          "selectionColor",
          "selectionColors",
          "selection",
          "selectColor"
        ];
        for (const x of w)
          E[x] !== void 0 && t.log(
            `  DEBUG:   Found potential "Selection colors" property: boundVariables.${x} = ${JSON.stringify(E[x])}`
          );
      } else
        t.log(
          `  DEBUG: Internal instance "${g}" -> No boundVariables found on instance node`
        );
      if (k && typeof k == "object") {
        const h = Object.keys(k);
        t.log(
          `  DEBUG: Main component "${d}" -> boundVariables keys: ${h.length > 0 ? h.join(", ") : "none"}`
        );
      }
      const V = e.backgrounds;
      if (V && Array.isArray(V)) {
        t.log(
          `  DEBUG: Internal instance "${g}" -> backgrounds array length: ${V.length}`
        );
        for (let h = 0; h < V.length; h++) {
          const w = V[h];
          if (w && typeof w == "object") {
            if (t.log(
              `  DEBUG:   backgrounds[${h}] structure: ${JSON.stringify(Object.keys(w))}`
            ), w.boundVariables) {
              const x = Object.keys(w.boundVariables);
              t.log(
                `  DEBUG:   backgrounds[${h}].boundVariables keys: ${x.length > 0 ? x.join(", ") : "none"}`
              );
              for (const U of x) {
                const Y = w.boundVariables[U];
                t.log(
                  `  DEBUG:     backgrounds[${h}].boundVariables.${U}: ${JSON.stringify(Y)}`
                );
              }
            }
            w.color && t.log(
              `  DEBUG:   backgrounds[${h}].color: ${JSON.stringify(w.color)}`
            );
          }
        }
      }
      const O = Object.keys(e).filter(
        (h) => !h.startsWith("_") && h !== "parent" && h !== "removed" && typeof e[h] != "function" && h !== "type" && h !== "id" && h !== "name" && h !== "boundVariables" && h !== "backgrounds" && h !== "fills"
      ), p = Object.keys(r).filter(
        (h) => !h.startsWith("_") && h !== "parent" && h !== "removed" && typeof r[h] != "function" && h !== "type" && h !== "id" && h !== "name" && h !== "boundVariables" && h !== "backgrounds" && h !== "fills"
      ), f = [
        .../* @__PURE__ */ new Set([...O, ...p])
      ].filter(
        (h) => h.toLowerCase().includes("selection") || h.toLowerCase().includes("select") || h.toLowerCase().includes("color") && !h.toLowerCase().includes("fill") && !h.toLowerCase().includes("stroke")
      );
      if (f.length > 0) {
        t.log(
          `  DEBUG: Found selection/color-related properties: ${f.join(", ")}`
        );
        for (const h of f)
          try {
            if (O.includes(h)) {
              const w = e[h];
              t.log(
                `  DEBUG:   Instance.${h}: ${JSON.stringify(w)}`
              );
            }
            if (p.includes(h)) {
              const w = r[h];
              t.log(
                `  DEBUG:   MainComponent.${h}: ${JSON.stringify(w)}`
              );
            }
          } catch (w) {
          }
      } else
        t.log(
          "  DEBUG: No selection/color-related properties found on instance or main component"
        );
    } else if (I === "normal") {
      const E = s || v;
      if (E) {
        _.componentPageName = E.name;
        const V = Ut(E);
        V != null && V.id && V.version !== void 0 ? (_.componentGuid = V.id, _.componentVersion = V.version, t.log(
          `  Found INSTANCE: "${g}" -> NORMAL component "${d}" (ID: ${r.id.substring(0, 8)}...) at path [${(c || []).join(" → ")}]`
        )) : t.warning(
          `  Instance "${g}" -> component "${d}" is classified as normal but page "${E.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const V = r.id;
        let O = "", p = "";
        switch (S.reason) {
          case "broken_chain":
            O = "The component's parent chain is broken and cannot be traversed to find the page", p = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            O = "Cannot access the component's parent chain (access error)", p = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            O = "Cannot determine which page the component is on", p = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([r]);
        } catch (w) {
          console.warn("Could not scroll to component:", w);
        }
        const f = `Normal instance "${g}" -> component "${d}" (ID: ${V}) has no componentPage. ${O}. ${p} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", f), t.error(f);
        const h = new Error(f);
        throw console.error("Throwing error:", h), h;
      }
      c === void 0 && console.warn(
        `Failed to build path for normal instance "${g}" -> component "${d}". Path is required for resolution.`
      );
      const k = c && c.length > 0 ? ` at path [${c.join(" → ")}]` : " at page root";
      t.log(
        `  Found INSTANCE: "${g}" -> NORMAL component "${d}" (ID: ${r.id.substring(0, 8)}...)${k}`
      );
    } else if (I === "remote") {
      let E, k;
      const V = n.detachedComponentsHandled.has(
        r.id
      );
      if (!V)
        try {
          if (typeof r.getPublishStatusAsync == "function")
            try {
              const p = await r.getPublishStatusAsync();
              p && typeof p == "object" && (p.libraryName && (E = p.libraryName), p.libraryKey && (k = p.libraryKey));
            } catch (p) {
            }
          try {
            const p = figma.teamLibrary;
            if (typeof (p == null ? void 0 : p.getAvailableLibraryComponentSetsAsync) == "function") {
              const f = await p.getAvailableLibraryComponentSetsAsync();
              if (f && Array.isArray(f)) {
                for (const h of f)
                  if (h.key === r.key || h.name === r.name) {
                    h.libraryName && (E = h.libraryName), h.libraryKey && (k = h.libraryKey);
                    break;
                  }
              }
            }
          } catch (p) {
          }
        } catch (p) {
          console.warn(
            `Error getting library info for remote component "${d}":`,
            p
          );
        }
      if (E && (_.remoteLibraryName = E), k && (_.remoteLibraryKey = k), V && (_.componentNodeId = r.id), n.instanceTable.getInstanceIndex(_) !== -1)
        t.log(
          `  Found INSTANCE: "${g}" -> REMOTE component "${d}" (ID: ${r.id.substring(0, 8)}...)${V ? " [DETACHED]" : ""}`
        );
      else
        try {
          const { parseBaseNodeProperties: p } = await Promise.resolve().then(() => kn), f = await p(e, n), { parseFrameProperties: h } = await Promise.resolve().then(() => Un), w = await h(e, n), x = Ne(le(le({}, f), w), {
            type: "COMPONENT"
            // Convert to COMPONENT type for recreation (must be after baseProps to override)
          });
          if (e.children && Array.isArray(e.children) && e.children.length > 0) {
            const U = Ne(le({}, n), {
              depth: (n.depth || 0) + 1
            }), { extractNodeData: Y } = await Promise.resolve().then(() => Zn), re = [];
            for (const Q of e.children)
              try {
                let j;
                if (Q.type === "INSTANCE")
                  try {
                    const ee = await Q.getMainComponentAsync();
                    if (ee) {
                      const ne = await p(
                        Q,
                        n
                      ), K = await h(
                        Q,
                        n
                      ), ie = await Y(
                        ee,
                        /* @__PURE__ */ new WeakSet(),
                        U
                      );
                      j = Ne(le(le(le({}, ie), ne), K), {
                        type: "COMPONENT"
                        // Convert to COMPONENT
                      });
                    } else
                      j = await Y(
                        Q,
                        /* @__PURE__ */ new WeakSet(),
                        U
                      ), j.type === "INSTANCE" && (j.type = "COMPONENT"), delete j._instanceRef;
                  } catch (ee) {
                    j = await Y(
                      Q,
                      /* @__PURE__ */ new WeakSet(),
                      U
                    ), j.type === "INSTANCE" && (j.type = "COMPONENT"), delete j._instanceRef;
                  }
                else {
                  j = await Y(
                    Q,
                    /* @__PURE__ */ new WeakSet(),
                    U
                  );
                  const ee = Q.boundVariables;
                  if (ee && typeof ee == "object") {
                    const ne = Object.keys(ee);
                    ne.length > 0 && (t.log(
                      `  DEBUG: Child "${Q.name || "Unnamed"}" -> boundVariables keys: ${ne.join(", ")}`
                    ), ee.backgrounds !== void 0 && t.log(
                      `  DEBUG:   Child "${Q.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(ee.backgrounds)}`
                    ));
                  }
                  if (r.children && Array.isArray(r.children)) {
                    const ne = r.children.find(
                      (K) => K.name === Q.name
                    );
                    if (ne) {
                      const K = ne.boundVariables;
                      if (K && typeof K == "object") {
                        const ie = Object.keys(K);
                        if (ie.length > 0 && (t.log(
                          `  DEBUG: Main component child "${ne.name || "Unnamed"}" -> boundVariables keys: ${ie.join(", ")}`
                        ), K.backgrounds !== void 0 && (t.log(
                          `  DEBUG:   Main component child "${ne.name || "Unnamed"}" -> boundVariables.backgrounds: ${JSON.stringify(K.backgrounds)}`
                        ), !ee || !ee.backgrounds))) {
                          t.log(
                            "  DEBUG:   Instance child doesn't have boundVariables.backgrounds, but main component child does - preserving from main component"
                          );
                          const { extractBoundVariables: W } = await Promise.resolve().then(() => qe), z = await W(
                            K,
                            n.variableTable,
                            n.collectionTable
                          );
                          j.boundVariables || (j.boundVariables = {}), z.backgrounds && (j.boundVariables.backgrounds = z.backgrounds, t.log(
                            "  DEBUG:   ✓ Added boundVariables.backgrounds to childData from main component child"
                          ));
                        }
                      }
                    }
                  }
                }
                re.push(j);
              } catch (j) {
                console.warn(
                  `Failed to extract child "${Q.name || "Unnamed"}" for remote component "${d}":`,
                  j
                );
              }
            x.children = re;
          }
          if (!x)
            throw new Error("Failed to build structure for remote instance");
          try {
            const U = e.boundVariables;
            if (U && typeof U == "object") {
              const R = Object.keys(U);
              t.log(
                `  DEBUG: Instance "${g}" -> boundVariables keys: ${R.length > 0 ? R.join(", ") : "none"}`
              );
              for (const H of R) {
                const te = U[H], me = (te == null ? void 0 : te.type) || typeof te;
                if (t.log(
                  `  DEBUG:   boundVariables.${H}: type=${me}, value=${JSON.stringify(te)}`
                ), te && typeof te == "object" && !Array.isArray(te)) {
                  const fe = Object.keys(te);
                  if (fe.length > 0) {
                    t.log(
                      `  DEBUG:     boundVariables.${H} has nested keys: ${fe.join(", ")}`
                    );
                    for (const ce of fe) {
                      const ae = te[ce];
                      ae && typeof ae == "object" && ae.type === "VARIABLE_ALIAS" && t.log(
                        `  DEBUG:       boundVariables.${H}.${ce}: VARIABLE_ALIAS id=${ae.id}`
                      );
                    }
                  }
                }
              }
              const J = [
                "backgrounds",
                "selectionColor",
                "selectionColors",
                "selection",
                "selectColor"
              ];
              for (const H of J)
                U[H] !== void 0 && t.log(
                  `  DEBUG:   Found potential "Selection colors" property: boundVariables.${H} = ${JSON.stringify(U[H])}`
                );
            } else
              t.log(
                `  DEBUG: Instance "${g}" -> No boundVariables found on instance node`
              );
            const Y = U && U.fills !== void 0 && U.fills !== null, re = x.fills !== void 0 && Array.isArray(x.fills) && x.fills.length > 0, Q = e.fills !== void 0 && Array.isArray(e.fills) && e.fills.length > 0, j = r.fills !== void 0 && Array.isArray(r.fills) && r.fills.length > 0;
            if (t.log(
              `  DEBUG: Instance "${g}" -> fills check: instanceHasFills=${Q}, structureHasFills=${re}, mainComponentHasFills=${j}, hasInstanceFillsBoundVar=${!!Y}`
            ), Y && !re) {
              t.log(
                "  DEBUG: Instance has boundVariables.fills but structure has no fills - attempting to get fills"
              );
              try {
                if (Q) {
                  const { serializeFills: R } = await Promise.resolve().then(() => qe), J = await R(
                    e.fills,
                    n.variableTable,
                    n.collectionTable
                  );
                  x.fills = J, t.log(
                    `  DEBUG: Got ${J.length} fill(s) from instance node`
                  );
                } else if (j) {
                  const { serializeFills: R } = await Promise.resolve().then(() => qe), J = await R(
                    r.fills,
                    n.variableTable,
                    n.collectionTable
                  );
                  x.fills = J, t.log(
                    `  DEBUG: Got ${J.length} fill(s) from main component`
                  );
                } else
                  t.warning(
                    "  DEBUG: Instance has boundVariables.fills but neither instance nor main component has fills"
                  );
              } catch (R) {
                t.warning(`  Failed to get fills: ${R}`);
              }
            }
            const ee = e.selectionColor, ne = r.selectionColor;
            ee !== void 0 && t.log(
              `  DEBUG: Instance "${g}" -> selectionColor: ${JSON.stringify(ee)}`
            ), ne !== void 0 && t.log(
              `  DEBUG: Main component "${d}" -> selectionColor: ${JSON.stringify(ne)}`
            );
            const K = Object.keys(e).filter(
              (R) => !R.startsWith("_") && R !== "parent" && R !== "removed" && typeof e[R] != "function" && R !== "type" && R !== "id" && R !== "name"
            ), ie = Object.keys(r).filter(
              (R) => !R.startsWith("_") && R !== "parent" && R !== "removed" && typeof r[R] != "function" && R !== "type" && R !== "id" && R !== "name"
            ), W = [
              .../* @__PURE__ */ new Set([...K, ...ie])
            ].filter(
              (R) => R.toLowerCase().includes("selection") || R.toLowerCase().includes("select") || R.toLowerCase().includes("color") && !R.toLowerCase().includes("fill") && !R.toLowerCase().includes("stroke")
            );
            if (W.length > 0) {
              t.log(
                `  DEBUG: Found selection/color-related properties: ${W.join(", ")}`
              );
              for (const R of W)
                try {
                  if (K.includes(R)) {
                    const J = e[R];
                    t.log(
                      `  DEBUG:   Instance.${R}: ${JSON.stringify(J)}`
                    );
                  }
                  if (ie.includes(R)) {
                    const J = r[R];
                    t.log(
                      `  DEBUG:   MainComponent.${R}: ${JSON.stringify(J)}`
                    );
                  }
                } catch (J) {
                }
            } else
              t.log(
                "  DEBUG: No selection/color-related properties found on instance or main component"
              );
            const z = r.boundVariables;
            if (z && typeof z == "object") {
              const R = Object.keys(z);
              if (R.length > 0) {
                t.log(
                  `  DEBUG: Main component "${d}" -> boundVariables keys: ${R.join(", ")}`
                ), R.includes("selectionColor") ? t.log(
                  `[ISSUE #2 EXPORT] Main component "${d}" HAS selectionColor in boundVariables: ${JSON.stringify(z.selectionColor)}`
                ) : t.log(
                  `[ISSUE #2 EXPORT] Main component "${d}" does NOT have selectionColor in boundVariables (has: ${R.join(", ")})`
                );
                for (const J of R) {
                  const H = z[J], te = (H == null ? void 0 : H.type) || typeof H;
                  t.log(
                    `  DEBUG:   Main component boundVariables.${J}: type=${te}, value=${JSON.stringify(H)}`
                  );
                }
              } else
                t.log(
                  `[ISSUE #2 EXPORT] Main component "${d}" has no boundVariables`
                );
            } else
              t.log(
                `[ISSUE #2 EXPORT] Main component "${d}" boundVariables is null/undefined`
              );
            if (U && Object.keys(U).length > 0) {
              t.log(
                `  DEBUG: Preserving instance's boundVariables in structure (${Object.keys(U).length} key(s))`
              );
              const { extractBoundVariables: R } = await Promise.resolve().then(() => qe), J = await R(
                U,
                n.variableTable,
                n.collectionTable
              );
              x.boundVariables || (x.boundVariables = {});
              for (const [H, te] of Object.entries(
                J
              ))
                te !== void 0 && (x.boundVariables[H] !== void 0 && t.log(
                  `  DEBUG: Structure already has boundVariables.${H} from baseProps, but instance also has it - using instance's boundVariables.${H}`
                ), x.boundVariables[H] = te, t.log(
                  `  DEBUG: Set boundVariables.${H} in structure: ${JSON.stringify(te)}`
                ));
              J.fills !== void 0 ? t.log(
                "  DEBUG: ✓ Preserved boundVariables.fills from instance"
              ) : Y && t.warning(
                "  DEBUG: Instance has boundVariables.fills but extractBoundVariables didn't extract it"
              ), J.backgrounds !== void 0 ? t.log(
                `  DEBUG: ✓ Preserved boundVariables.backgrounds from instance: ${JSON.stringify(J.backgrounds)}`
              ) : U && U.backgrounds !== void 0 && t.warning(
                "  DEBUG: Instance has boundVariables.backgrounds but extractBoundVariables didn't extract it"
              );
            }
            if (z && Object.keys(z).length > 0) {
              t.log(
                `  DEBUG: Checking main component's boundVariables for properties not in instance (${Object.keys(z).length} key(s))`
              );
              const { extractBoundVariables: R } = await Promise.resolve().then(() => qe), J = await R(
                z,
                n.variableTable,
                n.collectionTable
              );
              x.boundVariables || (x.boundVariables = {});
              for (const [H, te] of Object.entries(
                J
              ))
                te !== void 0 && (x.boundVariables[H] === void 0 ? (x.boundVariables[H] = te, H === "selectionColor" ? t.log(
                  `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${d}" to instance "${g}": ${JSON.stringify(te)}`
                ) : t.log(
                  `  DEBUG: Added boundVariables.${H} from main component (not in instance): ${JSON.stringify(te)}`
                )) : H === "selectionColor" ? t.log(
                  `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${d}" (instance "${g}" already has it)`
                ) : t.log(
                  `  DEBUG: Skipped boundVariables.${H} from main component (instance already has it)`
                ));
            }
            t.log(
              `  DEBUG: Final structure for "${d}": hasFills=${!!x.fills}, fillsCount=${((a = x.fills) == null ? void 0 : a.length) || 0}, hasBoundVars=${!!x.boundVariables}, boundVarsKeys=${x.boundVariables ? Object.keys(x.boundVariables).join(", ") : "none"}`
            ), (l = x.boundVariables) != null && l.fills && t.log(
              `  DEBUG: Structure boundVariables.fills: ${JSON.stringify(x.boundVariables.fills)}`
            );
          } catch (U) {
            t.warning(
              `  Failed to handle bound variables for fills: ${U}`
            );
          }
          _.structure = x, V ? t.log(
            `  Extracted structure for detached component "${d}" (ID: ${r.id.substring(0, 8)}...)`
          ) : t.log(
            `  Extracted structure from instance for remote component "${d}" (preserving size overrides: ${e.width}x${e.height})`
          ), t.log(
            `  Found INSTANCE: "${g}" -> REMOTE component "${d}" (ID: ${r.id.substring(0, 8)}...)${V ? " [DETACHED]" : ""}`
          );
        } catch (p) {
          const f = `Failed to extract structure for remote component "${d}": ${p instanceof Error ? p.message : String(p)}`;
          console.error(f, p), t.error(f);
        }
    }
    if (I === "normal" && r) {
      if (e.children && Array.isArray(e.children) && e.children.length > 0) {
        t.log(
          `[DEBUG] Normal instance "${g}" has ${e.children.length} child(ren) (unexpected for normal instance):`
        );
        for (let E = 0; E < Math.min(e.children.length, 5); E++) {
          const k = e.children[E];
          if (k) {
            const V = k.name || `Child ${E}`, O = k.type || "UNKNOWN", p = k.boundVariables, f = k.fills;
            if (t.log(
              `[DEBUG]   Child ${E}: "${V}" (${O}) - hasBoundVars=${!!p}, hasFills=${!!f}`
            ), p) {
              const h = Object.keys(p);
              t.log(
                `[DEBUG]     boundVariables: ${h.join(", ")}`
              );
            }
          }
        }
      }
      if (r.children && Array.isArray(r.children) && r.children.length > 0) {
        t.log(
          `[DEBUG] Main component "${d}" has ${r.children.length} child(ren):`
        );
        for (let E = 0; E < Math.min(r.children.length, 5); E++) {
          const k = r.children[E];
          if (k) {
            const V = k.name || `Child ${E}`, O = k.type || "UNKNOWN", p = k.boundVariables, f = k.fills;
            if (t.log(
              `[DEBUG]   Main component child ${E}: "${V}" (${O}) - hasBoundVars=${!!p}, hasFills=${!!f}`
            ), p) {
              const h = Object.keys(p);
              t.log(
                `[DEBUG]     boundVariables: ${h.join(", ")}`
              ), p.fills && t.log(
                `[DEBUG]     boundVariables.fills: ${JSON.stringify(p.fills)}`
              );
            }
            if (f && Array.isArray(f) && f.length > 0) {
              const h = f[0];
              h && typeof h == "object" && t.log(
                `[DEBUG]     fills[0]: type=${h.type}, color=${JSON.stringify(h.color)}`
              );
            }
            if (e.children && Array.isArray(e.children) && E < e.children.length) {
              const h = e.children[E];
              if (h && h.name === V) {
                const w = h.boundVariables, x = w ? Object.keys(w) : [], U = p ? Object.keys(p) : [], Y = x.filter(
                  (re) => !U.includes(re)
                );
                if (Y.length > 0) {
                  t.log(
                    `[DEBUG] Instance "${g}" child "${V}" has instance override bound variables: ${Y.join(", ")} (will be exported with instance children)`
                  );
                  for (const re of Y)
                    t.log(
                      `[DEBUG]   Instance child boundVariables.${re}: ${JSON.stringify(w[re])}`
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
          const k = Object.keys(E);
          if (k.length > 0) {
            t.log(
              `[ISSUE #2 EXPORT] Normal instance "${g}" -> checking main component "${d}" boundVariables (${k.length} key(s))`
            ), k.includes("selectionColor") ? t.log(
              `[ISSUE #2 EXPORT] Main component "${d}" HAS selectionColor in boundVariables: ${JSON.stringify(E.selectionColor)}`
            ) : t.log(
              `[ISSUE #2 EXPORT] Main component "${d}" does NOT have selectionColor in boundVariables (has: ${k.join(", ")})`
            );
            const { extractBoundVariables: V } = await Promise.resolve().then(() => qe), O = await V(
              E,
              n.variableTable,
              n.collectionTable
            );
            o.boundVariables || (o.boundVariables = {});
            for (const [p, f] of Object.entries(
              O
            ))
              f !== void 0 && (o.boundVariables[p] === void 0 ? (o.boundVariables[p] = f, p === "selectionColor" ? t.log(
                `[ISSUE #2 EXPORT] Added boundVariables.selectionColor from main component "${d}" to normal instance "${g}": ${JSON.stringify(f)}`
              ) : t.log(
                `  DEBUG: Added boundVariables.${p} from main component to normal instance: ${JSON.stringify(f)}`
              )) : p === "selectionColor" && t.log(
                `[ISSUE #2 EXPORT] Skipped boundVariables.selectionColor from main component "${d}" (normal instance "${g}" already has it)`
              ));
          } else
            t.log(
              `[ISSUE #2 EXPORT] Main component "${d}" has no boundVariables`
            );
        } else
          t.log(
            `[ISSUE #2 EXPORT] Main component "${d}" boundVariables is null/undefined`
          );
      } catch (E) {
        t.warning(
          `[ISSUE #2 EXPORT] Error checking main component boundVariables for normal instance "${g}": ${E}`
        );
      }
    }
    const L = n.instanceTable.addInstance(_);
    o._instanceRef = L, i.add("_instanceRef");
  }
  return o;
}
class at {
  constructor() {
    Pe(this, "instanceMap");
    // unique key -> index
    Pe(this, "instances");
    // index -> instance data
    Pe(this, "nextIndex");
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
    const o = new at(), i = Object.entries(n).sort(
      (a, l) => parseInt(a[0], 10) - parseInt(l[0], 10)
    );
    for (const [a, l] of i) {
      const r = parseInt(a, 10), g = o.generateKey(l);
      o.instanceMap.set(g, r), o.instances[r] = l, o.nextIndex = Math.max(o.nextIndex, r + 1);
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
    Pe(this, "styles", /* @__PURE__ */ new Map());
    Pe(this, "styleKeyToIndex", /* @__PURE__ */ new Map());
    Pe(this, "nextIndex", 0);
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
    return this.styles.set(a, Ne(le({}, n), { styleKey: o })), this.styleKeyToIndex.set(o, a), a;
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
      const o = a, { styleKey: l } = o, r = vt(o, ["styleKey"]);
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
      const l = parseInt(i, 10), r = a.styleKey || `${a.type}:${a.name}:${JSON.stringify(a.textStyle || a.paintStyle || a.effectStyle || a.gridStyle)}`;
      o.styles.set(l, Ne(le({}, a), { styleKey: r })), o.styleKeyToIndex.set(r, l), l >= o.nextIndex && (o.nextIndex = l + 1);
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
function Wn() {
  const e = {};
  for (const [n, o] of Object.entries(qt))
    e[o] = n;
  return e;
}
function Lt(e) {
  var n;
  return (n = qt[e]) != null ? n : e;
}
function Kn(e) {
  var n;
  return typeof e == "number" ? (n = Wn()[e]) != null ? n : e.toString() : e;
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
}, It = {};
for (const [e, n] of Object.entries(Yt))
  It[n] = e;
class mt {
  constructor() {
    Pe(this, "shortToLong");
    Pe(this, "longToShort");
    this.shortToLong = le({}, It), this.longToShort = le({}, Yt);
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
      for (const [a, l] of Object.entries(n)) {
        const r = this.getShortName(a);
        if (r !== a && !i.has(r)) {
          let g = this.compressObject(l);
          r === "type" && typeof g == "string" && (g = Lt(g)), o[r] = g;
        } else {
          let g = this.compressObject(l);
          a === "type" && typeof g == "string" && (g = Lt(g)), o[a] = g;
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
        const l = this.getLongName(i);
        let r = this.expandObject(a);
        (l === "type" || i === "type") && (typeof r == "number" || typeof r == "string") && (r = Kn(r)), o[l] = r;
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
    return le({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(n) {
    const o = new mt();
    o.shortToLong = le(le({}, It), n), o.longToShort = {};
    for (const [i, a] of Object.entries(
      o.shortToLong
    ))
      o.longToShort[a] = i;
    return o;
  }
}
class Pt extends Error {
  constructor(n) {
    super(n), this.name = "OperationCancelledError", Error.captureStackTrace && Error.captureStackTrace(this, Pt);
  }
}
const Tt = /* @__PURE__ */ new Set();
function Xn(e) {
  Tt.add(e);
}
function Ie(e) {
  if (e && Tt.has(e))
    throw new Pt(`Operation cancelled: ${e}`);
}
function Ft(e) {
  Tt.delete(e);
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
function gt(e) {
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
  var b, S, v, I, s, C, $;
  if (!e || typeof e != "object")
    return e;
  const i = (b = o.maxNodes) != null ? b : 1e4, a = (S = o.nodeCount) != null ? S : 0;
  if (a >= i)
    return t.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: a
    };
  const l = {
    visited: (v = o.visited) != null ? v : /* @__PURE__ */ new WeakSet(),
    depth: (I = o.depth) != null ? I : 0,
    maxDepth: (s = o.maxDepth) != null ? s : 100,
    nodeCount: a + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: o.variableTable,
    collectionTable: o.collectionTable,
    instanceTable: o.instanceTable,
    styleTable: o.styleTable,
    detachedComponentsHandled: (C = o.detachedComponentsHandled) != null ? C : /* @__PURE__ */ new Set(),
    exportedIds: ($ = o.exportedIds) != null ? $ : /* @__PURE__ */ new Map()
  };
  if (n.has(e))
    return "[Circular Reference]";
  n.add(e), l.visited = n;
  const r = {}, g = await Kt(e, l);
  if (Object.assign(r, g), r.id && l.exportedIds) {
    const c = l.exportedIds.get(r.id);
    if (c !== void 0) {
      const F = r.name || "Unnamed";
      if (c !== F) {
        const _ = `Duplicate ID detected during export: ID "${r.id.substring(0, 8)}..." is used by both "${c}" and "${F}". Each node must have a unique ID.`;
        throw t.error(_), new Error(_);
      }
      t.warning(
        `Node "${F}" (ID: ${r.id.substring(0, 8)}...) was encountered multiple times during export. This may indicate a structural issue.`
      );
    } else
      l.exportedIds.set(r.id, r.name || "Unnamed");
  }
  const d = e.type;
  if (d)
    switch (d) {
      case "FRAME":
      case "COMPONENT": {
        const c = await Nt(e);
        Object.assign(r, c);
        break;
      }
      case "INSTANCE": {
        const c = await Hn(
          e,
          l
        );
        Object.assign(r, c);
        const F = await Nt(
          e
        );
        Object.assign(r, F);
        break;
      }
      case "TEXT": {
        const c = await Fn(e, l);
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
        l.unhandledKeys.add("_unknownType");
        break;
    }
  const m = Object.getOwnPropertyNames(e), y = /* @__PURE__ */ new Set([
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
  (d === "FRAME" || d === "COMPONENT" || d === "INSTANCE") && (y.add("layoutMode"), y.add("primaryAxisSizingMode"), y.add("counterAxisSizingMode"), y.add("primaryAxisAlignItems"), y.add("counterAxisAlignItems"), y.add("paddingLeft"), y.add("paddingRight"), y.add("paddingTop"), y.add("paddingBottom"), y.add("itemSpacing"), y.add("counterAxisSpacing"), y.add("cornerRadius"), y.add("clipsContent"), y.add("layoutWrap"), y.add("layoutGrow")), d === "TEXT" && (y.add("characters"), y.add("fontName"), y.add("fontSize"), y.add("textAlignHorizontal"), y.add("textAlignVertical"), y.add("letterSpacing"), y.add("lineHeight"), y.add("textCase"), y.add("textDecoration"), y.add("textAutoResize"), y.add("paragraphSpacing"), y.add("paragraphIndent"), y.add("listOptions")), (d === "VECTOR" || d === "LINE") && (y.add("fillGeometry"), y.add("strokeGeometry")), (d === "RECTANGLE" || d === "ELLIPSE" || d === "STAR" || d === "POLYGON") && (y.add("pointCount"), y.add("innerRadius"), y.add("arcData")), d === "INSTANCE" && (y.add("mainComponent"), y.add("componentProperties"));
  for (const c of m)
    typeof e[c] != "function" && (y.has(c) || l.unhandledKeys.add(c));
  if (l.unhandledKeys.size > 0 && (r._unhandledKeys = Array.from(l.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const c = l.maxDepth;
    if (l.depth >= c)
      r.children = {
        _truncated: !0,
        _reason: `Maximum depth (${c}) reached`,
        _count: e.children.length
      };
    else if (l.nodeCount >= i)
      r.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const F = Ne(le({}, l), {
        depth: l.depth + 1
      }), _ = [];
      let L = !1;
      for (const E of e.children) {
        if (F.nodeCount >= i) {
          r.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: _.length,
            _total: e.children.length,
            children: _
          }, L = !0;
          break;
        }
        const k = await ht(E, n, F);
        _.push(k), F.nodeCount && (l.nodeCount = F.nodeCount);
      }
      L || (r.children = _);
    }
  }
  return r;
}
async function Ze(e, n = /* @__PURE__ */ new Set(), o = !1, i = /* @__PURE__ */ new Set(), a) {
  Ie(a), e.clearConsole !== !1 && !o ? (t.clear(), t.log("=== Starting Page Export ===")) : o || t.log("=== Starting Page Export ===");
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
    Ie(a), t.log("Loading all pages..."), await figma.loadAllPagesAsync(), Ie(a);
    const g = figma.root.children;
    if (t.log(`Loaded ${g.length} page(s)`), r < 0 || r >= g.length)
      return t.error(
        `Invalid page index: ${r} (valid range: 0-${g.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const d = g[r], m = d.id;
    if (e.skipPrompts) {
      if (i.has(m))
        return t.log(
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
      i.add(m);
    } else {
      if (n.has(m))
        return t.log(
          `Page "${d.name}" has already been processed, skipping...`
        ), {
          type: "exportPage",
          success: !1,
          error: !0,
          message: "Page already processed",
          data: {}
        };
      n.add(m);
    }
    t.log(
      `Selected page: "${d.name}" (index: ${r})`
    ), t.log(
      "Initializing variable, collection, and instance tables..."
    );
    const y = new rt(), b = new it(), S = new at(), v = new pt();
    t.log("Extracting node data from page..."), t.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), t.log(
      "Collections will be discovered as variables are processed:"
    );
    const I = await ht(
      d,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: y,
        collectionTable: b,
        instanceTable: S,
        styleTable: v
      }
    );
    Ie(a), t.log("Node extraction finished");
    const s = ut(I), C = y.getSize(), $ = b.getSize(), c = S.getSize(), F = Zt(I);
    t.log("Extraction complete:"), t.log(`  - Total nodes: ${s}`), t.log(`  - Unique variables: ${C}`), t.log(`  - Unique collections: ${$}`), t.log(`  - Unique instances: ${c}`), t.log(
      `  - Nodes with constraints exported: ${F}`
    );
    const _ = S.getSerializedTable(), L = /* @__PURE__ */ new Map();
    for (const [W, z] of Object.entries(_))
      if (z.instanceType === "remote") {
        const R = parseInt(W, 10);
        L.set(R, z);
      }
    if (e.validateOnly) {
      t.log("=== Validation Mode ===");
      const W = await figma.variables.getLocalVariableCollectionsAsync(), z = /* @__PURE__ */ new Set(), R = /* @__PURE__ */ new Set();
      for (const ae of W)
        z.add(ae.id), R.add(ae.name);
      R.add("Token"), R.add("Tokens"), R.add("Theme"), R.add("Themes");
      const J = [], H = [];
      for (const ae of L.values()) {
        const se = ae.componentName || "(unnamed)";
        J.push({
          componentName: se,
          pageName: d.name
        }), H.push({
          type: "externalReference",
          message: `External reference found: "${se}" references a component from another file`,
          componentName: se,
          pageName: d.name
        });
      }
      const te = [], me = b.getTable();
      for (const ae of Object.values(me))
        ae.isLocal ? z.has(ae.collectionId) || (te.push({
          collectionName: ae.collectionName,
          collectionId: ae.collectionId,
          pageName: d.name
        }), H.push({
          type: "unknownCollection",
          message: `Unknown local collection: "${ae.collectionName}"`,
          collectionName: ae.collectionName,
          pageName: d.name
        })) : R.has(ae.collectionName) || (te.push({
          collectionName: ae.collectionName,
          collectionId: ae.collectionId,
          pageName: d.name
        }), H.push({
          type: "unknownCollection",
          message: `Unknown remote collection: "${ae.collectionName}". Remote collections must be named "Token", "Tokens", "Theme", or "Themes"`,
          collectionName: ae.collectionName,
          pageName: d.name
        }));
      const fe = Object.values(me).map(
        (ae) => ae.collectionName
      ), ce = {
        hasErrors: H.length > 0,
        errors: H,
        externalReferences: J,
        unknownCollections: te,
        discoveredCollections: fe
      };
      return t.log("Validation complete:"), t.log(`  - External references: ${J.length}`), t.log(`  - Unknown collections: ${te.length}`), t.log(`  - Has errors: ${ce.hasErrors}`), {
        type: "exportPage",
        success: !0,
        error: !1,
        message: "Validation complete",
        data: {
          filename: "",
          pageData: {},
          pageName: d.name,
          additionalPages: [],
          validationResult: ce
        }
      };
    }
    if (L.size > 0) {
      t.error(
        `Found ${L.size} remote instance(s) - remote instances are not supported during publishing`
      );
      const W = (H, te, me = [], fe = !1) => {
        const ce = [];
        if (!H || typeof H != "object")
          return ce;
        if (fe || H.type === "PAGE") {
          const ue = H.children || H.child;
          if (Array.isArray(ue))
            for (const Se of ue)
              Se && typeof Se == "object" && ce.push(
                ...W(
                  Se,
                  te,
                  [],
                  !1
                )
              );
          return ce;
        }
        const ae = H.name || "";
        if (typeof H._instanceRef == "number" && H._instanceRef === te) {
          const ue = ae || "(unnamed)", Se = me.length > 0 ? [...me, ue] : [ue];
          return ce.push({
            path: Se,
            nodeName: ue
          }), ce;
        }
        const se = ae ? [...me, ae] : me, de = H.children || H.child;
        if (Array.isArray(de))
          for (const ue of de)
            ue && typeof ue == "object" && ce.push(
              ...W(
                ue,
                te,
                se,
                !1
              )
            );
        return ce;
      }, z = [];
      let R = 1;
      for (const [H, te] of L.entries()) {
        const me = te.componentName || "(unnamed)", fe = te.componentSetName, ce = W(
          I,
          H,
          [],
          !0
        );
        let ae = "";
        ce.length > 0 ? ae = `
   Location(s): ${ce.map((Se) => {
          const xe = Se.path.length > 0 ? Se.path.join(" → ") : "page root";
          return `"${Se.nodeName}" at ${xe}`;
        }).join(", ")}` : ae = `
   Location: (unable to determine - instance may be deeply nested)`;
        const se = fe ? `Component: "${me}" (from component set "${fe}")` : `Component: "${me}"`, de = te.remoteLibraryName ? `
   Library: ${te.remoteLibraryName}` : "";
        z.push(
          `${R}. ${se}${de}${ae}`
        ), R++;
      }
      const J = `Cannot publish: Remote instances are not supported. Please remove all remote instances before publishing.

Found ${L.size} remote instance(s):
${z.join(`

`)}

To fix this:
1. Locate each remote instance component listed above using the path(s) shown
2. Replace it with a local component or remove it
3. Try publishing again`;
      throw t.error(J), new Error(J);
    }
    if ($ > 0) {
      t.log("Collections found:");
      const W = b.getTable();
      for (const [z, R] of Object.values(W).entries()) {
        const J = R.collectionGuid ? ` (GUID: ${R.collectionGuid.substring(0, 8)}...)` : "";
        t.log(
          `  ${z}: ${R.collectionName}${J} - ${R.modes.length} mode(s)`
        );
      }
    }
    let E;
    if (e.skipPrompts) {
      t.log("Running validation on main page...");
      try {
        Ie(a);
        const W = await Ze(
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
        if (W.success && W.data) {
          const z = W.data;
          z.validationResult && (E = z.validationResult, t.log(
            `Main page validation: ${E.hasErrors ? "FAILED" : "PASSED"}`
          ), E.hasErrors && t.warning(
            `Found ${E.errors.length} validation error(s) in main page`
          ));
        }
      } catch (W) {
        t.warning(
          `Could not validate main page: ${W instanceof Error ? W.message : String(W)}`
        );
      }
    }
    t.log("Checking for referenced component pages...");
    const k = [], V = [], O = Object.values(_).filter(
      (W) => W.instanceType === "normal"
    );
    if (O.length > 0) {
      t.log(
        `Found ${O.length} normal instance(s) to check`
      );
      const W = /* @__PURE__ */ new Map();
      for (const z of O)
        if (z.componentPageName) {
          const R = g.find((J) => J.name === z.componentPageName);
          if (R && !n.has(R.id))
            W.has(R.id) || W.set(R.id, R);
          else if (!R) {
            const J = `Normal instance references component "${z.componentName || "(unnamed)"}" on page "${z.componentPageName}", but that page was not found. Cannot export.`;
            throw t.error(J), new Error(J);
          }
        } else {
          const R = `Normal instance references component "${z.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw t.error(R), new Error(R);
        }
      t.log(
        `Found ${W.size} unique referenced page(s)`
      );
      for (const [z, R] of W.entries()) {
        Ie(a);
        const J = R.name;
        if (n.has(z)) {
          t.log(`Skipping "${J}" - already processed`);
          continue;
        }
        const H = R.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let te = !1, me = 0;
        if (H)
          try {
            const se = JSON.parse(H);
            te = !!(se.id && se.version !== void 0), me = se.version || 0;
          } catch (se) {
          }
        const fe = g.findIndex(
          (se) => se.id === R.id
        );
        if (fe === -1)
          throw t.error(`Could not find page index for "${J}"`), new Error(`Could not find page index for "${J}"`);
        const ce = Array.from(O).find(
          (se) => se.componentPageName === J
        ), ae = ce == null ? void 0 : ce.componentName;
        if (e.skipPrompts) {
          z === m ? t.log(
            `Skipping "${J}" - this is the original page being published`
          ) : V.find(
            (de) => de.pageId === z
          ) || (V.push({
            pageId: z,
            pageName: J,
            pageIndex: fe,
            hasMetadata: te,
            componentName: ae,
            localVersion: me
          }), t.log(
            `Discovered referenced page: "${J}" (local version: ${me}) (will be handled by wizard)`
          )), t.log(
            `Validating "${J}" for external references and unknown collections...`
          );
          try {
            Ie(a);
            const se = await Ze(
              {
                pageIndex: fe,
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
            if (se.success && se.data) {
              const de = se.data;
              if (de.validationResult) {
                E || (E = {
                  hasErrors: !1,
                  errors: [],
                  externalReferences: [],
                  unknownCollections: [],
                  discoveredCollections: []
                }), E.errors.push(
                  ...de.validationResult.errors
                ), E.externalReferences.push(
                  ...de.validationResult.externalReferences
                ), E.unknownCollections.push(
                  ...de.validationResult.unknownCollections
                );
                for (const ue of de.validationResult.discoveredCollections)
                  E.discoveredCollections.includes(
                    ue
                  ) || E.discoveredCollections.push(
                    ue
                  );
                E.hasErrors = E.errors.length > 0, t.log(
                  `  Validation for "${J}": ${de.validationResult.hasErrors ? "FAILED" : "PASSED"}`
                ), de.validationResult.hasErrors && t.warning(
                  `  Found ${de.validationResult.errors.length} validation error(s) in "${J}"`
                );
              }
            }
          } catch (se) {
            t.warning(
              `Could not validate "${J}": ${se instanceof Error ? se.message : String(se)}`
            );
          }
          t.log(
            `Checking dependencies of "${J}" for transitive dependencies...`
          );
          try {
            Ie(a);
            const se = await Ze(
              {
                pageIndex: fe,
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
            if (se.success && se.data) {
              const de = se.data;
              if (de.discoveredReferencedPages)
                for (const ue of de.discoveredReferencedPages) {
                  if (ue.pageId === m) {
                    t.log(
                      `  Skipping "${ue.pageName}" - this is the original page being published`
                    );
                    continue;
                  }
                  V.find(
                    (xe) => xe.pageId === ue.pageId
                  ) || (V.push(ue), t.log(
                    `  Discovered transitive dependency: "${ue.pageName}" (from ${J})`
                  ));
                }
            }
          } catch (se) {
            t.warning(
              `Could not discover dependencies of "${J}": ${se instanceof Error ? se.message : String(se)}`
            );
          }
        } else {
          const se = `Do you want to also publish referenced component "${J}"?`;
          try {
            await tt.prompt(se, {
              okLabel: "Yes",
              cancelLabel: "No",
              timeoutMs: 3e5
              // 5 minutes
            }), t.log(`Exporting referenced page: "${J}"`);
            const de = g.findIndex(
              (Se) => Se.id === R.id
            );
            if (de === -1)
              throw t.error(`Could not find page index for "${J}"`), new Error(`Could not find page index for "${J}"`);
            Ie(a);
            const ue = await Ze(
              {
                pageIndex: de
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
            if (ue.success && ue.data) {
              const Se = ue.data;
              k.push(Se), t.log(
                `Successfully exported referenced page: "${J}"`
              );
            } else
              throw new Error(
                `Failed to export referenced page "${J}": ${ue.message}`
              );
          } catch (de) {
            if (de instanceof Error && de.message === "User cancelled")
              if (te)
                t.log(
                  `User declined to publish "${J}", but page has existing metadata. Continuing with existing metadata.`
                );
              else
                throw t.error(
                  `Export cancelled: Referenced page "${J}" has no metadata and user declined to publish it.`
                ), new Error(
                  `Cannot continue export: Referenced component "${J}" has no metadata. Please publish it first or choose to publish it now.`
                );
            else
              throw de;
          }
        }
      }
    }
    t.log("Creating string table...");
    const p = new mt();
    t.log("Getting page metadata...");
    const f = d.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let h = "", w = 0;
    if (f)
      try {
        const W = JSON.parse(f);
        h = W.id || "", w = W.version || 0;
      } catch (W) {
        t.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!h) {
      t.log("Generating new GUID for page..."), h = await At();
      const W = {
        _ver: 1,
        id: h,
        name: d.name,
        version: w,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      d.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(W)
      );
    }
    t.log("Creating export data structure...");
    const x = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "1.0.0",
        figmaApiVersion: figma.apiVersion,
        guid: h,
        version: w,
        name: d.name,
        pluginVersion: "1.0.0"
      },
      stringTable: p.getSerializedTable(),
      collections: b.getSerializedTable(),
      variables: y.getSerializedTable(),
      instances: S.getSerializedTable(),
      styles: v.getSerializedTable(),
      pageData: I
    };
    t.log("Compressing JSON data...");
    const U = qn(x, p);
    t.log("Serializing to JSON...");
    const Y = JSON.stringify(U, null, 2), re = (Y.length / 1024).toFixed(2), j = gt(d.name).trim().replace(/\s+/g, "_") + ".figma.json";
    t.log(`JSON serialization complete: ${re} KB`), t.log(`Export file: ${j}`), t.log("=== Export Complete ===");
    const ee = JSON.parse(Y), ne = {
      filename: j,
      pageData: ee,
      pageName: d.name,
      additionalPages: k,
      // Populated with referenced component pages
      discoveredReferencedPages: V.length > 0 ? (
        // Filter out the original page - it shouldn't be in the discovered list since it's the one being published
        V.filter((W) => W.pageId !== m)
      ) : void 0,
      // Only include if there are discovered pages
      validationResult: E
      // Include aggregated validation results if in discovery mode
    }, K = t.getLogs();
    return {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: le(le({}, ne), K.length > 0 && { debugLogs: K })
    };
  } catch (r) {
    const g = r instanceof Error ? r.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", r), console.error("Error message:", g), t.error(`Export failed: ${g}`), r instanceof Error && r.stack && (console.error("Stack trace:", r.stack), t.error(`Stack trace: ${r.stack}`));
    const d = t.getLogs(), m = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: g,
      data: le({}, d.length > 0 && { debugLogs: d })
    };
    return console.error("Returning error response:", m), m;
  }
}
const Zn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  countTotalNodes: ut,
  exportPage: Ze,
  extractNodeData: ht
}, Symbol.toStringTag, { value: "Module" }));
function $e(e) {
  return e.replace(/[^a-zA-Z0-9]/g, "");
}
function Qt(e) {
  const i = e, { logs: n } = i;
  return vt(i, ["logs"]);
}
const en = /* @__PURE__ */ new Map();
async function Ke(e, n) {
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
    e.modes.find((l) => l.name === i) || e.addMode(i);
}
const ke = "recursica:collectionId";
async function dt(e) {
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
      ke
    );
    if (o && o.trim() !== "")
      return o;
    const i = await At();
    return e.setSharedPluginData("recursica", ke, i), i;
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
      const g = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((d) => d.name.trim().toLowerCase() === o);
      if (g) {
        Qn(e.collectionName, !1);
        const d = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          g.key
        );
        if (d.length > 0) {
          const m = await figma.variables.importVariableByKeyAsync(d[0].key), y = await figma.variables.getVariableCollectionByIdAsync(
            m.variableCollectionId
          );
          if (y) {
            if (n = y, e.collectionGuid) {
              const b = n.getSharedPluginData(
                "recursica",
                ke
              );
              (!b || b.trim() === "") && n.setSharedPluginData(
                "recursica",
                ke,
                e.collectionGuid
              );
            } else
              await dt(n);
            return await Ke(n, e.modes), { collection: n };
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
    let g;
    if (e.collectionGuid && (g = r.find((d) => d.getSharedPluginData("recursica", ke) === e.collectionGuid)), g || (g = r.find(
      (d) => d.name === e.collectionName
    )), g)
      if (n = g, e.collectionGuid) {
        const d = n.getSharedPluginData(
          "recursica",
          ke
        );
        (!d || d.trim() === "") && n.setSharedPluginData(
          "recursica",
          ke,
          e.collectionGuid
        );
      } else
        await dt(n);
    else
      n = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? n.setSharedPluginData(
        "recursica",
        ke,
        e.collectionGuid
      ) : await dt(n);
  } else {
    const r = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), g = e.collectionName.trim().toLowerCase(), d = r.find((S) => S.name.trim().toLowerCase() === g);
    if (!d)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const m = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      d.key
    );
    if (m.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const y = await figma.variables.importVariableByKeyAsync(
      m[0].key
    ), b = await figma.variables.getVariableCollectionByIdAsync(
      y.variableCollectionId
    );
    if (!b)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (n = b, e.collectionGuid) {
      const S = n.getSharedPluginData(
        "recursica",
        ke
      );
      (!S || S.trim() === "") && n.setSharedPluginData(
        "recursica",
        ke,
        e.collectionGuid
      );
    } else
      dt(n);
  }
  return await Ke(n, e.modes), { collection: n };
}
async function Ot(e, n) {
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
  for (const [l, r] of Object.entries(n)) {
    const g = en.get(`${i.id}:${l}`) || l;
    let d = i.modes.find((y) => y.name === g);
    if (d || (d = i.modes.find((y) => y.name === l)), !d) {
      t.warning(
        `Mode "${l}" (mapped: "${g}") not found in collection "${i.name}" for variable "${e.name}". Available modes: ${i.modes.map((y) => y.name).join(", ")}. Skipping.`
      );
      continue;
    }
    const m = d.modeId;
    try {
      if (r == null) {
        t.log(
          `  Mode "${l}": value is null/undefined, skipping`
        );
        continue;
      }
      if (t.log(
        `  Mode "${l}": value type=${typeof r}, value=${JSON.stringify(r)}`
      ), typeof r == "string" || typeof r == "number" || typeof r == "boolean") {
        e.setValueForMode(m, r);
        continue;
      }
      if (typeof r == "object" && r !== null && "r" in r && "g" in r && "b" in r && typeof r.r == "number" && typeof r.g == "number" && typeof r.b == "number") {
        const y = r, b = {
          r: y.r,
          g: y.g,
          b: y.b
        };
        y.a !== void 0 && (b.a = y.a), e.setValueForMode(m, b);
        const S = e.valuesByMode[m];
        if (t.log(
          `  Set color value for "${e.name}" mode "${l}": r=${b.r.toFixed(3)}, g=${b.g.toFixed(3)}, b=${b.b.toFixed(3)}${b.a !== void 0 ? `, a=${b.a.toFixed(3)}` : ""}`
        ), t.log(`  Read back value: ${JSON.stringify(S)}`), typeof S == "object" && S !== null && "r" in S && "g" in S && "b" in S) {
          const v = S, I = Math.abs(v.r - b.r) < 1e-3, s = Math.abs(v.g - b.g) < 1e-3, C = Math.abs(v.b - b.b) < 1e-3;
          !I || !s || !C ? t.warning(
            `  ⚠️ Value mismatch! Set: r=${b.r}, g=${b.g}, b=${b.b}, Read back: r=${v.r}, g=${v.g}, b=${v.b}`
          ) : t.log(
            "  ✓ Value verified: read-back matches what we set"
          );
        } else
          t.warning(
            `  ⚠️ Read-back value is not an RGB object: ${JSON.stringify(S)}`
          );
        continue;
      }
      if (typeof r == "object" && r !== null && "_varRef" in r && typeof r._varRef == "number") {
        const y = r;
        let b = null;
        const S = o.getVariableByIndex(
          y._varRef
        );
        if (S) {
          let v = null;
          if (a && S._colRef !== void 0) {
            const I = a.getCollectionByIndex(
              S._colRef
            );
            I && (v = (await eo(I)).collection);
          }
          v && (b = await Ot(
            v,
            S.variableName
          ));
        }
        if (b) {
          const v = {
            type: "VARIABLE_ALIAS",
            id: b.id
          };
          e.setValueForMode(m, v);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${l}" in variable "${e.name}". Variable reference index: ${y._varRef}`
          );
      }
    } catch (y) {
      typeof r == "object" && r !== null && !("_varRef" in r) && !("r" in r && "g" in r && "b" in r) && t.warning(
        `Unhandled value type for mode "${l}" in variable "${e.name}": ${JSON.stringify(r)}`
      ), console.warn(
        `Error setting value for mode "${l}" in variable "${e.name}":`,
        y
      );
    }
  }
}
async function wt(e, n, o, i) {
  if (t.log(
    `Creating variable "${e.variableName}" (type: ${e.variableType})`
  ), e.valuesByMode) {
    t.log(
      `  valuesByMode has ${Object.keys(e.valuesByMode).length} mode(s): ${Object.keys(e.valuesByMode).join(", ")}`
    );
    for (const [l, r] of Object.entries(e.valuesByMode))
      t.log(
        `  Mode "${l}": ${JSON.stringify(r)} (type: ${typeof r})`
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
    for (const [l, r] of Object.entries(
      e.valuesByMode
    )) {
      const g = n.modes.find((d) => d.name === l);
      if (g) {
        const d = a.valuesByMode[g.modeId];
        t.log(
          `    Mode "${l}": expected=${JSON.stringify(r)}, actual=${JSON.stringify(d)}`
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
  const l = i.get(String(a._colRef));
  if (!l)
    return null;
  const r = await Ot(
    l,
    a.variableName
  );
  if (r) {
    let g;
    if (typeof a.variableType == "number" ? g = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[a.variableType] || String(a.variableType) : g = a.variableType, on(r, g))
      return r;
  }
  return await wt(
    a,
    l,
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
      const l = n[o];
      if (Array.isArray(l))
        for (let r = 0; r < l.length && r < a.length; r++) {
          const g = l[r];
          if (g && typeof g == "object") {
            if (a[r].boundVariables || (a[r].boundVariables = {}), ze(g)) {
              const d = g._varRef;
              if (d !== void 0) {
                const m = i.get(String(d));
                m && (a[r].boundVariables.color = {
                  type: "VARIABLE_ALIAS",
                  id: m.id
                });
              }
            } else
              for (const [d, m] of Object.entries(
                g
              ))
                if (ze(m)) {
                  const y = m._varRef;
                  if (y !== void 0) {
                    const b = i.get(String(y));
                    b && (a[r].boundVariables[d] = {
                      type: "VARIABLE_ALIAS",
                      id: b.id
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
    (l, r) => parseInt(l[0], 10) - parseInt(r[0], 10)
  );
  for (const [l, r] of a) {
    const g = parseInt(l, 10), d = r.name || "Unnamed Style", m = r.type;
    let y = null;
    switch (m) {
      case "TEXT":
        y = (await figma.getLocalTextStylesAsync()).find(
          (S) => S.name === d
        ) || null;
        break;
      case "PAINT":
        y = (await figma.getLocalPaintStylesAsync()).find(
          (S) => S.name === d
        ) || null;
        break;
      case "EFFECT":
        y = (await figma.getLocalEffectStylesAsync()).find(
          (S) => S.name === d
        ) || null;
        break;
      case "GRID":
        y = (await figma.getLocalGridStylesAsync()).find(
          (S) => S.name === d
        ) || null;
        break;
    }
    if (y) {
      t.log(
        `  Skipping creation of style "${d}" (type: ${m}) as it already exists. Reusing existing style.`
      ), o.set(g, y);
      continue;
    }
    let b = null;
    try {
      switch (m) {
        case "TEXT":
          b = await io(r, n);
          break;
        case "PAINT":
          b = await ro(r, n);
          break;
        case "EFFECT":
          b = await ao(r, n);
          break;
        case "GRID":
          b = await so(r, n);
          break;
        default:
          t.warning(
            `  Unknown style type "${m}" for style "${d}". Skipping.`
          );
          break;
      }
      b && (o.set(g, b), i.push(b), t.log(
        `  ✓ Created style "${d}" (type: ${m})`
      ));
    } catch (S) {
      t.warning(
        `  Failed to create style "${d}" (type: ${m}): ${S}`
      );
    }
  }
  return { styleMapping: o, newlyCreatedStyles: i };
}
async function io(e, n) {
  var i, a, l, r, g, d, m, y;
  const o = figma.createTextStyle();
  if (o.name = e.name, e.textStyle && (e.textStyle.fontName !== void 0 && !((i = e.textStyle.boundVariables) != null && i.fontName) && (await figma.loadFontAsync(e.textStyle.fontName), o.fontName = e.textStyle.fontName), e.textStyle.fontSize !== void 0 && !((a = e.textStyle.boundVariables) != null && a.fontSize) && (o.fontSize = e.textStyle.fontSize), e.textStyle.letterSpacing !== void 0 && !((l = e.textStyle.boundVariables) != null && l.letterSpacing) && (o.letterSpacing = e.textStyle.letterSpacing), e.textStyle.lineHeight !== void 0 && !((r = e.textStyle.boundVariables) != null && r.lineHeight) && (o.lineHeight = e.textStyle.lineHeight), e.textStyle.textCase !== void 0 && !((g = e.textStyle.boundVariables) != null && g.textCase) && (o.textCase = e.textStyle.textCase), e.textStyle.textDecoration !== void 0 && !((d = e.textStyle.boundVariables) != null && d.textDecoration) && (o.textDecoration = e.textStyle.textDecoration), e.textStyle.paragraphSpacing !== void 0 && !((m = e.textStyle.boundVariables) != null && m.paragraphSpacing) && (o.paragraphSpacing = e.textStyle.paragraphSpacing), e.textStyle.paragraphIndent !== void 0 && !((y = e.textStyle.boundVariables) != null && y.paragraphIndent) && (o.paragraphIndent = e.textStyle.paragraphIndent), e.textStyle.boundVariables))
    for (const [b, S] of Object.entries(
      e.textStyle.boundVariables
    )) {
      let v;
      if (typeof S == "object" && S !== null && "_varRef" in S) {
        const I = S._varRef;
        v = n.get(String(I));
      } else {
        const I = typeof S == "string" ? S : String(S);
        v = n.get(I);
      }
      if (v)
        try {
          o.setBoundVariable(b, v);
        } catch (I) {
          t.warning(
            `Could not bind variable to text style property "${b}": ${I}`
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
    const a = we;
    e.layoutMode === void 0 && (e.layoutMode = a.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = a.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = a.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = a.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = a.counterAxisAlignItems), o || (e.paddingLeft === void 0 && (e.paddingLeft = a.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = a.paddingRight), e.paddingTop === void 0 && (e.paddingTop = a.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = a.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = a.itemSpacing), e.counterAxisSpacing === void 0 && (e.counterAxisSpacing = a.counterAxisSpacing));
  }
  if (n === "TEXT") {
    const a = Me;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = a.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = a.textAlignVertical), e.textCase === void 0 && (e.textCase = a.textCase), e.textDecoration === void 0 && (e.textDecoration = a.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = a.textAutoResize);
  }
}
async function Xe(e, n, o = null, i = null, a = null, l = null, r = null, g = !1, d = null, m = null, y = null, b = null, S = null, v, I = null) {
  var p, f, h, w, x, U, Y, re, Q, j, ee, ne, K, ie, W, z, R, J, H, te, me, fe, ce, ae, se, de, ue, Se, xe, je, nt, Je, T, pe, Z;
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
      if (e.id && r && r.has(e.id))
        s = r.get(e.id), t.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (s = figma.createComponent(), t.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions) {
        const N = e.componentPropertyDefinitions;
        let P = 0, u = 0;
        for (const [A, B] of Object.entries(N))
          try {
            const G = B.type;
            let M = null;
            if (typeof G == "string" ? (G === "TEXT" || G === "BOOLEAN" || G === "INSTANCE_SWAP" || G === "VARIANT") && (M = G) : typeof G == "number" && (M = {
              2: "TEXT",
              // Text property
              25: "BOOLEAN",
              // Boolean property
              27: "INSTANCE_SWAP",
              // Instance swap property
              26: "VARIANT"
              // Variant property
            }[G] || null), !M) {
              t.warning(
                `  Unknown property type ${G} (${typeof G}) for property "${A}" in component "${e.name || "Unnamed"}"`
              ), u++;
              continue;
            }
            const D = B.defaultValue, q = A.split("#")[0];
            s.addComponentProperty(
              q,
              M,
              D
            ), P++;
          } catch (G) {
            t.warning(
              `  Failed to add component property "${A}" to "${e.name || "Unnamed"}": ${G}`
            ), u++;
          }
        P > 0 && t.log(
          `  Added ${P} component property definition(s) to "${e.name || "Unnamed"}"${u > 0 ? ` (${u} failed)` : ""}`
        );
      }
      break;
    case "COMPONENT_SET": {
      const N = e.children ? e.children.filter((A) => A.type === "COMPONENT").length : 0;
      t.log(
        `Creating COMPONENT_SET "${e.name || "Unnamed"}" by combining ${N} component variant(s)`
      );
      const P = [];
      let u = null;
      if (e.children && Array.isArray(e.children)) {
        u = figma.createFrame(), u.name = `_temp_${e.name || "COMPONENT_SET"}`, u.visible = !1, ((n == null ? void 0 : n.type) === "PAGE" ? n : figma.currentPage).appendChild(u);
        for (const B of e.children)
          if (B.type === "COMPONENT" && !B._truncated)
            try {
              const G = await Xe(
                B,
                u,
                // Use temp parent for now
                o,
                i,
                a,
                l,
                r,
                g,
                d,
                m,
                // Pass deferredInstances through for component set creation
                null,
                // parentNodeData - not needed here, will be passed correctly in recursive calls
                b,
                S,
                // Pass placeholderFrameIds through for component set creation
                void 0,
                // currentPlaceholderId - component set creation is not inside a placeholder
                I
                // Pass styleMapping to apply styles
              );
              G && G.type === "COMPONENT" && (P.push(G), t.log(
                `  Created component variant: "${G.name || "Unnamed"}"`
              ));
            } catch (G) {
              t.warning(
                `  Failed to create component variant "${B.name || "Unnamed"}": ${G}`
              );
            }
      }
      if (P.length > 0)
        try {
          const A = n || figma.currentPage, B = figma.combineAsVariants(
            P,
            A
          );
          e.name && (B.name = e.name), e.x !== void 0 && (B.x = e.x), e.y !== void 0 && (B.y = e.y), u && u.parent && u.remove(), t.log(
            `  ✓ Successfully created COMPONENT_SET "${B.name}" with ${P.length} variant(s)`
          ), s = B;
        } catch (A) {
          if (t.warning(
            `  Failed to combine components into COMPONENT_SET "${e.name || "Unnamed"}": ${A}. Falling back to frame.`
          ), s = figma.createFrame(), e.name && (s.name = e.name), u && u.children.length > 0) {
            for (const B of u.children)
              s.appendChild(B);
            u.remove();
          }
        }
      else
        t.warning(
          `  No valid component variants found for COMPONENT_SET "${e.name || "Unnamed"}". Creating frame instead.`
        ), s = figma.createFrame(), e.name && (s.name = e.name), u && u.remove();
      break;
    }
    case "INSTANCE":
      if (g)
        s = figma.createFrame(), e.name && (s.name = e.name);
      else if (e._instanceRef !== void 0 && a && r) {
        const N = a.getInstanceByIndex(
          e._instanceRef
        );
        if (N && N.instanceType === "internal")
          if (N.componentNodeId)
            if (N.componentNodeId === e.id)
              t.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), s = figma.createFrame(), e.name && (s.name = e.name);
            else {
              const P = r.get(
                N.componentNodeId
              );
              if (!P) {
                const u = Array.from(r.keys()).slice(
                  0,
                  20
                );
                t.error(
                  `Component not found for internal instance "${e.name}" (ID: ${N.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), t.error(
                  `Looking for component ID: ${N.componentNodeId}`
                ), t.error(
                  `Available IDs in mapping (first 20): ${u.map((D) => D.substring(0, 8) + "...").join(", ")}`
                );
                const A = (D, q) => {
                  if (D.type === "COMPONENT" && D.id === q)
                    return !0;
                  if (D.children && Array.isArray(D.children)) {
                    for (const X of D.children)
                      if (!X._truncated && A(X, q))
                        return !0;
                  }
                  return !1;
                }, B = A(
                  e,
                  N.componentNodeId
                );
                t.error(
                  `Component ID ${N.componentNodeId.substring(0, 8)}... exists in current node tree: ${B}`
                ), t.error(
                  `WARNING: Component ID ${N.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), t.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), t.error(
                  "  2. The component wasn't collected in the first pass"
                ), t.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const G = u.filter(
                  (D) => D.startsWith(N.componentNodeId.substring(0, 8))
                );
                G.length > 0 && t.error(
                  `Found IDs with matching prefix: ${G.map((D) => D.substring(0, 8) + "...").join(", ")}`
                );
                const M = `Component not found for internal instance "${e.name}" (ID: ${N.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${u.map((D) => D.substring(0, 8) + "...").join(", ")}`;
                throw new Error(M);
              }
              if (P && P.type === "COMPONENT") {
                if (s = P.createInstance(), t.log(
                  `✓ Created internal instance "${e.name}" from component "${N.componentName}"`
                ), N.variantProperties && Object.keys(N.variantProperties).length > 0)
                  try {
                    let u = null;
                    if (P.parent && P.parent.type === "COMPONENT_SET")
                      u = P.parent.componentPropertyDefinitions, t.log(
                        `  DEBUG: Component "${N.componentName}" is inside component set "${P.parent.name}" with ${Object.keys(u || {}).length} property definitions`
                      );
                    else {
                      const A = await s.getMainComponentAsync();
                      if (A) {
                        const B = A.type;
                        t.log(
                          `  DEBUG: Internal instance "${e.name}" - componentNode parent: ${P.parent ? P.parent.type : "N/A"}, mainComponent type: ${B}, mainComponent parent: ${A.parent ? A.parent.type : "N/A"}`
                        ), B === "COMPONENT_SET" ? u = A.componentPropertyDefinitions : B === "COMPONENT" && A.parent && A.parent.type === "COMPONENT_SET" ? (u = A.parent.componentPropertyDefinitions, t.log(
                          `  DEBUG: Found component set parent "${A.parent.name}" with ${Object.keys(u || {}).length} property definitions`
                        )) : t.log(
                          `  Skipping variant properties for internal instance "${e.name}" - component "${N.componentName}" is not yet in a COMPONENT_SET (will be moved later during component set creation)`
                        );
                      }
                    }
                    if (u) {
                      const A = {};
                      for (const [B, G] of Object.entries(
                        N.variantProperties
                      )) {
                        const M = B.split("#")[0];
                        u[M] && (A[M] = G);
                      }
                      Object.keys(A).length > 0 && s.setProperties(A);
                    }
                  } catch (u) {
                    const A = `Failed to set variant properties for instance "${e.name}": ${u}`;
                    throw t.error(A), new Error(A);
                  }
                if (N.componentProperties && Object.keys(N.componentProperties).length > 0)
                  try {
                    const u = await s.getMainComponentAsync();
                    if (u) {
                      let A = null;
                      const B = u.type;
                      if (B === "COMPONENT_SET" ? A = u.componentPropertyDefinitions : B === "COMPONENT" && u.parent && u.parent.type === "COMPONENT_SET" ? A = u.parent.componentPropertyDefinitions : B === "COMPONENT" && (A = u.componentPropertyDefinitions), A)
                        for (const [G, M] of Object.entries(
                          N.componentProperties
                        )) {
                          const D = G.split("#")[0];
                          if (A[D])
                            try {
                              let q = M;
                              M && typeof M == "object" && "value" in M && (q = M.value), s.setProperties({
                                [D]: q
                              });
                            } catch (q) {
                              const X = `Failed to set component property "${D}" for internal instance "${e.name}": ${q}`;
                              throw t.error(X), new Error(X);
                            }
                        }
                    } else
                      t.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (u) {
                    if (u instanceof Error)
                      throw u;
                    const A = `Failed to set component properties for instance "${e.name}": ${u}`;
                    throw t.error(A), new Error(A);
                  }
              } else if (!s && P) {
                const u = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${N.componentNodeId.substring(0, 8)}...).`;
                throw t.error(u), new Error(u);
              }
            }
          else {
            const P = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw t.error(P), new Error(P);
          }
        else if (N && N.instanceType === "remote")
          if (d) {
            const P = d.get(
              e._instanceRef
            );
            if (P) {
              if (s = P.createInstance(), t.log(
                `✓ Created remote instance "${e.name}" from component "${N.componentName}" on REMOTES page`
              ), N.variantProperties && Object.keys(N.variantProperties).length > 0)
                try {
                  const u = await s.getMainComponentAsync();
                  if (u) {
                    let A = null;
                    const B = u.type;
                    if (B === "COMPONENT_SET" ? A = u.componentPropertyDefinitions : B === "COMPONENT" && u.parent && u.parent.type === "COMPONENT_SET" ? A = u.parent.componentPropertyDefinitions : t.log(
                      `Skipping variant properties for remote instance "${e.name}" - main component is not a COMPONENT_SET or variant (expected for remote components)`
                    ), A) {
                      const G = {};
                      for (const [M, D] of Object.entries(
                        N.variantProperties
                      )) {
                        const q = M.split("#")[0];
                        A[q] && (G[q] = D);
                      }
                      Object.keys(G).length > 0 && s.setProperties(G);
                    }
                  } else
                    t.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (u) {
                  const A = `Failed to set variant properties for remote instance "${e.name}": ${u}`;
                  throw t.error(A), new Error(A);
                }
              if (N.componentProperties && Object.keys(N.componentProperties).length > 0)
                try {
                  const u = await s.getMainComponentAsync();
                  if (u) {
                    let A = null;
                    const B = u.type;
                    if (B === "COMPONENT_SET" ? A = u.componentPropertyDefinitions : B === "COMPONENT" && u.parent && u.parent.type === "COMPONENT_SET" ? A = u.parent.componentPropertyDefinitions : B === "COMPONENT" && (A = u.componentPropertyDefinitions), A)
                      for (const [G, M] of Object.entries(
                        N.componentProperties
                      )) {
                        const D = G.split("#")[0];
                        if (A[D])
                          try {
                            let q = M;
                            M && typeof M == "object" && "value" in M && (q = M.value), s.setProperties({
                              [D]: q
                            });
                          } catch (q) {
                            const X = `Failed to set component property "${D}" for remote instance "${e.name}": ${q}`;
                            throw t.error(X), new Error(X);
                          }
                      }
                  } else
                    t.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (u) {
                  if (u instanceof Error)
                    throw u;
                  const A = `Failed to set component properties for remote instance "${e.name}": ${u}`;
                  throw t.error(A), new Error(A);
                }
              if (e.width !== void 0 && e.height !== void 0)
                try {
                  s.resize(e.width, e.height);
                } catch (u) {
                  t.log(
                    `Note: Could not resize remote instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
                  );
                }
            } else {
              const u = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw t.error(u), new Error(u);
            }
          } else {
            const P = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw t.error(P), new Error(P);
          }
        else if ((N == null ? void 0 : N.instanceType) === "normal") {
          if (!N.componentPageName) {
            const M = `Normal instance "${e.name}" missing componentPageName. Cannot resolve.`;
            throw t.error(M), new Error(M);
          }
          await figma.loadAllPagesAsync();
          const P = figma.root.children.find(
            (M) => M.name === N.componentPageName
          );
          if (!P) {
            t.log(
              `  Deferring normal instance "${e.name}" - referenced page "${N.componentPageName}" does not exist yet (may be circular reference or not yet imported)`
            );
            const M = figma.createFrame();
            if (M.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (M.x = e.x), e.y !== void 0 && (M.y = e.y), e.width !== void 0 && e.height !== void 0 ? M.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && M.resize(e.w, e.h), S && S.add(M.id), m) {
              const D = v;
              D ? t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${D.substring(0, 8)}... (immediate parent: "${n.name}" ${n.id.substring(0, 8)}...)`
              ) : t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${n.name}" (${n.id.substring(0, 8)}...)`
              );
              let q = n.id;
              if (D)
                try {
                  const oe = await figma.getNodeByIdAsync(D);
                  oe && oe.parent && (q = oe.parent.id);
                } catch (oe) {
                  q = n.id;
                }
              const X = {
                placeholderFrameId: M.id,
                instanceEntry: N,
                nodeData: e,
                parentNodeId: q,
                parentPlaceholderId: D,
                instanceIndex: e._instanceRef
              };
              m.push(X);
            }
            s = M;
            break;
          }
          let u = null;
          const A = (M, D, q, X, oe) => {
            if (D.length === 0) {
              let ye = null;
              for (const ve of M.children || [])
                if (ve.type === "COMPONENT") {
                  if (ve.name === q)
                    if (ye || (ye = ve), X)
                      try {
                        const Ce = ve.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (Ce && JSON.parse(Ce).id === X)
                          return ve;
                      } catch (Ce) {
                      }
                    else
                      return ve;
                } else if (ve.type === "COMPONENT_SET") {
                  if (oe && ve.name !== oe)
                    continue;
                  for (const Ce of ve.children || [])
                    if (Ce.type === "COMPONENT" && Ce.name === q)
                      if (ye || (ye = Ce), X)
                        try {
                          const De = Ce.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (De && JSON.parse(De).id === X)
                            return Ce;
                        } catch (De) {
                        }
                      else
                        return Ce;
                }
              return ye;
            }
            const [be, ...he] = D;
            for (const ye of M.children || [])
              if (ye.name === be) {
                if (he.length === 0 && ye.type === "COMPONENT_SET") {
                  if (oe && ye.name !== oe)
                    continue;
                  for (const ve of ye.children || [])
                    if (ve.type === "COMPONENT" && ve.name === q) {
                      if (X)
                        try {
                          const Ce = ve.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (Ce && JSON.parse(Ce).id === X)
                            return ve;
                        } catch (Ce) {
                        }
                      return ve;
                    }
                  return null;
                }
                return A(
                  ye,
                  he,
                  q,
                  X,
                  oe
                );
              }
            return null;
          };
          t.log(
            `  Looking for component "${N.componentName}" on page "${N.componentPageName}"${N.path && N.path.length > 0 ? ` at path [${N.path.join(" → ")}]` : " at page root"}${N.componentGuid ? ` (GUID: ${N.componentGuid.substring(0, 8)}...)` : ""}`
          );
          const B = [], G = (M, D = 0) => {
            const q = "  ".repeat(D);
            if (M.type === "COMPONENT")
              B.push(`${q}COMPONENT: "${M.name}"`);
            else if (M.type === "COMPONENT_SET") {
              B.push(
                `${q}COMPONENT_SET: "${M.name}"`
              );
              for (const X of M.children || [])
                X.type === "COMPONENT" && B.push(
                  `${q}  └─ COMPONENT: "${X.name}"`
                );
            }
            for (const X of M.children || [])
              G(X, D + 1);
          };
          if (G(P), B.length > 0 ? t.log(
            `  Available components on page "${N.componentPageName}":
${B.slice(0, 20).join(`
`)}${B.length > 20 ? `
  ... and ${B.length - 20} more` : ""}`
          ) : t.warning(
            `  No components found on page "${N.componentPageName}"`
          ), u = A(
            P,
            N.path || [],
            N.componentName,
            N.componentGuid,
            N.componentSetName
          ), u && N.componentGuid)
            try {
              const M = u.getPluginData(
                "RecursicaPublishedMetadata"
              );
              if (M) {
                const D = JSON.parse(M);
                D.id !== N.componentGuid ? t.warning(
                  `  Found component "${N.componentName}" by name but GUID verification failed (expected ${N.componentGuid.substring(0, 8)}..., got ${D.id ? D.id.substring(0, 8) + "..." : "none"}). Using name match as fallback.`
                ) : t.log(
                  `  Found component "${N.componentName}" with matching GUID ${N.componentGuid.substring(0, 8)}...`
                );
              } else
                t.warning(
                  `  Found component "${N.componentName}" by name but no metadata found. Using name match as fallback.`
                );
            } catch (M) {
              t.warning(
                `  Found component "${N.componentName}" by name but GUID verification failed. Using name match as fallback.`
              );
            }
          if (!u) {
            t.log(
              `  Deferring normal instance "${e.name}" - component "${N.componentName}" not found on page "${N.componentPageName}" (may not be created yet due to circular reference)`
            );
            const M = figma.createFrame();
            if (M.name = `[Deferred: ${e.name}]`, e.x !== void 0 && (M.x = e.x), e.y !== void 0 && (M.y = e.y), e.width !== void 0 && e.height !== void 0 ? M.resize(e.width, e.height) : e.w !== void 0 && e.h !== void 0 && M.resize(e.w, e.h), S && S.add(M.id), m) {
              const D = v;
              D ? t.log(
                `[NESTED] Creating child deferred instance "${e.name}" with parent placeholder ID ${D.substring(0, 8)}... (immediate parent: "${n.name}" ${n.id.substring(0, 8)}...)`
              ) : t.log(
                `[NESTED] Creating top-level deferred instance "${e.name}" - parent "${n.name}" (${n.id.substring(0, 8)}...)`
              );
              let q = n.id;
              if (D)
                try {
                  const oe = await figma.getNodeByIdAsync(D);
                  oe && oe.parent && (q = oe.parent.id);
                } catch (oe) {
                  q = n.id;
                }
              const X = {
                placeholderFrameId: M.id,
                instanceEntry: N,
                nodeData: e,
                parentNodeId: q,
                parentPlaceholderId: D,
                instanceIndex: e._instanceRef
              };
              m.push(X);
            }
            s = M;
            break;
          }
          if (s = u.createInstance(), t.log(
            `  Created normal instance "${e.name}" from component "${N.componentName}" on page "${N.componentPageName}"`
          ), N.variantProperties && Object.keys(N.variantProperties).length > 0)
            try {
              const M = await s.getMainComponentAsync();
              if (M) {
                let D = null;
                const q = M.type;
                if (q === "COMPONENT_SET" ? D = M.componentPropertyDefinitions : q === "COMPONENT" && M.parent && M.parent.type === "COMPONENT_SET" ? D = M.parent.componentPropertyDefinitions : t.warning(
                  `Cannot set variant properties for normal instance "${e.name}" - main component is not a COMPONENT_SET or variant`
                ), D) {
                  const X = {};
                  for (const [oe, be] of Object.entries(
                    N.variantProperties
                  )) {
                    const he = oe.split("#")[0];
                    D[he] && (X[he] = be);
                  }
                  Object.keys(X).length > 0 && s.setProperties(X);
                }
              }
            } catch (M) {
              t.warning(
                `Failed to set variant properties for normal instance "${e.name}": ${M}`
              );
            }
          if (N.componentProperties && Object.keys(N.componentProperties).length > 0)
            try {
              const M = await s.getMainComponentAsync();
              if (M) {
                let D = null;
                const q = M.type;
                if (q === "COMPONENT_SET" ? D = M.componentPropertyDefinitions : q === "COMPONENT" && M.parent && M.parent.type === "COMPONENT_SET" ? D = M.parent.componentPropertyDefinitions : q === "COMPONENT" && (D = M.componentPropertyDefinitions), D) {
                  const X = {};
                  for (const [oe, be] of Object.entries(
                    N.componentProperties
                  )) {
                    const he = oe.split("#")[0];
                    let ye;
                    if (D[oe] ? ye = oe : D[he] ? ye = he : ye = Object.keys(D).find(
                      (ve) => ve.split("#")[0] === he
                    ), ye) {
                      const ve = be && typeof be == "object" && "value" in be ? be.value : be;
                      X[ye] = ve;
                    } else
                      t.warning(
                        `Component property "${he}" (from "${oe}") does not exist on component "${N.componentName}" for normal instance "${e.name}". Available properties: ${Object.keys(D).join(", ") || "none"}`
                      );
                  }
                  if (Object.keys(X).length > 0)
                    try {
                      t.log(
                        `  Attempting to set component properties for normal instance "${e.name}": ${Object.keys(X).join(", ")}`
                      ), t.log(
                        `  Available component properties: ${Object.keys(D).join(", ")}`
                      ), s.setProperties(X), t.log(
                        `  ✓ Successfully set component properties for normal instance "${e.name}": ${Object.keys(X).join(", ")}`
                      );
                    } catch (oe) {
                      t.warning(
                        `Failed to set component properties for normal instance "${e.name}": ${oe}`
                      ), t.warning(
                        `  Properties attempted: ${JSON.stringify(X)}`
                      ), t.warning(
                        `  Available properties: ${JSON.stringify(Object.keys(D))}`
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
              s.resize(e.width, e.height);
            } catch (M) {
              t.log(
                `Note: Could not resize normal instance "${e.name}" to ${e.width}x${e.height} (may be constrained by component)`
              );
            }
        } else {
          const P = `Instance "${e.name}" has unknown or missing instance type: ${(N == null ? void 0 : N.instanceType) || "unknown"}`;
          throw t.error(P), new Error(P);
        }
      } else {
        const N = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw t.error(N), new Error(N);
      }
      break;
    case "GROUP":
      s = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      t.log(
        `Converting BOOLEAN_OPERATION "${e.name}" to VECTOR node (boolean operations cannot be created directly in Figma API)`
      ), s = figma.createVector();
      break;
    }
    case "POLYGON":
      s = figma.createPolygon();
      break;
    default: {
      const N = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw t.error(N), new Error(N);
    }
  }
  if (!s)
    return null;
  e.id && r && (r.set(e.id, s), s.type === "COMPONENT" && t.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), e._instanceRef !== void 0 && s.type === "INSTANCE" ? (r._instanceTableMap || (r._instanceTableMap = /* @__PURE__ */ new Map()), r._instanceTableMap.set(
    s.id,
    e._instanceRef
  ), t.log(
    `  Stored instance table mapping: instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) -> instance table index ${e._instanceRef}`
  )) : s.type === "INSTANCE" && t.log(
    `  WARNING: Instance "${s.name}" (ID: ${s.id.substring(0, 8)}...) has no _instanceRef in nodeData - will use fallback matching in third pass`
  );
  const C = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.paddingLeft || e.boundVariables.paddingRight || e.boundVariables.paddingTop || e.boundVariables.paddingBottom || e.boundVariables.itemSpacing);
  lo(
    s,
    e.type || "FRAME",
    C
  ), e.name !== void 0 && (s.name = e.name || "Unnamed Node");
  const $ = y && y.layoutMode !== void 0 && y.layoutMode !== "NONE", c = n && "layoutMode" in n && n.layoutMode !== "NONE";
  $ || c || (e.x !== void 0 && (s.x = e.x), e.y !== void 0 && (s.y = e.y));
  const _ = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height), L = e.name || "Unnamed";
  if (e.preserveRatio !== void 0 && t.log(
    `  [ISSUE #3 DEBUG] "${L}" has preserveRatio in nodeData: ${e.preserveRatio}`
  ), e.constraints !== void 0 && t.log(
    `  [ISSUE #4 DEBUG] "${L}" has constraints in nodeData: ${JSON.stringify(e.constraints)}`
  ), (e.constraintHorizontal !== void 0 || e.constraintVertical !== void 0) && t.log(
    `  [ISSUE #4 DEBUG] "${L}" has constraintHorizontal: ${e.constraintHorizontal}, constraintVertical: ${e.constraintVertical}`
  ), e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && e.width !== void 0 && e.height !== void 0 && !_) {
    const N = s.preserveRatio;
    N !== void 0 && t.log(
      `  [ISSUE #3 DEBUG] "${L}" preserveRatio before resize: ${N}`
    ), s.resize(e.width, e.height);
    const P = s.preserveRatio;
    P !== void 0 ? t.log(
      `  [ISSUE #3 DEBUG] "${L}" preserveRatio after resize: ${P}`
    ) : e.preserveRatio !== void 0 && t.warning(
      `  ⚠️ ISSUE #3: "${L}" preserveRatio was in nodeData (${e.preserveRatio}) but not set on node!`
    );
    const u = e.constraintHorizontal || ((p = e.constraints) == null ? void 0 : p.horizontal), A = e.constraintVertical || ((f = e.constraints) == null ? void 0 : f.vertical);
    (u !== void 0 || A !== void 0) && t.log(
      `  [ISSUE #4] "${L}" (${e.type}) - Expected constraints from JSON: H=${u || "undefined"}, V=${A || "undefined"}`
    );
    const B = (h = s.constraints) == null ? void 0 : h.horizontal, G = (w = s.constraints) == null ? void 0 : w.vertical;
    (u !== void 0 || A !== void 0) && t.log(
      `  [ISSUE #4] "${L}" (${e.type}) - Constraints after resize (before setting): H=${B || "undefined"}, V=${G || "undefined"}`
    );
    const M = e.constraintHorizontal !== void 0 || ((x = e.constraints) == null ? void 0 : x.horizontal) !== void 0, D = e.constraintVertical !== void 0 || ((U = e.constraints) == null ? void 0 : U.vertical) !== void 0;
    if (M || D) {
      const oe = e.constraintHorizontal || ((Y = e.constraints) == null ? void 0 : Y.horizontal), be = e.constraintVertical || ((re = e.constraints) == null ? void 0 : re.vertical), he = oe || B || "MIN", ye = be || G || "MIN";
      try {
        t.log(
          `  [ISSUE #4] Setting constraints for "${L}" (${e.type}): H=${he} (from ${oe || "default"}), V=${ye} (from ${be || "default"})`
        ), s.constraints = {
          horizontal: he,
          vertical: ye
        };
        const ve = (Q = s.constraints) == null ? void 0 : Q.horizontal, Ce = (j = s.constraints) == null ? void 0 : j.vertical;
        ve === he && Ce === ye ? t.log(
          `  [ISSUE #4] ✓ Constraints set successfully: H=${ve}, V=${Ce} for "${L}"`
        ) : t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${he}, V=${ye}, got H=${ve || "undefined"}, V=${Ce || "undefined"} for "${L}"`
        );
      } catch (ve) {
        t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${L}" (${e.type}): ${ve instanceof Error ? ve.message : String(ve)}`
        );
      }
    }
    const q = s.constraintHorizontal, X = s.constraintVertical;
    (u !== void 0 || A !== void 0) && (t.log(
      `  [ISSUE #4] "${L}" (${e.type}) - Final constraints: H=${q || "undefined"}, V=${X || "undefined"}`
    ), u !== void 0 && q !== u && t.warning(
      `  ⚠️ ISSUE #4: "${L}" constraintHorizontal mismatch! Expected: ${u}, Got: ${q || "undefined"}`
    ), A !== void 0 && X !== A && t.warning(
      `  ⚠️ ISSUE #4: "${L}" constraintVertical mismatch! Expected: ${A}, Got: ${X || "undefined"}`
    ), u !== void 0 && A !== void 0 && q === u && X === A && t.log(
      `  ✓ ISSUE #4: "${L}" constraints correctly set: H=${q}, V=${X}`
    ));
  } else {
    const N = e.constraintHorizontal || ((ee = e.constraints) == null ? void 0 : ee.horizontal), P = e.constraintVertical || ((ne = e.constraints) == null ? void 0 : ne.vertical);
    if ((N !== void 0 || P !== void 0) && (e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" ? t.log(
      `  [ISSUE #4] "${L}" (VECTOR) - Constraints already set earlier (skipping "no resize" path)`
    ) : t.log(
      `  [ISSUE #4] "${L}" (${e.type}) - Setting constraints (no resize): Expected H=${N || "undefined"}, V=${P || "undefined"}`
    )), e.type !== "VECTOR") {
      const u = e.constraintHorizontal !== void 0 || ((K = e.constraints) == null ? void 0 : K.horizontal) !== void 0, A = e.constraintVertical !== void 0 || ((ie = e.constraints) == null ? void 0 : ie.vertical) !== void 0;
      if (u || A) {
        const B = e.constraintHorizontal || ((W = e.constraints) == null ? void 0 : W.horizontal), G = e.constraintVertical || ((z = e.constraints) == null ? void 0 : z.vertical), M = s.constraints || {}, D = M.horizontal || "MIN", q = M.vertical || "MIN", X = B || D, oe = G || q;
        try {
          t.log(
            `  [ISSUE #4] Setting constraints for "${L}" (${e.type}) (no resize): H=${X} (from ${B || "current"}), V=${oe} (from ${G || "current"})`
          ), s.constraints = {
            horizontal: X,
            vertical: oe
          };
          const be = (R = s.constraints) == null ? void 0 : R.horizontal, he = (J = s.constraints) == null ? void 0 : J.vertical;
          be === X && he === oe ? t.log(
            `  [ISSUE #4] ✓ Constraints set successfully (no resize): H=${be}, V=${he} for "${L}"`
          ) : t.warning(
            `  [ISSUE #4] ⚠️ Constraints set but verification failed (no resize)! Expected H=${X}, V=${oe}, got H=${be || "undefined"}, V=${he || "undefined"} for "${L}"`
          );
        } catch (be) {
          t.warning(
            `  [ISSUE #4] ✗ Failed to set constraints for "${L}" (${e.type}) (no resize): ${be instanceof Error ? be.message : String(be)}`
          );
        }
      }
    }
    if (e.type !== "VECTOR" && e.type !== "BOOLEAN_OPERATION" && (N !== void 0 || P !== void 0)) {
      const u = (H = s.constraints) == null ? void 0 : H.horizontal, A = (te = s.constraints) == null ? void 0 : te.vertical;
      t.log(
        `  [ISSUE #4] "${L}" (${e.type}) - Final constraints (no resize): H=${u || "undefined"}, V=${A || "undefined"}`
      ), N !== void 0 && u !== N && t.warning(
        `  ⚠️ ISSUE #4: "${L}" constraintHorizontal mismatch! Expected: ${N}, Got: ${u || "undefined"}`
      ), P !== void 0 && A !== P && t.warning(
        `  ⚠️ ISSUE #4: "${L}" constraintVertical mismatch! Expected: ${P}, Got: ${A || "undefined"}`
      ), N !== void 0 && P !== void 0 && u === N && A === P && t.log(
        `  ✓ ISSUE #4: "${L}" constraints correctly set (no resize): H=${u}, V=${A}`
      );
    }
  }
  const E = e.boundVariables && typeof e.boundVariables == "object";
  if (e.visible !== void 0 && (s.visible = e.visible), e.locked !== void 0 && (s.locked = e.locked), e.opacity !== void 0 && (!E || !e.boundVariables.opacity) && (s.opacity = e.opacity), e.rotation !== void 0 && (!E || !e.boundVariables.rotation) && (s.rotation = e.rotation), e.blendMode !== void 0 && (!E || !e.boundVariables.blendMode) && (s.blendMode = e.blendMode), e.type !== "INSTANCE") {
    if (e.type === "VECTOR" && e.boundVariables && (t.log(
      `  DEBUG: VECTOR "${e.name || "Unnamed"}" (ID: ${((me = e.id) == null ? void 0 : me.substring(0, 8)) || "unknown"}...) has boundVariables: ${Object.keys(e.boundVariables).join(", ")}`
    ), e.boundVariables.fills && t.log(
      `  DEBUG:   boundVariables.fills: ${JSON.stringify(e.boundVariables.fills)}`
    )), e.fills !== void 0)
      try {
        let N = e.fills;
        const P = e.name || "Unnamed";
        if (Array.isArray(N))
          for (let u = 0; u < N.length; u++) {
            const A = N[u];
            A && typeof A == "object" && A.selectionColor !== void 0 && t.log(
              `  [ISSUE #2 DEBUG] "${P}" fill[${u}] has selectionColor: ${JSON.stringify(A.selectionColor)}`
            );
          }
        if (Array.isArray(N)) {
          const u = e.name || "Unnamed";
          for (let A = 0; A < N.length; A++) {
            const B = N[A];
            B && typeof B == "object" && B.selectionColor !== void 0 && t.warning(
              `  ⚠️ ISSUE #2: "${u}" fill[${A}] has selectionColor that will be preserved: ${JSON.stringify(B.selectionColor)}`
            );
          }
          N = N.map((A) => {
            if (A && typeof A == "object") {
              const B = le({}, A);
              return delete B.boundVariables, B;
            }
            return A;
          });
        }
        if (e.fills && Array.isArray(e.fills) && l) {
          if (e.type === "VECTOR") {
            t.log(
              `  DEBUG: VECTOR "${e.name || "Unnamed"}" has ${e.fills.length} fill(s)`
            );
            for (let G = 0; G < e.fills.length; G++) {
              const M = e.fills[G];
              if (M && typeof M == "object") {
                const D = M.boundVariables || M.bndVar;
                D ? t.log(
                  `  DEBUG:   fill[${G}] has boundVariables: ${JSON.stringify(D)}`
                ) : t.log(
                  `  DEBUG:   fill[${G}] has no boundVariables`
                );
              }
            }
          }
          const u = [];
          for (let G = 0; G < N.length; G++) {
            const M = N[G], D = e.fills[G];
            if (!D || typeof D != "object") {
              u.push(M);
              continue;
            }
            const q = D.boundVariables || D.bndVar;
            if (!q) {
              u.push(M);
              continue;
            }
            const X = le({}, M);
            X.boundVariables = {};
            for (const [oe, be] of Object.entries(q))
              if (e.type === "VECTOR" && t.log(
                `  DEBUG: Processing fill[${G}].${oe} on VECTOR "${s.name || "Unnamed"}": varInfo=${JSON.stringify(be)}`
              ), ze(be)) {
                const he = be._varRef;
                if (he !== void 0) {
                  if (e.type === "VECTOR") {
                    t.log(
                      `  DEBUG: Looking up variable reference ${he} in recognizedVariables (map has ${l.size} entries)`
                    );
                    const ve = Array.from(
                      l.keys()
                    ).slice(0, 10);
                    t.log(
                      `  DEBUG: Available variable references (first 10): ${ve.join(", ")}`
                    );
                    const Ce = l.has(String(he));
                    if (t.log(
                      `  DEBUG: Variable reference ${he} ${Ce ? "found" : "NOT FOUND"} in recognizedVariables`
                    ), !Ce) {
                      const De = Array.from(
                        l.keys()
                      ).sort((Vt, yn) => parseInt(Vt) - parseInt(yn));
                      t.log(
                        `  DEBUG: All available variable references: ${De.join(", ")}`
                      );
                    }
                  }
                  let ye = l.get(String(he));
                  ye || (e.type === "VECTOR" && t.log(
                    `  DEBUG: Variable ${he} not in recognizedVariables. variableTable=${!!o}, collectionTable=${!!i}, recognizedCollections=${!!b}`
                  ), o && i && b ? (t.log(
                    `  Variable reference ${he} not in recognizedVariables, attempting to resolve from variable table...`
                  ), ye = await no(
                    he,
                    o,
                    i,
                    b
                  ) || void 0, ye ? (l.set(String(he), ye), t.log(
                    `  ✓ Resolved variable ${ye.name} from variable table and added to recognizedVariables`
                  )) : t.warning(
                    `  Failed to resolve variable ${he} from variable table`
                  )) : e.type === "VECTOR" && t.warning(
                    `  Cannot resolve variable ${he} from table - missing required parameters`
                  )), ye ? (X.boundVariables[oe] = {
                    type: "VARIABLE_ALIAS",
                    id: ye.id
                  }, t.log(
                    `  ✓ Restored bound variable for fill[${G}].${oe} on "${s.name || "Unnamed"}" (${e.type}): variable ${ye.name} (ID: ${ye.id.substring(0, 8)}...)`
                  )) : t.warning(
                    `  Variable reference ${he} not found in recognizedVariables for fill[${G}].${oe} on "${s.name || "Unnamed"}"`
                  );
                } else
                  e.type === "VECTOR" && t.warning(
                    `  DEBUG: Variable reference ${he} is undefined for fill[${G}].${oe} on VECTOR "${s.name || "Unnamed"}"`
                  );
              } else
                e.type === "VECTOR" && t.warning(
                  `  DEBUG: fill[${G}].${oe} on VECTOR "${s.name || "Unnamed"}" is not a variable reference: ${JSON.stringify(be)}`
                );
            u.push(X);
          }
          s.fills = u, t.log(
            `  ✓ Set fills with boundVariables on "${s.name || "Unnamed"}" (${e.type})`
          );
          const A = s.fills, B = e.name || "Unnamed";
          if (Array.isArray(A))
            for (let G = 0; G < A.length; G++) {
              const M = A[G];
              M && typeof M == "object" && M.selectionColor !== void 0 && t.warning(
                `  ⚠️ ISSUE #2: "${B}" fill[${G}] has selectionColor AFTER setting with boundVariables: ${JSON.stringify(M.selectionColor)}`
              );
            }
        } else {
          s.fills = N;
          const u = s.fills, A = e.name || "Unnamed";
          if (Array.isArray(u))
            for (let B = 0; B < u.length; B++) {
              const G = u[B];
              G && typeof G == "object" && G.selectionColor !== void 0 && t.warning(
                `  ⚠️ ISSUE #2: "${A}" fill[${B}] has selectionColor AFTER setting: ${JSON.stringify(G.selectionColor)}`
              );
            }
        }
        e.boundVariables && Object.keys(e.boundVariables).length > 0 && !e.boundVariables.fills && t.log(
          `  Node "${s.name || "Unnamed"}" (${e.type}) has boundVariables but not for fills: ${Object.keys(e.boundVariables).join(", ")}`
        );
      } catch (N) {
        console.log("Error setting fills:", N);
      }
    else if (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "GROUP")
      try {
        s.fills = [];
      } catch (N) {
        console.log("Error clearing fills:", N);
      }
  }
  if (e.strokes !== void 0)
    try {
      e.strokes.length > 0 ? s.strokes = e.strokes : s.strokes = [];
    } catch (N) {
      console.log("Error setting strokes:", N);
    }
  else if (e.type === "VECTOR")
    try {
      s.strokes = [];
    } catch (N) {
    }
  const k = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.strokeWeight || e.boundVariables.strokeAlign);
  e.strokeWeight !== void 0 ? (!k || !e.boundVariables.strokeWeight) && (s.strokeWeight = e.strokeWeight) : e.type === "VECTOR" && (e.strokes === void 0 || e.strokes.length === 0) && (!k || !e.boundVariables.strokeWeight) && (s.strokeWeight = 0), e.strokeAlign !== void 0 && (!k || !e.boundVariables.strokeAlign) && (s.strokeAlign = e.strokeAlign);
  const V = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.cornerRadius || e.boundVariables.topLeftRadius || e.boundVariables.topRightRadius || e.boundVariables.bottomLeftRadius || e.boundVariables.bottomRightRadius);
  if (e.cornerRadius !== void 0 && (!V || !e.boundVariables.cornerRadius) && (s.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (s.effects = e.effects), e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") {
    if (e.layoutMode !== void 0 && (["NONE", "HORIZONTAL", "VERTICAL"].includes(e.layoutMode) ? s.layoutMode = e.layoutMode : t.warning(
      `Invalid layoutMode value "${e.layoutMode}" for node "${e.name || "Unnamed"}", skipping layoutMode setting`
    )), e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.boundVariables && l) {
      const P = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ];
      for (const u of P) {
        const A = e.boundVariables[u];
        if (A && ze(A)) {
          const B = A._varRef;
          if (B !== void 0) {
            const G = l.get(String(B));
            if (G) {
              const M = {
                type: "VARIABLE_ALIAS",
                id: G.id
              };
              s.boundVariables || (s.boundVariables = {});
              const D = s[u], q = (fe = s.boundVariables) == null ? void 0 : fe[u];
              t.log(
                `  DEBUG: Attempting to set bound variable for ${u} on "${e.name || "Unnamed"}": current value=${D}, current boundVar=${JSON.stringify(q)}`
              );
              try {
                s.setBoundVariable(u, null);
              } catch (oe) {
              }
              try {
                s.setBoundVariable(u, G);
                const oe = (ce = s.boundVariables) == null ? void 0 : ce[u];
                t.log(
                  `  DEBUG: Immediately after setting ${u} bound variable: ${JSON.stringify(oe)}`
                );
              } catch (oe) {
                t.warning(
                  `  Error setting bound variable for ${u}: ${oe instanceof Error ? oe.message : String(oe)}`
                );
              }
              const X = (ae = s.boundVariables) == null ? void 0 : ae[u];
              if (u === "itemSpacing") {
                const oe = s[u], be = (se = s.boundVariables) == null ? void 0 : se[u];
                t.log(
                  `  [ISSUE #1 DEBUG] itemSpacing variable binding for "${e.name || "Unnamed"}":`
                ), t.log(`    - Expected variable ref: ${B}`), t.log(
                  `    - Final itemSpacing value: ${oe}`
                ), t.log(
                  `    - Final boundVariable: ${JSON.stringify(be)}`
                ), t.log(
                  `    - Variable found: ${G ? `Yes (ID: ${G.id})` : "No"}`
                ), !X || !X.id ? t.warning(
                  "    ⚠️ ISSUE #1: itemSpacing variable binding FAILED - boundVariable not set correctly!"
                ) : t.log(
                  "    ✓ itemSpacing variable binding SUCCESS"
                );
              }
              X && typeof X == "object" && X.type === "VARIABLE_ALIAS" && X.id === G.id ? t.log(
                `  ✓ Set bound variable for ${u} on "${e.name || "Unnamed"}" (${e.type}): variable ${G.name} (ID: ${G.id.substring(0, 8)}...)`
              ) : t.warning(
                `  Failed to set bound variable for ${u} on "${e.name || "Unnamed"}" - verification failed. Expected: ${JSON.stringify(M)}, Got: ${JSON.stringify(X)}`
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
    ), s.itemSpacing = e.itemSpacing, t.log(
      `  ✓ Set itemSpacing to ${s.itemSpacing} (verified)`
    )) : (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && t.log(
      `  DEBUG: Not setting itemSpacing for "${e.name || "Unnamed"}": layoutMode=${e.layoutMode}, itemSpacing=${e.itemSpacing}`
    ), e.layoutWrap !== void 0 && (s.layoutWrap = e.layoutWrap), e.primaryAxisSizingMode !== void 0 ? s.primaryAxisSizingMode = e.primaryAxisSizingMode : s.primaryAxisSizingMode = "AUTO", e.counterAxisSizingMode !== void 0 ? s.counterAxisSizingMode = e.counterAxisSizingMode : s.counterAxisSizingMode = "AUTO", e.primaryAxisAlignItems !== void 0 && (s.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (s.counterAxisAlignItems = e.counterAxisAlignItems);
    const N = e.boundVariables && typeof e.boundVariables == "object";
    if (N) {
      const P = [
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing"
      ].filter((u) => e.boundVariables[u]);
      P.length > 0 && t.log(
        `  DEBUG: Node "${e.name || "Unnamed"}" (${e.type}) has bound variables for: ${P.join(", ")}`
      );
    }
    if (e.paddingLeft !== void 0 && (!N || !e.boundVariables.paddingLeft) && (s.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (!N || !e.boundVariables.paddingRight) && (s.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (!N || !e.boundVariables.paddingTop) && (s.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (!N || !e.boundVariables.paddingBottom) && (s.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && s.layoutMode !== void 0 && s.layoutMode !== "NONE") {
      const P = ((de = s.boundVariables) == null ? void 0 : de.itemSpacing) !== void 0;
      !P && (!N || !e.boundVariables.itemSpacing) ? s.itemSpacing !== e.itemSpacing && (t.log(
        `  Setting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (late setting)`
      ), s.itemSpacing = e.itemSpacing) : P && t.log(
        `  Skipping late setting of itemSpacing for "${e.name || "Unnamed"}" - already bound to variable`
      );
    }
    e.counterAxisSpacing !== void 0 && (!N || !e.boundVariables.counterAxisSpacing) && s.layoutMode !== void 0 && s.layoutMode !== "NONE" && (s.counterAxisSpacing = e.counterAxisSpacing), e.layoutGrow !== void 0 && (s.layoutGrow = e.layoutGrow);
  }
  if ((e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION" || e.type === "LINE") && (e.strokeCap !== void 0 && (s.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (s.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (s.dashPattern = e.dashPattern), e.type === "VECTOR" || e.type === "BOOLEAN_OPERATION")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: A } = await Promise.resolve().then(() => Gn), B = e.fillGeometry.map((G) => {
          const M = G.data;
          return {
            data: A(M),
            windingRule: G.windingRule || G.windRule || "NONZERO"
          };
        });
        for (let G = 0; G < e.fillGeometry.length; G++) {
          const M = e.fillGeometry[G].data, D = B[G].data;
          M !== D && t.log(
            `  Normalized path ${G + 1} for "${e.name || "Unnamed"}": ${M.substring(0, 50)}... -> ${D.substring(0, 50)}...`
          );
        }
        s.vectorPaths = B, t.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${B.length} path(s))`
        );
      } catch (A) {
        t.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        s.strokeGeometry = e.strokeGeometry;
      } catch (A) {
        t.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    const N = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.width || e.boundVariables.height);
    if (e.width !== void 0 && e.height !== void 0 && !N)
      try {
        s.resize(e.width, e.height), t.log(
          `  Set size for VECTOR "${e.name || "Unnamed"}" to ${e.width}x${e.height}`
        );
      } catch (A) {
        t.warning(
          `Error setting size for VECTOR "${e.name || "Unnamed"}": ${A}`
        );
      }
    const P = e.constraintHorizontal || ((ue = e.constraints) == null ? void 0 : ue.horizontal), u = e.constraintVertical || ((Se = e.constraints) == null ? void 0 : Se.vertical);
    if (P !== void 0 || u !== void 0) {
      t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Setting constraints immediately after size: Expected H=${P || "undefined"}, V=${u || "undefined"}`
      );
      const A = s.constraints || {}, B = A.horizontal || "MIN", G = A.vertical || "MIN", M = P || B, D = u || G;
      try {
        s.constraints = {
          horizontal: M,
          vertical: D
        };
        const oe = (xe = s.constraints) == null ? void 0 : xe.horizontal, be = (je = s.constraints) == null ? void 0 : je.vertical;
        oe === M && be === D ? t.log(
          `  [ISSUE #4] ✓ Constraints set successfully for "${e.name || "Unnamed"}" (VECTOR): H=${oe}, V=${be}`
        ) : t.warning(
          `  [ISSUE #4] ⚠️ Constraints set but verification failed! Expected H=${M}, V=${D}, got H=${oe || "undefined"}, V=${be || "undefined"} for "${e.name || "Unnamed"}"`
        );
      } catch (oe) {
        t.warning(
          `  [ISSUE #4] ✗ Failed to set constraints for "${e.name || "Unnamed"}" (VECTOR): ${oe instanceof Error ? oe.message : String(oe)}`
        );
      }
      const q = (nt = s.constraints) == null ? void 0 : nt.horizontal, X = (Je = s.constraints) == null ? void 0 : Je.vertical;
      t.log(
        `  [ISSUE #4] "${e.name || "Unnamed"}" (VECTOR) - Final constraints after immediate setting: H=${q || "undefined"}, V=${X || "undefined"}`
      ), P !== void 0 && q !== P && t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintHorizontal mismatch! Expected: ${P}, Got: ${q || "undefined"}`
      ), u !== void 0 && X !== u && t.warning(
        `  ⚠️ ISSUE #4: "${e.name || "Unnamed"}" constraintVertical mismatch! Expected: ${u}, Got: ${X || "undefined"}`
      ), P !== void 0 && u !== void 0 && q === P && X === u && t.log(
        `  ✓ ISSUE #4: "${e.name || "Unnamed"}" (VECTOR) constraints correctly set: H=${q}, V=${X}`
      );
    }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      let N = !1;
      if (t.log(
        `  Processing TEXT node "${e.name || "Unnamed"}": has _styleRef=${e._styleRef !== void 0}, has styleMapping=${I != null}`
      ), e._styleRef !== void 0)
        if (!I)
          t.warning(
            `Text node "${e.name || "Unnamed"}" has _styleRef but styles table was not imported. Using individual properties instead.`
          );
        else {
          const P = I.get(e._styleRef);
          if (P && P.type === "TEXT")
            try {
              const u = P;
              t.log(
                `  Applying text style "${P.name}" to text node "${e.name || "Unnamed"}" (font: ${u.fontName.family} ${u.fontName.style})`
              );
              try {
                await figma.loadFontAsync(u.fontName), t.log(
                  `  ✓ Loaded font "${u.fontName.family} ${u.fontName.style}" for style "${P.name}"`
                );
              } catch (A) {
                t.warning(
                  `  Could not load font "${u.fontName.family} ${u.fontName.style}" for style "${P.name}": ${A}. Trying fallback font.`
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
              await s.setTextStyleIdAsync(P.id), t.log(
                `  ✓ Set textStyleId to "${P.id}" for style "${P.name}"`
              ), s.characters = e.characters, t.log(
                `  ✓ Set characters: "${e.characters.substring(0, 50)}${e.characters.length > 50 ? "..." : ""}"`
              ), N = !0, e.textAlignHorizontal !== void 0 && (s.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (s.textAlignVertical = e.textAlignVertical), e.textAutoResize !== void 0 && (s.textAutoResize = e.textAutoResize), e.listOptions !== void 0 && (s.listOptions = e.listOptions);
            } catch (u) {
              t.warning(
                `Failed to apply style "${P.name}" on text node "${e.name || "Unnamed"}": ${u}. Falling back to individual properties.`
              );
            }
          else
            t.warning(
              `Text node "${e.name || "Unnamed"}" has invalid _styleRef (${e._styleRef}). Using individual properties instead.`
            );
        }
      if (!N) {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), s.fontName = e.fontName;
          } catch (u) {
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
        const P = e.boundVariables && typeof e.boundVariables == "object" && (e.boundVariables.fontSize || e.boundVariables.letterSpacing || e.boundVariables.lineHeight);
        e.fontSize !== void 0 && (!P || !e.boundVariables.fontSize) && (s.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (s.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (s.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (!P || !e.boundVariables.letterSpacing) && (s.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (!P || !e.boundVariables.lineHeight) && (s.lineHeight = e.lineHeight), e.textCase !== void 0 && (s.textCase = e.textCase), e.textDecoration !== void 0 && (s.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (s.textAutoResize = e.textAutoResize);
      }
    } catch (N) {
      console.log("Error setting text properties: " + N);
      try {
        s.characters = e.characters;
      } catch (P) {
        console.log("Could not set text characters: " + P);
      }
    }
  if (e.selectionColor !== void 0) {
    const N = e.name || "Unnamed";
    if (e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.selectionColor !== void 0)
      t.log(
        `  [ISSUE #2] Skipping direct selectionColor value for "${N}" - will be set via bound variable`
      );
    else
      try {
        s.selectionColor = e.selectionColor, t.log(
          `  [ISSUE #2] Set selectionColor (direct value) on "${N}": ${JSON.stringify(e.selectionColor)}`
        );
      } catch (u) {
        t.warning(
          `  [ISSUE #2] Failed to set selectionColor on "${N}": ${u instanceof Error ? u.message : String(u)}`
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
    for (const [P, u] of Object.entries(
      e.boundVariables
    ))
      if (P !== "fills" && !N.includes(P)) {
        if (P === "selectionColor") {
          const A = e.name || "Unnamed";
          t.log(
            `  [ISSUE #2] Restoring bound variable for selectionColor on "${A}"`
          );
        }
        if (ze(u) && o && l) {
          const A = u._varRef;
          if (A !== void 0) {
            const B = l.get(String(A));
            if (B)
              try {
                const G = {
                  type: "VARIABLE_ALIAS",
                  id: B.id
                };
                s.boundVariables || (s.boundVariables = {});
                const M = s[P];
                M !== void 0 && s.boundVariables[P] === void 0 && t.warning(
                  `  Property ${P} has direct value ${M} which may prevent bound variable from being set`
                ), s.boundVariables[P] = G;
                const q = (T = s.boundVariables) == null ? void 0 : T[P];
                if (q && typeof q == "object" && q.type === "VARIABLE_ALIAS" && q.id === B.id)
                  t.log(
                    `  ✓ Set bound variable for ${P} on "${e.name || "Unnamed"}" (${e.type}): variable ${B.name} (ID: ${B.id.substring(0, 8)}...)`
                  );
                else {
                  const X = (pe = s.boundVariables) == null ? void 0 : pe[P];
                  t.warning(
                    `  Failed to set bound variable for ${P} on "${e.name || "Unnamed"}" - bound variable not persisted. Property value: ${M}, Expected: ${JSON.stringify(G)}, Got: ${JSON.stringify(X)}`
                  );
                }
              } catch (G) {
                t.warning(
                  `  Error setting bound variable for ${P} on "${e.name || "Unnamed"}": ${G}`
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
  if (e.boundVariables && l && (e.boundVariables.width || e.boundVariables.height)) {
    const N = e.boundVariables.width, P = e.boundVariables.height;
    if (N && ze(N)) {
      const u = N._varRef;
      if (u !== void 0) {
        const A = l.get(String(u));
        if (A) {
          const B = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.width = B;
        }
      }
    }
    if (P && ze(P)) {
      const u = P._varRef;
      if (u !== void 0) {
        const A = l.get(String(u));
        if (A) {
          const B = {
            type: "VARIABLE_ALIAS",
            id: A.id
          };
          s.boundVariables || (s.boundVariables = {}), s.boundVariables.height = B;
        }
      }
    }
  }
  const O = e.id && r && r.has(e.id) && s.type === "COMPONENT" && s.children && s.children.length > 0;
  if (e.children && Array.isArray(e.children) && s.type !== "INSTANCE" && !O) {
    const N = (u) => {
      const A = [];
      for (const B of u)
        B._truncated || (B.type === "COMPONENT" ? (A.push(B), B.children && Array.isArray(B.children) && A.push(...N(B.children))) : B.children && Array.isArray(B.children) && A.push(...N(B.children)));
      return A;
    };
    for (const u of e.children) {
      if (u._truncated) {
        console.log(
          `Skipping truncated children: ${u._reason || "Unknown"}`
        );
        continue;
      }
      u.type;
    }
    const P = N(e.children);
    t.log(
      `  First pass: Creating ${P.length} COMPONENT node(s) (without children)...`
    );
    for (const u of P)
      t.log(
        `  Collected COMPONENT "${u.name || "Unnamed"}" (ID: ${u.id ? u.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const u of P)
      if (u.id && r && !r.has(u.id)) {
        const A = figma.createComponent();
        if (u.name !== void 0 && (A.name = u.name || "Unnamed Node"), u.componentPropertyDefinitions) {
          const B = u.componentPropertyDefinitions;
          let G = 0, M = 0;
          for (const [D, q] of Object.entries(B))
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
              }[q.type];
              if (!oe) {
                t.warning(
                  `  Unknown property type ${q.type} for property "${D}" in component "${u.name || "Unnamed"}"`
                ), M++;
                continue;
              }
              const be = q.defaultValue, he = D.split("#")[0];
              A.addComponentProperty(
                he,
                oe,
                be
              ), G++;
            } catch (X) {
              t.warning(
                `  Failed to add component property "${D}" to "${u.name || "Unnamed"}" in first pass: ${X}`
              ), M++;
            }
          G > 0 && t.log(
            `  Added ${G} component property definition(s) to "${u.name || "Unnamed"}" in first pass${M > 0 ? ` (${M} failed)` : ""}`
          );
        }
        r.set(u.id, A), t.log(
          `  Created COMPONENT "${u.name || "Unnamed"}" (ID: ${u.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const u of e.children) {
      if (u._truncated)
        continue;
      const A = s && S && S.has(s.id) ? s.id : v, B = await Xe(
        u,
        s,
        o,
        i,
        a,
        l,
        r,
        g,
        d,
        m,
        // Pass deferredInstances through for recursive calls
        e,
        // parentNodeData - pass the parent's nodeData so children can check for auto-layout
        b,
        S,
        // Pass placeholderFrameIds through for recursive calls
        A,
        // Pass currentPlaceholderId down (or placeholder ID if newNode is a placeholder)
        I
        // Pass styleMapping to apply styles
      );
      if (B && B.parent !== s) {
        if (B.parent && typeof B.parent.removeChild == "function")
          try {
            B.parent.removeChild(B);
          } catch (G) {
            t.warning(
              `Failed to remove child "${B.name || "Unnamed"}" from parent "${B.parent.name || "Unnamed"}": ${G}`
            );
          }
        s.appendChild(B);
      }
    }
  }
  if (n && s.parent !== n) {
    if (s.parent && typeof s.parent.removeChild == "function")
      try {
        s.parent.removeChild(s);
      } catch (N) {
        t.warning(
          `Failed to remove node "${s.name || "Unnamed"}" from parent "${s.parent.name || "Unnamed"}": ${N}`
        );
      }
    n.appendChild(s);
  }
  if ((s.type === "FRAME" || s.type === "COMPONENT" || s.type === "INSTANCE") && e.layoutMode !== void 0 && e.layoutMode !== "NONE" && e.itemSpacing !== void 0) {
    const N = ((Z = s.boundVariables) == null ? void 0 : Z.itemSpacing) !== void 0, P = e.boundVariables && typeof e.boundVariables == "object" && e.boundVariables.itemSpacing;
    if (N)
      t.log(
        `  FINAL CHECK: itemSpacing is bound to variable for "${e.name || "Unnamed"}" - skipping direct value fix`
      );
    else if (P)
      t.warning(
        `  FINAL CHECK: itemSpacing should be bound to variable for "${e.name || "Unnamed"}" but binding is missing!`
      );
    else {
      const u = s.itemSpacing;
      u !== e.itemSpacing ? (t.log(
        `  FINAL FIX: Resetting itemSpacing to ${e.itemSpacing} for "${e.name || "Unnamed"}" (was ${u})`
      ), s.itemSpacing = e.itemSpacing, t.log(
        `  FINAL FIX: Verified itemSpacing is now ${s.itemSpacing}`
      )) : t.log(
        `  FINAL CHECK: itemSpacing is already correct (${u}) for "${e.name || "Unnamed"}"`
      );
    }
  }
  return s;
}
async function co(e, n, o) {
  let i = 0, a = 0, l = 0;
  const r = (d) => {
    const m = [];
    if (d.type === "INSTANCE" && m.push(d), "children" in d && d.children)
      for (const y of d.children)
        m.push(...r(y));
    return m;
  }, g = r(e);
  t.log(
    `  Found ${g.length} instance(s) to process for variant properties`
  );
  for (const d of g)
    try {
      const m = await d.getMainComponentAsync();
      if (!m) {
        a++;
        continue;
      }
      const y = n.getSerializedTable();
      let b = null, S;
      if (o._instanceTableMap ? (S = o._instanceTableMap.get(
        d.id
      ), S !== void 0 ? (b = y[S], t.log(
        `  Found instance table index ${S} for instance "${d.name}" (ID: ${d.id.substring(0, 8)}...)`
      )) : t.log(
        `  No instance table index mapping found for instance "${d.name}" (ID: ${d.id.substring(0, 8)}...), using fallback matching`
      )) : t.log(
        `  No instance table map found, using fallback matching for instance "${d.name}"`
      ), !b) {
        for (const [I, s] of Object.entries(y))
          if (s.instanceType === "internal" && s.componentNodeId && o.has(s.componentNodeId)) {
            const C = o.get(s.componentNodeId);
            if (C && C.id === m.id) {
              b = s, t.log(
                `  Matched instance "${d.name}" to instance table entry ${I} by component (less precise)`
              );
              break;
            }
          }
      }
      if (!b) {
        t.log(
          `  No matching entry found for instance "${d.name}" (main component: ${m.name}, ID: ${m.id.substring(0, 8)}...)`
        ), a++;
        continue;
      }
      if (!b.variantProperties) {
        t.log(
          `  Instance table entry for "${d.name}" has no variant properties`
        ), a++;
        continue;
      }
      t.log(
        `  Instance "${d.name}" matched to entry with variant properties: ${JSON.stringify(b.variantProperties)}`
      );
      let v = null;
      if (m.parent && m.parent.type === "COMPONENT_SET" && (v = m.parent.componentPropertyDefinitions), v) {
        const I = {};
        for (const [s, C] of Object.entries(
          b.variantProperties
        )) {
          const $ = s.split("#")[0];
          v[$] && (I[$] = C);
        }
        Object.keys(I).length > 0 ? (d.setProperties(I), i++, t.log(
          `  ✓ Set variant properties on instance "${d.name}": ${JSON.stringify(I)}`
        )) : a++;
      } else
        a++;
    } catch (m) {
      l++, t.warning(
        `  Failed to set variant properties on instance "${d.name}": ${m}`
      );
    }
  t.log(
    `  Variant properties set: ${i} processed, ${a} skipped, ${l} errors`
  );
}
async function Bt(e) {
  await figma.loadAllPagesAsync();
  const n = figma.root.children, o = new Set(n.map((l) => l.name));
  if (!o.has(e))
    return e;
  let i = 1, a = `${e}_${i}`;
  for (; o.has(a); )
    i++, a = `${e}_${i}`;
  return a;
}
async function go(e) {
  const n = await figma.variables.getLocalVariableCollectionsAsync(), o = new Set(n.map((l) => l.name));
  if (!o.has(e))
    return e;
  let i = 1, a = `${e}_${i}`;
  for (; o.has(a); )
    i++, a = `${e}_${i}`;
  return a;
}
async function fo(e, n) {
  const o = /* @__PURE__ */ new Set();
  for (const l of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(l);
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
  const n = await figma.variables.getLocalVariableCollectionsAsync(), o = Te(e.collectionName);
  if (Ge(e.collectionName)) {
    for (const i of n)
      if (Te(i.name) === o)
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
        ke
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
function Gt(e) {
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
      version: n.version
    }
  };
}
function yt(e) {
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
      collectionTable: it.fromTable(
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
  const o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), l = e.getTable();
  for (const [r, g] of Object.entries(l)) {
    if (g.isLocal === !1) {
      t.log(
        `Skipping remote collection: "${g.collectionName}" (index ${r})`
      );
      continue;
    }
    const d = Te(g.collectionName), m = n == null ? void 0 : n.get(d);
    if (m) {
      t.log(
        `✓ Using pre-created collection: "${d}" (index ${r})`
      ), o.set(r, m);
      continue;
    }
    const y = await po(g);
    y.matchType === "recognized" ? (t.log(
      `✓ Recognized collection by GUID: "${g.collectionName}" (index ${r})`
    ), o.set(r, y.collection)) : y.matchType === "potential" ? (t.log(
      `? Potential match by name: "${g.collectionName}" (index ${r})`
    ), i.set(r, {
      entry: g,
      collection: y.collection
    })) : (t.log(
      `✗ No match found for collection: "${g.collectionName}" (index ${r}) - will create new`
    ), a.set(r, g));
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
      for (const [a, { entry: l, collection: r }] of e.entries()) {
        const g = Te(
          l.collectionName
        ).toLowerCase();
        let d = !1;
        g === "tokens" || g === "token" ? d = i.tokens === "existing" : g === "theme" || g === "themes" ? d = i.theme === "existing" : (g === "layer" || g === "layers") && (d = i.layers === "existing");
        const m = Ge(l.collectionName) ? Te(l.collectionName) : r.name;
        d ? (t.log(
          `✓ Wizard selection: Using existing collection "${m}" (index ${a})`
        ), n.set(a, r), await Ke(r, l.modes), t.log(
          `  ✓ Ensured modes for collection "${m}" (${l.modes.length} mode(s))`
        )) : (t.log(
          `✗ Wizard selection: Will create new collection for "${l.collectionName}" (index ${a})`
        ), o.set(a, l));
      }
      return;
    }
    t.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [a, { entry: l, collection: r }] of e.entries())
      try {
        const g = Ge(l.collectionName) ? Te(l.collectionName) : r.name, d = `Found existing "${g}" variable collection. Should I use it?`;
        t.log(
          `Prompting user about potential match: "${g}"`
        ), await tt.prompt(d, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), t.log(
          `✓ User confirmed: Using existing collection "${g}" (index ${a})`
        ), n.set(a, r), await Ke(r, l.modes), t.log(
          `  ✓ Ensured modes for collection "${g}" (${l.modes.length} mode(s))`
        );
      } catch (g) {
        t.log(
          `✗ User rejected: Will create new collection for "${l.collectionName}" (index ${a})`
        ), o.set(a, l);
      }
  }
}
async function ho(e, n, o) {
  if (e.size === 0)
    return;
  t.log("Ensuring modes exist for recognized collections...");
  const i = n.getTable();
  for (const [a, l] of e.entries()) {
    const r = i[a];
    r && (o.has(a) || (await Ke(l, r.modes), t.log(
      `  ✓ Ensured modes for collection "${l.name}" (${r.modes.length} mode(s))`
    )));
  }
}
async function yo(e, n, o, i) {
  if (e.size !== 0) {
    t.log(
      `Processing ${e.size} collection(s) to create...`
    );
    for (const [a, l] of e.entries()) {
      const r = Te(l.collectionName), g = i == null ? void 0 : i.get(r);
      if (g) {
        t.log(
          `Reusing pre-created collection: "${r}" (index ${a}, id: ${g.id.substring(0, 8)}...)`
        ), n.set(a, g), await Ke(g, l.modes), o.push(g);
        continue;
      }
      const d = await go(r);
      d !== r ? t.log(
        `Creating collection: "${d}" (normalized: "${r}" - name conflict resolved)`
      ) : t.log(`Creating collection: "${d}"`);
      const m = figma.variables.createVariableCollection(d);
      o.push(m);
      let y;
      if (Ge(l.collectionName)) {
        const b = ft(l.collectionName);
        b && (y = b);
      } else l.collectionGuid && (y = l.collectionGuid);
      y && (m.setSharedPluginData(
        "recursica",
        ke,
        y
      ), t.log(`  Stored GUID: ${y.substring(0, 8)}...`)), await Ke(m, l.modes), t.log(
        `  ✓ Created collection "${d}" with ${l.modes.length} mode(s)`
      ), n.set(a, m);
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
      variableTable: rt.fromTable(e.variables)
    };
  } catch (n) {
    return {
      success: !1,
      error: `Failed to load variables table: ${n instanceof Error ? n.message : "Unknown error"}`
    };
  }
}
async function sn(e, n, o, i) {
  const a = /* @__PURE__ */ new Map(), l = [], r = new Set(
    i.map((b) => b.id)
  );
  t.log("Matching and creating variables in collections...");
  const g = e.getTable(), d = /* @__PURE__ */ new Map();
  for (const [b, S] of Object.entries(g)) {
    if (S._colRef === void 0)
      continue;
    const v = o.get(String(S._colRef));
    if (!v)
      continue;
    d.has(v.id) || d.set(v.id, {
      collectionName: v.name,
      existing: 0,
      created: 0
    });
    const I = d.get(v.id), s = r.has(
      v.id
    );
    let C;
    typeof S.variableType == "number" ? C = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[S.variableType] || String(S.variableType) : C = S.variableType;
    const $ = await Ot(
      v,
      S.variableName
    );
    if ($)
      if (on($, C))
        a.set(b, $), I.existing++;
      else {
        t.warning(
          `Type mismatch for variable "${S.variableName}" in collection "${v.name}": expected ${C}, found ${$.resolvedType}. Creating new variable with incremented name.`
        );
        const c = await fo(
          v,
          S.variableName
        ), F = await wt(
          Ne(le({}, S), {
            variableName: c,
            variableType: C
          }),
          v,
          e,
          n
        );
        s || l.push(F), a.set(b, F), I.created++;
      }
    else {
      const c = await wt(
        Ne(le({}, S), {
          variableType: C
        }),
        v,
        e,
        n
      );
      s || l.push(c), a.set(b, c), I.created++;
    }
  }
  t.log("Variable processing complete:");
  for (const b of d.values())
    t.log(
      `  "${b.collectionName}": ${b.existing} existing, ${b.created} created`
    );
  t.log("Final verification: Reading back all COLOR variables...");
  let m = 0, y = 0;
  for (const b of l)
    if (b.resolvedType === "COLOR") {
      const S = await figma.variables.getVariableCollectionByIdAsync(
        b.variableCollectionId
      );
      if (!S) {
        t.warning(
          `  ⚠️ Variable "${b.name}" has no variableCollection (ID: ${b.variableCollectionId})`
        );
        continue;
      }
      const v = S.modes;
      if (!v || v.length === 0) {
        t.warning(
          `  ⚠️ Variable "${b.name}" collection has no modes`
        );
        continue;
      }
      for (const I of v) {
        const s = b.valuesByMode[I.modeId];
        if (s && typeof s == "object" && "r" in s) {
          const C = s;
          Math.abs(C.r - 1) < 0.01 && Math.abs(C.g - 1) < 0.01 && Math.abs(C.b - 1) < 0.01 ? (y++, t.warning(
            `  ⚠️ Variable "${b.name}" mode "${I.name}" is WHITE: r=${C.r.toFixed(3)}, g=${C.g.toFixed(3)}, b=${C.b.toFixed(3)}`
          )) : (m++, t.log(
            `  ✓ Variable "${b.name}" mode "${I.name}" has color: r=${C.r.toFixed(3)}, g=${C.g.toFixed(3)}, b=${C.b.toFixed(3)}`
          ));
        } else s && typeof s == "object" && "type" in s || t.warning(
          `  ⚠️ Variable "${b.name}" mode "${I.name}" has unexpected value type: ${JSON.stringify(s)}`
        );
      }
    }
  return t.log(
    `Final verification complete: ${m} color variables verified, ${y} white variables found`
  ), {
    recognizedVariables: a,
    newlyCreatedVariables: l
  };
}
function bo(e) {
  if (!e.instances)
    return null;
  try {
    return at.fromTable(e.instances);
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
function bt(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = $o(e.type));
  const n = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (n && (n === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const o of e.children)
      bt(o);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function vo(e, n) {
  const o = /* @__PURE__ */ new Set();
  for (const l of e.children)
    (l.type === "FRAME" || l.type === "COMPONENT") && o.add(l.name);
  if (!o.has(n))
    return n;
  let i = 1, a = `${n}_${i}`;
  for (; o.has(a); )
    i++, a = `${n}_${i}`;
  return a;
}
async function So(e, n, o, i, a, l = "", r = null) {
  var C;
  const g = e.getSerializedTable(), d = Object.values(g).filter(
    ($) => $.instanceType === "remote"
  ), m = /* @__PURE__ */ new Map(), y = [];
  if (d.length === 0)
    return t.log("No remote instances found"), { remoteComponentMap: m, dependentComponents: y };
  t.log(
    `Processing ${d.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  const b = figma.root.children, S = l ? `${l} REMOTES` : "REMOTES";
  let v = b.find(
    ($) => $.name === "REMOTES" || $.name === S
  );
  if (v ? (t.log("Found existing REMOTES page"), l && !v.name.startsWith(l) && (v.name = S)) : (v = figma.createPage(), v.name = S, t.log("Created REMOTES page")), d.length > 0 && t.log("Marked REMOTES page as under review"), !v.children.some(
    ($) => $.type === "FRAME" && $.name === "Title"
  )) {
    const $ = { family: "Inter", style: "Bold" }, c = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync($), await figma.loadFontAsync(c);
    const F = figma.createFrame();
    F.name = "Title", F.layoutMode = "VERTICAL", F.paddingTop = 20, F.paddingBottom = 20, F.paddingLeft = 20, F.paddingRight = 20, F.fills = [];
    const _ = figma.createText();
    _.fontName = $, _.characters = "REMOTE INSTANCES", _.fontSize = 24, _.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], F.appendChild(_);
    const L = figma.createText();
    L.fontName = c, L.characters = "These are remotely connected component instances found in our different component pages.", L.fontSize = 14, L.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], F.appendChild(L), v.appendChild(F), t.log("Created title and description on REMOTES page");
  }
  const s = /* @__PURE__ */ new Map();
  for (const [$, c] of Object.entries(g)) {
    if (c.instanceType !== "remote")
      continue;
    const F = parseInt($, 10);
    if (t.log(
      `Processing remote instance ${F}: "${c.componentName}"`
    ), !c.structure) {
      t.warning(
        `Remote instance "${c.componentName}" missing structure data, skipping`
      );
      continue;
    }
    bt(c.structure);
    const _ = c.structure.children !== void 0, L = c.structure.child !== void 0, E = c.structure.children ? c.structure.children.length : c.structure.child ? c.structure.child.length : 0;
    t.log(
      `  Structure type: ${c.structure.type || "unknown"}, has children: ${E} (children key: ${_}, child key: ${L})`
    );
    let k = c.componentName;
    if (c.path && c.path.length > 0) {
      const O = c.path.filter((p) => p !== "").join(" / ");
      O && (k = `${O} / ${c.componentName}`);
    }
    const V = await vo(
      v,
      k
    );
    V !== k && t.log(
      `Component name conflict: "${k}" -> "${V}"`
    );
    try {
      if (c.structure.type !== "COMPONENT") {
        t.warning(
          `Remote instance "${c.componentName}" structure is not a COMPONENT (type: ${c.structure.type}), creating frame fallback`
        );
        const p = figma.createFrame();
        p.name = V;
        const f = await Xe(
          c.structure,
          p,
          n,
          o,
          null,
          i,
          s,
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
          `✓ Created remote instance frame fallback: "${V}"`
        )) : p.remove();
        continue;
      }
      const O = figma.createComponent();
      O.name = V, v.appendChild(O), t.log(`  Created component node: "${V}"`);
      try {
        if (c.structure.componentPropertyDefinitions) {
          const Q = c.structure.componentPropertyDefinitions;
          let j = 0, ee = 0;
          for (const [ne, K] of Object.entries(Q))
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
              }[K.type];
              if (!W) {
                t.warning(
                  `  Unknown property type ${K.type} for property "${ne}" in component "${c.componentName}"`
                ), ee++;
                continue;
              }
              const z = K.defaultValue, R = ne.split("#")[0];
              O.addComponentProperty(
                R,
                W,
                z
              ), j++;
            } catch (ie) {
              t.warning(
                `  Failed to add component property "${ne}" to "${c.componentName}": ${ie}`
              ), ee++;
            }
          j > 0 && t.log(
            `  Added ${j} component property definition(s) to "${c.componentName}"${ee > 0 ? ` (${ee} failed)` : ""}`
          );
        }
        c.structure.name !== void 0 && (O.name = c.structure.name);
        const p = c.structure.boundVariables && typeof c.structure.boundVariables == "object" && (c.structure.boundVariables.width || c.structure.boundVariables.height);
        c.structure.width !== void 0 && c.structure.height !== void 0 && !p && O.resize(c.structure.width, c.structure.height), c.structure.x !== void 0 && (O.x = c.structure.x), c.structure.y !== void 0 && (O.y = c.structure.y);
        const f = c.structure.boundVariables && typeof c.structure.boundVariables == "object";
        if (c.structure.visible !== void 0 && (O.visible = c.structure.visible), c.structure.opacity !== void 0 && (!f || !c.structure.boundVariables.opacity) && (O.opacity = c.structure.opacity), c.structure.rotation !== void 0 && (!f || !c.structure.boundVariables.rotation) && (O.rotation = c.structure.rotation), c.structure.blendMode !== void 0 && (!f || !c.structure.boundVariables.blendMode) && (O.blendMode = c.structure.blendMode), c.structure.fills !== void 0)
          try {
            let Q = c.structure.fills;
            Array.isArray(Q) && (Q = Q.map((j) => {
              if (j && typeof j == "object") {
                const ee = le({}, j);
                return delete ee.boundVariables, ee;
              }
              return j;
            })), O.fills = Q, (C = c.structure.boundVariables) != null && C.fills && i && await tn(
              O,
              c.structure.boundVariables,
              "fills",
              i
            );
          } catch (Q) {
            t.warning(
              `Error setting fills for remote component "${c.componentName}": ${Q}`
            );
          }
        if (c.structure.strokes !== void 0)
          try {
            O.strokes = c.structure.strokes;
          } catch (Q) {
            t.warning(
              `Error setting strokes for remote component "${c.componentName}": ${Q}`
            );
          }
        const h = c.structure.boundVariables && typeof c.structure.boundVariables == "object" && (c.structure.boundVariables.strokeWeight || c.structure.boundVariables.strokeAlign);
        c.structure.strokeWeight !== void 0 && (!h || !c.structure.boundVariables.strokeWeight) && (O.strokeWeight = c.structure.strokeWeight), c.structure.strokeAlign !== void 0 && (!h || !c.structure.boundVariables.strokeAlign) && (O.strokeAlign = c.structure.strokeAlign), c.structure.layoutMode !== void 0 && (O.layoutMode = c.structure.layoutMode), c.structure.primaryAxisSizingMode !== void 0 && (O.primaryAxisSizingMode = c.structure.primaryAxisSizingMode), c.structure.counterAxisSizingMode !== void 0 && (O.counterAxisSizingMode = c.structure.counterAxisSizingMode);
        const w = c.structure.boundVariables && typeof c.structure.boundVariables == "object";
        c.structure.paddingLeft !== void 0 && (!w || !c.structure.boundVariables.paddingLeft) && (O.paddingLeft = c.structure.paddingLeft), c.structure.paddingRight !== void 0 && (!w || !c.structure.boundVariables.paddingRight) && (O.paddingRight = c.structure.paddingRight), c.structure.paddingTop !== void 0 && (!w || !c.structure.boundVariables.paddingTop) && (O.paddingTop = c.structure.paddingTop), c.structure.paddingBottom !== void 0 && (!w || !c.structure.boundVariables.paddingBottom) && (O.paddingBottom = c.structure.paddingBottom), c.structure.itemSpacing !== void 0 && (!w || !c.structure.boundVariables.itemSpacing) && (O.itemSpacing = c.structure.itemSpacing);
        const x = c.structure.boundVariables && typeof c.structure.boundVariables == "object" && (c.structure.boundVariables.cornerRadius || c.structure.boundVariables.topLeftRadius || c.structure.boundVariables.topRightRadius || c.structure.boundVariables.bottomLeftRadius || c.structure.boundVariables.bottomRightRadius);
        if (c.structure.cornerRadius !== void 0 && (!x || !c.structure.boundVariables.cornerRadius) && (O.cornerRadius = c.structure.cornerRadius), c.structure.boundVariables && i) {
          const Q = c.structure.boundVariables, j = [
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
            if (Q[ee] && ze(Q[ee])) {
              const ne = Q[ee]._varRef;
              if (ne !== void 0) {
                const K = i.get(String(ne));
                if (K) {
                  const ie = {
                    type: "VARIABLE_ALIAS",
                    id: K.id
                  };
                  O.boundVariables || (O.boundVariables = {}), O.boundVariables[ee] = ie;
                }
              }
            }
        }
        t.log(
          `  DEBUG: Structure keys: ${Object.keys(c.structure).join(", ")}, has children: ${!!c.structure.children}, has child: ${!!c.structure.child}`
        );
        const U = c.structure.children || (c.structure.child ? c.structure.child : null);
        if (t.log(
          `  DEBUG: childrenArray exists: ${!!U}, isArray: ${Array.isArray(U)}, length: ${U ? U.length : 0}`
        ), U && Array.isArray(U) && U.length > 0) {
          t.log(
            `  Recreating ${U.length} child(ren) for component "${c.componentName}"`
          );
          for (let Q = 0; Q < U.length; Q++) {
            const j = U[Q];
            if (t.log(
              `  DEBUG: Processing child ${Q + 1}/${U.length}: ${JSON.stringify({ name: j == null ? void 0 : j.name, type: j == null ? void 0 : j.type, hasTruncated: !!(j != null && j._truncated) })}`
            ), j._truncated) {
              t.log(
                `  Skipping truncated child: ${j._reason || "Unknown"}`
              );
              continue;
            }
            t.log(
              `  Recreating child: "${j.name || "Unnamed"}" (type: ${j.type})`
            );
            const ee = await Xe(
              j,
              O,
              n,
              o,
              null,
              i,
              s,
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
            ee ? (O.appendChild(ee), t.log(
              `  ✓ Appended child "${j.name || "Unnamed"}" to component "${c.componentName}"`
            )) : t.warning(
              `  ✗ Failed to create child "${j.name || "Unnamed"}" (type: ${j.type})`
            );
          }
        }
        m.set(F, O);
        const Y = c.componentGuid || "", re = c.componentVersion;
        Y && y.push({
          guid: Y,
          version: re,
          pageId: v.id
        }), t.log(
          `✓ Created remote component: "${V}" (index ${F})`
        );
      } catch (p) {
        t.warning(
          `Error populating remote component "${c.componentName}": ${p instanceof Error ? p.message : "Unknown error"}`
        ), O.remove();
      }
    } catch (O) {
      t.warning(
        `Error recreating remote instance "${c.componentName}": ${O instanceof Error ? O.message : "Unknown error"}`
      );
    }
  }
  return t.log(
    `Remote instance processing complete: ${m.size} component(s) created`
  ), { remoteComponentMap: m, dependentComponents: y };
}
async function Co(e, n, o, i, a, l, r = null, g = null, d = null, m = !1, y = null, b = !1, S = !1, v = "", I = null) {
  t.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const s = figma.root.children, C = "RecursicaPublishedMetadata";
  let $ = null;
  for (const f of s) {
    const h = f.getPluginData(C);
    if (h)
      try {
        if (JSON.parse(h).id === e.guid) {
          $ = f;
          break;
        }
      } catch (w) {
        continue;
      }
  }
  let c = !1;
  if ($ && !m && !b) {
    let f;
    try {
      const x = $.getPluginData(C);
      x && (f = JSON.parse(x).version);
    } catch (x) {
    }
    const h = f !== void 0 ? ` v${f}` : "", w = `Found existing component "${$.name}${h}". Should I use it or create a copy?`;
    t.log(
      `Found existing page with same GUID: "${$.name}". Prompting user...`
    );
    try {
      await tt.prompt(w, {
        okLabel: "Use",
        cancelLabel: "Copy",
        timeoutMs: 3e5
        // 5 minutes
      }), c = !0, t.log(
        `User chose to use existing page: "${$.name}"`
      );
    } catch (x) {
      t.log("User chose to create a copy. Will create new page.");
    }
  }
  if (c && $)
    return await figma.setCurrentPageAsync($), t.log(
      `Using existing page: "${$.name}" (GUID: ${e.guid.substring(0, 8)}...)`
    ), t.log(
      `  Instances from other pages will resolve to components on this existing page using componentPageName: "${$.name}"`
    ), {
      success: !0,
      page: $,
      // Include pageId so it can be tracked in importedPages
      pageId: $.id
    };
  const F = s.find((f) => f.name === e.name);
  F && t.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let _;
  if ($ || F) {
    const f = `__${e.name}`;
    _ = await Bt(f), t.log(
      `Creating scratch page: "${_}" (will be renamed to "${e.name}" on success)`
    );
  } else
    _ = e.name, t.log(`Creating page: "${_}"`);
  const L = figma.createPage();
  if (L.name = _, await figma.setCurrentPageAsync(L), t.log(`Switched to page: "${_}"`), !n.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  t.log("Recreating page structure...");
  const E = n.pageData;
  if (E.backgrounds !== void 0)
    try {
      L.backgrounds = E.backgrounds, t.log(
        `Set page background: ${JSON.stringify(E.backgrounds)}`
      );
    } catch (f) {
      t.warning(`Failed to set page background: ${f}`);
    }
  bt(E);
  const k = /* @__PURE__ */ new Map(), V = (f, h = []) => {
    if (f.type === "COMPONENT" && f.id && h.push(f.id), f.children && Array.isArray(f.children))
      for (const w of f.children)
        w._truncated || V(w, h);
    return h;
  }, O = V(E);
  if (t.log(
    `Found ${O.length} COMPONENT node(s) in page data`
  ), O.length > 0 && (t.log(
    `Component IDs in page data (first 20): ${O.slice(0, 20).map((f) => f.substring(0, 8) + "...").join(", ")}`
  ), E._allComponentIds = O), E.children && Array.isArray(E.children))
    for (const f of E.children) {
      const h = await Xe(
        f,
        L,
        o,
        i,
        a,
        l,
        k,
        !1,
        // isRemoteStructure: false - we're creating the main page
        r,
        g,
        E,
        // parentNodeData - pass the page's nodeData so children can check for auto-layout
        y,
        d,
        void 0,
        // currentPlaceholderId - page root is not inside a placeholder
        I
        // Pass styleMapping to apply styles
      );
      h && L.appendChild(h);
    }
  t.log("Page structure recreated successfully"), a && (t.log("Third pass: Setting variant properties on instances..."), await co(
    L,
    a,
    k
  ));
  const p = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (L.setPluginData(C, JSON.stringify(p)), t.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), _.startsWith("__")) {
    let f;
    S ? f = v ? `${v} ${e.name}` : e.name : f = await Bt(e.name), L.name = f, t.log(`Renamed page from "${_}" to "${f}"`);
  } else S && v && (L.name.startsWith(v) || (L.name = `${v} ${L.name}`));
  return {
    success: !0,
    page: L,
    deferredInstances: g || void 0
  };
}
async function xt(e, n) {
  var d, m, y;
  const o = (/* @__PURE__ */ new Date()).toISOString();
  Ie(n), e.clearConsole !== !1 && t.clear(), t.log("=== Starting Page Import ===");
  const a = [];
  let l = [], r = [], g = [];
  try {
    const b = e.jsonData;
    if (!b)
      return t.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    t.log("Validating metadata...");
    const S = Gt(b);
    if (!S.success)
      return t.error(S.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: S.error,
        data: {}
      };
    const v = S.metadata;
    t.log(
      `Metadata validated: guid=${v.guid}, name=${v.name}`
    ), Ie(n), t.log("Loading string table...");
    const I = yt(b);
    if (!I.success)
      return t.error(I.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: I.error,
        data: {}
      };
    t.log("String table loaded successfully"), t.log("Expanding JSON data...");
    const s = I.expandedJsonData;
    t.log("JSON expanded successfully"), Ie(n), t.log("Loading collections table...");
    const C = rn(s);
    if (!C.success)
      return C.error === "No collections table found in JSON" ? (t.log(C.error), t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: v.name }
      }) : (t.error(C.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: C.error,
        data: {}
      });
    const $ = C.collectionTable;
    t.log(
      `Loaded collections table with ${$.getSize()} collection(s)`
    ), Ie(n), t.log("Matching collections with existing local collections...");
    const { recognizedCollections: c, potentialMatches: F, collectionsToCreate: _ } = await mo($, e.preCreatedCollections);
    await uo(
      F,
      c,
      _,
      e.collectionChoices
    ), await ho(
      c,
      $,
      F
    ), await yo(
      _,
      c,
      a,
      e.preCreatedCollections
    ), Ie(n), t.log("Loading variables table...");
    const L = an(s);
    if (!L.success)
      return L.error === "No variables table found in JSON" ? (t.log(L.error), t.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: v.name }
      }) : (t.error(L.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: L.error,
        data: {}
      });
    const E = L.variableTable;
    t.log(
      `Loaded variables table with ${E.getSize()} variable(s)`
    ), Ie(n);
    const k = await sn(
      E,
      $,
      c,
      a
    ), V = k.recognizedVariables;
    l = k.newlyCreatedVariables, t.log("Checking for styles table...");
    const O = s.styles !== void 0 && s.styles !== null;
    if (!O) {
      if (nn(
        s.pageData
      )) {
        const te = "Style references found in page data but styles table is missing from JSON. Cannot import styles.";
        return t.error(te), {
          type: "importPage",
          success: !1,
          error: !0,
          message: te,
          data: {}
        };
      }
      t.log(
        "No styles table found in JSON (and no style references detected)"
      );
    }
    let p = null;
    if (O) {
      t.log("Loading styles table...");
      const H = pt.fromTable(s.styles);
      t.log(
        `Loaded styles table with ${H.getSize()} style(s)`
      );
      const te = await oo(
        H.getTable(),
        V
      );
      p = te.styleMapping, r = te.newlyCreatedStyles, t.log(
        `Imported ${p.size} style(s) (some may have been skipped if they already exist)`
      );
    }
    Ie(n), t.log("Loading instance table...");
    const f = bo(s);
    if (f) {
      const H = f.getSerializedTable(), te = Object.values(H).filter(
        (fe) => fe.instanceType === "internal"
      ), me = Object.values(H).filter(
        (fe) => fe.instanceType === "remote"
      );
      t.log(
        `Loaded instance table with ${f.getSize()} instance(s) (${te.length} internal, ${me.length} remote)`
      );
    } else
      t.log("No instance table found in JSON");
    Ie(n);
    const h = [], w = /* @__PURE__ */ new Set(), x = (d = e.isMainPage) != null ? d : !0, U = (m = e.alwaysCreateCopy) != null ? m : !1, Y = (y = e.skipUniqueNaming) != null ? y : !1, re = e.constructionIcon || "";
    let Q = null;
    if (f) {
      const H = await So(
        f,
        E,
        $,
        V,
        c,
        re,
        p
        // Pass styleMapping to apply styles
      );
      Q = H.remoteComponentMap, g = H.dependentComponents;
    }
    const j = await Co(
      v,
      s,
      E,
      $,
      f,
      V,
      Q,
      h,
      w,
      x,
      c,
      U,
      Y,
      re,
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
    const ee = j.page, ne = V.size + l.length, K = j.deferredInstances || h, ie = (K == null ? void 0 : K.length) || 0;
    if (t.log("=== Import Complete ==="), t.log(
      `Successfully processed ${c.size} collection(s), ${ne} variable(s), and created page "${ee.name}"${ie > 0 ? ` (${ie} deferred normal instance(s) - will need to be resolved after all pages are imported)` : ""}`
    ), ie > 0)
      for (const H of K)
        t.log(
          `    - "${H.nodeData.name}" from page "${H.instanceEntry.componentPageName}"`
        );
    const W = j.pageId || ee.id, z = t.getLogs(), R = {
      componentGuid: v.guid,
      componentPage: v.name,
      branch: e.branch,
      importedAt: o,
      logs: z,
      createdPageIds: [ee.id],
      createdCollectionIds: a.map((H) => H.id),
      createdVariableIds: l.map((H) => H.id),
      createdStyleIds: r.map((H) => H.id),
      dependentComponents: g
    };
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: le({
        pageName: ee.name,
        pageId: W,
        // Include pageId for tracking (used for both new and reused pages)
        deferredInstances: ie > 0 ? K : void 0,
        importResult: R
      }, z.length > 0 && { debugLogs: z })
    };
  } catch (b) {
    const S = b instanceof Error ? b.message : "Unknown error occurred";
    t.error(`Import failed: ${S}`), b instanceof Error && b.stack && t.error(`Stack trace: ${b.stack}`), console.error("Error importing page:", b);
    const v = t.getLogs();
    let I = "", s = "";
    try {
      const $ = e.jsonData;
      if ($) {
        const c = Gt($);
        c.success && c.metadata && (I = c.metadata.guid, s = c.metadata.name);
      }
    } catch ($) {
    }
    const C = {
      componentGuid: I,
      componentPage: s,
      branch: e.branch,
      importedAt: o,
      error: S,
      logs: v,
      createdPageIds: [],
      createdCollectionIds: a.map(($) => $.id),
      createdVariableIds: l.map(($) => $.id),
      createdStyleIds: r.map(($) => $.id),
      dependentComponents: g
    };
    return {
      type: "importPage",
      success: !1,
      error: !0,
      message: S,
      data: le({
        importResult: C
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
    for (const l of e.children) {
      if (!("fills" in l) || !Array.isArray(l.fills)) {
        t.log(
          `[FILL-BOUND] Skipping child "${l.name}" - no fills property`
        );
        continue;
      }
      const r = n.children.find(
        (g) => g.name === l.name
      );
      if (!r) {
        t.log(
          `[FILL-BOUND] No JSON data found for child "${l.name}" in instance "${e.name}"`
        );
        continue;
      }
      if (!((a = r.boundVariables) != null && a.fills)) {
        t.log(
          `[FILL-BOUND] Child "${l.name}" in instance "${e.name}" has no fill bound variables in JSON`
        );
        continue;
      }
      t.log(
        `[FILL-BOUND] Found fill bound variables for child "${l.name}" in instance "${e.name}"`
      );
      try {
        if (!o) {
          t.warning(
            "[FILL-BOUND] Cannot apply fill bound variables: recognizedVariables is null"
          );
          continue;
        }
        const g = r.boundVariables.fills;
        if (!Array.isArray(g))
          continue;
        const d = [];
        for (let m = 0; m < l.fills.length && m < g.length; m++) {
          const y = l.fills[m], b = g[m];
          if (b && typeof b == "object") {
            let S = null;
            if (b._varRef !== void 0) {
              const v = b._varRef;
              S = o.get(String(v)) || null;
            } else if (b.color) {
              const v = b.color;
              v._varRef !== void 0 ? S = o.get(String(v._varRef)) || null : v.type === "VARIABLE_ALIAS" && v.id && (S = await figma.variables.getVariableByIdAsync(
                v.id
              ));
            } else b.type === "VARIABLE_ALIAS" && b.id && (S = await figma.variables.getVariableByIdAsync(
              b.id
            ));
            if (S && y.type === "SOLID") {
              const v = y, I = {
                type: "SOLID",
                visible: v.visible,
                opacity: v.opacity,
                blendMode: v.blendMode,
                color: le({}, v.color)
                // This will be overridden by the variable
              }, s = figma.variables.setBoundVariableForPaint(
                I,
                "color",
                S
              );
              d.push(s), t.log(
                `[FILL-BOUND] ✓ Bound variable "${S.name}" (${S.id}) to fill[${m}].color on child "${l.name}"`
              );
            } else S ? (d.push(y), S ? y.type !== "SOLID" && t.log(
              `[FILL-BOUND] Fill[${m}] on child "${l.name}" is type "${y.type}" - variable binding for non-solid fills not yet implemented`
            ) : t.warning(
              `[FILL-BOUND] Could not resolve variable for fill[${m}] on child "${l.name}"`
            )) : d.push(y);
          } else
            d.push(y);
        }
        l.fills = d, t.log(
          `[FILL-BOUND] ✓ Applied fill bound variables to child "${l.name}" in instance "${e.name}" (${d.length} fill(s))`
        );
      } catch (g) {
        t.warning(
          `Error applying fill bound variables to instance child "${l.name}": ${g instanceof Error ? g.message : String(g)}`
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
  const o = (l, r) => {
    if ("children" in l && Array.isArray(l.children))
      for (const g of l.children) {
        if (g.name === r)
          return g;
        const d = o(g, r);
        if (d)
          return d;
      }
    return null;
  };
  for (const l of n.children) {
    if (!l || !l.name)
      continue;
    o(
      e,
      l.name
    ) || t.warning(
      `Child "${l.name}" in JSON does not exist in instance "${e.name}" - skipping (instance override or Figma limitation)`
    );
  }
  const i = new Set(
    (n.children || []).map((l) => l == null ? void 0 : l.name).filter(Boolean)
  ), a = e.children.filter(
    (l) => !i.has(l.name)
  );
  a.length > 0 && t.log(
    `Instance "${e.name}" has ${a.length} child(ren) not in JSON - keeping default children: ${a.map((l) => l.name).join(", ")}`
  );
}
async function Rt(e, n = "", o = null, i = null, a = null, l = null) {
  var S;
  if (e.length === 0)
    return { resolved: 0, failed: 0, errors: [] };
  t.log(
    `=== Resolving ${e.length} deferred normal instance(s) ===`
  );
  let r = 0, g = 0;
  const d = [];
  await figma.loadAllPagesAsync();
  const m = (v, I, s = /* @__PURE__ */ new Set()) => {
    if (!v.parentPlaceholderId || s.has(v.placeholderFrameId))
      return 0;
    s.add(v.placeholderFrameId);
    const C = I.find(
      ($) => $.placeholderFrameId === v.parentPlaceholderId
    );
    return C ? 1 + m(C, I, s) : 0;
  }, y = e.map((v) => ({
    deferred: v,
    depth: m(v, e)
  }));
  if (y.sort((v, I) => I.depth - v.depth), t.log(
    `[BOTTOM-UP] Sorted ${e.length} deferred instance(s) by depth (deepest first)`
  ), y.length > 0) {
    const v = Math.max(...y.map((I) => I.depth));
    t.log(
      `[BOTTOM-UP] Depth range: 0 (root) to ${v} (deepest)`
    );
  }
  const b = /* @__PURE__ */ new Set();
  for (const v of e)
    v.parentPlaceholderId && (b.add(v.placeholderFrameId), t.log(
      `[NESTED] Pre-marked child deferred instance "${v.nodeData.name}" (placeholder: ${v.placeholderFrameId.substring(0, 8)}..., parent placeholder: ${v.parentPlaceholderId.substring(0, 8)}...)`
    ));
  t.log(
    `[NESTED] Pre-marked ${b.size} child deferred instance(s) to skip in main loop`
  );
  for (const { deferred: v } of y) {
    if (b.has(v.placeholderFrameId)) {
      t.log(
        `[NESTED] Skipping child deferred instance "${v.nodeData.name}" (placeholder: ${v.placeholderFrameId.substring(0, 8)}...) - will be resolved when parent is resolved`
      );
      continue;
    }
    try {
      const { placeholderFrameId: I, instanceEntry: s, nodeData: C, parentNodeId: $ } = v, c = await figma.getNodeByIdAsync(
        I
      ), F = await figma.getNodeByIdAsync(
        $
      );
      if (!c || !F) {
        const f = v.parentPlaceholderId !== void 0, h = b.has(I), w = `Deferred instance "${C.name}" - could not find placeholder frame (${I.substring(0, 8)}...) or parent node (${$.substring(0, 8)}...). Was child deferred: ${f}, Was marked: ${h}`;
        t.error(w), f && !h && t.error(
          `[NESTED] BUG: Child deferred instance "${C.name}" was not properly marked! parentPlaceholderId: ${(S = v.parentPlaceholderId) == null ? void 0 : S.substring(0, 8)}...`
        ), d.push(w), g++;
        continue;
      }
      let _ = figma.root.children.find((f) => {
        const h = f.name === s.componentPageName, w = n && f.name === `${n} ${s.componentPageName}`;
        return h || w;
      });
      if (!_) {
        const f = $e(
          s.componentPageName
        );
        _ = figma.root.children.find((h) => $e(h.name) === f);
      }
      if (!_) {
        const f = n ? `"${s.componentPageName}" or "${n} ${s.componentPageName}"` : `"${s.componentPageName}"`, h = `Deferred instance "${C.name}" still cannot find referenced page (tried: ${f}, and clean name matching)`;
        t.error(h), d.push(h), g++;
        continue;
      }
      const L = (f, h, w, x, U) => {
        if (h.length === 0) {
          let j = null;
          const ee = $e(w);
          for (const ne of f.children || [])
            if (ne.type === "COMPONENT") {
              const K = ne.name === w, ie = $e(ne.name) === ee;
              if (K || ie) {
                if (j || (j = ne), K && x)
                  try {
                    const W = ne.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (W && JSON.parse(W).id === x)
                      return ne;
                  } catch (W) {
                  }
                else if (K)
                  return ne;
              }
            } else if (ne.type === "COMPONENT_SET") {
              if (U) {
                const K = ne.name === U, ie = $e(ne.name) === $e(U);
                if (!K && !ie)
                  continue;
              }
              for (const K of ne.children || [])
                if (K.type === "COMPONENT") {
                  const ie = K.name === w, W = $e(K.name) === ee;
                  if (ie || W) {
                    if (j || (j = K), ie && x)
                      try {
                        const z = K.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (z && JSON.parse(z).id === x)
                          return K;
                      } catch (z) {
                      }
                    else if (ie)
                      return K;
                  }
                }
            }
          return j;
        }
        const [Y, ...re] = h, Q = $e(Y);
        for (const j of f.children || []) {
          const ee = j.name === Y, ne = $e(j.name) === Q;
          if (ee || ne) {
            if (re.length === 0) {
              if (j.type === "COMPONENT_SET") {
                if (U) {
                  const W = j.name === U, z = $e(j.name) === $e(U);
                  if (!W && !z)
                    continue;
                }
                const K = $e(w);
                let ie = null;
                for (const W of j.children || [])
                  if (W.type === "COMPONENT") {
                    const z = W.name === w, R = $e(W.name) === K;
                    if (z || R) {
                      if (ie || (ie = W), x)
                        try {
                          const J = W.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (J && JSON.parse(J).id === x)
                            return W;
                        } catch (J) {
                        }
                      if (z)
                        return W;
                    }
                  }
                return ie || null;
              }
              return null;
            }
            return re.length > 0 ? L(
              j,
              re,
              w,
              x,
              U
            ) : null;
          }
        }
        return null;
      };
      let E = L(
        _,
        s.path || [],
        s.componentName,
        s.componentGuid,
        s.componentSetName
      );
      if (!E && s.componentSetName) {
        const f = (h, w = 0) => {
          if (w > 5) return null;
          for (const x of h.children || []) {
            if (x.type === "COMPONENT_SET") {
              const U = x.name === s.componentSetName, Y = $e(x.name) === $e(s.componentSetName || "");
              if (U || Y) {
                const re = $e(
                  s.componentName
                );
                for (const Q of x.children || [])
                  if (Q.type === "COMPONENT") {
                    const j = Q.name === s.componentName, ee = $e(Q.name) === re;
                    if (j || ee) {
                      if (s.componentGuid)
                        try {
                          const ne = Q.getPluginData(
                            "RecursicaPublishedMetadata"
                          );
                          if (ne && JSON.parse(ne).id === s.componentGuid)
                            return Q;
                        } catch (ne) {
                        }
                      return Q;
                    }
                  }
              }
            }
            if (x.type === "FRAME" || x.type === "GROUP") {
              const U = f(x, w + 1);
              if (U) return U;
            }
          }
          return null;
        };
        E = f(_);
      }
      if (!E) {
        const f = s.path && s.path.length > 0 ? ` at path [${s.path.join(" → ")}]` : " at page root", h = [], w = (U, Y = 0) => {
          if (!(Y > 3) && ((U.type === "COMPONENT" || U.type === "COMPONENT_SET") && h.push(
            `${U.type}: "${U.name}"${U.type === "COMPONENT_SET" ? ` (${U.children.length} variants)` : ""}`
          ), U.children && Array.isArray(U.children)))
            for (const re of U.children.slice(0, 10))
              w(re, Y + 1);
        };
        w(_);
        const x = `Deferred instance "${C.name}" still cannot find component "${s.componentName}" on page "${s.componentPageName}"${f}`;
        t.error(x), d.push(x), g++;
        continue;
      }
      const k = E.createInstance();
      if (k.name = C.name || c.name.replace("[Deferred: ", "").replace("]", ""), k.x = c.x, k.y = c.y, c.width !== void 0 && c.height !== void 0 && k.resize(c.width, c.height), s.variantProperties && Object.keys(s.variantProperties).length > 0)
        try {
          const f = await k.getMainComponentAsync();
          if (f) {
            let h = null;
            const w = f.type;
            if (w === "COMPONENT_SET" ? h = f.componentPropertyDefinitions : w === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? h = f.parent.componentPropertyDefinitions : t.warning(
              `Cannot set variant properties for resolved instance "${C.name}" - main component is not a COMPONENT_SET or variant`
            ), h) {
              const x = {};
              for (const [U, Y] of Object.entries(
                s.variantProperties
              )) {
                const re = U.split("#")[0];
                h[re] && (x[re] = Y);
              }
              Object.keys(x).length > 0 && k.setProperties(x);
            }
          }
        } catch (f) {
          t.warning(
            `Failed to set variant properties for resolved instance "${C.name}": ${f}`
          );
        }
      if (s.componentProperties && Object.keys(s.componentProperties).length > 0)
        try {
          const f = await k.getMainComponentAsync();
          if (f) {
            let h = null;
            const w = f.type;
            if (w === "COMPONENT_SET" ? h = f.componentPropertyDefinitions : w === "COMPONENT" && f.parent && f.parent.type === "COMPONENT_SET" ? h = f.parent.componentPropertyDefinitions : w === "COMPONENT" && (h = f.componentPropertyDefinitions), h)
              for (const [x, U] of Object.entries(
                s.componentProperties
              )) {
                const Y = x.split("#")[0];
                if (h[Y])
                  try {
                    k.setProperties({
                      [Y]: U
                    });
                  } catch (re) {
                    t.warning(
                      `Failed to set component property "${Y}" for resolved instance "${C.name}": ${re}`
                    );
                  }
              }
          }
        } catch (f) {
          t.warning(
            `Failed to set component properties for resolved instance "${C.name}": ${f}`
          );
        }
      await _t(
        k,
        C,
        o
      ), await zt(k, C), t.log(
        `[NESTED] Extracting child deferred instances for placeholder "${C.name}" (${I.substring(0, 8)}...). Total deferred instances: ${e.length}`
      );
      const V = async (f) => {
        try {
          const h = await figma.getNodeByIdAsync(f);
          if (!h || !h.parent) return !1;
          let w = h.parent;
          for (; w; ) {
            if (w.id === I)
              return !0;
            if (w.type === "PAGE")
              break;
            w = w.parent;
          }
          return !1;
        } catch (h) {
          return !1;
        }
      }, O = [];
      for (const f of e)
        f.parentPlaceholderId === I ? (O.push(f), t.log(
          `[NESTED]   - Found child by parentPlaceholderId: "${f.nodeData.name}" (placeholder: ${f.placeholderFrameId.substring(0, 8)}...)`
        )) : await V(
          f.placeholderFrameId
        ) && (O.push(f), t.log(
          `[NESTED]   - Found child by structural check: "${f.nodeData.name}" (placeholder: ${f.placeholderFrameId.substring(0, 8)}...) - placeholder is inside current placeholder`
        ));
      t.log(
        `[NESTED] Found ${O.length} child deferred instance(s) for placeholder "${C.name}"`
      );
      for (const f of O)
        b.add(f.placeholderFrameId);
      if ("children" in F && "insertChild" in F) {
        const f = F.children.indexOf(c);
        F.insertChild(f, k), c.remove();
      } else {
        const f = `Parent node does not support children operations for deferred instance "${C.name}"`;
        t.error(f), d.push(f);
        continue;
      }
      const p = (f, h) => {
        const w = [];
        if (f.name === h && w.push(f), "children" in f)
          for (const x of f.children)
            w.push(...p(x, h));
        return w;
      };
      for (const f of O)
        try {
          const h = p(
            k,
            f.nodeData.name
          );
          if (h.length === 0) {
            t.warning(
              `  Could not find matching child "${f.nodeData.name}" in resolved instance "${C.name}" - child may not exist in component`
            );
            continue;
          }
          if (h.length > 1) {
            const z = `Cannot resolve child deferred instance "${f.nodeData.name}": multiple children with same name in instance "${C.name}"`;
            t.error(z), d.push(z), g++;
            continue;
          }
          const w = h[0], x = f.instanceEntry;
          let U = figma.root.children.find((z) => {
            const R = z.name === x.componentPageName, J = n && z.name === `${n} ${x.componentPageName}`;
            return R || J;
          });
          if (!U) {
            const z = $e(
              x.componentPageName
            );
            U = figma.root.children.find((R) => $e(R.name) === z);
          }
          if (!U) {
            t.warning(
              `  Could not find referenced page for child deferred instance "${f.nodeData.name}"`
            );
            continue;
          }
          const Y = (z, R, J, H, te) => {
            if (R.length === 0) {
              let fe = null;
              for (const ce of z.children || [])
                if (ce.type === "COMPONENT") {
                  const ae = $e(ce.name), se = $e(J);
                  if (ae === se)
                    if (fe || (fe = ce), H)
                      try {
                        const de = ce.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (de && JSON.parse(de).id === H)
                          return ce;
                      } catch (de) {
                      }
                    else
                      return ce;
                } else if (ce.type === "COMPONENT_SET" && te) {
                  const ae = $e(ce.name), se = $e(te);
                  if (ae === se) {
                    for (const de of ce.children)
                      if (de.type === "COMPONENT") {
                        const ue = $e(
                          de.name
                        ), Se = $e(J);
                        if (ue === Se)
                          if (fe || (fe = de), H)
                            try {
                              const xe = de.getPluginData(
                                "RecursicaPublishedMetadata"
                              );
                              if (xe && JSON.parse(xe).id === H)
                                return de;
                            } catch (xe) {
                            }
                          else
                            return de;
                      }
                  }
                }
              return fe;
            }
            let me = z;
            for (const fe of R) {
              const ce = $e(fe), ae = (me.children || []).find(
                (se) => $e(se.name) === ce
              );
              if (!ae) return null;
              me = ae;
            }
            if (me.type === "COMPONENT") {
              const fe = $e(me.name), ce = $e(J);
              if (fe === ce)
                if (H)
                  try {
                    const ae = me.getPluginData(
                      "RecursicaPublishedMetadata"
                    );
                    if (ae && JSON.parse(ae).id === H)
                      return me;
                  } catch (ae) {
                    return null;
                  }
                else
                  return me;
            } else if (me.type === "COMPONENT_SET" && te) {
              for (const fe of me.children)
                if (fe.type === "COMPONENT") {
                  const ce = $e(fe.name), ae = $e(J);
                  if (ce === ae)
                    if (H)
                      try {
                        const se = fe.getPluginData(
                          "RecursicaPublishedMetadata"
                        );
                        if (se && JSON.parse(se).id === H)
                          return fe;
                      } catch (se) {
                        continue;
                      }
                    else
                      return fe;
                }
            }
            return null;
          };
          let re = x.componentSetName;
          !re && f.nodeData.name && (re = f.nodeData.name, t.log(
            `  [NESTED] componentSetName not provided, using child name "${re}" as fallback`
          )), t.log(
            `  [NESTED] Looking for component: page="${U.name}", componentSet="${re}", component="${x.componentName}", path=[${(x.path || []).join(", ")}]`
          );
          const Q = (z) => {
            const R = [];
            if (z.type === "COMPONENT_SET" && R.push(z), "children" in z && Array.isArray(z.children))
              for (const J of z.children)
                R.push(...Q(J));
            return R;
          }, j = Q(U);
          t.log(
            `  [NESTED] Found ${j.length} component set(s) on page "${U.name}" (recursive search): ${j.map((z) => z.name).join(", ")}`
          );
          const ee = U.children.map(
            (z) => `${z.type}:${z.name}`
          );
          t.log(
            `  [NESTED] Direct children of page "${U.name}" (${ee.length}): ${ee.slice(0, 10).join(", ")}${ee.length > 10 ? "..." : ""}`
          );
          const ne = Y(
            U,
            x.path || [],
            x.componentName,
            x.componentGuid,
            re
          );
          if (!ne) {
            if (t.warning(
              `  Could not find component "${x.componentName}" (componentSet: "${re}") for child deferred instance "${f.nodeData.name}" on page "${U.name}"`
            ), re) {
              const z = $e(re), R = j.filter((J) => $e(J.name) === z);
              if (R.length > 0) {
                t.log(
                  `  [NESTED] Found ${R.length} component set(s) with matching clean name "${z}": ${R.map((J) => J.name).join(", ")}`
                );
                for (const J of R) {
                  const H = J.children.filter(
                    (te) => te.type === "COMPONENT"
                  );
                  t.log(
                    `  [NESTED] Component set "${J.name}" has ${H.length} variant(s): ${H.map((te) => te.name).join(", ")}`
                  );
                }
              }
            }
            continue;
          }
          const K = ne.createInstance();
          K.name = f.nodeData.name || w.name, K.x = w.x, K.y = w.y, w.width !== void 0 && w.height !== void 0 && K.resize(w.width, w.height), await _t(
            K,
            f.nodeData,
            o
          ), await zt(
            K,
            f.nodeData
          );
          const ie = w.parent;
          if (!ie || !("children" in ie)) {
            const z = `Cannot replace child "${f.nodeData.name}": parent does not support children`;
            t.error(z), d.push(z), g++;
            continue;
          }
          const W = ie.children.indexOf(w);
          ie.insertChild(W, K), w.remove(), t.log(
            `  ✓ Resolved nested child deferred instance "${f.nodeData.name}" in "${C.name}"`
          );
        } catch (h) {
          t.warning(
            `  Error resolving child deferred instance "${f.nodeData.name}": ${h instanceof Error ? h.message : String(h)}`
          );
        }
      t.log(
        `  ✓ Resolved deferred instance "${C.name}" from component "${s.componentName}" on page "${s.componentPageName}"`
      ), r++;
    } catch (I) {
      const s = I instanceof Error ? I.message : String(I), C = `Failed to resolve deferred instance "${v.nodeData.name}": ${s}`;
      t.error(C), d.push(C), g++;
    }
  }
  return t.log(
    `=== Deferred Resolution Complete: ${r} resolved, ${g} failed ===`
  ), { resolved: r, failed: g, errors: d };
}
async function ln(e) {
  t.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: n, collectionIds: o, variableIds: i } = e;
    let a = 0;
    for (const g of i)
      try {
        const d = await figma.variables.getVariableByIdAsync(g);
        if (d) {
          const m = d.variableCollectionId;
          o.includes(m) || (d.remove(), a++);
        }
      } catch (d) {
        t.warning(
          `Could not delete variable ${g.substring(0, 8)}...: ${d}`
        );
      }
    let l = 0;
    for (const g of o)
      try {
        const d = await figma.variables.getVariableCollectionByIdAsync(g);
        d && (d.remove(), l++);
      } catch (d) {
        t.warning(
          `Could not delete collection ${g.substring(0, 8)}...: ${d}`
        );
      }
    await figma.loadAllPagesAsync();
    let r = 0;
    for (const g of n)
      try {
        const d = await figma.getNodeByIdAsync(g);
        d && d.type === "PAGE" && (d.remove(), r++);
      } catch (d) {
        t.warning(
          `Could not delete page ${g.substring(0, 8)}...: ${d}`
        );
      }
    return t.log(
      `Cleanup complete: Deleted ${r} page(s), ${l} collection(s), ${a} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: r,
        deletedCollections: l,
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
const No = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cleanupCreatedEntities: ln,
  importPage: xt,
  loadAndExpandJson: yt,
  loadCollectionTable: rn,
  loadVariableTable: an,
  matchAndCreateVariables: sn,
  normalizeStructureTypes: bt,
  recreateNodeFromData: Xe,
  resolveDeferredNormalInstances: Rt,
  restoreBoundVariablesForFills: tn,
  sanitizeImportResult: Qt
}, Symbol.toStringTag, { value: "Module" }));
async function cn(e) {
  const n = [];
  for (const { fileName: o, jsonData: i } of e)
    try {
      const a = yt(i);
      if (!a.success || !a.expandedJsonData) {
        t.warning(
          `Skipping ${o} - failed to expand JSON: ${a.error || "Unknown error"}`
        );
        continue;
      }
      const l = a.expandedJsonData, r = l.metadata;
      if (!r || !r.name || !r.guid) {
        t.warning(
          `Skipping ${o} - missing or invalid metadata`
        );
        continue;
      }
      const g = [];
      if (l.instances) {
        const m = at.fromTable(
          l.instances
        ).getSerializedTable();
        for (const y of Object.values(m))
          y.instanceType === "normal" && y.componentPageName && (g.includes(y.componentPageName) || g.push(y.componentPageName));
      }
      n.push({
        fileName: o,
        pageName: r.name,
        pageGuid: r.guid,
        dependencies: g,
        jsonData: i
        // Store original JSON data for import
      }), t.log(
        `  ${o}: "${r.name}" depends on: ${g.length > 0 ? g.join(", ") : "none"}`
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
  for (const m of e)
    a.set(m.pageName, m);
  const l = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), g = [], d = (m) => {
    if (l.has(m.pageName))
      return !1;
    if (r.has(m.pageName)) {
      const y = g.findIndex(
        (b) => b.pageName === m.pageName
      );
      if (y !== -1) {
        const b = g.slice(y).concat([m]);
        return o.push(b), !0;
      }
      return !1;
    }
    r.add(m.pageName), g.push(m);
    for (const y of m.dependencies) {
      const b = a.get(y);
      b && d(b);
    }
    return r.delete(m.pageName), g.pop(), l.add(m.pageName), n.push(m), !1;
  };
  for (const m of e)
    l.has(m.pageName) || d(m);
  for (const m of e)
    for (const y of m.dependencies)
      a.has(y) || i.push(
        `Page "${m.pageName}" (${m.fileName}) depends on "${y}" which is not in the import set`
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
      const a = i.map((l) => `"${l.pageName}"`).join(" → ");
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
  var F, _, L, E, k, V;
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
  const l = /* @__PURE__ */ new Map();
  if (t.log(
    `Checking collectionChoices: ${e.collectionChoices ? "exists" : "undefined"}`
  ), e.collectionChoices) {
    t.log("=== Pre-creating Collections ==="), t.log(
      `Collection choices: tokens=${e.collectionChoices.tokens}, theme=${e.collectionChoices.theme}, layers=${e.collectionChoices.layers}`
    );
    const O = "recursica:collectionId", p = async (h) => {
      const w = await figma.variables.getLocalVariableCollectionsAsync(), x = new Set(w.map((re) => re.name));
      if (!x.has(h))
        return h;
      let U = 1, Y = `${h}_${U}`;
      for (; x.has(Y); )
        U++, Y = `${h}_${U}`;
      return Y;
    }, f = [
      { choice: e.collectionChoices.tokens, normalizedName: "Tokens" },
      { choice: e.collectionChoices.theme, normalizedName: "Theme" },
      { choice: e.collectionChoices.layers, normalizedName: "Layer" }
    ];
    for (const { choice: h, normalizedName: w } of f)
      if (h === "new") {
        t.log(
          `Processing collection type: "${w}" (choice: "new") - will create new collection`
        );
        const x = await p(w), U = figma.variables.createVariableCollection(x);
        if (Ge(w)) {
          const Y = ft(w);
          Y && (U.setSharedPluginData(
            "recursica",
            O,
            Y
          ), t.log(
            `  Stored fixed GUID: ${Y.substring(0, 8)}...`
          ));
        }
        l.set(w, U), t.log(
          `✓ Pre-created collection: "${x}" (normalized: "${w}", id: ${U.id.substring(0, 8)}...)`
        );
      } else
        t.log(
          `Skipping collection type: "${w}" (choice: "existing")`
        );
    l.size > 0 && t.log(
      `Pre-created ${l.size} collection(s) for reuse across all imports`
    );
  }
  t.log("=== Importing Pages in Order ===");
  let r = 0, g = 0;
  const d = [...a], m = [], y = {
    pageIds: [],
    collectionIds: [],
    variableIds: []
  }, b = [], S = [];
  if (l.size > 0)
    for (const O of l.values())
      y.collectionIds.push(O.id), t.log(
        `Tracking pre-created collection: "${O.name}" (${O.id.substring(0, 8)}...)`
      );
  const v = e.mainFileName;
  for (let O = 0; O < o.length; O++) {
    const p = o[O], f = v ? p.fileName === v : O === o.length - 1;
    t.log(
      `[${O + 1}/${o.length}] Importing ${p.fileName} ("${p.pageName}")${f ? " [MAIN]" : " [DEPENDENCY]"}...`
    );
    try {
      const h = O === 0, w = await xt({
        jsonData: p.jsonData,
        isMainPage: f,
        clearConsole: h,
        collectionChoices: e.collectionChoices,
        alwaysCreateCopy: !0,
        // Wizard imports always create copies (no prompts)
        skipUniqueNaming: (F = e.skipUniqueNaming) != null ? F : !1,
        constructionIcon: e.constructionIcon || "",
        preCreatedCollections: l
        // Pass pre-created collections for reuse
      });
      if (w.success) {
        if (r++, (_ = w.data) != null && _.deferredInstances) {
          const x = w.data.deferredInstances;
          Array.isArray(x) && (t.log(
            `  [DEBUG] Collected ${x.length} deferred instance(s) from ${p.fileName}`
          ), m.push(...x));
        } else
          t.log(
            `  [DEBUG] No deferred instances in response for ${p.fileName}`
          );
        if ((L = w.data) != null && L.importResult) {
          const x = w.data.importResult;
          S.push(x), x.createdPageIds && y.pageIds.push(...x.createdPageIds), x.createdCollectionIds && y.collectionIds.push(
            ...x.createdCollectionIds
          ), x.createdVariableIds && y.variableIds.push(
            ...x.createdVariableIds
          );
          const U = ((E = x.createdPageIds) == null ? void 0 : E[0]) || ((k = w.data) == null ? void 0 : k.pageId);
          (V = w.data) != null && V.pageName && U && b.push({
            name: w.data.pageName,
            pageId: U
          });
        }
      } else
        g++, d.push(
          `Failed to import ${p.fileName}: ${w.message || "Unknown error"}`
        );
    } catch (h) {
      g++;
      const w = h instanceof Error ? h.message : String(h);
      d.push(`Failed to import ${p.fileName}: ${w}`);
    }
  }
  let I = 0;
  if (m.length > 0) {
    t.log(
      `=== Resolving ${m.length} Deferred Instance(s) ===`
    );
    try {
      t.log(
        "  Rebuilding variable and collection tables from imported JSON files..."
      );
      const {
        loadAndExpandJson: O,
        loadCollectionTable: p,
        loadVariableTable: f,
        matchAndCreateVariables: h
      } = await Promise.resolve().then(() => No), w = [], x = [];
      for (const ee of o)
        try {
          const ne = O(ee.jsonData);
          if (ne.success && ne.expandedJsonData) {
            const K = ne.expandedJsonData, ie = p(K);
            ie.success && ie.collectionTable && x.push(ie.collectionTable);
            const W = f(K);
            W.success && W.variableTable && w.push(W.variableTable);
          }
        } catch (ne) {
          t.warning(
            `  Could not load tables from ${ee.fileName}: ${ne}`
          );
        }
      let U = null, Y = null;
      w.length > 0 && (U = w[w.length - 1], t.log(
        `  Using variable table with ${U.getSize()} variable(s)`
      )), x.length > 0 && (Y = x[x.length - 1], t.log(
        `  Using collection table with ${Y.getSize()} collection(s)`
      ));
      const re = /* @__PURE__ */ new Map();
      if (Y) {
        const ee = await figma.variables.getLocalVariableCollectionsAsync(), ne = /* @__PURE__ */ new Map();
        for (const ie of ee) {
          const W = Te(ie.name);
          ne.set(W, ie);
        }
        const K = Y.getTable();
        for (const [ie, W] of Object.entries(
          K
        )) {
          const z = W, R = Te(
            z.collectionName
          ), J = ne.get(R);
          J ? (re.set(ie, J), t.log(
            `  Matched collection table index ${ie} ("${z.collectionName}") to collection "${J.name}"`
          )) : t.warning(
            `  Could not find collection for table index ${ie} ("${z.collectionName}")`
          );
        }
      }
      let Q = /* @__PURE__ */ new Map();
      if (U && Y) {
        const { recognizedVariables: ee } = await h(
          U,
          Y,
          re,
          []
          // newlyCreatedCollections - empty since they're already created
        );
        Q = ee, t.log(
          `  Built recognizedVariables map with ${Q.size} variable(s)`
        );
      } else
        t.warning(
          "  Could not build recognizedVariables map - variable or collection table missing"
        );
      const j = await Rt(
        m,
        e.constructionIcon || "",
        Q,
        U || null,
        Y || null,
        re
      );
      t.log(
        `  Resolved: ${j.resolved}, Failed: ${j.failed}`
      ), j.errors.length > 0 && (d.push(...j.errors), I = j.failed);
    } catch (O) {
      const p = `Failed to resolve deferred instances: ${O instanceof Error ? O.message : String(O)}`;
      d.push(p), I = m.length;
    }
  }
  const s = [...new Set(y.collectionIds)];
  if (t.log("=== Import Summary ==="), t.log(
    `  Imported: ${r}, Failed: ${g}, Deferred instances: ${m.length}, Deferred resolution failed: ${I}`
  ), t.log(
    `  Collections in allCreatedEntityIds: ${y.collectionIds.length}, Unique: ${s.length}`
  ), s.length > 0) {
    t.log(`  Created ${s.length} collection(s)`);
    for (const O of s)
      try {
        const p = await figma.variables.getVariableCollectionByIdAsync(O);
        p && t.log(
          `    - "${p.name}" (${O.substring(0, 8)}...)`
        );
      } catch (p) {
      }
  }
  const C = g === 0 && I === 0, $ = C ? `Successfully imported ${r} page(s)${m.length > 0 ? ` (${m.length} deferred instance(s) resolved)` : ""}` : `Import completed with ${g} failure(s). ${d.join("; ")}`, c = "RecursicaImportResult";
  if (S.length > 0) {
    const O = S.map(
      (p) => Qt(p)
    );
    figma.root.setPluginData(
      c,
      JSON.stringify(O)
    ), t.log(
      `Stored ${O.length} sanitized importResult object(s) globally for cleanup/delete operations`
    );
  }
  return {
    type: "importPagesInOrder",
    success: C,
    error: !C,
    message: $,
    data: {
      imported: r,
      failed: g,
      deferred: m.length,
      errors: d,
      importedPages: b
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
    const l = JSON.stringify(a, null, 2), r = JSON.parse(l), g = "Copy - " + r.name, d = figma.createPage();
    if (d.name = g, figma.root.appendChild(d), r.children && r.children.length > 0) {
      let b = function(v) {
        v.forEach((I) => {
          const s = (I.x || 0) + (I.width || 0);
          s > S && (S = s), I.children && I.children.length > 0 && b(I.children);
        });
      };
      console.log(
        "Recreating " + r.children.length + " top-level children..."
      );
      let S = 0;
      b(r.children), console.log("Original content rightmost edge: " + S);
      for (const v of r.children)
        await Xe(v, d, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const m = ut(r);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: r.name,
        newPageName: g,
        totalNodes: m
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
async function xo(e) {
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
function Ae(e, n = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: n
  };
}
function Ve(e, n, o = {}) {
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
async function Ro(e) {
  try {
    const n = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (g) => g.id === n.id
    ), a = n.getPluginData(pn);
    if (!a) {
      const m = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: gt(n.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return Ae("getComponentMetadata", m);
    }
    const r = {
      componentMetadata: JSON.parse(a),
      currentPageIndex: i
    };
    return Ae("getComponentMetadata", r);
  } catch (n) {
    return console.error("Error getting component metadata:", n), Ve(
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
      const l = a, r = l.getPluginData(pn);
      if (r)
        try {
          const g = JSON.parse(r);
          o.push(g);
        } catch (g) {
          console.warn(
            `Failed to parse metadata for page "${l.name}":`,
            g
          );
          const m = {
            _ver: 1,
            id: "",
            name: gt(l.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          o.push(m);
        }
      else {
        const d = {
          _ver: 1,
          id: "",
          name: gt(l.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        o.push(d);
      }
    }
    return Ae("getAllComponents", {
      components: o
    });
  } catch (n) {
    return console.error("Error getting all components:", n), Ve(
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
    } : (tt.handleResponse({ requestId: n, action: o }), {
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
const Oe = "RecursicaPrimaryImport", Be = "RecursicaImportResult", mn = "---", un = "---", Re = "RecursicaImportDivider", Qe = "start", et = "end", Le = "⚠️";
async function Uo(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children;
    for (const i of n) {
      if (i.type !== "PAGE")
        continue;
      const a = i.getPluginData(Oe);
      if (a)
        try {
          const r = JSON.parse(a), g = {
            exists: !0,
            pageId: i.id,
            metadata: r
          };
          return Ae(
            "checkForExistingPrimaryImport",
            g
          );
        } catch (r) {
          t.warning(
            `Failed to parse primary import metadata on page "${i.name}": ${r}`
          );
          continue;
        }
      if (figma.root.getPluginData(Be)) {
        const r = i.getPluginData(Oe);
        if (r)
          try {
            const g = JSON.parse(r), d = {
              exists: !0,
              pageId: i.id,
              metadata: g
            };
            return Ae(
              "checkForExistingPrimaryImport",
              d
            );
          } catch (g) {
          }
      }
    }
    return Ae("checkForExistingPrimaryImport", {
      exists: !1
    });
  } catch (n) {
    return console.error("Error checking for existing primary import:", n), Ve(
      "checkForExistingPrimaryImport",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function Lo(e) {
  try {
    await figma.loadAllPagesAsync();
    const n = figma.root.children.find(
      (g) => g.type === "PAGE" && g.getPluginData(Re) === Qe
    ), o = figma.root.children.find(
      (g) => g.type === "PAGE" && g.getPluginData(Re) === et
    );
    if (n && o) {
      const g = {
        startDividerId: n.id,
        endDividerId: o.id
      };
      return Ae("createImportDividers", g);
    }
    const i = figma.createPage();
    i.name = mn, i.setPluginData(Re, Qe);
    const a = figma.createPage();
    a.name = un, a.setPluginData(Re, et);
    const l = figma.root.children.indexOf(i);
    figma.root.insertChild(l + 1, a), t.log("Created import dividers");
    const r = {
      startDividerId: i.id,
      endDividerId: a.id
    };
    return Ae("createImportDividers", r);
  } catch (n) {
    return console.error("Error creating import dividers:", n), Ve(
      "createImportDividers",
      n instanceof Error ? n : "Unknown error occurred"
    );
  }
}
async function Fo(e) {
  try {
    t.log("=== Starting Single Component Import ==="), t.log("Creating start divider..."), await figma.loadAllPagesAsync();
    let n = figma.root.children.find(
      (p) => p.type === "PAGE" && p.getPluginData(Re) === Qe
    );
    n || (n = figma.createPage(), n.name = mn, n.setPluginData(Re, Qe), t.log("Created start divider"));
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
      constructionIcon: Le
      // Add construction icon to page names
    });
    if (!a.success)
      throw new Error(
        a.message || "Failed to import pages in order"
      );
    await figma.loadAllPagesAsync();
    const l = figma.root.children;
    let r = l.find(
      (p) => p.type === "PAGE" && p.getPluginData(Re) === et
    );
    if (!r) {
      r = figma.createPage(), r.name = un, r.setPluginData(
        Re,
        et
      );
      let p = l.length;
      for (let f = l.length - 1; f >= 0; f--) {
        const h = l[f];
        if (h.type === "PAGE" && h.getPluginData(Re) !== Qe && h.getPluginData(Re) !== et) {
          p = f + 1;
          break;
        }
      }
      figma.root.insertChild(p, r), t.log("Created end divider");
    }
    const g = figma.root.getPluginData(Be);
    if (g)
      try {
        const p = JSON.parse(
          g
        ), f = [];
        if (n && f.push(n.id), r && f.push(r.id), f.length > 0) {
          for (const h of p) {
            h.createdPageIds || (h.createdPageIds = []);
            const w = new Set(h.createdPageIds);
            for (const x of f)
              w.has(x) || h.createdPageIds.push(x);
          }
          figma.root.setPluginData(
            Be,
            JSON.stringify(p)
          ), t.log(
            `Added ${f.length} divider ID(s) to global importResult: ${f.map((h) => h.substring(0, 8) + "...").join(", ")}`
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
    const d = a.data;
    if (t.log(
      "Import completed. ImportResult objects are stored globally for cleanup/delete operations."
    ), !(d != null && d.importedPages) || d.importedPages.length === 0)
      throw new Error("No pages were imported");
    const m = "RecursicaPublishedMetadata", y = e.mainComponent.guid;
    t.log(
      `Looking for main page by GUID: ${y.substring(0, 8)}...`
    );
    let b, S = null;
    for (const p of d.importedPages)
      try {
        const f = await figma.getNodeByIdAsync(
          p.pageId
        );
        if (f && f.type === "PAGE") {
          const h = f.getPluginData(m);
          if (h)
            try {
              if (JSON.parse(h).id === y) {
                b = p.pageId, S = f, t.log(
                  `Found main page by GUID: "${f.name}" (ID: ${p.pageId.substring(0, 12)}...)`
                );
                break;
              }
            } catch (w) {
            }
        }
      } catch (f) {
        t.warning(
          `Error checking page ${p.pageId}: ${f}`
        );
      }
    if (!b) {
      t.log(
        "Main page not found in importedPages list, searching all pages by GUID..."
      ), await figma.loadAllPagesAsync();
      const p = figma.root.children;
      for (const f of p)
        if (f.type === "PAGE") {
          const h = f.getPluginData(m);
          if (h)
            try {
              if (JSON.parse(h).id === y) {
                b = f.id, S = f, t.log(
                  `Found main page by GUID in all pages: "${f.name}" (ID: ${f.id.substring(0, 12)}...)`
                );
                break;
              }
            } catch (w) {
            }
        }
    }
    if (!b || !S) {
      t.error(
        `Failed to find imported main page by GUID: ${y.substring(0, 8)}...`
      ), t.log("Imported pages were:");
      for (const p of d.importedPages)
        t.log(
          `  - "${p.name}" (ID: ${p.pageId.substring(0, 12)}...)`
        );
      throw new Error("Failed to find imported main page ID");
    }
    if (!S || S.type !== "PAGE")
      throw new Error("Failed to get main page node");
    for (const p of d.importedPages)
      try {
        const f = await figma.getNodeByIdAsync(
          p.pageId
        );
        if (f && f.type === "PAGE") {
          const h = f.name.replace(/_\d+$/, "");
          if (!h.startsWith(Le))
            f.name = `${Le} ${h}`;
          else {
            const w = h.replace(Le, "").trim();
            f.name = `${Le} ${w}`;
          }
        }
      } catch (f) {
        t.warning(
          `Failed to process page ${p.pageId}: ${f}`
        );
      }
    await figma.loadAllPagesAsync();
    const v = figma.root.children, I = v.find(
      (p) => p.type === "PAGE" && (p.name === "REMOTES" || p.name === `${Le} REMOTES`)
    );
    I && (I.name.startsWith(Le) || (I.name = `${Le} REMOTES`), t.log("Ensured construction icon on REMOTES page"));
    const s = v.find(
      (p) => p.type === "PAGE" && p.getPluginData(Re) === Qe
    ), C = v.find(
      (p) => p.type === "PAGE" && p.getPluginData(Re) === et
    );
    if (s && C) {
      const p = v.indexOf(s), f = v.indexOf(C);
      for (let h = p + 1; h < f; h++) {
        const w = v[h];
        w.type === "PAGE" && t.log(
          `Found page "${w.name}" between dividers (will be identified by importResult)`
        );
      }
    }
    const $ = [], c = [], F = figma.root.getPluginData(Be), _ = [], L = [];
    if (F)
      try {
        const p = JSON.parse(
          F
        );
        for (const f of p)
          f.createdCollectionIds && _.push(...f.createdCollectionIds), f.createdVariableIds && L.push(...f.createdVariableIds);
      } catch (p) {
        t.warning(
          `[EXTRACTION] Failed to parse global importResult: ${p}`
        );
      }
    if (t.log(
      `[EXTRACTION] Starting collection extraction. Collection IDs from global importResult: ${_.length}`
    ), _.length > 0) {
      t.log(
        `[EXTRACTION] Collection IDs to process: ${_.map((p) => p.substring(0, 8) + "...").join(", ")}`
      );
      for (const p of _)
        try {
          const f = await figma.variables.getVariableCollectionByIdAsync(p);
          f ? ($.push({
            collectionId: f.id,
            collectionName: f.name
          }), t.log(
            `[EXTRACTION] ✓ Extracted collection: "${f.name}" (${p.substring(0, 8)}...)`
          )) : ($.push({
            collectionId: p,
            collectionName: `Unknown (${p.substring(0, 8)}...)`
          }), t.warning(
            `[EXTRACTION] Collection ${p.substring(0, 8)}... not found - will still track for cleanup`
          ));
        } catch (f) {
          $.push({
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
      `[EXTRACTION] Total collections extracted: ${$.length}`
    ), $.length > 0 && t.log(
      `[EXTRACTION] Extracted collections: ${$.map((p) => `"${p.collectionName}" (${p.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), L.length > 0) {
      t.log(
        `[EXTRACTION] Processing ${L.length} variable ID(s)...`
      );
      for (const p of L)
        try {
          const f = await figma.variables.getVariableByIdAsync(p);
          if (f && f.resolvedType) {
            const h = await figma.variables.getVariableCollectionByIdAsync(
              f.variableCollectionId
            );
            h ? c.push({
              variableId: f.id,
              variableName: f.name,
              collectionId: f.variableCollectionId,
              collectionName: h.name
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
    if ($.length === 0 && _.length > 0) {
      t.warning(
        "[EXTRACTION] Collection extraction failed, but IDs are available in global importResult - creating fallback entries"
      );
      for (const p of _)
        $.push({
          collectionId: p,
          collectionName: `Unknown (${p.substring(0, 8)}...)`
        });
    }
    if (c.length === 0 && L.length > 0) {
      t.warning(
        "[EXTRACTION] Variable extraction failed, but IDs are available in global importResult - creating fallback entries"
      );
      for (const p of L)
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
      createdCollections: $,
      createdVariables: c,
      importError: void 0
      // No error yet
    };
    t.log(
      `Storing metadata with ${$.length} collection(s) and ${c.length} variable(s)`
    ), S.setPluginData(
      Oe,
      JSON.stringify(E)
    ), t.log("Stored primary import metadata on main page");
    const k = [];
    d.importedPages && k.push(
      ...d.importedPages.map((p) => p.pageId)
    ), t.log("=== Single Component Import Complete ==="), E.importError = void 0, t.log(
      `[METADATA] About to store metadata with ${$.length} collection(s) and ${c.length} variable(s)`
    ), $.length > 0 && t.log(
      `[METADATA] Collections to store: ${$.map((p) => `"${p.collectionName}" (${p.collectionId.substring(0, 8)}...)`).join(", ")}`
    ), S.setPluginData(
      Oe,
      JSON.stringify(E)
    ), t.log(
      `[METADATA] Stored metadata: ${$.length} collection(s), ${c.length} variable(s)`
    );
    const V = S.getPluginData(Oe);
    if (V)
      try {
        const p = JSON.parse(V);
        t.log(
          `[METADATA] Verification: Stored metadata has ${p.createdCollections.length} collection(s) and ${p.createdVariables.length} variable(s)`
        );
      } catch (p) {
        t.warning("[METADATA] Failed to verify stored metadata");
      }
    const O = {
      success: !0,
      mainPageId: S.id,
      importedPageIds: k,
      createdCollections: $,
      createdVariables: c
    };
    return Ae("importSingleComponentWithWizard", O);
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    t.error(`Import failed: ${o}`);
    try {
      await figma.loadAllPagesAsync();
      const i = figma.root.children;
      let a = null;
      for (const l of i) {
        if (l.type !== "PAGE") continue;
        const r = l.getPluginData(Oe);
        if (r)
          try {
            if (JSON.parse(r).componentGuid === e.mainComponent.guid) {
              a = l;
              break;
            }
          } catch (g) {
          }
      }
      if (a) {
        const l = a.getPluginData(Oe);
        if (l)
          try {
            const r = JSON.parse(l);
            t.log(
              `[CATCH] Found existing metadata with ${r.createdCollections.length} collection(s) and ${r.createdVariables.length} variable(s)`
            ), r.importError = o, a.setPluginData(
              Oe,
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
        const l = [], r = "RecursicaPublishedMetadata", g = figma.root.getPluginData(Be), d = [];
        if (g)
          try {
            const b = JSON.parse(
              g
            );
            for (const S of b)
              S.createdPageIds && d.push(...S.createdPageIds);
          } catch (b) {
          }
        for (const b of i) {
          if (b.type !== "PAGE") continue;
          const S = !!b.getPluginData(r), v = d.includes(b.id);
          (S || v) && l.push(b);
        }
        const m = [];
        if (e.wizardSelections) {
          const b = await figma.variables.getLocalVariableCollectionsAsync(), S = [
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
          for (const { choice: v, normalizedName: I } of S)
            if (v === "new") {
              const s = b.filter((C) => Te(C.name) === I);
              if (s.length > 0) {
                const C = s[0];
                m.push({
                  collectionId: C.id,
                  collectionName: C.name
                }), t.log(
                  `Found created collection: "${C.name}" (${C.id.substring(0, 8)}...)`
                );
              }
            }
        }
        const y = [];
        if (l.length > 0) {
          const b = l[0], S = {
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
            createdCollections: m,
            createdVariables: y,
            importError: o
          };
          b.setPluginData(
            Oe,
            JSON.stringify(S)
          ), t.log(
            `Created fallback metadata with ${m.length} collection(s) and error information`
          );
        }
      }
    } catch (i) {
      t.warning(
        `Failed to store error metadata: ${i instanceof Error ? i.message : String(i)}`
      );
    }
    return Ve(
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
    const o = n.getPluginData(Oe);
    if (!o)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(o);
    t.log(
      `Found metadata: ${i.createdCollections.length} collection(s), ${i.createdVariables.length} variable(s) to delete`
    ), await figma.loadAllPagesAsync();
    const a = figma.root.children, l = [], r = "RecursicaPublishedMetadata", g = figma.root.getPluginData(Be), d = [];
    if (g)
      try {
        const s = JSON.parse(g);
        for (const C of s)
          C.createdPageIds && d.push(...C.createdPageIds);
        t.log(
          `Found ${d.length} page ID(s) in global importResult (includes dividers)`
        );
      } catch (s) {
        t.warning(`Failed to parse global importResult: ${s}`);
      }
    if (d.length > 0)
      for (const s of d)
        try {
          const C = await figma.getNodeByIdAsync(
            s
          );
          C && C.type === "PAGE" && (l.push(C), t.log(
            `Found page to delete from importResult: "${C.name}" (${s.substring(0, 8)}...)`
          ));
        } catch (C) {
          t.warning(
            `Could not get page ${s.substring(0, 8)}...: ${C}`
          );
        }
    else {
      t.log(
        "No importResult found, falling back to PAGE_METADATA_KEY for page identification"
      );
      for (const s of a) {
        if (s.type !== "PAGE")
          continue;
        !!s.getPluginData(r) && (l.push(s), t.log(`Found page to delete (legacy): "${s.name}"`));
      }
    }
    t.log(
      `Deleting ${i.createdVariables.length} variable(s) from existing collections...`
    );
    let m = 0;
    for (const s of i.createdVariables)
      try {
        const C = await figma.variables.getVariableByIdAsync(
          s.variableId
        );
        C ? (C.remove(), m++, t.log(
          `Deleted variable: ${s.variableName} from collection ${s.collectionName}`
        )) : t.warning(
          `Variable ${s.variableName} (${s.variableId}) not found - may have already been deleted`
        );
      } catch (C) {
        t.warning(
          `Failed to delete variable ${s.variableName}: ${C instanceof Error ? C.message : String(C)}`
        );
      }
    t.log(
      `Deleting ${i.createdCollections.length} collection(s)...`
    );
    let y = 0;
    for (const s of i.createdCollections)
      try {
        const C = await figma.variables.getVariableCollectionByIdAsync(
          s.collectionId
        );
        C ? (C.remove(), y++, t.log(
          `Deleted collection: ${s.collectionName} (${s.collectionId})`
        )) : t.warning(
          `Collection ${s.collectionName} (${s.collectionId}) not found - may have already been deleted`
        );
      } catch (C) {
        t.warning(
          `Failed to delete collection ${s.collectionName}: ${C instanceof Error ? C.message : String(C)}`
        );
      }
    const b = l.map((s) => ({
      page: s,
      name: s.name,
      id: s.id
    })), S = figma.currentPage;
    if (b.some(
      (s) => s.id === S.id
    )) {
      await figma.loadAllPagesAsync();
      const C = figma.root.children.find(
        ($) => $.type === "PAGE" && !b.some((c) => c.id === $.id)
      );
      C ? (await figma.setCurrentPageAsync(C), t.log(
        `Switched away from page "${S.name}" before deletion`
      )) : t.warning(
        "No safe page to switch to - all pages are being deleted"
      );
    }
    for (const { page: s, name: C } of b)
      try {
        let $ = !1;
        try {
          await figma.loadAllPagesAsync(), $ = figma.root.children.some((F) => F.id === s.id);
        } catch (c) {
          $ = !1;
        }
        if (!$) {
          t.log(`Page "${C}" already deleted, skipping`);
          continue;
        }
        if (figma.currentPage.id === s.id) {
          await figma.loadAllPagesAsync();
          const F = figma.root.children.find(
            (_) => _.type === "PAGE" && _.id !== s.id && !b.some((L) => L.id === _.id)
          );
          F && await figma.setCurrentPageAsync(F);
        }
        s.remove(), t.log(`Deleted page: "${C}"`);
      } catch ($) {
        t.warning(
          `Failed to delete page "${C}": ${$ instanceof Error ? $.message : String($)}`
        );
      }
    t.log("=== Import Group Deletion Complete ===");
    const I = {
      success: !0,
      deletedPages: l.length,
      deletedCollections: y,
      deletedVariables: m
    };
    return Ae("deleteImportGroup", I);
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Delete failed: ${o}`), Ve(
      "deleteImportGroup",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Bo(e) {
  try {
    t.log("=== Cleaning up failed import ==="), await figma.loadAllPagesAsync();
    const n = figma.root.children, o = "RecursicaPublishedMetadata", i = "RecursicaCreatedEntities", a = figma.root.getPluginData(Be), l = !!a;
    let r = !1;
    for (const $ of n) {
      if ($.type !== "PAGE")
        continue;
      if ($.getPluginData(i)) {
        r = !0;
        break;
      }
    }
    if (l)
      t.log(
        "Found global RecursicaImportResult, using importResult-based cleanup logic"
      );
    else if (r)
      t.log(
        "Found pages with RecursicaCreatedEntities (legacy), using createdEntities-based cleanup logic"
      );
    else {
      let $ = null;
      for (const c of n) {
        if (c.type !== "PAGE")
          continue;
        if (c.getPluginData(Oe)) {
          $ = c;
          break;
        }
      }
      if ($)
        return t.log(
          "Found page with PRIMARY_IMPORT_KEY (old system), using deleteImportGroup"
        ), await hn({ pageId: $.id });
      t.log(
        "No primary metadata found, looking for pages using global importResult or PAGE_METADATA_KEY"
      );
    }
    const g = [], d = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
    let y = [];
    if (l)
      try {
        y = JSON.parse(a), t.log(
          `Found ${y.length} importResult object(s) in global storage`
        );
        for (const $ of y) {
          if ($.createdCollectionIds)
            for (const c of $.createdCollectionIds)
              d.add(c);
          if ($.createdVariableIds)
            for (const c of $.createdVariableIds)
              m.add(c);
        }
        t.log(
          `Extracted ${d.size} collection ID(s) and ${m.size} variable ID(s) from global importResult`
        );
      } catch ($) {
        t.warning(`Failed to parse global importResult: ${$}`);
      }
    else if (r) {
      t.log(
        `Scanning ${n.length} page(s) for legacy created entities...`
      );
      for (const $ of n) {
        if ($.type !== "PAGE")
          continue;
        const c = $.getPluginData(i);
        if (c)
          try {
            const F = JSON.parse(c);
            if (F.collectionIds)
              for (const _ of F.collectionIds)
                d.add(_);
            if (F.variableIds)
              for (const _ of F.variableIds)
                m.add(_);
          } catch (F) {
            t.warning(
              `Failed to parse created entities from page "${$.name}": ${F}`
            );
          }
      }
    }
    t.log(
      `Scanning ${n.length} page(s) for pages to delete...`
    );
    for (const $ of n) {
      if ($.type !== "PAGE")
        continue;
      const c = $.getPluginData(o), F = $.getPluginData(i), _ = l && y.some((L) => {
        var E;
        return (E = L.createdPageIds) == null ? void 0 : E.includes($.id);
      });
      t.log(
        `  Checking page "${$.name}": hasMetadata=${!!c}, isInImportResult=${_}, hasLegacyCreatedEntities=${!!F}`
      ), (_ || c) && (g.push({ id: $.id, name: $.name }), t.log(
        `Found page to delete: "${$.name}" (isInImportResult: ${_}, hasMetadata: ${!!c})`
      ));
    }
    if (l && y.length > 0) {
      t.log(
        "Checking global importResult for additional pages to delete..."
      );
      for (const $ of y)
        if ($.createdPageIds) {
          for (const c of $.createdPageIds)
            if (!g.some((F) => F.id === c))
              try {
                const F = await figma.getNodeByIdAsync(
                  c
                );
                F && F.type === "PAGE" && (g.push({
                  id: F.id,
                  name: F.name
                }), t.log(
                  `  Added additional page from global importResult.createdPageIds: "${F.name}"`
                ));
              } catch (F) {
                t.warning(
                  `  Could not get page ${c.substring(0, 8)}...: ${F}`
                );
              }
        }
    } else if (r)
      for (const $ of n) {
        if ($.type !== "PAGE")
          continue;
        const c = $.getPluginData(i);
        if (c)
          try {
            const F = JSON.parse(c);
            if (F.pageIds) {
              for (const _ of F.pageIds)
                if (!g.some((L) => L.id === _))
                  try {
                    const L = await figma.getNodeByIdAsync(
                      _
                    );
                    L && L.type === "PAGE" && (g.push({
                      id: L.id,
                      name: L.name
                    }), t.log(
                      `  Added additional page from legacy createdEntities.pageIds: "${L.name}"`
                    ));
                  } catch (L) {
                    t.warning(
                      `  Could not get page ${_.substring(0, 8)}...: ${L}`
                    );
                  }
            }
          } catch (F) {
            t.warning(
              `  Failed to parse legacy createdEntities from page "${$.name}": ${F}`
            );
          }
      }
    t.log(
      `Cleanup summary: Found ${g.length} page(s) to delete, ${d.size} collection(s) to delete, ${m.size} variable(s) to delete`
    );
    const b = figma.currentPage;
    if (g.some(
      ($) => $.id === b.id
    )) {
      await figma.loadAllPagesAsync();
      const c = figma.root.children.find(
        (F) => F.type === "PAGE" && !g.some((_) => _.id === F.id)
      );
      c && (await figma.setCurrentPageAsync(c), t.log(
        `Switched away from page "${b.name}" before deletion`
      ));
    }
    let v = 0;
    for (const $ of g)
      try {
        await figma.loadAllPagesAsync();
        const c = await figma.getNodeByIdAsync(
          $.id
        );
        if (!c || c.type !== "PAGE")
          continue;
        if (figma.currentPage.id === c.id) {
          await figma.loadAllPagesAsync();
          const _ = figma.root.children.find(
            (L) => L.type === "PAGE" && L.id !== c.id && !g.some((E) => E.id === L.id)
          );
          _ && await figma.setCurrentPageAsync(_);
        }
        c.remove(), v++, t.log(`Deleted page: "${$.name}"`);
      } catch (c) {
        t.warning(
          `Failed to delete page "${$.name}" (${$.id.substring(0, 8)}...): ${c instanceof Error ? c.message : String(c)}`
        );
      }
    let I = 0, s = 0;
    for (const $ of m)
      try {
        const c = await figma.variables.getVariableByIdAsync($);
        if (c) {
          const F = c.variableCollectionId;
          d.has(F) || (c.remove(), s++, t.log(
            `Deleted variable: ${c.name} (${$.substring(0, 8)}...)`
          ));
        }
      } catch (c) {
        t.warning(
          `Could not delete variable ${$.substring(0, 8)}...: ${c instanceof Error ? c.message : String(c)}`
        );
      }
    for (const $ of d)
      try {
        const c = await figma.variables.getVariableCollectionByIdAsync($);
        c && (c.remove(), I++, t.log(
          `Deleted collection: "${c.name}" (${$.substring(0, 8)}...)`
        ));
      } catch (c) {
        t.warning(
          `Could not delete collection ${$.substring(0, 8)}...: ${c instanceof Error ? c.message : String(c)}`
        );
      }
    return l && (figma.root.setPluginData(Be, ""), t.log("Cleared global importResult after cleanup")), t.log("=== Failed Import Cleanup Complete ==="), Ae("cleanupFailedImport", {
      success: !0,
      deletedPages: v,
      deletedCollections: I,
      deletedVariables: s
    });
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Cleanup failed: ${o}`), Ve(
      "cleanupFailedImport",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Go(e) {
  try {
    t.log("=== Clearing Import Metadata ==="), await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!n || n.type !== "PAGE")
      throw new Error("Page not found");
    return n.setPluginData(Oe, ""), figma.root.setPluginData(Be, ""), t.log("Cleared global importResult after clearing metadata"), t.log("Cleared import metadata from page and related pages"), Ae("clearImportMetadata", {
      success: !0
    });
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Clear metadata failed: ${o}`), Ve(
      "clearImportMetadata",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function _o(e) {
  try {
    t.log("=== Summarizing Variables for Wizard ===");
    const n = [];
    for (const { fileName: v, jsonData: I } of e.jsonFiles)
      try {
        const s = yt(I);
        if (!s.success || !s.expandedJsonData) {
          t.warning(
            `Skipping ${v} - failed to expand JSON: ${s.error || "Unknown error"}`
          );
          continue;
        }
        const C = s.expandedJsonData;
        if (!C.collections)
          continue;
        const c = it.fromTable(
          C.collections
        );
        if (!C.variables)
          continue;
        const _ = rt.fromTable(C.variables).getTable();
        for (const L of Object.values(_)) {
          if (L._colRef === void 0)
            continue;
          const E = c.getCollectionByIndex(
            L._colRef
          );
          if (E) {
            const V = Te(
              E.collectionName
            ).toLowerCase();
            (V === "tokens" || V === "theme" || V === "layer") && n.push({
              name: L.variableName,
              collectionName: V
              // Use lowercase for consistency ("layer" not "layers")
            });
          }
        }
      } catch (s) {
        t.warning(
          `Error processing ${v}: ${s instanceof Error ? s.message : String(s)}`
        );
        continue;
      }
    const o = await figma.variables.getLocalVariableCollectionsAsync();
    let i = null, a = null, l = null;
    for (const v of o) {
      const s = Te(v.name).toLowerCase();
      (s === "tokens" || s === "token") && !i ? i = v : (s === "theme" || s === "themes") && !a ? a = v : (s === "layer" || s === "layers") && !l && (l = v);
    }
    const r = n.filter(
      (v) => v.collectionName === "tokens"
    ), g = n.filter((v) => v.collectionName === "theme"), d = n.filter((v) => v.collectionName === "layer"), m = {
      existing: 0,
      new: 0
    }, y = {
      existing: 0,
      new: 0
    }, b = {
      existing: 0,
      new: 0
    };
    if (e.tokensCollection === "existing" && i) {
      const v = /* @__PURE__ */ new Set();
      for (const I of i.variableIds)
        try {
          const s = figma.variables.getVariableById(I);
          s && v.add(s.name);
        } catch (s) {
          continue;
        }
      for (const I of r)
        v.has(I.name) ? m.existing++ : m.new++;
    } else
      m.new = r.length;
    if (e.themeCollection === "existing" && a) {
      const v = /* @__PURE__ */ new Set();
      for (const I of a.variableIds)
        try {
          const s = figma.variables.getVariableById(I);
          s && v.add(s.name);
        } catch (s) {
          continue;
        }
      for (const I of g)
        v.has(I.name) ? y.existing++ : y.new++;
    } else
      y.new = g.length;
    if (e.layersCollection === "existing" && l) {
      const v = /* @__PURE__ */ new Set();
      for (const I of l.variableIds)
        try {
          const s = figma.variables.getVariableById(I);
          s && v.add(s.name);
        } catch (s) {
          continue;
        }
      for (const I of d)
        v.has(I.name) ? b.existing++ : b.new++;
    } else
      b.new = d.length;
    return t.log(
      `Variable summary: Tokens - ${m.existing} existing, ${m.new} new; Theme - ${y.existing} existing, ${y.new} new; Layers - ${b.existing} existing, ${b.new} new`
    ), Ae("summarizeVariablesForWizard", {
      tokens: m,
      theme: y,
      layers: b
    });
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Summarize failed: ${o}`), Ve(
      "summarizeVariablesForWizard",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function zo(e) {
  try {
    const n = "recursica:collectionId", i = {
      collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((a) => {
        const l = a.getSharedPluginData("recursica", n);
        return {
          id: a.id,
          name: a.name,
          guid: l || void 0
        };
      })
    };
    return Ae(
      "getLocalVariableCollections",
      i
    );
  } catch (n) {
    return Ve(
      "getLocalVariableCollections",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function jo(e) {
  try {
    const n = "recursica:collectionId", o = [];
    for (const a of e.collectionIds)
      try {
        const l = await figma.variables.getVariableCollectionByIdAsync(a);
        if (l) {
          const r = l.getSharedPluginData(
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
      } catch (l) {
        t.warning(
          `Failed to get GUID for collection ${a}: ${l instanceof Error ? l.message : String(l)}`
        ), o.push({
          collectionId: a,
          guid: null
        });
      }
    return Ae(
      "getCollectionGuids",
      {
        collectionGuids: o
      }
    );
  } catch (n) {
    return Ve(
      "getCollectionGuids",
      n instanceof Error ? n : new Error(String(n))
    );
  }
}
async function Jo(e) {
  try {
    t.log("=== Starting Import Group Merge ==="), await figma.loadAllPagesAsync();
    const n = await figma.getNodeByIdAsync(
      e.pageId
    );
    if (!n || n.type !== "PAGE")
      throw new Error("Main page not found");
    const o = n.getPluginData(Oe);
    if (!o)
      throw new Error("Primary import metadata not found on page");
    const i = JSON.parse(o);
    t.log(
      `Found metadata for component: ${i.componentName} (Version: ${i.componentVersion})`
    );
    let a = 0, l = 0;
    const r = "recursica:collectionId";
    for (const C of e.collectionChoices)
      if (C.choice === "merge")
        try {
          const $ = await figma.variables.getVariableCollectionByIdAsync(
            C.newCollectionId
          );
          if (!$) {
            t.warning(
              `New collection ${C.newCollectionId} not found, skipping merge`
            );
            continue;
          }
          let c = null;
          if (C.existingCollectionId)
            c = await figma.variables.getVariableCollectionByIdAsync(
              C.existingCollectionId
            );
          else {
            const V = $.getSharedPluginData(
              "recursica",
              r
            );
            if (V) {
              const O = await figma.variables.getLocalVariableCollectionsAsync();
              for (const p of O)
                if (p.getSharedPluginData(
                  "recursica",
                  r
                ) === V && p.id !== C.newCollectionId) {
                  c = p;
                  break;
                }
              if (!c && (V === _e.LAYER || V === _e.TOKENS || V === _e.THEME)) {
                let p;
                V === _e.LAYER ? p = Ue.LAYER : V === _e.TOKENS ? p = Ue.TOKENS : p = Ue.THEME;
                for (const f of O)
                  if (f.getSharedPluginData(
                    "recursica",
                    r
                  ) === V && f.name === p && f.id !== C.newCollectionId) {
                    c = f;
                    break;
                  }
                c || (c = figma.variables.createVariableCollection(p), c.setSharedPluginData(
                  "recursica",
                  r,
                  V
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
            `Merging collection "${$.name}" (${C.newCollectionId.substring(0, 8)}...) into "${c.name}" (${c.id.substring(0, 8)}...)`
          );
          const F = $.variableIds.map(
            (V) => figma.variables.getVariableByIdAsync(V)
          ), _ = await Promise.all(F), L = c.variableIds.map(
            (V) => figma.variables.getVariableByIdAsync(V)
          ), E = await Promise.all(L), k = new Set(
            E.filter((V) => V !== null).map((V) => V.name)
          );
          for (const V of _)
            if (V)
              try {
                if (k.has(V.name)) {
                  t.warning(
                    `Variable "${V.name}" already exists in collection "${c.name}", skipping`
                  );
                  continue;
                }
                const O = figma.variables.createVariable(
                  V.name,
                  c,
                  V.resolvedType
                );
                for (const p of c.modes) {
                  const f = p.modeId;
                  let h = V.valuesByMode[f];
                  if (h === void 0 && $.modes.length > 0) {
                    const w = $.modes[0].modeId;
                    h = V.valuesByMode[w];
                  }
                  h !== void 0 && O.setValueForMode(f, h);
                }
                t.log(
                  `  ✓ Copied variable "${V.name}" to collection "${c.name}"`
                );
              } catch (O) {
                t.warning(
                  `Failed to copy variable "${V.name}": ${O instanceof Error ? O.message : String(O)}`
                );
              }
          $.remove(), a++, t.log(
            `✓ Merged and deleted collection: ${$.name}`
          );
        } catch ($) {
          t.warning(
            `Failed to merge collection: ${$ instanceof Error ? $.message : String($)}`
          );
        }
      else
        l++, t.log(`Kept collection: ${C.newCollectionId}`);
    t.log("Removing dividers...");
    const g = figma.root.children, d = [];
    for (const C of g) {
      if (C.type !== "PAGE") continue;
      const $ = C.getPluginData(Re);
      ($ === "start" || $ === "end") && d.push(C);
    }
    const m = figma.currentPage;
    if (d.some((C) => C.id === m.id))
      if (n && n.id !== m.id)
        figma.currentPage = n;
      else {
        const C = g.find(
          ($) => $.type === "PAGE" && !d.some((c) => c.id === $.id)
        );
        C && (figma.currentPage = C);
      }
    const y = d.map((C) => C.name);
    for (const C of d)
      try {
        C.remove();
      } catch ($) {
        t.warning(
          `Failed to delete divider: ${$ instanceof Error ? $.message : String($)}`
        );
      }
    for (const C of y)
      t.log(`Deleted divider: ${C}`);
    t.log("Removing construction icons and renaming pages..."), await figma.loadAllPagesAsync();
    const b = figma.root.children;
    let S = 0;
    const v = "RecursicaPublishedMetadata", I = [];
    for (const C of b)
      if (C.type === "PAGE")
        try {
          const $ = C.getPluginData(v), c = !!$, F = figma.root.getPluginData(
            "RecursicaImportResult"
          );
          let _ = !1;
          if (F)
            try {
              _ = JSON.parse(F).some(
                (E) => {
                  var k;
                  return (k = E.createdPageIds) == null ? void 0 : k.includes(C.id);
                }
              );
            } catch (L) {
            }
          if (c || _) {
            let L = {};
            if ($)
              try {
                L = JSON.parse($);
              } catch (E) {
              }
            I.push({
              pageId: C.id,
              pageName: C.name,
              pageMetadata: L
            });
          }
        } catch ($) {
          t.warning(
            `Failed to process page: ${$ instanceof Error ? $.message : String($)}`
          );
        }
    for (const C of I)
      try {
        const $ = await figma.getNodeByIdAsync(
          C.pageId
        );
        if (!$ || $.type !== "PAGE") {
          t.warning(
            `Page ${C.pageId} not found, skipping rename`
          );
          continue;
        }
        let c = $.name;
        if (c.startsWith(Le) && (c = c.substring(Le.length).trim()), c === "REMOTES" || c.includes("REMOTES")) {
          $.name = "REMOTES", S++, t.log(`Renamed page: "${$.name}" -> "REMOTES"`);
          continue;
        }
        const _ = C.pageMetadata.name && C.pageMetadata.name.length > 0 && !C.pageMetadata.name.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        ) ? C.pageMetadata.name : i.componentName || c, L = C.pageMetadata.version !== void 0 ? C.pageMetadata.version : i.componentVersion, E = `${_} (VERSION: ${L})`;
        $.name = E, S++, t.log(`Renamed page: "${c}" -> "${E}"`);
      } catch ($) {
        t.warning(
          `Failed to rename page ${C.pageId}: ${$ instanceof Error ? $.message : String($)}`
        );
      }
    if (t.log("Clearing import metadata..."), n)
      try {
        n.setPluginData(Oe, "");
      } catch (C) {
        t.warning(
          `Failed to clear primary import metadata: ${C instanceof Error ? C.message : String(C)}`
        );
      }
    for (const C of I)
      ;
    const s = {
      mergedCollections: a,
      keptCollections: l,
      pagesRenamed: S
    };
    return t.log(
      `=== Merge Complete ===
  Merged: ${a} collection(s)
  Kept: ${l} collection(s)
  Renamed: ${S} page(s)`
    ), Ae(
      "mergeImportGroup",
      s
    );
  } catch (n) {
    return t.error(
      `Merge failed: ${n instanceof Error ? n.message : String(n)}`
    ), Ve(
      "mergeImportGroup",
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
    const l = [];
    t.log(
      `
--- Test 1: Component with children → Create instance ---`
    );
    const r = figma.createComponent();
    r.name = "Test Component - With Children", r.resize(200, 200), a.appendChild(r);
    const g = figma.createFrame();
    g.name = "Child 1", g.resize(50, 50), g.x = 10, g.y = 10, r.appendChild(g);
    const d = figma.createFrame();
    d.name = "Child 2", d.resize(50, 50), d.x = 70, d.y = 10, r.appendChild(d), t.log(
      `  Created component "${r.name}" with ${r.children.length} children`
    ), t.log(
      `  Component children: ${r.children.map((T) => T.name).join(", ")}`
    );
    const m = r.createInstance();
    m.name = "Instance 1 - From Component", a.appendChild(m), t.log(`  Created instance "${m.name}" from component`);
    const y = m.children.length;
    if (t.log(
      `  Instance children count immediately after creation: ${y}`
    ), y > 0) {
      t.log(
        `  Instance children: ${m.children.map((Z) => Z.name).join(", ")}`
      ), t.log(
        `  Instance child types: ${m.children.map((Z) => Z.type).join(", ")}`
      );
      const T = m.children[0];
      if (t.log(
        `  First child: name="${T.name}", type="${T.type}", id="${T.id}"`
      ), t.log(
        `  First child parent: ${(n = T.parent) == null ? void 0 : n.name} (id: ${(o = T.parent) == null ? void 0 : o.id})`
      ), "mainComponent" in T) {
        const Z = await T.getMainComponentAsync();
        t.log(
          `  First child mainComponent: ${(Z == null ? void 0 : Z.name) || "none"}`
        );
      }
      t.log(
        `  Component children IDs: ${r.children.map((Z) => Z.id).join(", ")}`
      ), t.log(
        `  Instance children IDs: ${m.children.map((Z) => Z.id).join(", ")}`
      );
      const pe = m.children[0].id !== r.children[0].id;
      t.log(
        `  Are instance children different nodes from component children? ${pe}`
      );
    } else
      t.log(
        "  ⚠️ Instance has NO children immediately after creation"
      );
    if (l.push({
      test: "Instance has children immediately",
      success: y > 0,
      details: {
        instanceChildrenCount: y,
        componentChildrenCount: r.children.length,
        instanceChildren: m.children.map((T) => ({
          name: T.name,
          type: T.type,
          id: T.id
        }))
      }
    }), t.log(
      `
--- Test 2: Create instance override by replacing child ---`
    ), y > 0) {
      const T = m.children[0];
      t.log(
        `  Original child to replace: "${T.name}" (id: ${T.id})`
      );
      const pe = figma.createFrame();
      pe.name = "Override Child", pe.resize(60, 60), pe.x = T.x, pe.y = T.y, a.appendChild(pe), t.log(
        `  Created override child "${pe.name}" as child of Test frame`
      );
      let Z = !1, N;
      try {
        const P = m.children.indexOf(T);
        m.insertChild(P, pe), T.remove(), Z = !0, t.log(
          `  ✓ Successfully replaced child at index ${P}`
        );
      } catch (P) {
        N = P instanceof Error ? P.message : String(P), t.log(
          `  ✗ Cannot move node into instance: ${N}`
        ), t.log(
          "  → This means we cannot directly move placeholder children into instances"
        ), t.log(
          "  → We must create NEW nodes and copy properties instead"
        ), pe.remove();
      }
      if (Z) {
        t.log(
          `  Instance children after override: ${m.children.map((u) => u.name).join(", ")}`
        ), t.log(
          `  Instance children count after override: ${m.children.length}`
        ), t.log(
          `  Component children after override: ${r.children.map((u) => u.name).join(", ")}`
        ), t.log(
          `  Component children count after override: ${r.children.length}`
        );
        const P = r.children.length === 2 && r.children[0].name === "Child 1" && r.children[1].name === "Child 2";
        l.push({
          test: "Instance override doesn't affect component",
          success: P,
          details: {
            instanceChildrenAfterOverride: m.children.map((u) => ({
              name: u.name,
              type: u.type,
              id: u.id
            })),
            componentChildrenAfterOverride: r.children.map((u) => ({
              name: u.name,
              type: u.type,
              id: u.id
            }))
          }
        });
      } else
        t.log(
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
      t.log(
        "  ⚠️ Skipping override test - instance has no children"
      ), l.push({
        test: "Instance override doesn't affect component",
        success: !1,
        details: { reason: "Instance has no children to override" }
      });
    t.log(
      `
--- Test 3: Merge placeholder children into instance ---`
    );
    const b = r.createInstance();
    b.name = "Instance 2 - For Placeholder Merge", b.x = 250, a.appendChild(b), t.log(
      `  Created instance "${b.name}" with ${b.children.length} children`
    );
    const S = figma.createFrame();
    S.name = "[Deferred: Placeholder]", S.resize(200, 200), a.appendChild(S);
    const v = figma.createFrame();
    v.name = "Child 1", v.resize(60, 60), v.x = 10, v.y = 10, S.appendChild(v);
    const I = figma.createFrame();
    I.name = "Placeholder Only Child", I.resize(50, 50), I.x = 80, I.y = 10, S.appendChild(I), t.log(
      `  Created placeholder with ${S.children.length} children: ${S.children.map((T) => T.name).join(", ")}`
    ), t.log(
      `  Instance has ${b.children.length} children: ${b.children.map((T) => T.name).join(", ")}`
    );
    let s = !1, C = {}, $;
    if (b.children.length > 0 && S.children.length > 0) {
      t.log("  Attempting to merge placeholder children..."), t.log(
        "  → Since we cannot move nodes into instances, we'll test creating new nodes"
      );
      const T = [];
      for (const Z of S.children) {
        const N = b.children.find(
          (P) => P.name === Z.name
        );
        if (N) {
          t.log(
            `  Found matching child "${Z.name}" in instance - attempting to replace`
          );
          try {
            const P = b.children.indexOf(N);
            b.insertChild(P, Z), N.remove(), T.push({
              name: Z.name,
              source: "replaced existing"
            }), t.log(
              `    ✓ Successfully replaced "${Z.name}"`
            );
          } catch (P) {
            const u = P instanceof Error ? P.message : String(P);
            t.log(
              `    ✗ Cannot move "${Z.name}" into instance: ${u}`
            ), t.log(
              "    → Must create new node and copy properties instead"
            ), T.push({
              name: Z.name,
              source: "replaced existing (failed)",
              error: u
            }), $ = u;
          }
        } else {
          t.log(
            `  No matching child for "${Z.name}" - attempting to append`
          );
          try {
            b.appendChild(Z), T.push({
              name: Z.name,
              source: "appended new"
            }), t.log(
              `    ✓ Successfully appended "${Z.name}"`
            );
          } catch (P) {
            const u = P instanceof Error ? P.message : String(P);
            t.log(
              `    ✗ Cannot append "${Z.name}" to instance: ${u}`
            ), t.log(
              "    → Must create new node and copy properties instead"
            ), T.push({
              name: Z.name,
              source: "appended new (failed)",
              error: u
            }), $ = u;
          }
        }
      }
      t.log(
        `  After merge attempt, instance has ${b.children.length} children: ${b.children.map((Z) => Z.name).join(", ")}`
      );
      const pe = T.filter(
        (Z) => !Z.error && Z.source !== "replaced existing (failed)" && Z.source !== "appended new (failed)"
      );
      $ ? (t.log(
        "  → Merge failed: Cannot move nodes into instances (expected behavior)"
      ), t.log(
        "  → Solution: Must create NEW nodes and copy properties from placeholder children"
      ), s = !0) : s = pe.length > 0, C = {
        mergedChildren: T,
        successfulMerges: pe.length,
        failedMerges: T.length - pe.length,
        mergeError: $,
        finalInstanceChildren: b.children.map((Z) => ({
          name: Z.name,
          type: Z.type,
          id: Z.id
        })),
        finalInstanceChildrenCount: b.children.length,
        note: $ ? "Cannot move nodes into instances - must create new nodes and copy properties" : "Merge succeeded"
      };
    } else
      t.log(
        "  ⚠️ Cannot merge - instance or placeholder has no children"
      ), C = {
        instanceChildrenCount: b.children.length,
        placeholderChildrenCount: S.children.length
      };
    l.push({
      test: "Merge placeholder children into instance",
      success: s,
      details: C
    }), t.log(`
--- Test 4: getMainComponent behavior ---`);
    const c = await m.getMainComponentAsync();
    if (t.log(
      `  Instance mainComponent: ${(c == null ? void 0 : c.name) || "none"} (id: ${(c == null ? void 0 : c.id) || "none"})`
    ), t.log(`  MainComponent type: ${(c == null ? void 0 : c.type) || "none"}`), c) {
      t.log(
        `  MainComponent children: ${c.children.map((pe) => pe.name).join(", ")}`
      ), t.log(
        `  MainComponent children count: ${c.children.length}`
      ), t.log(
        `  Instance children count: ${m.children.length}`
      );
      const T = m.children.length === c.children.length && m.children.every(
        (pe, Z) => pe.name === c.children[Z].name
      );
      t.log(
        `  Do instance children match mainComponent children? ${T}`
      ), l.push({
        test: "getMainComponent returns component",
        success: c.id === r.id,
        details: {
          mainComponentId: c.id,
          componentId: r.id,
          childrenMatch: T,
          instanceChildrenCount: m.children.length,
          mainComponentChildrenCount: c.children.length
        }
      });
    } else
      l.push({
        test: "getMainComponent returns component",
        success: !1,
        details: { reason: "getMainComponentAsync returned null" }
      });
    t.log(
      `
--- Test 5: Recreate children from JSON (simulating deferred resolution) ---`
    );
    const F = figma.createComponent();
    F.name = "Test Component - For JSON Recreation", F.resize(300, 300), a.appendChild(F);
    const _ = figma.createFrame();
    _.name = "Default Child 1", _.resize(50, 50), _.fills = [{ type: "SOLID", color: { r: 1, g: 0, b: 0 } }], F.appendChild(_);
    const L = figma.createFrame();
    L.name = "Default Child 2", L.resize(50, 50), L.fills = [{ type: "SOLID", color: { r: 0, g: 1, b: 0 } }], F.appendChild(L);
    const E = figma.createFrame();
    E.name = "Default Child 3", E.resize(50, 50), E.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 1 } }], F.appendChild(E), t.log(
      `  Created component "${F.name}" with ${F.children.length} default children`
    ), t.log(
      `  Default children: ${F.children.map((T) => T.name).join(", ")}`
    );
    const k = F.createInstance();
    k.name = "Instance 3 - For JSON Recreation", k.x = 350, a.appendChild(k), t.log(
      `  Created instance "${k.name}" with ${k.children.length} default children`
    ), t.log(
      `  Instance default children: ${k.children.map((T) => T.name).join(", ")}`
    );
    const V = [
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
      `  JSON children to recreate: ${V.map((T) => T.name).join(", ")}`
    ), t.log(
      "  Strategy: Match by name, update matches in place, cannot add new ones (Figma limitation), keep defaults not in JSON"
    );
    let O = !0;
    const p = {
      defaultChildrenBefore: k.children.map((T) => ({
        name: T.name,
        type: T.type,
        fills: "fills" in T ? T.fills : void 0
      })),
      jsonChildren: V.map((T) => ({ name: T.name, type: T.type }))
    }, f = [], h = [];
    for (const T of V) {
      const pe = k.children.find(
        (Z) => Z.name === T.name
      );
      if (pe) {
        t.log(
          `  Found matching child "${T.name}" - attempting to update in place`
        );
        try {
          if ("fills" in pe && T.fills) {
            const Z = pe.fills;
            t.log(
              `    Current fills before update: ${JSON.stringify(Z)}`
            ), pe.fills = T.fills;
            const N = pe.fills;
            t.log(
              `    Fills after update: ${JSON.stringify(N)}`
            ), Array.isArray(N) && N.length > 0 && N[0].type === "SOLID" && N[0].color.r === T.fills[0].color.r && N[0].color.g === T.fills[0].color.g && N[0].color.b === T.fills[0].color.b ? (t.log(
              `    ✓ Successfully updated "${T.name}" fills in place`
            ), f.push(T.name)) : (t.log(
              "    ✗ Update assignment succeeded but fills didn't change (read-only?)"
            ), O = !1);
          } else
            t.log(
              `    ⚠ Cannot update "${T.name}" - node type doesn't support fills`
            );
        } catch (Z) {
          const N = Z instanceof Error ? Z.message : String(Z);
          t.log(
            `    ✗ Cannot update "${T.name}": ${N}`
          ), O = !1;
        }
      } else
        t.log(
          `  No matching child for "${T.name}" - cannot add to instance (Figma limitation)`
        ), t.log(
          "    → Children that exist only in JSON cannot be added to instances"
        ), h.push(T.name);
    }
    t.log(
      "  Testing: Can we modify other properties (like name, size) of instance children?"
    );
    let w = !1;
    if (k.children.length > 0) {
      const T = k.children[0], pe = T.name, Z = "width" in T ? T.width : void 0;
      try {
        T.name = "Modified Name", "resize" in T && Z && T.resize(Z + 10, T.height), w = !0, t.log(
          "    ✓ Can modify properties (name, size) of instance children"
        ), T.name = pe, "resize" in T && Z && T.resize(Z, T.height);
      } catch (N) {
        const P = N instanceof Error ? N.message : String(N);
        t.log(
          `    ✗ Cannot modify properties of instance children: ${P}`
        );
      }
    }
    const x = k.children.filter(
      (T) => !V.some((pe) => pe.name === T.name)
    );
    t.log(
      `  Kept default children (not in JSON): ${x.map((T) => T.name).join(", ")}`
    ), t.log(
      `  Final instance children: ${k.children.map((T) => T.name).join(", ")}`
    ), t.log(
      `  Final instance children count: ${k.children.length}`
    ), p.finalChildren = k.children.map((T) => ({
      name: T.name,
      type: T.type
    })), p.keptDefaultChildren = x.map((T) => ({
      name: T.name,
      type: T.type
    })), p.finalChildrenCount = k.children.length, p.updatedChildren = f, p.skippedChildren = h, p.canModifyProperties = w;
    const U = k.children.some(
      (T) => T.name === "Default Child 1"
    ), Y = k.children.some(
      (T) => T.name === "JSON Only Child"
    ), re = k.children.some(
      (T) => T.name === "Default Child 2"
    ), Q = k.children.some(
      (T) => T.name === "Default Child 3"
    ), j = k.children.find(
      (T) => T.name === "Default Child 1"
    );
    let ee = !1;
    if (j && "fills" in j) {
      const T = j.fills;
      Array.isArray(T) && T.length > 0 && T[0].type === "SOLID" && (ee = T[0].color.r === 1 && T[0].color.g === 1 && T[0].color.b === 0);
    }
    const ne = U && ee && !Y && // Should NOT exist (Figma limitation)
    re && Q && k.children.length === 3;
    t.log(`  Meets expectations: ${ne}`), t.log(`    - "Default Child 1" updated: ${ee}`), t.log(
      `    - "JSON Only Child" added: ${Y} (expected: false - cannot add new children)`
    ), t.log(
      `    - Default children kept: ${re && Q}`
    ), l.push({
      test: "Recreate children from JSON",
      success: O && ne,
      details: Ne(le({}, p), {
        meetsExpectations: ne,
        hasJsonChild1: U,
        child1Updated: ee,
        hasJsonOnlyChild: Y,
        hasDefaultChild2: re,
        hasDefaultChild3: Q,
        note: O && ne ? "Successfully updated existing children in place, kept defaults not in JSON. Cannot add new children to instances (Figma limitation)." : "Failed to update children or expectations not met"
      })
    }), t.log(
      `
--- Test 6: Bottom-up resolution order (nested deferred instances) ---`
    );
    const K = figma.createFrame();
    K.name = "[Deferred: Parent]", K.resize(200, 200), a.appendChild(K);
    const ie = figma.createFrame();
    ie.name = "[Deferred: Child]", ie.resize(100, 100), ie.x = 10, ie.y = 10, K.appendChild(ie);
    const W = figma.createFrame();
    W.name = "[Deferred: Grandchild]", W.resize(50, 50), W.x = 10, W.y = 10, ie.appendChild(W), t.log(
      "  Created nested structure: Parent -> Child -> Grandchild"
    ), t.log(
      `  Parent placeholder has ${K.children.length} child(ren)`
    ), t.log(
      `  Child placeholder has ${ie.children.length} child(ren)`
    );
    let z = !0;
    const R = {};
    t.log("  Step 1: Resolving grandchild (leaf node)...");
    const J = figma.createComponent();
    J.name = "Grandchild Component", J.resize(50, 50), a.appendChild(J);
    const H = J.createInstance();
    H.name = "Grandchild Instance", a.appendChild(H);
    const te = W.parent;
    if (te && "children" in te) {
      const T = te.children.indexOf(
        W
      );
      te.insertChild(T, H), W.remove(), t.log(
        "    ✓ Resolved grandchild - replaced placeholder with instance"
      ), R.grandchildResolved = !0;
    } else
      t.log("    ✗ Could not resolve grandchild"), z = !1;
    t.log(
      "  Step 2: Resolving child (has resolved grandchild inside)..."
    );
    const me = figma.createComponent();
    me.name = "Child Component", me.resize(100, 100), a.appendChild(me);
    const fe = me.createInstance();
    fe.name = "Child Instance", a.appendChild(fe);
    const ce = K.children.find(
      (T) => T.name === "[Deferred: Child]"
    );
    if (!ce)
      t.log(
        "    ✗ Child placeholder lost after resolving grandchild"
      ), z = !1;
    else if (!("children" in ce))
      t.log("    ✗ Child placeholder does not support children"), z = !1;
    else {
      ce.children.find(
        (N) => N.name === "Grandchild Instance"
      ) ? (t.log(
        "    ✓ Grandchild still accessible inside child placeholder"
      ), R.grandchildStillAccessible = !0) : t.log(
        "    ⚠ Grandchild not found inside child placeholder (may have been moved)"
      );
      const pe = ce.children.find(
        (N) => N.name === "Grandchild Instance"
      ), Z = ce.parent;
      if (Z && "children" in Z) {
        const N = Z.children.indexOf(
          ce
        );
        Z.insertChild(N, fe), ce.remove(), t.log(
          "    ✓ Resolved child - replaced placeholder with instance"
        ), R.childResolved = !0, pe && (t.log(
          "    ⚠ Grandchild instance was in child placeholder and is now lost"
        ), t.log(
          "    → This demonstrates the need to extract children before replacing placeholders"
        ), R.grandchildLost = !0);
      } else
        t.log("    ✗ Could not resolve child"), z = !1;
    }
    t.log(
      "  Step 3: Resolving parent (has resolved child inside)..."
    );
    const ae = figma.createComponent();
    ae.name = "Parent Component", ae.resize(200, 200), a.appendChild(ae);
    const se = ae.createInstance();
    se.name = "Parent Instance", a.appendChild(se);
    const de = K.children.find(
      (T) => T.name === "Child Instance"
    );
    de ? (t.log(
      "    ✓ Child still accessible inside parent placeholder"
    ), R.childStillAccessible = !0, a.appendChild(de), t.log(
      "    ✓ Extracted child instance from parent placeholder"
    ), R.childExtracted = !0) : (t.log(
      "    ✗ Child not found inside parent placeholder - cannot extract"
    ), z = !1);
    const ue = K.parent;
    if (ue && "children" in ue) {
      const T = ue.children.indexOf(K);
      if (ue.insertChild(T, se), K.remove(), t.log(
        "    ✓ Resolved parent - replaced placeholder with instance"
      ), R.parentResolved = !0, de)
        try {
          se.appendChild(de), t.log("    ✓ Added child instance to parent instance"), R.childAddedToParent = !0;
        } catch (pe) {
          const Z = pe instanceof Error ? pe.message : String(pe);
          t.log(
            `    ✗ Cannot add child to parent instance: ${Z}`
          ), t.log(
            "    → This is the Figma limitation - cannot add children to instances"
          ), t.log(
            "    → Child instance remains in testFrame (not in final structure)"
          ), R.childAddedToParent = !1, R.childAddError = Z;
        }
    } else
      t.log("    ✗ Could not resolve parent"), z = !1;
    t.log("  Verifying bottom-up resolution worked...");
    const Se = a.children.find(
      (T) => T.name === "Parent Instance"
    ), xe = a.children.find(
      (T) => T.name === "Child Instance"
    );
    let je = !1;
    Se && xe ? (je = !0, t.log(
      "    ✓ Bottom-up resolution worked: Parent resolved, child extracted"
    ), t.log(
      "    ⚠ Child cannot be added to parent instance (Figma limitation)"
    )) : Se ? t.log(
      "    ⚠ Parent resolved but child not found (may have been lost)"
    ) : t.log("    ✗ Parent not resolved"), R.bottomUpWorked = je, R.finalParentExists = !!Se, R.childExtractedExists = !!xe, R.note = "Bottom-up resolution works, but Figma limitation prevents adding children to instances. This demonstrates the need for a different approach (e.g., matching by name and replacing at parent level).", R.note = "Bottom-up resolution (leaf to root) ensures nested placeholders are resolved before their parents are replaced", l.push({
      test: "Bottom-up resolution order",
      success: z && je,
      details: R
    }), t.log(`
--- Test Summary ---`);
    const nt = l.every((T) => T.success), Je = l.filter((T) => T.success).length;
    t.log(`  Tests passed: ${Je}/${l.length}`);
    for (const T of l)
      t.log(
        `  ${T.success ? "✓" : "✗"} ${T.test}: ${T.success ? "PASS" : "FAIL"}`
      );
    return {
      success: nt,
      message: nt ? "All instance children and override tests passed" : `${Je}/${l.length} tests passed - see details`,
      details: {
        testResults: l,
        summary: {
          total: l.length,
          passed: Je,
          failed: l.length - Je
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
    for (const S of n)
      if (S.name === "Test") {
        t.log(
          `  Found existing "Test" collection (ID: ${S.id.substring(0, 8)}...), deleting...`
        );
        const v = await figma.variables.getLocalVariablesAsync();
        for (const I of v)
          I.variableCollectionId === S.id && I.remove();
        S.remove(), t.log('  Deleted "Test" collection');
      }
    await figma.loadAllPagesAsync();
    let i = figma.root.children.find(
      (S) => S.type === "PAGE" && S.name === "Test"
    );
    i ? t.log('Found existing "Test" page') : (i = figma.createPage(), i.name = "Test", t.log('Created "Test" page')), await figma.setCurrentPageAsync(i);
    const a = i.children.find(
      (S) => S.type === "FRAME" && S.name === "Test"
    );
    a && (t.log(
      'Found existing "Test" frame, deleting it and all children...'
    ), a.remove(), t.log('Deleted existing "Test" frame'));
    const l = figma.createFrame();
    l.name = "Test", i.appendChild(l), t.log('Created new "Test" frame container');
    const r = [];
    t.log(`
` + "=".repeat(60)), t.log("TEST 9: Instance Children and Overrides Behavior"), t.log("=".repeat(60));
    const g = await Do(i.id);
    r.push({
      name: "Instance Children and Overrides",
      success: g.success,
      message: g.message,
      details: g.details
    }), t.log(`
` + "=".repeat(60)), t.log("=== ALL TESTS COMPLETE ==="), t.log("=".repeat(60));
    const d = r.filter((S) => S.success), m = r.filter((S) => !S.success);
    t.log(
      `Total: ${r.length} | Passed: ${d.length} | Failed: ${m.length}`
    );
    for (const S of r)
      t.log(
        `  ${S.success ? "✓" : "✗"} ${S.name}: ${S.message}`
      );
    const b = {
      testResults: {
        success: g.success,
        message: `All tests completed: ${d.length}/${r.length} passed`,
        details: {
          summary: {
            total: r.length,
            passed: d.length,
            failed: m.length
          },
          tests: r
        }
      },
      allTests: r
    };
    return Ae("runTest", b);
  } catch (n) {
    const o = n instanceof Error ? n.message : "Unknown error occurred";
    return t.error(`Test failed: ${o}`), Ve("runTest", o);
  }
}
const Wo = {
  getCurrentUser: Sn,
  loadPages: Cn,
  exportPage: Ze,
  importPage: xt,
  cleanupCreatedEntities: ln,
  resolveDeferredNormalInstances: Rt,
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
  storeSelectedRepo: xo,
  getComponentMetadata: Ro,
  getAllComponents: Vo,
  pluginPromptResponse: Mo,
  switchToPage: ko,
  checkForExistingPrimaryImport: Uo,
  createImportDividers: Lo,
  importSingleComponentWithWizard: Fo,
  deleteImportGroup: hn,
  clearImportMetadata: Go,
  cleanupFailedImport: Bo,
  summarizeVariablesForWizard: _o,
  getLocalVariableCollections: zo,
  getCollectionGuids: jo,
  mergeImportGroup: Jo,
  runTest: Ho
}, Ko = Wo;
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
    xn(e);
    return;
  }
  const n = e;
  try {
    const i = n.type, a = Ko[i];
    if (!a) {
      console.warn("Unknown message type:", n.type);
      const g = {
        type: n.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + n.type,
        data: {},
        requestId: n.requestId
      };
      figma.ui.postMessage(g);
      return;
    }
    n.requestId && Ie(n.requestId);
    let l;
    i === "exportPage" && n.requestId ? l = await a(
      n.data,
      /* @__PURE__ */ new Set(),
      !1,
      /* @__PURE__ */ new Set(),
      n.requestId
    ) : i === "importPage" && n.requestId ? l = await a(
      n.data,
      n.requestId
    ) : l = await a(n.data);
    const r = t.getLogs();
    r.length > 0 && (l.data = Ne(le({}, l.data), {
      debugLogs: r
    })), figma.ui.postMessage(Ne(le({}, l), {
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
    }, l = t.getLogs();
    l.length > 0 && (a.data.debugLogs = l), figma.ui.postMessage(a), n.requestId && Ft(n.requestId);
  }
};
