var He = Object.defineProperty, Ke = Object.defineProperties;
var qe = Object.getOwnPropertyDescriptors;
var Ne = Object.getOwnPropertySymbols;
var Je = Object.prototype.hasOwnProperty, We = Object.prototype.propertyIsEnumerable;
var pe = (e, t, r) => t in e ? He(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r, I = (e, t) => {
  for (var r in t || (t = {}))
    Je.call(t, r) && pe(e, r, t[r]);
  if (Ne)
    for (var r of Ne(t))
      We.call(t, r) && pe(e, r, t[r]);
  return e;
}, _ = (e, t) => Ke(e, qe(t));
var L = (e, t, r) => pe(e, typeof t != "symbol" ? t + "" : t, r);
async function Ye(e) {
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
  } catch (r) {
    return {
      type: "getCurrentUser",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function De(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((n, c) => ({
          name: n.name,
          index: c
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
const k = {
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
}, O = _(I({}, k), {
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
}), z = _(I({}, k), {
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
}), K = _(I({}, k), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), $e = _(I({}, k), {
  cornerRadius: 0
}), Xe = _(I({}, k), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Ze(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return O;
    case "TEXT":
      return z;
    case "VECTOR":
      return K;
    case "LINE":
      return Xe;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return $e;
    default:
      return k;
  }
}
function E(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((r, a) => E(r, t[a])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const r = Object.keys(e), a = Object.keys(t);
      return r.length !== a.length ? !0 : r.some(
        (n) => !(n in t) || E(e[n], t[n])
      );
    }
    return !0;
  }
  return e !== t;
}
const ue = {
  LAYER: "00000000-0000-0000-0000-000000000001",
  TOKENS: "00000000-0000-0000-0000-000000000002",
  THEME: "00000000-0000-0000-0000-000000000003"
}, V = {
  LAYER: "Layer",
  TOKENS: "Tokens",
  THEME: "Theme"
};
function j(e) {
  const t = e.trim(), r = t.toLowerCase();
  return r === "themes" ? V.THEME : r === "token" ? V.TOKENS : r === "layer" ? V.LAYER : r === "tokens" ? V.TOKENS : r === "theme" ? V.THEME : t;
}
function H(e) {
  const t = j(e);
  return t === V.LAYER || t === V.TOKENS || t === V.THEME;
}
function ye(e) {
  const t = j(e);
  if (t === V.LAYER)
    return ue.LAYER;
  if (t === V.TOKENS)
    return ue.TOKENS;
  if (t === V.THEME)
    return ue.THEME;
}
class ie {
  constructor() {
    L(this, "collectionMap");
    // collectionId -> index
    L(this, "collections");
    // index -> collection data
    L(this, "normalizedNameMap");
    // normalized name -> index (for standard collections)
    L(this, "nextIndex");
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
  mergeModes(t, r) {
    const a = new Set(t);
    for (const n of r)
      a.add(n);
    return Array.from(a);
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * For standard collections (Layer, Tokens, Theme), merges by normalized name
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(t) {
    const r = t.collectionId;
    if (this.collectionMap.has(r))
      return this.collectionMap.get(r);
    const a = j(
      t.collectionName
    );
    if (H(t.collectionName)) {
      const s = this.findCollectionByNormalizedName(a);
      if (s !== void 0) {
        const p = this.collections[s];
        return p.modes = this.mergeModes(
          p.modes,
          t.modes
        ), this.collectionMap.set(r, s), s;
      }
    }
    const n = this.nextIndex++;
    this.collectionMap.set(r, n);
    const c = _(I({}, t), {
      collectionName: a
    });
    if (H(t.collectionName)) {
      const s = ye(
        t.collectionName
      );
      s && (c.collectionGuid = s), this.normalizedNameMap.set(a, n);
    }
    return this.collections[n] = c, n;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(t) {
    var r;
    return (r = this.collectionMap.get(t)) != null ? r : -1;
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
    for (let r = 0; r < this.collections.length; r++)
      t[String(r)] = this.collections[r];
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
    for (let r = 0; r < this.collections.length; r++) {
      const a = this.collections[r], n = I({
        collectionName: a.collectionName,
        modes: a.modes
      }, a.collectionGuid && { collectionGuid: a.collectionGuid });
      t[String(r)] = n;
    }
    return t;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(t) {
    var n;
    const r = new ie(), a = Object.entries(t).sort(
      (c, s) => parseInt(c[0], 10) - parseInt(s[0], 10)
    );
    for (const [c, s] of a) {
      const p = parseInt(c, 10), u = (n = s.isLocal) != null ? n : !0, l = j(
        s.collectionName || ""
      ), g = s.collectionId || s.collectionGuid || `temp:${p}:${l}`, d = I({
        collectionName: l,
        collectionId: g,
        isLocal: u,
        modes: s.modes || []
      }, s.collectionGuid && {
        collectionGuid: s.collectionGuid
      });
      r.collectionMap.set(g, p), r.collections[p] = d, H(l) && r.normalizedNameMap.set(l, p), r.nextIndex = Math.max(
        r.nextIndex,
        p + 1
      );
    }
    return r;
  }
  /**
   * Gets the total number of collections in the table
   */
  getSize() {
    return this.collections.length;
  }
}
const Qe = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, et = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function tt(e) {
  var r;
  const t = e.toUpperCase();
  return (r = Qe[t]) != null ? r : e;
}
function rt(e) {
  var t;
  return typeof e == "number" ? (t = et[e]) != null ? t : e.toString() : e;
}
class oe {
  constructor() {
    L(this, "variableMap");
    // variableKey -> index
    L(this, "variables");
    // index -> variable data
    L(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(t) {
    const r = t.variableKey;
    if (!r)
      return -1;
    if (this.variableMap.has(r))
      return this.variableMap.get(r);
    const a = this.nextIndex++;
    return this.variableMap.set(r, a), this.variables[a] = t, a;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(t) {
    var r;
    return (r = this.variableMap.get(t)) != null ? r : -1;
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
    for (let r = 0; r < this.variables.length; r++)
      t[String(r)] = this.variables[r];
    return t;
  }
  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  serializeValuesByMode(t) {
    if (!t)
      return;
    const r = {};
    for (const [a, n] of Object.entries(t))
      typeof n == "object" && n !== null && "_varRef" in n && typeof n._varRef == "number" ? r[a] = {
        _varRef: n._varRef
      } : r[a] = n;
    return r;
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
    for (let r = 0; r < this.variables.length; r++) {
      const a = this.variables[r], n = this.serializeValuesByMode(
        a.valuesByMode
      ), c = I(I({
        variableName: a.variableName,
        variableType: tt(a.variableType)
      }, a._colRef !== void 0 && { _colRef: a._colRef }), n && { valuesByMode: n });
      t[String(r)] = c;
    }
    return t;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(t) {
    const r = new oe(), a = Object.entries(t).sort(
      (n, c) => parseInt(n[0], 10) - parseInt(c[0], 10)
    );
    for (const [n, c] of a) {
      const s = parseInt(n, 10), p = rt(c.variableType), u = _(I({}, c), {
        variableType: p
        // Always a string after expansion
      });
      r.variables[s] = u, r.nextIndex = Math.max(r.nextIndex, s + 1);
    }
    return r;
  }
  /**
   * Gets the total number of variables in the table
   */
  getSize() {
    return this.variables.length;
  }
}
function at(e) {
  return {
    _varRef: e
  };
}
function Pe(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let nt = 0;
const q = /* @__PURE__ */ new Map();
function it(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = q.get(e.requestId);
  t && (q.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function we() {
  return new Promise((e, t) => {
    const r = `guid_${Date.now()}_${++nt}`;
    q.set(r, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: r
    }), setTimeout(() => {
      q.has(r) && (q.delete(r), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const Me = {
  "VariableCollectionId:31c5f6bbb52cef5990baeb9894f2c1a6ce32ad8e/2977:6": {
    guid: "1d35ec3e-03d3-4236-a823-62008be5f8bb",
    name: "Tokens"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/2151:0": {
    guid: "f56276ba-eae3-49a0-81c0-b28a17cba12b",
    name: "Theme"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/1908:0": {
    guid: "e3a98c30-3985-4e3c-9aaf-c7d61f50f380",
    name: "Theme"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/2069:864": {
    guid: "bbf8e196-850c-4ebd-ab84-97ae61f308d8",
    name: "Theme"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/1884:373": {
    guid: "a7c3d9f2-4b1e-4a8c-9d5f-3e8a2b7c4d1e",
    name: "Themes"
  },
  "VariableCollectionId:31c5f6bbb52cef5990baeb9894f2c1a6ce32ad8e/2849:188": {
    guid: "b8d4e0a3-5c2f-4b9d-ae6f-4f9b3c8d5e2f",
    name: "Tokens"
  },
  "VariableCollectionId:eac91903ad8b04eed20f4bf2f0444ac6069c6da3/1761:753": {
    guid: "c9e5f1b4-6d3a-4c0e-bf7a-5a0c4d9e6f3a",
    name: "Themes"
  },
  "VariableCollectionId:31c5f6bbb52cef5990baeb9894f2c1a6ce32ad8e/2762:6": {
    guid: "d0f6a2c5-7e4b-4d1f-c08b-6b1d5e0a7f4b",
    name: "Tokens"
  }
};
async function Q() {
  return new Promise((e) => setTimeout(e, 0));
}
const i = {
  clear: async () => {
    console.clear(), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    }), await Q();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await Q();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await Q();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await Q();
  }
};
function ot(e, t) {
  const r = t.modes.find((a) => a.modeId === e);
  return r ? r.name : e;
}
async function Re(e, t, r, a, n = /* @__PURE__ */ new Set()) {
  const c = {};
  for (const [s, p] of Object.entries(e)) {
    const u = ot(s, a);
    if (p == null) {
      c[u] = p;
      continue;
    }
    if (typeof p == "string" || typeof p == "number" || typeof p == "boolean") {
      c[u] = p;
      continue;
    }
    if (typeof p == "object" && p !== null && "type" in p && p.type === "VARIABLE_ALIAS" && "id" in p) {
      const l = p.id;
      if (n.has(l)) {
        c[u] = {
          type: "VARIABLE_ALIAS",
          id: l
        };
        continue;
      }
      const g = await figma.variables.getVariableByIdAsync(l);
      if (!g) {
        c[u] = {
          type: "VARIABLE_ALIAS",
          id: l
        };
        continue;
      }
      const d = new Set(n);
      d.add(l);
      const m = await figma.variables.getVariableCollectionByIdAsync(
        g.variableCollectionId
      ), o = g.key;
      if (!o) {
        c[u] = {
          type: "VARIABLE_ALIAS",
          id: l
        };
        continue;
      }
      const f = {
        variableName: g.name,
        variableType: g.resolvedType,
        collectionName: m == null ? void 0 : m.name,
        collectionId: g.variableCollectionId,
        variableKey: o,
        id: l,
        isLocal: !g.remote
      };
      if (m) {
        const b = await Oe(
          m,
          r
        );
        f._colRef = b, g.valuesByMode && (f.valuesByMode = await Re(
          g.valuesByMode,
          t,
          r,
          m,
          // Pass collection for mode ID to name conversion
          d
        ));
      }
      const w = t.addVariable(f);
      c[u] = {
        type: "VARIABLE_ALIAS",
        id: l,
        _varRef: w
      };
    } else
      c[u] = p;
  }
  return c;
}
const ee = "recursica:collectionId";
async function st(e) {
  if (e.remote === !0) {
    const r = Me[e.id];
    if (!r) {
      const n = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await i.error(n), new Error(n);
    }
    return r.guid;
  } else {
    if (H(e.name)) {
      const n = ye(e.name);
      if (n) {
        const c = e.getSharedPluginData(
          "recursica",
          ee
        );
        return (!c || c.trim() === "") && e.setSharedPluginData(
          "recursica",
          ee,
          n
        ), n;
      }
    }
    const r = e.getSharedPluginData(
      "recursica",
      ee
    );
    if (r && r.trim() !== "")
      return r;
    const a = await we();
    return e.setSharedPluginData("recursica", ee, a), a;
  }
}
function ct(e, t) {
  if (t)
    return;
  const r = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(r))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Oe(e, t) {
  const r = !e.remote, a = t.getCollectionIndex(e.id);
  if (a !== -1)
    return a;
  ct(e.name, r);
  const n = await st(e), c = e.modes.map((l) => l.name), s = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: r,
    modes: c,
    collectionGuid: n
  }, p = t.addCollection(s), u = r ? "local" : "remote";
  return await i.log(
    `  Added ${u} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), p;
}
async function Ce(e, t, r) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const a = await figma.variables.getVariableByIdAsync(e.id);
    if (!a)
      return console.log("Could not resolve variable alias:", e.id), null;
    const n = await figma.variables.getVariableCollectionByIdAsync(
      a.variableCollectionId
    );
    if (!n)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const c = a.key;
    if (!c)
      return console.log("Variable missing key:", e.id), null;
    const s = await Oe(
      n,
      r
    ), p = {
      variableName: a.name,
      variableType: a.resolvedType,
      _colRef: s,
      // Reference to collection table (v2.4.0+)
      variableKey: c,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    a.valuesByMode && (p.valuesByMode = await Re(
      a.valuesByMode,
      t,
      r,
      n,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const u = t.addVariable(p);
    return at(u);
  } catch (a) {
    const n = a instanceof Error ? a.message : String(a);
    throw console.error("Could not resolve variable alias:", e.id, a), new Error(
      `Failed to resolve variable alias ${e.id}: ${n}`
    );
  }
}
async function ae(e, t, r) {
  if (!e || typeof e != "object") return e;
  const a = {};
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      const c = e[n];
      if (c && typeof c == "object" && !Array.isArray(c))
        if (c.type === "VARIABLE_ALIAS") {
          const s = await Ce(
            c,
            t,
            r
          );
          s && (a[n] = s);
        } else
          a[n] = await ae(
            c,
            t,
            r
          );
      else Array.isArray(c) ? a[n] = await Promise.all(
        c.map(async (s) => (s == null ? void 0 : s.type) === "VARIABLE_ALIAS" ? await Ce(
          s,
          t,
          r
        ) || s : s && typeof s == "object" ? await ae(
          s,
          t,
          r
        ) : s)
      ) : a[n] = c;
    }
  return a;
}
async function lt(e, t, r) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (a) => {
      if (!a || typeof a != "object") return a;
      const n = {};
      for (const c in a)
        Object.prototype.hasOwnProperty.call(a, c) && (c === "boundVariables" ? n[c] = await ae(
          a[c],
          t,
          r
        ) : n[c] = a[c]);
      return n;
    })
  );
}
async function dt(e, t) {
  const r = {}, a = /* @__PURE__ */ new Set();
  if (e.type && (r.type = e.type, a.add("type")), e.id && (r.id = e.id, a.add("id")), e.name !== void 0 && e.name !== "" && (r.name = e.name, a.add("name")), e.x !== void 0 && e.x !== 0 && (r.x = e.x, a.add("x")), e.y !== void 0 && e.y !== 0 && (r.y = e.y, a.add("y")), e.width !== void 0 && (r.width = e.width, a.add("width")), e.height !== void 0 && (r.height = e.height, a.add("height")), e.visible !== void 0 && E(e.visible, k.visible) && (r.visible = e.visible, a.add("visible")), e.locked !== void 0 && E(e.locked, k.locked) && (r.locked = e.locked, a.add("locked")), e.opacity !== void 0 && E(e.opacity, k.opacity) && (r.opacity = e.opacity, a.add("opacity")), e.rotation !== void 0 && E(e.rotation, k.rotation) && (r.rotation = e.rotation, a.add("rotation")), e.blendMode !== void 0 && E(e.blendMode, k.blendMode) && (r.blendMode = e.blendMode, a.add("blendMode")), e.effects !== void 0 && E(e.effects, k.effects) && (r.effects = e.effects, a.add("effects")), e.fills !== void 0) {
    const n = await lt(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    E(n, k.fills) && (r.fills = n), a.add("fills");
  }
  if (e.strokes !== void 0 && E(e.strokes, k.strokes) && (r.strokes = e.strokes, a.add("strokes")), e.strokeWeight !== void 0 && E(e.strokeWeight, k.strokeWeight) && (r.strokeWeight = e.strokeWeight, a.add("strokeWeight")), e.strokeAlign !== void 0 && E(e.strokeAlign, k.strokeAlign) && (r.strokeAlign = e.strokeAlign, a.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const n = await ae(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(n).length > 0 && (r.boundVariables = n), a.add("boundVariables");
  }
  return r;
}
async function Ee(e, t) {
  const r = {}, a = /* @__PURE__ */ new Set();
  if (e.type === "COMPONENT")
    try {
      e.componentPropertyDefinitions && (r.componentPropertyDefinitions = e.componentPropertyDefinitions, a.add("componentPropertyDefinitions"));
    } catch (n) {
    }
  return e.layoutMode !== void 0 && E(e.layoutMode, O.layoutMode) && (r.layoutMode = e.layoutMode, a.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && E(
    e.primaryAxisSizingMode,
    O.primaryAxisSizingMode
  ) && (r.primaryAxisSizingMode = e.primaryAxisSizingMode, a.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && E(
    e.counterAxisSizingMode,
    O.counterAxisSizingMode
  ) && (r.counterAxisSizingMode = e.counterAxisSizingMode, a.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && E(
    e.primaryAxisAlignItems,
    O.primaryAxisAlignItems
  ) && (r.primaryAxisAlignItems = e.primaryAxisAlignItems, a.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && E(
    e.counterAxisAlignItems,
    O.counterAxisAlignItems
  ) && (r.counterAxisAlignItems = e.counterAxisAlignItems, a.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && E(e.paddingLeft, O.paddingLeft) && (r.paddingLeft = e.paddingLeft, a.add("paddingLeft")), e.paddingRight !== void 0 && E(e.paddingRight, O.paddingRight) && (r.paddingRight = e.paddingRight, a.add("paddingRight")), e.paddingTop !== void 0 && E(e.paddingTop, O.paddingTop) && (r.paddingTop = e.paddingTop, a.add("paddingTop")), e.paddingBottom !== void 0 && E(e.paddingBottom, O.paddingBottom) && (r.paddingBottom = e.paddingBottom, a.add("paddingBottom")), e.itemSpacing !== void 0 && E(e.itemSpacing, O.itemSpacing) && (r.itemSpacing = e.itemSpacing, a.add("itemSpacing")), e.cornerRadius !== void 0 && E(e.cornerRadius, O.cornerRadius) && (r.cornerRadius = e.cornerRadius, a.add("cornerRadius")), e.clipsContent !== void 0 && E(e.clipsContent, O.clipsContent) && (r.clipsContent = e.clipsContent, a.add("clipsContent")), e.layoutWrap !== void 0 && E(e.layoutWrap, O.layoutWrap) && (r.layoutWrap = e.layoutWrap, a.add("layoutWrap")), e.layoutGrow !== void 0 && E(e.layoutGrow, O.layoutGrow) && (r.layoutGrow = e.layoutGrow, a.add("layoutGrow")), r;
}
async function pt(e, t) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (r.characters = e.characters, a.add("characters")), e.fontName !== void 0 && (r.fontName = e.fontName, a.add("fontName")), e.fontSize !== void 0 && (r.fontSize = e.fontSize, a.add("fontSize")), e.textAlignHorizontal !== void 0 && E(
    e.textAlignHorizontal,
    z.textAlignHorizontal
  ) && (r.textAlignHorizontal = e.textAlignHorizontal, a.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && E(
    e.textAlignVertical,
    z.textAlignVertical
  ) && (r.textAlignVertical = e.textAlignVertical, a.add("textAlignVertical")), e.letterSpacing !== void 0 && E(e.letterSpacing, z.letterSpacing) && (r.letterSpacing = e.letterSpacing, a.add("letterSpacing")), e.lineHeight !== void 0 && E(e.lineHeight, z.lineHeight) && (r.lineHeight = e.lineHeight, a.add("lineHeight")), e.textCase !== void 0 && E(e.textCase, z.textCase) && (r.textCase = e.textCase, a.add("textCase")), e.textDecoration !== void 0 && E(e.textDecoration, z.textDecoration) && (r.textDecoration = e.textDecoration, a.add("textDecoration")), e.textAutoResize !== void 0 && E(e.textAutoResize, z.textAutoResize) && (r.textAutoResize = e.textAutoResize, a.add("textAutoResize")), e.paragraphSpacing !== void 0 && E(
    e.paragraphSpacing,
    z.paragraphSpacing
  ) && (r.paragraphSpacing = e.paragraphSpacing, a.add("paragraphSpacing")), e.paragraphIndent !== void 0 && E(e.paragraphIndent, z.paragraphIndent) && (r.paragraphIndent = e.paragraphIndent, a.add("paragraphIndent")), e.listOptions !== void 0 && E(e.listOptions, z.listOptions) && (r.listOptions = e.listOptions, a.add("listOptions")), r;
}
function ut(e) {
  const t = e.match(/^(\d+\.?\d*)[eE]([+-]?\d+)$/);
  if (t) {
    const r = parseFloat(t[1]), a = parseInt(t[2]), n = r * Math.pow(10, a);
    return Math.abs(n) < 1e-10 ? "0" : n.toFixed(6).replace(/\.?0+$/, "") || "0";
  }
  return e;
}
function ke(e) {
  if (!e || typeof e != "string")
    return e;
  let t = e.replace(/(\d+\.?\d*)[eE]([+-]?\d+)/g, (r) => ut(r));
  return t = t.replace(
    /(\d+\.\d{7,})/g,
    // Match numbers with more than 6 decimal places
    (r) => {
      const a = parseFloat(r);
      return Math.abs(a) < 1e-10 ? "0" : a.toFixed(6).replace(/\.?0+$/, "") || "0";
    }
  ), t = t.replace(
    /([MmLlHhVvCcSsQqTtAaZz])([-\d])/g,
    (r, a, n) => `${a} ${n}`
  ), t = t.replace(/\s+/g, " ").trim(), t;
}
function ge(e) {
  return Array.isArray(e) ? e.map((t) => ({
    data: ke(t.data),
    // Normalize winding rule key (use windRule consistently)
    windRule: t.windRule || t.windingRule || "NONZERO"
  })) : e;
}
const mt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  normalizeSvgPath: ke,
  normalizeVectorGeometry: ge
}, Symbol.toStringTag, { value: "Module" }));
async function gt(e, t) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && E(e.fillGeometry, K.fillGeometry) && (r.fillGeometry = ge(e.fillGeometry), a.add("fillGeometry")), e.strokeGeometry !== void 0 && E(e.strokeGeometry, K.strokeGeometry) && (r.strokeGeometry = ge(e.strokeGeometry), a.add("strokeGeometry")), e.strokeCap !== void 0 && E(e.strokeCap, K.strokeCap) && (r.strokeCap = e.strokeCap, a.add("strokeCap")), e.strokeJoin !== void 0 && E(e.strokeJoin, K.strokeJoin) && (r.strokeJoin = e.strokeJoin, a.add("strokeJoin")), e.dashPattern !== void 0 && E(e.dashPattern, K.dashPattern) && (r.dashPattern = e.dashPattern, a.add("dashPattern")), r;
}
async function ft(e, t) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && E(e.cornerRadius, $e.cornerRadius) && (r.cornerRadius = e.cornerRadius, a.add("cornerRadius")), e.pointCount !== void 0 && (r.pointCount = e.pointCount, a.add("pointCount")), e.innerRadius !== void 0 && (r.innerRadius = e.innerRadius, a.add("innerRadius")), e.pointCount !== void 0 && (r.pointCount = e.pointCount, a.add("pointCount")), r;
}
const te = /* @__PURE__ */ new Map();
let ht = 0;
function yt() {
  return `prompt_${Date.now()}_${++ht}`;
}
const J = {
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
    const r = typeof t == "number" ? { timeoutMs: t } : t, a = (p = r == null ? void 0 : r.timeoutMs) != null ? p : 3e5, n = r == null ? void 0 : r.okLabel, c = r == null ? void 0 : r.cancelLabel, s = yt();
    return new Promise((u, l) => {
      const g = a === -1 ? null : setTimeout(() => {
        te.delete(s), l(new Error(`Plugin prompt timeout: ${e}`));
      }, a);
      te.set(s, {
        resolve: u,
        reject: l,
        timeout: g
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: I(I({
          message: e,
          requestId: s
        }, n && { okLabel: n }), c && { cancelLabel: c })
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
    const { requestId: t, action: r } = e, a = te.get(t);
    if (!a) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    a.timeout && clearTimeout(a.timeout), te.delete(t), r === "ok" ? a.resolve() : a.reject(new Error("User cancelled"));
  }
}, wt = "RecursicaPublishedMetadata";
function me(e) {
  let t = e, r = !1;
  try {
    if (r = t.parent !== null && t.parent !== void 0, !r)
      return { page: null, reason: "detached" };
  } catch (a) {
    return { page: null, reason: "detached" };
  }
  for (; t; ) {
    if (t.type === "PAGE")
      return { page: t, reason: "found" };
    try {
      const a = t.parent;
      if (!a)
        return { page: null, reason: "broken_chain" };
      t = a;
    } catch (a) {
      return { page: null, reason: "access_error" };
    }
  }
  return { page: null, reason: "broken_chain" };
}
function Te(e) {
  try {
    const t = e.getPluginData(wt);
    if (!t || t.trim() === "")
      return null;
    const r = JSON.parse(t);
    return {
      id: r.id,
      version: r.version
    };
  } catch (t) {
    return null;
  }
}
async function bt(e, t) {
  const r = {}, a = /* @__PURE__ */ new Set();
  if (r._isInstance = !0, a.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function") {
    const n = await e.getMainComponentAsync();
    if (!n) {
      const h = e.name || "(unnamed)", v = e.id;
      if (t.detachedComponentsHandled.has(v))
        await i.log(
          `Treating detached instance "${h}" as internal instance (already prompted)`
        );
      else {
        await i.warning(
          `Found detached instance: "${h}" (main component is missing)`
        );
        const B = `Found detached instance "${h}". The main component this instance references is missing. This should be fixed. Continue to publish?`;
        try {
          await J.prompt(B, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(v), await i.log(
            `Treating detached instance "${h}" as internal instance`
          );
        } catch (X) {
          if (X instanceof Error && X.message === "User cancelled") {
            const x = `Export cancelled: Detached instance "${h}" found. Please fix the instance before exporting.`;
            await i.error(x);
            try {
              await figma.viewport.scrollAndZoomIntoView([e]);
            } catch (P) {
              console.warn("Could not scroll to instance:", P);
            }
            throw new Error(x);
          } else
            throw X;
        }
      }
      if (!me(e).page) {
        const B = `Detached instance "${h}" is not on any page. Cannot export.`;
        throw await i.error(B), new Error(B);
      }
      let S, $;
      try {
        e.variantProperties && (S = e.variantProperties), e.componentProperties && ($ = e.componentProperties);
      } catch (B) {
      }
      const F = I(I({
        instanceType: "internal",
        componentName: h,
        componentNodeId: e.id
      }, S && { variantProperties: S }), $ && { componentProperties: $ }), D = t.instanceTable.addInstance(F);
      return r._instanceRef = D, a.add("_instanceRef"), await i.log(
        `  Exported detached INSTANCE: "${h}" as internal instance (ID: ${e.id.substring(0, 8)}...)`
      ), r;
    }
    const c = e.name || "(unnamed)", s = n.name || "(unnamed)", p = n.remote === !0, l = me(e).page, g = me(n), d = g.page;
    let m, o = d;
    if (p)
      if (d) {
        const h = Te(d);
        h != null && h.id ? (m = "normal", o = d, await i.log(
          `  Component "${s}" is from library but also exists on local page "${d.name}" with metadata. Treating as "normal" instance.`
        )) : (m = "remote", await i.log(
          `  Component "${s}" is from library and exists on local page "${d.name}" but has no metadata. Treating as "remote" instance.`
        ));
      } else
        m = "remote", await i.log(
          `  Component "${s}" is from library and not on a local page. Treating as "remote" instance.`
        );
    else if (d && l && d.id === l.id)
      m = "internal";
    else if (d && l && d.id !== l.id)
      m = "normal";
    else if (d && !l)
      m = "normal";
    else if (!p && g.reason === "detached") {
      const h = n.id;
      if (t.detachedComponentsHandled.has(h))
        m = "remote", await i.log(
          `Treating detached instance "${c}" -> component "${s}" as remote instance (already prompted)`
        );
      else {
        await i.warning(
          `Found detached instance: "${c}" -> component "${s}" (component is not on any page)`
        );
        try {
          await figma.viewport.scrollAndZoomIntoView([n]);
        } catch (N) {
          console.warn("Could not scroll to component:", N);
        }
        const v = `Found detached instance "${c}" attached to component "${s}". This should be fixed. Continue to publish?`;
        try {
          await J.prompt(v, {
            okLabel: "Ok",
            cancelLabel: "Cancel",
            timeoutMs: 3e5
            // 5 minutes
          }), t.detachedComponentsHandled.add(h), m = "remote", await i.log(
            `Treating detached instance "${c}" as remote instance (will be created on REMOTES page)`
          );
        } catch (N) {
          if (N instanceof Error && N.message === "User cancelled") {
            const A = `Export cancelled: Detached instance "${c}" found. The component "${s}" is not on any page. Please fix the instance before exporting.`;
            throw await i.error(A), new Error(A);
          } else
            throw N;
        }
      }
    } else
      p || await i.warning(
        `  Instance "${c}" -> component "${s}": componentPage is null but component is not remote. Reason: ${g.reason}. Cannot determine instance type.`
      ), m = "normal";
    let f, w;
    try {
      e.variantProperties && (f = e.variantProperties), e.componentProperties && (w = e.componentProperties);
    } catch (h) {
    }
    let b, C;
    try {
      let h = n.parent;
      const v = [];
      let N = 0;
      const A = 20;
      for (; h && N < A; )
        try {
          const S = h.type, $ = h.name;
          if (S === "COMPONENT_SET" && !C && (C = $), S === "PAGE")
            break;
          const F = $ || "";
          v.unshift(F), h = h.parent, N++;
        } catch (S) {
          break;
        }
      b = v;
    } catch (h) {
    }
    const y = I(I(I(I({
      instanceType: m,
      componentName: s
    }, C && { componentSetName: C }), f && { variantProperties: f }), w && { componentProperties: w }), m === "normal" ? { path: b || [] } : b && b.length > 0 && {
      path: b
    });
    if (m === "internal")
      y.componentNodeId = n.id, await i.log(
        `  Found INSTANCE: "${c}" -> INTERNAL component "${s}" (ID: ${n.id.substring(0, 8)}...)`
      );
    else if (m === "normal") {
      const h = o || d;
      if (h) {
        y.componentPageName = h.name;
        const N = Te(h);
        N != null && N.id && N.version !== void 0 ? (y.componentGuid = N.id, y.componentVersion = N.version, await i.log(
          `  Found INSTANCE: "${c}" -> NORMAL component "${s}" (ID: ${n.id.substring(0, 8)}...) at path [${(b || []).join(" → ")}]`
        )) : await i.warning(
          `  Instance "${c}" -> component "${s}" is classified as normal but page "${h.name}" has no metadata. This instance will not be importable.`
        );
      } else {
        const N = n.id;
        let A = "", S = "";
        switch (g.reason) {
          case "broken_chain":
            A = "The component's parent chain is broken and cannot be traversed to find the page", S = "Please ensure the component is properly nested within the document structure.";
            break;
          case "access_error":
            A = "Cannot access the component's parent chain (access error)", S = "The component may be in an invalid state. Please check the component structure.";
            break;
          default:
            A = "Cannot determine which page the component is on", S = "Please ensure the component is properly placed on a page.";
        }
        try {
          await figma.viewport.scrollAndZoomIntoView([n]);
        } catch (D) {
          console.warn("Could not scroll to component:", D);
        }
        const $ = `Normal instance "${c}" -> component "${s}" (ID: ${N}) has no componentPage. ${A}. ${S} Component has been focused in the viewport.`;
        console.error("FATAL EXPORT ERROR:", $), await i.error($);
        const F = new Error($);
        throw console.error("Throwing error:", F), F;
      }
      b === void 0 && console.warn(
        `Failed to build path for normal instance "${c}" -> component "${s}". Path is required for resolution.`
      );
      const v = b && b.length > 0 ? ` at path [${b.join(" → ")}]` : " at page root";
      await i.log(
        `  Found INSTANCE: "${c}" -> NORMAL component "${s}" (ID: ${n.id.substring(0, 8)}...)${v}`
      );
    } else if (m === "remote") {
      let h, v;
      const N = t.detachedComponentsHandled.has(
        n.id
      );
      if (!N)
        try {
          if (typeof n.getPublishStatusAsync == "function")
            try {
              const A = await n.getPublishStatusAsync();
              A && typeof A == "object" && (A.libraryName && (h = A.libraryName), A.libraryKey && (v = A.libraryKey));
            } catch (A) {
            }
          try {
            const A = figma.teamLibrary;
            if (typeof (A == null ? void 0 : A.getAvailableLibraryComponentSetsAsync) == "function") {
              const S = await A.getAvailableLibraryComponentSetsAsync();
              if (S && Array.isArray(S)) {
                for (const $ of S)
                  if ($.key === n.key || $.name === n.name) {
                    $.libraryName && (h = $.libraryName), $.libraryKey && (v = $.libraryKey);
                    break;
                  }
              }
            }
          } catch (A) {
          }
        } catch (A) {
          console.warn(
            `Error getting library info for remote component "${s}":`,
            A
          );
        }
      try {
        y.structure = await le(
          n,
          /* @__PURE__ */ new WeakSet(),
          t
        ), N && await i.log(
          `  Extracted structure for detached component "${s}" (ID: ${n.id.substring(0, 8)}...)`
        );
      } catch (A) {
        console.warn(
          `Failed to extract structure for remote component "${s}":`,
          A
        );
      }
      h && (y.remoteLibraryName = h), v && (y.remoteLibraryKey = v), N && (y.componentNodeId = n.id), await i.log(
        `  Found INSTANCE: "${c}" -> REMOTE component "${s}" (ID: ${n.id.substring(0, 8)}...)${N ? " [DETACHED]" : ""}`
      );
    }
    const T = t.instanceTable.addInstance(y);
    r._instanceRef = T, a.add("_instanceRef");
  }
  return r;
}
class se {
  constructor() {
    L(this, "instanceMap");
    // unique key -> index
    L(this, "instances");
    // index -> instance data
    L(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(t) {
    return t.instanceType === "internal" && t.componentNodeId ? `internal:${t.componentNodeId}` : t.instanceType === "normal" && t.componentGuid && t.componentVersion !== void 0 ? `normal:${t.componentGuid}:${t.componentVersion}` : t.instanceType === "remote" && t.remoteLibraryKey ? `remote:${t.remoteLibraryKey}:${t.componentName}` : t.instanceType === "remote" && t.componentNodeId ? `remote:detached:${t.componentNodeId}` : `${t.instanceType}:${t.componentName}:COMPONENT`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(t) {
    const r = this.generateKey(t);
    if (this.instanceMap.has(r))
      return this.instanceMap.get(r);
    const a = this.nextIndex++;
    return this.instanceMap.set(r, a), this.instances[a] = t, a;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(t) {
    var a;
    const r = this.generateKey(t);
    return (a = this.instanceMap.get(r)) != null ? a : -1;
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
    for (let r = 0; r < this.instances.length; r++)
      t[String(r)] = this.instances[r];
    return t;
  }
  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(t) {
    const r = new se(), a = Object.entries(t).sort(
      (n, c) => parseInt(n[0], 10) - parseInt(c[0], 10)
    );
    for (const [n, c] of a) {
      const s = parseInt(n, 10), p = r.generateKey(c);
      r.instanceMap.set(p, s), r.instances[s] = c, r.nextIndex = Math.max(r.nextIndex, s + 1);
    }
    return r;
  }
  /**
   * Gets the total number of instances in the table
   */
  getSize() {
    return this.instances.length;
  }
}
const Le = {
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
function At() {
  const e = {};
  for (const [t, r] of Object.entries(Le))
    e[r] = t;
  return e;
}
function Ie(e) {
  var t;
  return (t = Le[e]) != null ? t : e;
}
function vt(e) {
  var t;
  return typeof e == "number" ? (t = At()[e]) != null ? t : e.toString() : e;
}
const _e = {
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
}, fe = {};
for (const [e, t] of Object.entries(_e))
  fe[t] = e;
class ce {
  constructor() {
    L(this, "shortToLong");
    L(this, "longToShort");
    this.shortToLong = I({}, fe), this.longToShort = I({}, _e);
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
      return t.map((r) => this.compressObject(r));
    if (typeof t == "object") {
      const r = {}, a = /* @__PURE__ */ new Set();
      for (const n of Object.keys(t))
        a.add(n);
      for (const [n, c] of Object.entries(t)) {
        const s = this.getShortName(n);
        if (s !== n && !a.has(s)) {
          let p = this.compressObject(c);
          s === "type" && typeof p == "string" && (p = Ie(p)), r[s] = p;
        } else {
          let p = this.compressObject(c);
          n === "type" && typeof p == "string" && (p = Ie(p)), r[n] = p;
        }
      }
      return r;
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
      return t.map((r) => this.expandObject(r));
    if (typeof t == "object") {
      const r = {};
      for (const [a, n] of Object.entries(t)) {
        const c = this.getLongName(a);
        let s = this.expandObject(n);
        (c === "type" || a === "type") && (typeof s == "number" || typeof s == "string") && (s = vt(s)), r[c] = s;
      }
      return r;
    }
    return t;
  }
  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable() {
    return I({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const r = new ce();
    r.shortToLong = I(I({}, fe), t), r.longToShort = {};
    for (const [a, n] of Object.entries(
      r.shortToLong
    ))
      r.longToShort[n] = a;
    return r;
  }
}
function Nt(e, t) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return e;
  const r = {};
  e.metadata && (r.metadata = e.metadata);
  for (const [a, n] of Object.entries(e))
    a !== "metadata" && (r[a] = t.compressObject(n));
  return r;
}
function Ct(e, t) {
  return t.expandObject(e);
}
function ne(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
function be(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((r) => {
    t += be(r);
  }), t;
}
async function le(e, t = /* @__PURE__ */ new WeakSet(), r = {}) {
  var d, m, o, f, w, b;
  if (!e || typeof e != "object")
    return e;
  const a = (d = r.maxNodes) != null ? d : 1e4, n = (m = r.nodeCount) != null ? m : 0;
  if (n >= a)
    return await i.warning(
      `Maximum node count (${a}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${a}) reached`,
      _nodeCount: n
    };
  const c = {
    visited: (o = r.visited) != null ? o : /* @__PURE__ */ new WeakSet(),
    depth: (f = r.depth) != null ? f : 0,
    maxDepth: (w = r.maxDepth) != null ? w : 100,
    nodeCount: n + 1,
    maxNodes: a,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: r.variableTable,
    collectionTable: r.collectionTable,
    instanceTable: r.instanceTable,
    detachedComponentsHandled: (b = r.detachedComponentsHandled) != null ? b : /* @__PURE__ */ new Set()
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), c.visited = t;
  const s = {}, p = await dt(e, c);
  Object.assign(s, p);
  const u = e.type;
  if (u)
    switch (u) {
      case "FRAME":
      case "COMPONENT": {
        const C = await Ee(e);
        Object.assign(s, C);
        break;
      }
      case "INSTANCE": {
        const C = await bt(
          e,
          c
        );
        Object.assign(s, C);
        const y = await Ee(
          e
        );
        Object.assign(s, y);
        break;
      }
      case "TEXT": {
        const C = await pt(e);
        Object.assign(s, C);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const C = await gt(e);
        Object.assign(s, C);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const C = await ft(e);
        Object.assign(s, C);
        break;
      }
      default:
        c.unhandledKeys.add("_unknownType");
        break;
    }
  const l = Object.getOwnPropertyNames(e), g = /* @__PURE__ */ new Set([
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
  (u === "FRAME" || u === "COMPONENT" || u === "INSTANCE") && (g.add("layoutMode"), g.add("primaryAxisSizingMode"), g.add("counterAxisSizingMode"), g.add("primaryAxisAlignItems"), g.add("counterAxisAlignItems"), g.add("paddingLeft"), g.add("paddingRight"), g.add("paddingTop"), g.add("paddingBottom"), g.add("itemSpacing"), g.add("cornerRadius"), g.add("clipsContent"), g.add("layoutWrap"), g.add("layoutGrow")), u === "TEXT" && (g.add("characters"), g.add("fontName"), g.add("fontSize"), g.add("textAlignHorizontal"), g.add("textAlignVertical"), g.add("letterSpacing"), g.add("lineHeight"), g.add("textCase"), g.add("textDecoration"), g.add("textAutoResize"), g.add("paragraphSpacing"), g.add("paragraphIndent"), g.add("listOptions")), (u === "VECTOR" || u === "LINE") && (g.add("fillGeometry"), g.add("strokeGeometry")), (u === "RECTANGLE" || u === "ELLIPSE" || u === "STAR" || u === "POLYGON") && (g.add("pointCount"), g.add("innerRadius"), g.add("arcData")), u === "INSTANCE" && (g.add("mainComponent"), g.add("componentProperties"));
  for (const C of l)
    typeof e[C] != "function" && (g.has(C) || c.unhandledKeys.add(C));
  if (c.unhandledKeys.size > 0 && (s._unhandledKeys = Array.from(c.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const C = c.maxDepth;
    if (c.depth >= C)
      s.children = {
        _truncated: !0,
        _reason: `Maximum depth (${C}) reached`,
        _count: e.children.length
      };
    else if (c.nodeCount >= a)
      s.children = {
        _truncated: !0,
        _reason: `Maximum node count (${a}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const y = _(I({}, c), {
        depth: c.depth + 1
      }), T = [];
      let h = !1;
      for (const v of e.children) {
        if (y.nodeCount >= a) {
          s.children = {
            _truncated: !0,
            _reason: `Maximum node count (${a}) reached during children processing`,
            _processed: T.length,
            _total: e.children.length,
            children: T
          }, h = !0;
          break;
        }
        const N = await le(v, t, y);
        T.push(N), y.nodeCount && (c.nodeCount = y.nodeCount);
      }
      h || (s.children = T);
    }
  }
  return s;
}
async function ze(e, t = /* @__PURE__ */ new Set(), r = !1) {
  r || (await i.clear(), await i.log("=== Starting Page Export ==="));
  try {
    const a = e.pageIndex;
    if (a === void 0 || typeof a != "number")
      return await i.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await i.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const n = figma.root.children;
    if (await i.log(`Loaded ${n.length} page(s)`), a < 0 || a >= n.length)
      return await i.error(
        `Invalid page index: ${a} (valid range: 0-${n.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const c = n[a], s = c.id;
    if (t.has(s))
      return await i.log(
        `Page "${c.name}" has already been processed, skipping...`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Page already processed",
        data: {}
      };
    t.add(s), await i.log(
      `Selected page: "${c.name}" (index: ${a})`
    ), await i.log(
      "Initializing variable, collection, and instance tables..."
    );
    const p = new oe(), u = new ie(), l = new se();
    await i.log("Fetching team library variable collections...");
    let g = [];
    try {
      if (g = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((P) => ({
        libraryName: P.libraryName,
        key: P.key,
        name: P.name
      })), await i.log(
        `Found ${g.length} library collection(s) in team library`
      ), g.length > 0)
        for (const P of g)
          await i.log(`  - ${P.name} (from ${P.libraryName})`);
    } catch (x) {
      await i.warning(
        `Could not get library variable collections: ${x instanceof Error ? x.message : String(x)}`
      );
    }
    await i.log("Extracting node data from page..."), await i.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await i.log(
      "Collections will be discovered as variables are processed:"
    );
    const d = await le(
      c,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: p,
        collectionTable: u,
        instanceTable: l
      }
    );
    await i.log("Node extraction finished");
    const m = be(d), o = p.getSize(), f = u.getSize(), w = l.getSize();
    if (await i.log("Extraction complete:"), await i.log(`  - Total nodes: ${m}`), await i.log(`  - Unique variables: ${o}`), await i.log(`  - Unique collections: ${f}`), await i.log(`  - Unique instances: ${w}`), f > 0) {
      await i.log("Collections found:");
      const x = u.getTable();
      for (const [P, M] of Object.values(x).entries()) {
        const R = M.collectionGuid ? ` (GUID: ${M.collectionGuid.substring(0, 8)}...)` : "";
        await i.log(
          `  ${P}: ${M.collectionName}${R} - ${M.modes.length} mode(s)`
        );
      }
    }
    await i.log("Checking for referenced component pages...");
    const b = [], C = l.getSerializedTable(), y = Object.values(C).filter(
      (x) => x.instanceType === "normal"
    );
    if (y.length > 0) {
      await i.log(
        `Found ${y.length} normal instance(s) to check`
      );
      const x = /* @__PURE__ */ new Map();
      for (const P of y)
        if (P.componentPageName) {
          const M = n.find((R) => R.name === P.componentPageName);
          if (M && !t.has(M.id))
            x.has(M.id) || x.set(M.id, M);
          else if (!M) {
            const R = `Normal instance references component "${P.componentName || "(unnamed)"}" on page "${P.componentPageName}", but that page was not found. Cannot export.`;
            throw await i.error(R), new Error(R);
          }
        } else {
          const M = `Normal instance references component "${P.componentName || "(unnamed)"}" but has no componentPageName. Cannot export.`;
          throw await i.error(M), new Error(M);
        }
      await i.log(
        `Found ${x.size} unique referenced page(s)`
      );
      for (const [P, M] of x.entries()) {
        const R = M.name;
        if (t.has(P)) {
          await i.log(`Skipping "${R}" - already processed`);
          continue;
        }
        const Ae = M.getPluginData(
          "RecursicaPublishedMetadata"
        );
        let ve = !1;
        if (Ae)
          try {
            const U = JSON.parse(Ae);
            ve = !!(U.id && U.version !== void 0);
          } catch (U) {
          }
        const je = `Do you want to also publish referenced component "${R}"?`;
        try {
          await J.prompt(je, {
            okLabel: "Yes",
            cancelLabel: "No",
            timeoutMs: 3e5
            // 5 minutes
          }), await i.log(`Exporting referenced page: "${R}"`);
          const U = n.findIndex(
            (de) => de.id === M.id
          );
          if (U === -1)
            throw await i.error(
              `Could not find page index for "${R}"`
            ), new Error(`Could not find page index for "${R}"`);
          const Z = await ze(
            {
              pageIndex: U
            },
            t,
            // Pass the same set to track all processed pages
            !0
            // Mark as recursive call
          );
          if (Z.success && Z.data) {
            const de = Z.data;
            b.push(de), await i.log(
              `Successfully exported referenced page: "${R}"`
            );
          } else
            throw new Error(
              `Failed to export referenced page "${R}": ${Z.message}`
            );
        } catch (U) {
          if (U instanceof Error && U.message === "User cancelled")
            if (ve)
              await i.log(
                `User declined to publish "${R}", but page has existing metadata. Continuing with existing metadata.`
              );
            else
              throw await i.error(
                `Export cancelled: Referenced page "${R}" has no metadata and user declined to publish it.`
              ), new Error(
                `Cannot continue export: Referenced component "${R}" has no metadata. Please publish it first or choose to publish it now.`
              );
          else
            throw U;
        }
      }
    }
    await i.log("Creating string table...");
    const T = new ce();
    await i.log("Getting page metadata...");
    const h = c.getPluginData(
      "RecursicaPublishedMetadata"
    );
    let v = "", N = 0;
    if (h)
      try {
        const x = JSON.parse(h);
        v = x.id || "", N = x.version || 0;
      } catch (x) {
        await i.warning(
          "Failed to parse page metadata, generating new GUID"
        );
      }
    if (!v) {
      await i.log("Generating new GUID for page..."), v = await we();
      const x = {
        _ver: 1,
        id: v,
        name: c.name,
        version: N,
        publishDate: (/* @__PURE__ */ new Date()).toISOString(),
        history: {}
      };
      c.setPluginData(
        "RecursicaPublishedMetadata",
        JSON.stringify(x)
      );
    }
    await i.log("Creating export data structure...");
    const A = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        guid: v,
        version: N,
        name: c.name,
        pluginVersion: "1.0.0"
      },
      stringTable: T.getSerializedTable(),
      collections: u.getSerializedTable(),
      variables: p.getSerializedTable(),
      instances: l.getSerializedTable(),
      libraries: g,
      // Libraries might not need compression, but could be added later
      pageData: d
    };
    await i.log("Compressing JSON data...");
    const S = Nt(A, T);
    await i.log("Serializing to JSON...");
    const $ = JSON.stringify(S, null, 2), F = ($.length / 1024).toFixed(2), B = ne(c.name).trim().replace(/\s+/g, "_") + ".rec.json";
    return await i.log(`JSON serialization complete: ${F} KB`), await i.log(`Export file: ${B}`), await i.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: B,
        jsonData: $,
        pageName: c.name,
        additionalPages: b
        // Populated with referenced component pages
      }
    };
  } catch (a) {
    const n = a instanceof Error ? a.message : "Unknown error occurred";
    console.error("EXPORT ERROR CAUGHT:", a), console.error("Error message:", n), await i.error(`Export failed: ${n}`), a instanceof Error && a.stack && (console.error("Stack trace:", a.stack), await i.error(`Stack trace: ${a.stack}`));
    const c = {
      type: "exportPage",
      success: !1,
      error: !0,
      message: n,
      data: {}
    };
    return console.error("Returning error response:", c), c;
  }
}
async function W(e, t) {
  for (const r of t)
    e.modes.find((n) => n.name === r) || e.addMode(r);
}
const G = "recursica:collectionId";
async function re(e) {
  if (e.remote === !0) {
    const r = Me[e.id];
    if (!r) {
      const n = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await i.error(n), new Error(n);
    }
    return r.guid;
  } else {
    const r = e.getSharedPluginData(
      "recursica",
      G
    );
    if (r && r.trim() !== "")
      return r;
    const a = await we();
    return e.setSharedPluginData("recursica", G, a), a;
  }
}
function Et(e, t) {
  const r = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(r))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function Tt(e) {
  let t;
  const r = e.collectionName.trim().toLowerCase(), a = ["token", "tokens", "theme", "themes"], n = e.isLocal;
  if (n === !1 || n === void 0 && a.includes(r))
    try {
      const p = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((u) => u.name.trim().toLowerCase() === r);
      if (p) {
        Et(e.collectionName, !1);
        const u = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          p.key
        );
        if (u.length > 0) {
          const l = await figma.variables.importVariableByKeyAsync(u[0].key), g = await figma.variables.getVariableCollectionByIdAsync(
            l.variableCollectionId
          );
          if (g) {
            if (t = g, e.collectionGuid) {
              const d = t.getSharedPluginData(
                "recursica",
                G
              );
              (!d || d.trim() === "") && t.setSharedPluginData(
                "recursica",
                G,
                e.collectionGuid
              );
            } else
              await re(t);
            return await W(t, e.modes), { collection: t };
          }
        }
      }
    } catch (s) {
      if (n === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", s);
    }
  if (n !== !1) {
    const s = await figma.variables.getLocalVariableCollectionsAsync();
    let p;
    if (e.collectionGuid && (p = s.find((u) => u.getSharedPluginData("recursica", G) === e.collectionGuid)), p || (p = s.find(
      (u) => u.name === e.collectionName
    )), p)
      if (t = p, e.collectionGuid) {
        const u = t.getSharedPluginData(
          "recursica",
          G
        );
        (!u || u.trim() === "") && t.setSharedPluginData(
          "recursica",
          G,
          e.collectionGuid
        );
      } else
        await re(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        G,
        e.collectionGuid
      ) : await re(t);
  } else {
    const s = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), p = e.collectionName.trim().toLowerCase(), u = s.find((m) => m.name.trim().toLowerCase() === p);
    if (!u)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const l = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      u.key
    );
    if (l.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const g = await figma.variables.importVariableByKeyAsync(
      l[0].key
    ), d = await figma.variables.getVariableCollectionByIdAsync(
      g.variableCollectionId
    );
    if (!d)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = d, e.collectionGuid) {
      const m = t.getSharedPluginData(
        "recursica",
        G
      );
      (!m || m.trim() === "") && t.setSharedPluginData(
        "recursica",
        G,
        e.collectionGuid
      );
    } else
      re(t);
  }
  return await W(t, e.modes), { collection: t };
}
async function Ge(e, t) {
  for (const r of e.variableIds)
    try {
      const a = await figma.variables.getVariableByIdAsync(r);
      if (a && a.name === t)
        return a;
    } catch (a) {
      continue;
    }
  return null;
}
async function It(e, t, r, a, n) {
  for (const [c, s] of Object.entries(t)) {
    const p = a.modes.find((l) => l.name === c);
    if (!p) {
      console.warn(
        `Mode "${c}" not found in collection "${a.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const u = p.modeId;
    try {
      if (s == null)
        continue;
      if (typeof s == "string" || typeof s == "number" || typeof s == "boolean") {
        e.setValueForMode(u, s);
        continue;
      }
      if (typeof s == "object" && s !== null && "_varRef" in s && typeof s._varRef == "number") {
        const l = s;
        let g = null;
        const d = r.getVariableByIndex(
          l._varRef
        );
        if (d) {
          let m = null;
          if (n && d._colRef !== void 0) {
            const o = n.getCollectionByIndex(
              d._colRef
            );
            o && (m = (await Tt(o)).collection);
          }
          m && (g = await Ge(
            m,
            d.variableName
          ));
        }
        if (g) {
          const m = {
            type: "VARIABLE_ALIAS",
            id: g.id
          };
          e.setValueForMode(u, m);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${c}" in variable "${e.name}". Variable reference index: ${l._varRef}`
          );
      }
    } catch (l) {
      console.warn(
        `Error setting value for mode "${c}" in variable "${e.name}":`,
        l
      );
    }
  }
}
async function Se(e, t, r, a) {
  const n = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await It(
    n,
    e.valuesByMode,
    r,
    t,
    // Pass collection to look up modes by name
    a
  ), n;
}
async function Ve(e, t, r, a) {
  if (!(!t || typeof t != "object"))
    try {
      const n = e[r];
      if (!n || !Array.isArray(n))
        return;
      const c = t[r];
      if (Array.isArray(c))
        for (let s = 0; s < c.length && s < n.length; s++) {
          const p = c[s];
          if (p && typeof p == "object") {
            n[s].boundVariables || (n[s].boundVariables = {});
            for (const [u, l] of Object.entries(
              p
            ))
              if (Pe(l)) {
                const g = l._varRef;
                if (g !== void 0) {
                  const d = a.get(String(g));
                  d && (n[s].boundVariables[u] = {
                    type: "VARIABLE_ALIAS",
                    id: d.id
                  });
                }
              }
          }
        }
    } catch (n) {
      console.log(`Error restoring bound variables for ${r}:`, n);
    }
}
function St(e, t) {
  const r = Ze(t);
  if (e.visible === void 0 && (e.visible = r.visible), e.locked === void 0 && (e.locked = r.locked), e.opacity === void 0 && (e.opacity = r.opacity), e.rotation === void 0 && (e.rotation = r.rotation), e.blendMode === void 0 && (e.blendMode = r.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const a = O;
    e.layoutMode === void 0 && (e.layoutMode = a.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = a.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = a.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = a.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = a.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = a.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = a.paddingRight), e.paddingTop === void 0 && (e.paddingTop = a.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = a.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = a.itemSpacing);
  }
  if (t === "TEXT") {
    const a = z;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = a.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = a.textAlignVertical), e.textCase === void 0 && (e.textCase = a.textCase), e.textDecoration === void 0 && (e.textDecoration = a.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = a.textAutoResize);
  }
}
async function Y(e, t, r = null, a = null, n = null, c = null, s = null, p = !1, u = null) {
  var g;
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
      if (e.id && s && s.has(e.id))
        l = s.get(e.id), await i.log(
          `Reusing existing COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id.substring(0, 8)}...)`
        );
      else if (l = figma.createComponent(), await i.log(
        `Created COMPONENT "${e.name || "Unnamed"}" (ID: ${e.id ? e.id.substring(0, 8) + "..." : "no ID"})`
      ), e.componentPropertyDefinitions)
        try {
          l.componentPropertyDefinitions = e.componentPropertyDefinitions, await i.log(
            `  Set component property definitions for "${e.name || "Unnamed"}" via direct assignment`
          );
        } catch (d) {
          try {
            l.setProperties(
              e.componentPropertyDefinitions
            ), await i.log(
              `  Set component property definitions for "${e.name || "Unnamed"}" via setProperties`
            );
          } catch (m) {
            await i.warning(
              `  Component "${e.name || "Unnamed"}" has property definitions in JSON, but they cannot be recreated via API. Instances may not be able to set variant properties.`
            );
          }
        }
      break;
    case "COMPONENT_SET": {
      const d = e.children ? e.children.length : 0, m = e.children ? e.children.filter((o) => o.type === "COMPONENT").length : 0;
      if (await i.log(
        `Converting COMPONENT_SET "${e.name || "Unnamed"}" to frame (COMPONENT_SET cannot be created via API). Has ${d} children (${m} COMPONENT children)`
      ), e.children && Array.isArray(e.children))
        for (const o of e.children)
          o.type === "COMPONENT" && o.id && await i.log(
            `  COMPONENT child: "${o.name || "Unnamed"}" (ID: ${o.id.substring(0, 8)}...)`
          );
      l = figma.createFrame();
      break;
    }
    case "INSTANCE":
      if (p)
        l = figma.createFrame(), e.name && (l.name = e.name);
      else if (e._instanceRef !== void 0 && n && s) {
        const d = n.getInstanceByIndex(
          e._instanceRef
        );
        if (d && d.instanceType === "internal")
          if (d.componentNodeId)
            if (d.componentNodeId === e.id)
              await i.warning(
                `Instance "${e.name}" has componentNodeId matching its own ID (detached instance). Creating frame fallback.`
              ), l = figma.createFrame(), e.name && (l.name = e.name);
            else {
              const m = s.get(
                d.componentNodeId
              );
              if (!m) {
                const o = Array.from(s.keys()).slice(
                  0,
                  20
                );
                await i.error(
                  `Component not found for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...). The component should have been created during import.`
                ), await i.error(
                  `Looking for component ID: ${d.componentNodeId}`
                ), await i.error(
                  `Available IDs in mapping (first 20): ${o.map((y) => y.substring(0, 8) + "...").join(", ")}`
                );
                const f = (y, T) => {
                  if (y.type === "COMPONENT" && y.id === T)
                    return !0;
                  if (y.children && Array.isArray(y.children)) {
                    for (const h of y.children)
                      if (!h._truncated && f(h, T))
                        return !0;
                  }
                  return !1;
                }, w = f(
                  e,
                  d.componentNodeId
                );
                await i.error(
                  `Component ID ${d.componentNodeId.substring(0, 8)}... exists in current node tree: ${w}`
                ), await i.error(
                  `WARNING: Component ID ${d.componentNodeId.substring(0, 8)}... not found in nodeIdMapping. This might indicate:`
                ), await i.error(
                  "  1. The component doesn't exist in the pageData (detached component?)"
                ), await i.error(
                  "  2. The component wasn't collected in the first pass"
                ), await i.error(
                  "  3. The component ID in the instance table doesn't match the actual component ID"
                );
                const b = o.filter(
                  (y) => y.startsWith(d.componentNodeId.substring(0, 8))
                );
                b.length > 0 && await i.error(
                  `Found IDs with matching prefix: ${b.map((y) => y.substring(0, 8) + "...").join(", ")}`
                );
                const C = `Component not found for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...). The component should have been created during import. Available IDs in mapping (first 20): ${o.map((y) => y.substring(0, 8) + "...").join(", ")}`;
                throw new Error(C);
              }
              if (m && m.type === "COMPONENT") {
                if (l = m.createInstance(), await i.log(
                  `✓ Created internal instance "${e.name}" from component "${d.componentName}"`
                ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
                  try {
                    const o = await l.getMainComponentAsync();
                    if (o) {
                      const f = o.componentPropertyDefinitions, w = {};
                      for (const [b, C] of Object.entries(
                        d.variantProperties
                      ))
                        f[b] ? w[b] = C : await i.warning(
                          `Skipping variant property "${b}" for internal instance "${e.name}" - property does not exist on recreated component`
                        );
                      Object.keys(w).length > 0 && l.setProperties(w);
                    } else
                      await i.warning(
                        `Cannot set variant properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (o) {
                    const f = `Failed to set variant properties for instance "${e.name}": ${o}`;
                    throw await i.error(f), new Error(f);
                  }
                if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
                  try {
                    const o = await l.getMainComponentAsync();
                    if (o) {
                      const f = o.componentPropertyDefinitions;
                      for (const [w, b] of Object.entries(
                        d.componentProperties
                      ))
                        if (f[w])
                          try {
                            l.setProperties({ [w]: b });
                          } catch (C) {
                            const y = `Failed to set component property "${w}" for internal instance "${e.name}": ${C}`;
                            throw await i.error(y), new Error(y);
                          }
                        else
                          await i.warning(
                            `Skipping component property "${w}" for internal instance "${e.name}" - property does not exist on recreated component`
                          );
                    } else
                      await i.warning(
                        `Cannot set component properties for internal instance "${e.name}" - main component not found`
                      );
                  } catch (o) {
                    if (o instanceof Error)
                      throw o;
                    const f = `Failed to set component properties for instance "${e.name}": ${o}`;
                    throw await i.error(f), new Error(f);
                  }
              } else if (!l && m) {
                const o = `Component node found but is not a COMPONENT type for internal instance "${e.name}" (ID: ${d.componentNodeId.substring(0, 8)}...).`;
                throw await i.error(o), new Error(o);
              }
            }
          else {
            const m = `Internal instance "${e.name}" missing componentNodeId. This is required for internal instances.`;
            throw await i.error(m), new Error(m);
          }
        else if (d && d.instanceType === "remote")
          if (u) {
            const m = u.get(
              e._instanceRef
            );
            if (m) {
              if (l = m.createInstance(), await i.log(
                `✓ Created remote instance "${e.name}" from component "${d.componentName}" on REMOTES page`
              ), d.variantProperties && Object.keys(d.variantProperties).length > 0)
                try {
                  const o = await l.getMainComponentAsync();
                  if (o) {
                    const f = o.componentPropertyDefinitions, w = {};
                    for (const [b, C] of Object.entries(
                      d.variantProperties
                    ))
                      f[b] ? w[b] = C : await i.warning(
                        `Skipping variant property "${b}" for remote instance "${e.name}" - property does not exist on recreated component`
                      );
                    Object.keys(w).length > 0 && l.setProperties(w);
                  } else
                    await i.warning(
                      `Cannot set variant properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (o) {
                  const f = `Failed to set variant properties for remote instance "${e.name}": ${o}`;
                  throw await i.error(f), new Error(f);
                }
              if (d.componentProperties && Object.keys(d.componentProperties).length > 0)
                try {
                  const o = await l.getMainComponentAsync();
                  if (o) {
                    const f = o.componentPropertyDefinitions;
                    for (const [w, b] of Object.entries(
                      d.componentProperties
                    ))
                      if (f[w])
                        try {
                          l.setProperties({ [w]: b });
                        } catch (C) {
                          const y = `Failed to set component property "${w}" for remote instance "${e.name}": ${C}`;
                          throw await i.error(y), new Error(y);
                        }
                      else
                        await i.warning(
                          `Skipping component property "${w}" for remote instance "${e.name}" - property does not exist on recreated component`
                        );
                  } else
                    await i.warning(
                      `Cannot set component properties for remote instance "${e.name}" - main component not found`
                    );
                } catch (o) {
                  if (o instanceof Error)
                    throw o;
                  const f = `Failed to set component properties for remote instance "${e.name}": ${o}`;
                  throw await i.error(f), new Error(f);
                }
            } else {
              const o = `Remote component not found for instance "${e.name}" (index ${e._instanceRef}). The remote component should have been created on the REMOTES page.`;
              throw await i.error(o), new Error(o);
            }
          } else {
            const m = `Remote instance "${e.name}" cannot be resolved (no remoteComponentMap). Remote instances require a remoteComponentMap.`;
            throw await i.error(m), new Error(m);
          }
        else if ((d == null ? void 0 : d.instanceType) === "normal")
          await i.log(
            `Instance "${e.name}" is a normal instance (not yet implemented), creating frame fallback`
          ), l = figma.createFrame();
        else {
          const m = `Instance "${e.name}" has unknown or missing instance type: ${(d == null ? void 0 : d.instanceType) || "unknown"}`;
          throw await i.error(m), new Error(m);
        }
      } else {
        const d = `Instance "${e.name}" missing _instanceRef or instance table. This is required for instance resolution.`;
        throw await i.error(d), new Error(d);
      }
      break;
    case "GROUP":
      l = figma.createFrame();
      break;
    case "BOOLEAN_OPERATION": {
      const d = `Boolean operation nodes cannot be imported. Found boolean operation: "${e.name}".`;
      throw await i.error(d), new Error(d);
    }
    case "POLYGON":
      l = figma.createPolygon();
      break;
    default: {
      const d = `Unsupported node type: ${e.type}. This node type cannot be imported.`;
      throw await i.error(d), new Error(d);
    }
  }
  if (!l)
    return null;
  if (e.id && s && (s.set(e.id, l), l.type === "COMPONENT" && await i.log(
    `  Stored COMPONENT "${e.name || "Unnamed"}" in nodeIdMapping (ID: ${e.id.substring(0, 8)}...)`
  )), St(l, e.type || "FRAME"), e.name !== void 0 && (l.name = e.name || "Unnamed Node"), e.x !== void 0 && (l.x = e.x), e.y !== void 0 && (l.y = e.y), e.width !== void 0 && e.height !== void 0 && l.resize(e.width, e.height), e.visible !== void 0 && (l.visible = e.visible), e.locked !== void 0 && (l.locked = e.locked), e.opacity !== void 0 && (l.opacity = e.opacity), e.rotation !== void 0 && (l.rotation = e.rotation), e.blendMode !== void 0 && (l.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
    try {
      let d = e.fills;
      Array.isArray(d) && (d = d.map((m) => {
        if (m && typeof m == "object") {
          const o = I({}, m);
          return delete o.boundVariables, o;
        }
        return m;
      })), l.fills = d, (g = e.boundVariables) != null && g.fills && c && await Ve(
        l,
        e.boundVariables,
        "fills",
        c
      );
    } catch (d) {
      console.log("Error setting fills:", d);
    }
  if (e.strokes !== void 0 && e.strokes.length > 0)
    try {
      l.strokes = e.strokes;
    } catch (d) {
      console.log("Error setting strokes:", d);
    }
  if (e.strokeWeight !== void 0 && (l.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (l.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (l.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (l.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (l.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (l.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (l.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (l.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (l.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (l.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (l.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (l.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (l.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (l.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (l.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (l.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (l.dashPattern = e.dashPattern), e.type === "VECTOR")) {
    if (e.fillGeometry !== void 0)
      try {
        const { normalizeSvgPath: d } = await Promise.resolve().then(() => mt), m = e.fillGeometry.map((o) => {
          const f = o.data;
          return {
            data: d(f),
            windingRule: o.windRule || o.windingRule || "NONZERO"
          };
        });
        for (let o = 0; o < e.fillGeometry.length; o++) {
          const f = e.fillGeometry[o].data, w = m[o].data;
          f !== w && await i.log(
            `  Normalized path ${o + 1} for "${e.name || "Unnamed"}": ${f.substring(0, 50)}... -> ${w.substring(0, 50)}...`
          );
        }
        l.vectorPaths = m, await i.log(
          `  Set vectorPaths for VECTOR "${e.name || "Unnamed"}" (${m.length} path(s))`
        );
      } catch (d) {
        await i.warning(
          `Error setting vectorPaths for VECTOR "${e.name || "Unnamed"}": ${d}`
        );
      }
    if (e.strokeGeometry !== void 0)
      try {
        l.strokeGeometry = e.strokeGeometry;
      } catch (d) {
        await i.warning(
          `Error setting strokeGeometry for VECTOR "${e.name || "Unnamed"}": ${d}`
        );
      }
  }
  if (e.type === "TEXT" && e.characters !== void 0)
    try {
      if (e.fontName)
        try {
          await figma.loadFontAsync(e.fontName), l.fontName = e.fontName;
        } catch (d) {
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
      l.characters = e.characters, e.fontSize !== void 0 && (l.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (l.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (l.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (l.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (l.lineHeight = e.lineHeight), e.textCase !== void 0 && (l.textCase = e.textCase), e.textDecoration !== void 0 && (l.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (l.textAutoResize = e.textAutoResize);
    } catch (d) {
      console.log("Error setting text properties: " + d);
      try {
        l.characters = e.characters;
      } catch (m) {
        console.log("Could not set text characters: " + m);
      }
    }
  if (e.boundVariables) {
    for (const [d, m] of Object.entries(
      e.boundVariables
    ))
      if (d !== "fills" && Pe(m) && r && c) {
        const o = m._varRef;
        if (o !== void 0) {
          const f = c.get(String(o));
          if (f) {
            const w = {
              type: "VARIABLE_ALIAS",
              id: f.id
            };
            l.boundVariables || (l.boundVariables = {}), l.boundVariables[d] || (l.boundVariables[d] = w);
          }
        }
      }
  }
  if (e.children && Array.isArray(e.children) && l.type !== "INSTANCE") {
    const d = (o) => {
      const f = [];
      for (const w of o)
        w._truncated || (w.type === "COMPONENT" ? (f.push(w), w.children && Array.isArray(w.children) && f.push(...d(w.children))) : w.children && Array.isArray(w.children) && f.push(...d(w.children)));
      return f;
    };
    for (const o of e.children) {
      if (o._truncated) {
        console.log(
          `Skipping truncated children: ${o._reason || "Unknown"}`
        );
        continue;
      }
      o.type;
    }
    const m = d(e.children);
    await i.log(
      `  First pass: Creating ${m.length} COMPONENT node(s) (without children)...`
    );
    for (const o of m)
      await i.log(
        `  Collected COMPONENT "${o.name || "Unnamed"}" (ID: ${o.id ? o.id.substring(0, 8) + "..." : "no ID"}) for first pass`
      );
    for (const o of m)
      if (o.id && s && !s.has(o.id)) {
        const f = figma.createComponent();
        if (o.name !== void 0 && (f.name = o.name || "Unnamed Node"), o.componentPropertyDefinitions)
          try {
            f.componentPropertyDefinitions = o.componentPropertyDefinitions, await i.log(
              `  Set component property definitions for "${o.name || "Unnamed"}" via direct assignment in first pass`
            );
          } catch (w) {
            try {
              f.setProperties(
                o.componentPropertyDefinitions
              ), await i.log(
                `  Set component property definitions for "${o.name || "Unnamed"}" via setProperties in first pass`
              );
            } catch (b) {
              await i.warning(
                `  Component "${o.name || "Unnamed"}" has property definitions in JSON, but they cannot be recreated via API. Instances may not be able to set variant properties.`
              );
            }
          }
        s.set(o.id, f), await i.log(
          `  Created COMPONENT "${o.name || "Unnamed"}" (ID: ${o.id.substring(0, 8)}...) in first pass`
        );
      }
    for (const o of e.children) {
      if (o._truncated)
        continue;
      const f = await Y(
        o,
        l,
        r,
        a,
        n,
        c,
        s,
        p,
        u
      );
      f && l.appendChild(f);
    }
  }
  return t && t.appendChild(l), l;
}
async function xe(e) {
  await figma.loadAllPagesAsync();
  const t = figma.root.children, r = new Set(t.map((c) => c.name));
  if (!r.has(e))
    return e;
  let a = 1, n = `${e}_${a}`;
  for (; r.has(n); )
    a++, n = `${e}_${a}`;
  return n;
}
async function xt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), r = new Set(t.map((c) => c.name));
  if (!r.has(e))
    return e;
  let a = 1, n = `${e}_${a}`;
  for (; r.has(n); )
    a++, n = `${e}_${a}`;
  return n;
}
async function $t(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const c of e.variableIds)
    try {
      const s = await figma.variables.getVariableByIdAsync(c);
      s && r.add(s.name);
    } catch (s) {
      continue;
    }
  if (!r.has(t))
    return t;
  let a = 1, n = `${t}_${a}`;
  for (; r.has(n); )
    a++, n = `${t}_${a}`;
  return n;
}
function Pt(e, t) {
  const r = e.resolvedType.toUpperCase(), a = t.toUpperCase();
  return r === a;
}
async function Mt(e) {
  const t = await figma.variables.getLocalVariableCollectionsAsync(), r = j(e.collectionName);
  if (H(e.collectionName)) {
    for (const a of t)
      if (j(a.name) === r)
        return {
          collection: a,
          matchType: "potential"
        };
    return {
      collection: null,
      matchType: "none"
    };
  }
  if (e.collectionGuid) {
    for (const a of t)
      if (a.getSharedPluginData(
        "recursica",
        G
      ) === e.collectionGuid)
        return {
          collection: a,
          matchType: "recognized"
        };
  }
  for (const a of t)
    if (a.name === e.collectionName)
      return {
        collection: a,
        matchType: "potential"
      };
  return {
    collection: null,
    matchType: "none"
  };
}
function Rt(e) {
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
function Ot(e) {
  if (!e.stringTable)
    return {
      success: !1,
      error: "Invalid JSON format. String table is required."
    };
  let t;
  try {
    t = ce.fromTable(e.stringTable);
  } catch (a) {
    return {
      success: !1,
      error: `Failed to load string table: ${a instanceof Error ? a.message : "Unknown error"}`
    };
  }
  const r = Ct(e, t);
  return {
    success: !0,
    stringTable: t,
    expandedJsonData: r
  };
}
function kt(e) {
  if (!e.collections)
    return {
      success: !1,
      error: "No collections table found in JSON"
    };
  try {
    return {
      success: !0,
      collectionTable: ie.fromTable(
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
async function Lt(e) {
  const t = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), n = e.getTable();
  for (const [c, s] of Object.entries(n)) {
    if (s.isLocal === !1) {
      await i.log(
        `Skipping remote collection: "${s.collectionName}" (index ${c})`
      );
      continue;
    }
    const p = await Mt(s);
    p.matchType === "recognized" ? (await i.log(
      `✓ Recognized collection by GUID: "${s.collectionName}" (index ${c})`
    ), t.set(c, p.collection)) : p.matchType === "potential" ? (await i.log(
      `? Potential match by name: "${s.collectionName}" (index ${c})`
    ), r.set(c, {
      entry: s,
      collection: p.collection
    })) : (await i.log(
      `✗ No match found for collection: "${s.collectionName}" (index ${c}) - will create new`
    ), a.set(c, s));
  }
  return await i.log(
    `Collection matching complete: ${t.size} recognized, ${r.size} potential matches, ${a.size} to create`
  ), {
    recognizedCollections: t,
    potentialMatches: r,
    collectionsToCreate: a
  };
}
async function _t(e, t, r) {
  if (e.size !== 0) {
    await i.log(
      `Prompting user for ${e.size} potential match(es)...`
    );
    for (const [a, { entry: n, collection: c }] of e.entries())
      try {
        const s = H(n.collectionName) ? j(n.collectionName) : c.name, p = `Found existing "${s}" variable collection. Should I use it?`;
        await i.log(
          `Prompting user about potential match: "${s}"`
        ), await J.prompt(p, {
          okLabel: "Yes",
          cancelLabel: "No",
          timeoutMs: -1
        }), await i.log(
          `✓ User confirmed: Using existing collection "${s}" (index ${a})`
        ), t.set(a, c), await W(c, n.modes), await i.log(
          `  ✓ Ensured modes for collection "${s}" (${n.modes.length} mode(s))`
        );
      } catch (s) {
        await i.log(
          `✗ User rejected: Will create new collection for "${n.collectionName}" (index ${a})`
        ), r.set(a, n);
      }
  }
}
async function zt(e, t, r) {
  if (e.size === 0)
    return;
  await i.log("Ensuring modes exist for recognized collections...");
  const a = t.getTable();
  for (const [n, c] of e.entries()) {
    const s = a[n];
    s && (r.has(n) || (await W(c, s.modes), await i.log(
      `  ✓ Ensured modes for collection "${c.name}" (${s.modes.length} mode(s))`
    )));
  }
}
async function Gt(e, t, r) {
  if (e.size !== 0) {
    await i.log(
      `Creating ${e.size} new collection(s)...`
    );
    for (const [a, n] of e.entries()) {
      const c = j(n.collectionName), s = await xt(c);
      s !== c ? await i.log(
        `Creating collection: "${s}" (normalized: "${c}" - name conflict resolved)`
      ) : await i.log(`Creating collection: "${s}"`);
      const p = figma.variables.createVariableCollection(s);
      r.push(p);
      let u;
      if (H(n.collectionName)) {
        const l = ye(n.collectionName);
        l && (u = l);
      } else n.collectionGuid && (u = n.collectionGuid);
      u && (p.setSharedPluginData(
        "recursica",
        G,
        u
      ), await i.log(
        `  Stored GUID: ${u.substring(0, 8)}...`
      )), await W(p, n.modes), await i.log(
        `  ✓ Created collection "${s}" with ${n.modes.length} mode(s)`
      ), t.set(a, p);
    }
    await i.log("Collection creation complete");
  }
}
function Vt(e) {
  if (!e.variables)
    return {
      success: !1,
      error: "No variables table found in JSON"
    };
  try {
    return {
      success: !0,
      variableTable: oe.fromTable(e.variables)
    };
  } catch (t) {
    return {
      success: !1,
      error: `Failed to load variables table: ${t instanceof Error ? t.message : "Unknown error"}`
    };
  }
}
async function Ut(e, t, r, a) {
  const n = /* @__PURE__ */ new Map(), c = [], s = new Set(
    a.map((l) => l.id)
  );
  await i.log("Matching and creating variables in collections...");
  const p = e.getTable(), u = /* @__PURE__ */ new Map();
  for (const [l, g] of Object.entries(p)) {
    if (g._colRef === void 0)
      continue;
    const d = r.get(String(g._colRef));
    if (!d)
      continue;
    u.has(d.id) || u.set(d.id, {
      collectionName: d.name,
      existing: 0,
      created: 0
    });
    const m = u.get(d.id), o = s.has(
      d.id
    );
    let f;
    typeof g.variableType == "number" ? f = {
      1: "COLOR",
      2: "FLOAT",
      3: "STRING",
      4: "BOOLEAN"
    }[g.variableType] || String(g.variableType) : f = g.variableType;
    const w = await Ge(
      d,
      g.variableName
    );
    if (w)
      if (Pt(w, f))
        n.set(l, w), m.existing++;
      else {
        await i.warning(
          `Type mismatch for variable "${g.variableName}" in collection "${d.name}": expected ${f}, found ${w.resolvedType}. Creating new variable with incremented name.`
        );
        const b = await $t(
          d,
          g.variableName
        ), C = await Se(
          _(I({}, g), {
            variableName: b,
            variableType: f
          }),
          d,
          e,
          t
        );
        o || c.push(C), n.set(l, C), m.created++;
      }
    else {
      const b = await Se(
        _(I({}, g), {
          variableType: f
        }),
        d,
        e,
        t
      );
      o || c.push(b), n.set(l, b), m.created++;
    }
  }
  await i.log("Variable processing complete:");
  for (const l of u.values())
    await i.log(
      `  "${l.collectionName}": ${l.existing} existing, ${l.created} created`
    );
  return {
    recognizedVariables: n,
    newlyCreatedVariables: c
  };
}
function Ft(e) {
  if (!e.instances)
    return null;
  try {
    return se.fromTable(e.instances);
  } catch (t) {
    return null;
  }
}
function Bt(e) {
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
function Ue(e) {
  if (!e || typeof e != "object")
    return;
  e.type !== void 0 && (e.type = Bt(e.type));
  const t = e.children !== void 0 ? "children" : e.child !== void 0 ? "child" : null;
  if (t && (t === "child" && !e.children && (e.children = e.child, delete e.child), Array.isArray(e.children)))
    for (const r of e.children)
      Ue(r);
  e.fillG !== void 0 && e.fillGeometry === void 0 && (e.fillGeometry = e.fillG, delete e.fillG), e.strkG !== void 0 && e.strokeGeometry === void 0 && (e.strokeGeometry = e.strkG, delete e.strkG), e.child && !e.children && (e.children = e.child, delete e.child);
}
async function jt(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const c of e.children)
    (c.type === "FRAME" || c.type === "COMPONENT") && r.add(c.name);
  if (!r.has(t))
    return t;
  let a = 1, n = `${t}_${a}`;
  for (; r.has(n); )
    a++, n = `${t}_${a}`;
  return n;
}
async function Ht(e, t, r, a) {
  var d;
  const n = e.getSerializedTable(), c = Object.values(n).filter(
    (m) => m.instanceType === "remote"
  ), s = /* @__PURE__ */ new Map();
  if (c.length === 0)
    return await i.log("No remote instances found"), s;
  await i.log(
    `Processing ${c.length} remote instance(s)...`
  ), await figma.loadAllPagesAsync();
  let u = figma.root.children.find((m) => m.name === "REMOTES");
  if (u ? await i.log("Found existing REMOTES page") : (u = figma.createPage(), u.name = "REMOTES", await i.log("Created REMOTES page")), !u.children.some(
    (m) => m.type === "FRAME" && m.name === "Title"
  )) {
    const m = { family: "Inter", style: "Bold" }, o = { family: "Inter", style: "Regular" };
    await figma.loadFontAsync(m), await figma.loadFontAsync(o);
    const f = figma.createFrame();
    f.name = "Title", f.layoutMode = "VERTICAL", f.paddingTop = 20, f.paddingBottom = 20, f.paddingLeft = 20, f.paddingRight = 20, f.fills = [];
    const w = figma.createText();
    w.fontName = m, w.characters = "REMOTE INSTANCES", w.fontSize = 24, w.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }], f.appendChild(w);
    const b = figma.createText();
    b.fontName = o, b.characters = "These are remotely connected component instances found in our different component pages.", b.fontSize = 14, b.fills = [
      { type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }
    ], f.appendChild(b), u.appendChild(f), await i.log("Created title and description on REMOTES page");
  }
  const g = /* @__PURE__ */ new Map();
  for (const [m, o] of Object.entries(n)) {
    if (o.instanceType !== "remote")
      continue;
    const f = parseInt(m, 10);
    if (await i.log(
      `Processing remote instance ${f}: "${o.componentName}"`
    ), !o.structure) {
      await i.warning(
        `Remote instance "${o.componentName}" missing structure data, skipping`
      );
      continue;
    }
    Ue(o.structure);
    const w = o.structure.children !== void 0, b = o.structure.child !== void 0, C = o.structure.children ? o.structure.children.length : o.structure.child ? o.structure.child.length : 0;
    await i.log(
      `  Structure type: ${o.structure.type || "unknown"}, has children: ${C} (children key: ${w}, child key: ${b})`
    );
    let y = o.componentName;
    if (o.path && o.path.length > 0) {
      const h = o.path.filter((v) => v !== "").join(" / ");
      h && (y = `${h} / ${o.componentName}`);
    }
    const T = await jt(
      u,
      y
    );
    T !== y && await i.log(
      `Component name conflict: "${y}" -> "${T}"`
    );
    try {
      if (o.structure.type !== "COMPONENT") {
        await i.warning(
          `Remote instance "${o.componentName}" structure is not a COMPONENT (type: ${o.structure.type}), creating frame fallback`
        );
        const v = figma.createFrame();
        v.name = T;
        const N = await Y(
          o.structure,
          v,
          t,
          r,
          null,
          a,
          g,
          !0
          // isRemoteStructure: true
        );
        N ? (v.appendChild(N), u.appendChild(v), await i.log(
          `✓ Created remote instance frame fallback: "${T}"`
        )) : v.remove();
        continue;
      }
      const h = figma.createComponent();
      h.name = T, u.appendChild(h), await i.log(
        `  Created component node: "${T}"`
      );
      try {
        if (o.structure.componentPropertyDefinitions)
          try {
            h.componentPropertyDefinitions = o.structure.componentPropertyDefinitions, await i.log(
              `  Set component property definitions for "${o.componentName}" via direct assignment`
            );
          } catch (N) {
            try {
              h.setProperties(
                o.structure.componentPropertyDefinitions
              ), await i.log(
                `  Set component property definitions for "${o.componentName}" via setProperties`
              );
            } catch (A) {
              await i.warning(
                `  Component "${o.componentName}" has property definitions in JSON, but they cannot be recreated via API: ${A}`
              );
            }
          }
        if (o.structure.name !== void 0 && (h.name = o.structure.name), o.structure.width !== void 0 && o.structure.height !== void 0 && h.resize(o.structure.width, o.structure.height), o.structure.x !== void 0 && (h.x = o.structure.x), o.structure.y !== void 0 && (h.y = o.structure.y), o.structure.visible !== void 0 && (h.visible = o.structure.visible), o.structure.opacity !== void 0 && (h.opacity = o.structure.opacity), o.structure.rotation !== void 0 && (h.rotation = o.structure.rotation), o.structure.blendMode !== void 0 && (h.blendMode = o.structure.blendMode), o.structure.fills !== void 0)
          try {
            let N = o.structure.fills;
            Array.isArray(N) && (N = N.map((A) => {
              if (A && typeof A == "object") {
                const S = I({}, A);
                return delete S.boundVariables, S;
              }
              return A;
            })), h.fills = N, (d = o.structure.boundVariables) != null && d.fills && a && await Ve(
              h,
              o.structure.boundVariables,
              "fills",
              a
            );
          } catch (N) {
            await i.warning(
              `Error setting fills for remote component "${o.componentName}": ${N}`
            );
          }
        if (o.structure.strokes !== void 0)
          try {
            h.strokes = o.structure.strokes;
          } catch (N) {
            await i.warning(
              `Error setting strokes for remote component "${o.componentName}": ${N}`
            );
          }
        o.structure.layoutMode !== void 0 && (h.layoutMode = o.structure.layoutMode), o.structure.primaryAxisSizingMode !== void 0 && (h.primaryAxisSizingMode = o.structure.primaryAxisSizingMode), o.structure.counterAxisSizingMode !== void 0 && (h.counterAxisSizingMode = o.structure.counterAxisSizingMode), o.structure.paddingLeft !== void 0 && (h.paddingLeft = o.structure.paddingLeft), o.structure.paddingRight !== void 0 && (h.paddingRight = o.structure.paddingRight), o.structure.paddingTop !== void 0 && (h.paddingTop = o.structure.paddingTop), o.structure.paddingBottom !== void 0 && (h.paddingBottom = o.structure.paddingBottom), o.structure.itemSpacing !== void 0 && (h.itemSpacing = o.structure.itemSpacing), o.structure.cornerRadius !== void 0 && (h.cornerRadius = o.structure.cornerRadius), await i.log(
          `  DEBUG: Structure keys: ${Object.keys(o.structure).join(", ")}, has children: ${!!o.structure.children}, has child: ${!!o.structure.child}`
        );
        const v = o.structure.children || (o.structure.child ? o.structure.child : null);
        if (await i.log(
          `  DEBUG: childrenArray exists: ${!!v}, isArray: ${Array.isArray(v)}, length: ${v ? v.length : 0}`
        ), v && Array.isArray(v) && v.length > 0) {
          await i.log(
            `  Recreating ${v.length} child(ren) for component "${o.componentName}"`
          );
          for (let N = 0; N < v.length; N++) {
            const A = v[N];
            if (await i.log(
              `  DEBUG: Processing child ${N + 1}/${v.length}: ${JSON.stringify({ name: A == null ? void 0 : A.name, type: A == null ? void 0 : A.type, hasTruncated: !!(A != null && A._truncated) })}`
            ), A._truncated) {
              await i.log(
                `  Skipping truncated child: ${A._reason || "Unknown"}`
              );
              continue;
            }
            await i.log(
              `  Recreating child: "${A.name || "Unnamed"}" (type: ${A.type})`
            );
            const S = await Y(
              A,
              h,
              t,
              r,
              null,
              a,
              g,
              !0
              // isRemoteStructure: true
            );
            S ? (h.appendChild(S), await i.log(
              `  ✓ Appended child "${A.name || "Unnamed"}" to component "${o.componentName}"`
            )) : await i.warning(
              `  ✗ Failed to create child "${A.name || "Unnamed"}" (type: ${A.type})`
            );
          }
        }
        s.set(f, h), await i.log(
          `✓ Created remote component: "${T}" (index ${f})`
        );
      } catch (v) {
        await i.warning(
          `Error populating remote component "${o.componentName}": ${v instanceof Error ? v.message : "Unknown error"}`
        ), h.remove();
      }
    } catch (h) {
      await i.warning(
        `Error recreating remote instance "${o.componentName}": ${h instanceof Error ? h.message : "Unknown error"}`
      );
    }
  }
  return await i.log(
    `Remote instance processing complete: ${s.size} component(s) created`
  ), s;
}
async function Kt(e, t, r, a, n, c, s = null) {
  await i.log("Creating page from JSON..."), await figma.loadAllPagesAsync();
  const p = figma.root.children, u = "RecursicaPublishedMetadata";
  let l = null;
  for (const y of p) {
    const T = y.getPluginData(u);
    if (T)
      try {
        if (JSON.parse(T).id === e.guid) {
          l = y;
          break;
        }
      } catch (h) {
        continue;
      }
  }
  l && await i.log(
    `Found existing page with same GUID: "${l.name}". Will create new page to avoid overwriting.`
  );
  const g = p.find((y) => y.name === e.name);
  g && await i.log(
    `Found existing page with same name: "${e.name}". Will create new page with unique name.`
  );
  let d;
  if (l || g) {
    const y = `__${e.name}`;
    d = await xe(y), await i.log(
      `Creating scratch page: "${d}" (will be renamed to "${e.name}" on success)`
    );
  } else
    d = e.name, await i.log(`Creating page: "${d}"`);
  const m = figma.createPage();
  if (m.name = d, await figma.setCurrentPageAsync(m), await i.log(`Switched to page: "${d}"`), !t.pageData)
    return {
      success: !1,
      error: "No page data found in JSON"
    };
  await i.log("Recreating page structure...");
  const o = t.pageData, f = /* @__PURE__ */ new Map(), w = (y, T = []) => {
    if (y.type === "COMPONENT" && y.id && T.push(y.id), y.children && Array.isArray(y.children))
      for (const h of y.children)
        h._truncated || w(h, T);
    return T;
  }, b = w(o);
  if (await i.log(
    `Found ${b.length} COMPONENT node(s) in page data`
  ), b.length > 0 && (await i.log(
    `Component IDs in page data (first 20): ${b.slice(0, 20).map((y) => y.substring(0, 8) + "...").join(", ")}`
  ), o._allComponentIds = b), o.children && Array.isArray(o.children))
    for (const y of o.children) {
      const T = await Y(
        y,
        m,
        r,
        a,
        n,
        c,
        f,
        !1,
        // isRemoteStructure: false - we're creating the main page
        s
        // Pass the remote component map
      );
      T && m.appendChild(T);
    }
  await i.log("Page structure recreated successfully");
  const C = {
    _ver: 1,
    id: e.guid,
    name: e.name,
    version: e.version || 0,
    publishDate: (/* @__PURE__ */ new Date()).toISOString(),
    history: {}
  };
  if (m.setPluginData(u, JSON.stringify(C)), await i.log(
    `Stored page metadata (GUID: ${e.guid.substring(0, 8)}...)`
  ), d.startsWith("__")) {
    const y = await xe(e.name);
    m.name = y, await i.log(`Renamed page from "${d}" to "${y}"`);
  }
  return {
    success: !0,
    page: m
  };
}
async function qt(e) {
  await i.clear(), await i.log("=== Starting Page Import ===");
  const t = [];
  try {
    const r = e.jsonData;
    if (!r)
      return await i.error("JSON data is required"), {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    await i.log("Validating metadata...");
    const a = Rt(r);
    if (!a.success)
      return await i.error(a.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: a.error,
        data: {}
      };
    const n = a.metadata;
    await i.log(
      `Metadata validated: guid=${n.guid}, name=${n.name}`
    ), await i.log("Loading string table...");
    const c = Ot(r);
    if (!c.success)
      return await i.error(c.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: c.error,
        data: {}
      };
    await i.log("String table loaded successfully"), await i.log("Expanding JSON data...");
    const s = c.expandedJsonData;
    await i.log("JSON expanded successfully"), await i.log("Loading collections table...");
    const p = kt(s);
    if (!p.success)
      return p.error === "No collections table found in JSON" ? (await i.log(p.error), await i.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no collections to process)",
        data: { pageName: n.name }
      }) : (await i.error(p.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: p.error,
        data: {}
      });
    const u = p.collectionTable;
    await i.log(
      `Loaded collections table with ${u.getSize()} collection(s)`
    ), await i.log(
      "Matching collections with existing local collections..."
    );
    const { recognizedCollections: l, potentialMatches: g, collectionsToCreate: d } = await Lt(u);
    await _t(
      g,
      l,
      d
    ), await zt(
      l,
      u,
      g
    ), await Gt(
      d,
      l,
      t
    ), await i.log("Loading variables table...");
    const m = Vt(s);
    if (!m.success)
      return m.error === "No variables table found in JSON" ? (await i.log(m.error), await i.log("=== Import Complete ==="), {
        type: "importPage",
        success: !0,
        error: !1,
        message: "Import complete (no variables to process)",
        data: { pageName: n.name }
      }) : (await i.error(m.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: m.error,
        data: {}
      });
    const o = m.variableTable;
    await i.log(
      `Loaded variables table with ${o.getSize()} variable(s)`
    );
    const { recognizedVariables: f, newlyCreatedVariables: w } = await Ut(
      o,
      u,
      l,
      t
    );
    await i.log("Loading instance table...");
    const b = Ft(s);
    if (b) {
      const v = b.getSerializedTable(), N = Object.values(v).filter(
        (S) => S.instanceType === "internal"
      ), A = Object.values(v).filter(
        (S) => S.instanceType === "remote"
      );
      await i.log(
        `Loaded instance table with ${b.getSize()} instance(s) (${N.length} internal, ${A.length} remote)`
      );
    } else
      await i.log("No instance table found in JSON");
    let C = null;
    b && (C = await Ht(
      b,
      o,
      u,
      f
    ));
    const y = await Kt(
      n,
      s,
      o,
      u,
      b,
      f,
      C
    );
    if (!y.success)
      return await i.error(y.error), {
        type: "importPage",
        success: !1,
        error: !0,
        message: y.error,
        data: {}
      };
    const T = y.page, h = f.size + w.length;
    return await i.log("=== Import Complete ==="), await i.log(
      `Successfully processed ${l.size} collection(s), ${h} variable(s), and created page "${T.name}"`
    ), {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Import completed successfully",
      data: {
        pageName: T.name,
        createdEntities: {
          pageIds: [T.id],
          collectionIds: t.map((v) => v.id),
          variableIds: w.map((v) => v.id)
        }
      }
    };
  } catch (r) {
    const a = r instanceof Error ? r.message : "Unknown error occurred";
    return await i.error(`Import failed: ${a}`), r instanceof Error && r.stack && await i.error(`Stack trace: ${r.stack}`), console.error("Error importing page:", r), {
      type: "importPage",
      success: !1,
      error: !0,
      message: a,
      data: {}
    };
  }
}
async function Jt(e) {
  await i.log("=== Cleaning up created entities ===");
  try {
    const { pageIds: t, collectionIds: r, variableIds: a } = e;
    let n = 0;
    for (const p of a)
      try {
        const u = figma.variables.getVariableById(p);
        if (u) {
          const l = u.variableCollectionId;
          r.includes(l) || (u.remove(), n++);
        }
      } catch (u) {
        await i.warning(
          `Could not delete variable ${p.substring(0, 8)}...: ${u}`
        );
      }
    let c = 0;
    for (const p of r)
      try {
        const u = figma.variables.getVariableCollectionById(p);
        u && (u.remove(), c++);
      } catch (u) {
        await i.warning(
          `Could not delete collection ${p.substring(0, 8)}...: ${u}`
        );
      }
    await figma.loadAllPagesAsync();
    let s = 0;
    for (const p of t)
      try {
        const u = await figma.getNodeByIdAsync(p);
        u && u.type === "PAGE" && (u.remove(), s++);
      } catch (u) {
        await i.warning(
          `Could not delete page ${p.substring(0, 8)}...: ${u}`
        );
      }
    return await i.log(
      `Cleanup complete: Deleted ${s} page(s), ${c} collection(s), ${n} variable(s)`
    ), {
      type: "cleanupCreatedEntities",
      success: !0,
      error: !1,
      message: "Cleanup completed successfully",
      data: {
        deletedPages: s,
        deletedCollections: c,
        deletedVariables: n
      }
    };
  } catch (t) {
    const r = t instanceof Error ? t.message : "Unknown error occurred";
    return await i.error(`Cleanup failed: ${r}`), {
      type: "cleanupCreatedEntities",
      success: !1,
      error: !0,
      message: r,
      data: {}
    };
  }
}
async function Wt(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    console.log("Found " + t.length + " pages in the document");
    const r = 11, a = t[r];
    if (!a)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const n = await le(
      a,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + a.name + " (index: " + r + ")"
    );
    const c = JSON.stringify(n, null, 2), s = JSON.parse(c), p = "Copy - " + s.name, u = figma.createPage();
    if (u.name = p, figma.root.appendChild(u), s.children && s.children.length > 0) {
      let d = function(o) {
        o.forEach((f) => {
          const w = (f.x || 0) + (f.width || 0);
          w > m && (m = w), f.children && f.children.length > 0 && d(f.children);
        });
      };
      console.log(
        "Recreating " + s.children.length + " top-level children..."
      );
      let m = 0;
      d(s.children), console.log("Original content rightmost edge: " + m);
      for (const o of s.children)
        await Y(o, u, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const l = be(s);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: s.name,
        newPageName: p,
        totalNodes: l
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
async function Yt(e) {
  try {
    const t = e.accessToken, r = e.selectedRepo;
    return t ? (await figma.clientStorage.setAsync("accessToken", t), r && await figma.clientStorage.setAsync("selectedRepo", r), {
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
async function Dt(e) {
  try {
    const t = await figma.clientStorage.getAsync("accessToken"), r = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: t || void 0,
        selectedRepo: r || void 0
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
async function Xt(e) {
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
async function Zt(e) {
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
function he(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function Fe(e, t, r = {}) {
  const a = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: a,
    data: r
  };
}
const Be = "RecursicaPublishedMetadata";
async function Qt(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const a = figma.root.children.findIndex(
      (p) => p.id === t.id
    ), n = t.getPluginData(Be);
    if (!n) {
      const l = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: ne(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: a
      };
      return he("getComponentMetadata", l);
    }
    const s = {
      componentMetadata: JSON.parse(n),
      currentPageIndex: a
    };
    return he("getComponentMetadata", s);
  } catch (t) {
    return console.error("Error getting component metadata:", t), Fe(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function er(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children, r = [];
    for (const n of t) {
      if (n.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${n.name} (type: ${n.type})`
        );
        continue;
      }
      const c = n, s = c.getPluginData(Be);
      if (s)
        try {
          const p = JSON.parse(s);
          r.push(p);
        } catch (p) {
          console.warn(
            `Failed to parse metadata for page "${c.name}":`,
            p
          );
          const l = {
            _ver: 1,
            id: "",
            name: ne(c.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          r.push(l);
        }
      else {
        const u = {
          _ver: 1,
          id: "",
          name: ne(c.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        r.push(u);
      }
    }
    return he("getAllComponents", {
      components: r
    });
  } catch (t) {
    return console.error("Error getting all components:", t), Fe(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function tr(e) {
  try {
    const t = e.requestId, r = e.action;
    return !t || !r ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (J.handleResponse({ requestId: t, action: r }), {
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
async function rr(e) {
  try {
    const { pageId: t } = e;
    await figma.loadAllPagesAsync();
    const r = await figma.getNodeByIdAsync(t);
    return !r || r.type !== "PAGE" ? {
      type: "switchToPage",
      success: !1,
      error: !0,
      message: `Page with ID ${t.substring(0, 8)}... not found`,
      data: {}
    } : (await figma.setCurrentPageAsync(r), {
      type: "switchToPage",
      success: !0,
      error: !1,
      message: `Switched to page "${r.name}"`,
      data: {
        pageName: r.name
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
const ar = {
  getCurrentUser: Ye,
  loadPages: De,
  exportPage: ze,
  importPage: qt,
  cleanupCreatedEntities: Jt,
  quickCopy: Wt,
  storeAuthData: Yt,
  loadAuthData: Dt,
  clearAuthData: Xt,
  storeSelectedRepo: Zt,
  getComponentMetadata: Qt,
  getAllComponents: er,
  pluginPromptResponse: tr,
  switchToPage: rr
}, nr = ar;
figma.showUI(__html__, {
  width: 500,
  height: 500
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    it(e);
    return;
  }
  const t = e;
  try {
    const r = t.type, a = nr[r];
    if (!a) {
      console.warn("Unknown message type:", t.type);
      const c = {
        type: t.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + t.type,
        data: {},
        requestId: t.requestId
      };
      figma.ui.postMessage(c);
      return;
    }
    const n = await a(t.data);
    figma.ui.postMessage(_(I({}, n), {
      requestId: t.requestId
    }));
  } catch (r) {
    console.error("Error handling message:", r);
    const a = {
      type: t.type,
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {},
      requestId: t.requestId
    };
    figma.ui.postMessage(a);
  }
};
