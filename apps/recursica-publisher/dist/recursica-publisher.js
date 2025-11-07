var ve = Object.defineProperty, xe = Object.defineProperties;
var we = Object.getOwnPropertyDescriptors;
var ee = Object.getOwnPropertySymbols;
var Ne = Object.prototype.hasOwnProperty, Se = Object.prototype.propertyIsEnumerable;
var W = (e, t, a) => t in e ? ve(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, h = (e, t) => {
  for (var a in t || (t = {}))
    Ne.call(t, a) && W(e, a, t[a]);
  if (ee)
    for (var a of ee(t))
      Se.call(t, a) && W(e, a, t[a]);
  return e;
}, E = (e, t) => xe(e, we(t));
var C = (e, t, a) => W(e, typeof t != "symbol" ? t + "" : t, a);
async function Ie(e) {
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
  } catch (a) {
    return {
      type: "getCurrentUser",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ce(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((o, n) => ({
          name: o.name,
          index: n
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
const S = {
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
}, N = E(h({}, S), {
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
}), R = E(h({}, S), {
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
}), L = E(h({}, S), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), se = E(h({}, S), {
  cornerRadius: 0
}), Re = E(h({}, S), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Ee(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return N;
    case "TEXT":
      return R;
    case "VECTOR":
      return L;
    case "LINE":
      return Re;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return se;
    default:
      return S;
  }
}
function g(e, t) {
  if (Array.isArray(e))
    return Array.isArray(t) ? e.length !== t.length || e.some((a, r) => g(a, t[r])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof t == "object" && t !== null) {
      const a = Object.keys(e), r = Object.keys(t);
      return a.length !== r.length ? !0 : a.some(
        (o) => !(o in t) || g(e[o], t[o])
      );
    }
    return !0;
  }
  return e !== t;
}
class F {
  constructor() {
    C(this, "collectionMap");
    // collectionId -> index
    C(this, "collections");
    // index -> collection data
    C(this, "nextIndex");
    this.collectionMap = /* @__PURE__ */ new Map(), this.collections = [], this.nextIndex = 0;
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(t) {
    const a = t.collectionId;
    if (this.collectionMap.has(a))
      return this.collectionMap.get(a);
    const r = this.nextIndex++;
    return this.collectionMap.set(a, r), this.collections[r] = t, r;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(t) {
    var a;
    return (a = this.collectionMap.get(t)) != null ? a : -1;
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
    for (let a = 0; a < this.collections.length; a++)
      t[String(a)] = this.collections[a];
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
    for (let a = 0; a < this.collections.length; a++) {
      const r = this.collections[a], o = h({
        collectionName: r.collectionName,
        modes: r.modes
      }, r.collectionGuid && { collectionGuid: r.collectionGuid });
      t[String(a)] = o;
    }
    return t;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(t) {
    var o;
    const a = new F(), r = Object.entries(t).sort(
      (n, i) => parseInt(n[0], 10) - parseInt(i[0], 10)
    );
    for (const [n, i] of r) {
      const s = parseInt(n, 10), c = (o = i.isLocal) != null ? o : !0, d = i.collectionId || i.collectionGuid || `temp:${s}:${i.collectionName || "unknown"}`, l = h({
        collectionName: i.collectionName || "",
        collectionId: d,
        isLocal: c,
        modes: i.modes || []
      }, i.collectionGuid && {
        collectionGuid: i.collectionGuid
      });
      a.collectionMap.set(d, s), a.collections[s] = l, a.nextIndex = Math.max(
        a.nextIndex,
        s + 1
      );
    }
    return a;
  }
  /**
   * Gets the total number of collections in the table
   */
  getSize() {
    return this.collections.length;
  }
}
const Te = {
  COLOR: 1,
  FLOAT: 2,
  STRING: 3,
  BOOLEAN: 4
}, ke = {
  1: "COLOR",
  2: "FLOAT",
  3: "STRING",
  4: "BOOLEAN"
};
function Me(e) {
  var a;
  const t = e.toUpperCase();
  return (a = Te[t]) != null ? a : e;
}
function Pe(e) {
  var t;
  return typeof e == "number" ? (t = ke[e]) != null ? t : e.toString() : e;
}
class U {
  constructor() {
    C(this, "variableMap");
    // variableKey -> index
    C(this, "variables");
    // index -> variable data
    C(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(t) {
    const a = t.variableKey;
    if (!a)
      return -1;
    if (this.variableMap.has(a))
      return this.variableMap.get(a);
    const r = this.nextIndex++;
    return this.variableMap.set(a, r), this.variables[r] = t, r;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(t) {
    var a;
    return (a = this.variableMap.get(t)) != null ? a : -1;
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
    for (let a = 0; a < this.variables.length; a++)
      t[String(a)] = this.variables[a];
    return t;
  }
  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  serializeValuesByMode(t) {
    if (!t)
      return;
    const a = {};
    for (const [r, o] of Object.entries(t))
      typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number" ? a[r] = {
        _varRef: o._varRef
      } : a[r] = o;
    return a;
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
    for (let a = 0; a < this.variables.length; a++) {
      const r = this.variables[a], o = this.serializeValuesByMode(
        r.valuesByMode
      ), n = h(h({
        variableName: r.variableName,
        variableType: Me(r.variableType)
      }, r._colRef !== void 0 && { _colRef: r._colRef }), o && { valuesByMode: o });
      t[String(a)] = n;
    }
    return t;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   * Expands compressed variable types (numbers) back to strings
   */
  static fromTable(t) {
    const a = new U(), r = Object.entries(t).sort(
      (o, n) => parseInt(o[0], 10) - parseInt(n[0], 10)
    );
    for (const [o, n] of r) {
      const i = parseInt(o, 10), s = Pe(n.variableType), c = E(h({}, n), {
        variableType: s
        // Always a string after expansion
      });
      a.variables[i] = c, a.nextIndex = Math.max(a.nextIndex, i + 1);
    }
    return a;
  }
  /**
   * Gets the total number of variables in the table
   */
  getSize() {
    return this.variables.length;
  }
}
function Le(e) {
  return {
    _varRef: e
  };
}
function $(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Oe = 0;
const O = /* @__PURE__ */ new Map();
function Ve(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const t = O.get(e.requestId);
  t && (O.delete(e.requestId), e.error || !e.guid ? t.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : t.resolve(e.guid));
}
function ce() {
  return new Promise((e, t) => {
    const a = `guid_${Date.now()}_${++Oe}`;
    O.set(a, { resolve: e, reject: t }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: a
    }), setTimeout(() => {
      O.has(a) && (O.delete(a), t(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const le = {
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
async function _() {
  return new Promise((e) => setTimeout(e, 0));
}
const f = {
  clear: async () => {
    console.clear(), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    }), await _();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await _();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await _();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await _();
  }
};
function _e(e, t) {
  const a = t.modes.find((r) => r.modeId === e);
  return a ? a.name : e;
}
async function de(e, t, a, r, o = /* @__PURE__ */ new Set()) {
  const n = {};
  for (const [i, s] of Object.entries(e)) {
    const c = _e(i, r);
    if (s == null) {
      n[c] = s;
      continue;
    }
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean") {
      n[c] = s;
      continue;
    }
    if (typeof s == "object" && s !== null && "type" in s && s.type === "VARIABLE_ALIAS" && "id" in s) {
      const d = s.id;
      if (o.has(d)) {
        n[c] = {
          type: "VARIABLE_ALIAS",
          id: d
        };
        continue;
      }
      const l = await figma.variables.getVariableByIdAsync(d);
      if (!l) {
        n[c] = {
          type: "VARIABLE_ALIAS",
          id: d
        };
        continue;
      }
      const y = new Set(o);
      y.add(d);
      const p = await figma.variables.getVariableCollectionByIdAsync(
        l.variableCollectionId
      ), m = l.key;
      if (!m) {
        n[c] = {
          type: "VARIABLE_ALIAS",
          id: d
        };
        continue;
      }
      const A = {
        variableName: l.name,
        variableType: l.resolvedType,
        collectionName: p == null ? void 0 : p.name,
        collectionId: l.variableCollectionId,
        variableKey: m,
        id: d,
        isLocal: !l.remote
      };
      if (p) {
        const u = await ue(
          p,
          a
        );
        A._colRef = u, l.valuesByMode && (A.valuesByMode = await de(
          l.valuesByMode,
          t,
          a,
          p,
          // Pass collection for mode ID to name conversion
          y
        ));
      }
      const w = t.addVariable(A);
      n[c] = {
        type: "VARIABLE_ALIAS",
        id: d,
        _varRef: w
      };
    } else
      n[c] = s;
  }
  return n;
}
const te = "recursica:collectionId";
async function Ge(e) {
  if (e.remote === !0) {
    const a = le[e.id];
    if (!a) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await f.error(o), new Error(o);
    }
    return a.guid;
  } else {
    const a = e.getSharedPluginData(
      "recursica",
      te
    );
    if (a && a.trim() !== "")
      return a;
    const r = await ce();
    return e.setSharedPluginData("recursica", te, r), r;
  }
}
function ze(e, t) {
  if (t)
    return;
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ue(e, t) {
  const a = !e.remote, r = t.getCollectionIndex(e.id);
  if (r !== -1)
    return r;
  ze(e.name, a);
  const o = await Ge(e), n = e.modes.map((d) => d.name), i = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: a,
    modes: n,
    collectionGuid: o
  }, s = t.addCollection(i), c = a ? "local" : "remote";
  return await f.log(
    `  Added ${c} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), s;
}
async function ae(e, t, a) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const r = await figma.variables.getVariableByIdAsync(e.id);
    if (!r)
      return console.log("Could not resolve variable alias:", e.id), null;
    const o = await figma.variables.getVariableCollectionByIdAsync(
      r.variableCollectionId
    );
    if (!o)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const n = r.key;
    if (!n)
      return console.log("Variable missing key:", e.id), null;
    const i = await ue(
      o,
      a
    ), s = {
      variableName: r.name,
      variableType: r.resolvedType,
      _colRef: i,
      // Reference to collection table (v2.4.0+)
      variableKey: n,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    r.valuesByMode && (s.valuesByMode = await de(
      r.valuesByMode,
      t,
      a,
      o,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const c = t.addVariable(s);
    return Le(c);
  } catch (r) {
    const o = r instanceof Error ? r.message : String(r);
    throw console.error("Could not resolve variable alias:", e.id, r), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function B(e, t, a) {
  if (!e || typeof e != "object") return e;
  const r = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const n = e[o];
      if (n && typeof n == "object" && !Array.isArray(n))
        if (n.type === "VARIABLE_ALIAS") {
          const i = await ae(
            n,
            t,
            a
          );
          i && (r[o] = i);
        } else
          r[o] = await B(
            n,
            t,
            a
          );
      else Array.isArray(n) ? r[o] = await Promise.all(
        n.map(async (i) => (i == null ? void 0 : i.type) === "VARIABLE_ALIAS" ? await ae(
          i,
          t,
          a
        ) || i : i && typeof i == "object" ? await B(
          i,
          t,
          a
        ) : i)
      ) : r[o] = n;
    }
  return r;
}
async function $e(e, t, a) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (r) => {
      if (!r || typeof r != "object") return r;
      const o = {};
      for (const n in r)
        Object.prototype.hasOwnProperty.call(r, n) && (n === "boundVariables" ? o[n] = await B(
          r[n],
          t,
          a
        ) : o[n] = r[n]);
      return o;
    })
  );
}
async function Be(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  if (e.type && (a.type = e.type, r.add("type")), e.id && (a.id = e.id, r.add("id")), e.name !== void 0 && e.name !== "" && (a.name = e.name, r.add("name")), e.x !== void 0 && e.x !== 0 && (a.x = e.x, r.add("x")), e.y !== void 0 && e.y !== 0 && (a.y = e.y, r.add("y")), e.width !== void 0 && (a.width = e.width, r.add("width")), e.height !== void 0 && (a.height = e.height, r.add("height")), e.visible !== void 0 && g(e.visible, S.visible) && (a.visible = e.visible, r.add("visible")), e.locked !== void 0 && g(e.locked, S.locked) && (a.locked = e.locked, r.add("locked")), e.opacity !== void 0 && g(e.opacity, S.opacity) && (a.opacity = e.opacity, r.add("opacity")), e.rotation !== void 0 && g(e.rotation, S.rotation) && (a.rotation = e.rotation, r.add("rotation")), e.blendMode !== void 0 && g(e.blendMode, S.blendMode) && (a.blendMode = e.blendMode, r.add("blendMode")), e.effects !== void 0 && g(e.effects, S.effects) && (a.effects = e.effects, r.add("effects")), e.fills !== void 0) {
    const o = await $e(
      e.fills,
      t.variableTable,
      t.collectionTable
    );
    g(o, S.fills) && (a.fills = o), r.add("fills");
  }
  if (e.strokes !== void 0 && g(e.strokes, S.strokes) && (a.strokes = e.strokes, r.add("strokes")), e.strokeWeight !== void 0 && g(e.strokeWeight, S.strokeWeight) && (a.strokeWeight = e.strokeWeight, r.add("strokeWeight")), e.strokeAlign !== void 0 && g(e.strokeAlign, S.strokeAlign) && (a.strokeAlign = e.strokeAlign, r.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await B(
      e.boundVariables,
      t.variableTable,
      t.collectionTable
    );
    Object.keys(o).length > 0 && (a.boundVariables = o), r.add("boundVariables");
  }
  return a;
}
async function re(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && g(e.layoutMode, N.layoutMode) && (a.layoutMode = e.layoutMode, r.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && g(
    e.primaryAxisSizingMode,
    N.primaryAxisSizingMode
  ) && (a.primaryAxisSizingMode = e.primaryAxisSizingMode, r.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && g(
    e.counterAxisSizingMode,
    N.counterAxisSizingMode
  ) && (a.counterAxisSizingMode = e.counterAxisSizingMode, r.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && g(
    e.primaryAxisAlignItems,
    N.primaryAxisAlignItems
  ) && (a.primaryAxisAlignItems = e.primaryAxisAlignItems, r.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && g(
    e.counterAxisAlignItems,
    N.counterAxisAlignItems
  ) && (a.counterAxisAlignItems = e.counterAxisAlignItems, r.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && g(e.paddingLeft, N.paddingLeft) && (a.paddingLeft = e.paddingLeft, r.add("paddingLeft")), e.paddingRight !== void 0 && g(e.paddingRight, N.paddingRight) && (a.paddingRight = e.paddingRight, r.add("paddingRight")), e.paddingTop !== void 0 && g(e.paddingTop, N.paddingTop) && (a.paddingTop = e.paddingTop, r.add("paddingTop")), e.paddingBottom !== void 0 && g(e.paddingBottom, N.paddingBottom) && (a.paddingBottom = e.paddingBottom, r.add("paddingBottom")), e.itemSpacing !== void 0 && g(e.itemSpacing, N.itemSpacing) && (a.itemSpacing = e.itemSpacing, r.add("itemSpacing")), e.cornerRadius !== void 0 && g(e.cornerRadius, N.cornerRadius) && (a.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.clipsContent !== void 0 && g(e.clipsContent, N.clipsContent) && (a.clipsContent = e.clipsContent, r.add("clipsContent")), e.layoutWrap !== void 0 && g(e.layoutWrap, N.layoutWrap) && (a.layoutWrap = e.layoutWrap, r.add("layoutWrap")), e.layoutGrow !== void 0 && g(e.layoutGrow, N.layoutGrow) && (a.layoutGrow = e.layoutGrow, r.add("layoutGrow")), a;
}
async function Fe(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (a.characters = e.characters, r.add("characters")), e.fontName !== void 0 && (a.fontName = e.fontName, r.add("fontName")), e.fontSize !== void 0 && (a.fontSize = e.fontSize, r.add("fontSize")), e.textAlignHorizontal !== void 0 && g(
    e.textAlignHorizontal,
    R.textAlignHorizontal
  ) && (a.textAlignHorizontal = e.textAlignHorizontal, r.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && g(
    e.textAlignVertical,
    R.textAlignVertical
  ) && (a.textAlignVertical = e.textAlignVertical, r.add("textAlignVertical")), e.letterSpacing !== void 0 && g(e.letterSpacing, R.letterSpacing) && (a.letterSpacing = e.letterSpacing, r.add("letterSpacing")), e.lineHeight !== void 0 && g(e.lineHeight, R.lineHeight) && (a.lineHeight = e.lineHeight, r.add("lineHeight")), e.textCase !== void 0 && g(e.textCase, R.textCase) && (a.textCase = e.textCase, r.add("textCase")), e.textDecoration !== void 0 && g(e.textDecoration, R.textDecoration) && (a.textDecoration = e.textDecoration, r.add("textDecoration")), e.textAutoResize !== void 0 && g(e.textAutoResize, R.textAutoResize) && (a.textAutoResize = e.textAutoResize, r.add("textAutoResize")), e.paragraphSpacing !== void 0 && g(
    e.paragraphSpacing,
    R.paragraphSpacing
  ) && (a.paragraphSpacing = e.paragraphSpacing, r.add("paragraphSpacing")), e.paragraphIndent !== void 0 && g(e.paragraphIndent, R.paragraphIndent) && (a.paragraphIndent = e.paragraphIndent, r.add("paragraphIndent")), e.listOptions !== void 0 && g(e.listOptions, R.listOptions) && (a.listOptions = e.listOptions, r.add("listOptions")), a;
}
async function Ue(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && g(e.fillGeometry, L.fillGeometry) && (a.fillGeometry = e.fillGeometry, r.add("fillGeometry")), e.strokeGeometry !== void 0 && g(e.strokeGeometry, L.strokeGeometry) && (a.strokeGeometry = e.strokeGeometry, r.add("strokeGeometry")), e.strokeCap !== void 0 && g(e.strokeCap, L.strokeCap) && (a.strokeCap = e.strokeCap, r.add("strokeCap")), e.strokeJoin !== void 0 && g(e.strokeJoin, L.strokeJoin) && (a.strokeJoin = e.strokeJoin, r.add("strokeJoin")), e.dashPattern !== void 0 && g(e.dashPattern, L.dashPattern) && (a.dashPattern = e.dashPattern, r.add("dashPattern")), a;
}
async function Ke(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && g(e.cornerRadius, se.cornerRadius) && (a.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, r.add("pointCount")), e.innerRadius !== void 0 && (a.innerRadius = e.innerRadius, r.add("innerRadius")), e.pointCount !== void 0 && (a.pointCount = e.pointCount, r.add("pointCount")), a;
}
const je = "RecursicaPublishedMetadata";
function ie(e) {
  let t = e;
  for (; t; ) {
    if (t.type === "PAGE")
      return t;
    try {
      t = t.parent;
    } catch (a) {
      return null;
    }
  }
  return null;
}
function De(e) {
  try {
    const t = e.getSharedPluginData(
      "recursica",
      je
    );
    if (!t || t.trim() === "")
      return null;
    const a = JSON.parse(t);
    return {
      id: a.id,
      version: a.version
    };
  } catch (t) {
    return null;
  }
}
async function qe(e, t) {
  const a = {}, r = /* @__PURE__ */ new Set();
  if (a._isInstance = !0, r.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (!o)
        return a;
      const n = e.name || "(unnamed)", i = o.name || "(unnamed)", s = o.remote === !0, c = ie(e), d = ie(o);
      let l;
      s ? l = "remote" : d && c && d.id === c.id ? l = "internal" : (d && c && (d.id, c.id), l = "normal");
      let y, p;
      try {
        e.variantProperties && (y = e.variantProperties), e.componentProperties && (p = e.componentProperties);
      } catch (v) {
      }
      let m, A;
      try {
        let v = o.parent;
        const x = [];
        let b = 0;
        const k = 20;
        for (; v && b < k; )
          try {
            const I = v.type, q = v.name;
            if (I === "COMPONENT_SET" && !A && (A = q), I === "PAGE")
              break;
            const M = q || "";
            x.unshift(M), v = v.parent, b++;
          } catch (I) {
            break;
          }
        m = x;
      } catch (v) {
      }
      const w = h(h(h(h({
        instanceType: l,
        componentName: i
      }, A && { componentSetName: A }), y && { variantProperties: y }), p && { componentProperties: p }), l === "normal" ? { path: m || [] } : m && m.length > 0 && {
        path: m
      });
      if (l === "internal")
        w.componentNodeId = o.id, await f.log(
          `  Found INSTANCE: "${n}" -> INTERNAL component "${i}" (ID: ${o.id.substring(0, 8)}...)`
        );
      else if (l === "normal") {
        if (d) {
          w.componentPageName = d.name;
          const x = De(d);
          x != null && x.id && x.version !== void 0 && (w.componentGuid = x.id, w.componentVersion = x.version);
        }
        m === void 0 && console.warn(
          `Failed to build path for normal instance "${n}" -> component "${i}". Path is required for resolution.`
        );
        const v = m && m.length > 0 ? ` at path [${m.join(" → ")}]` : " at page root";
        await f.log(
          `  Found INSTANCE: "${n}" -> NORMAL component "${i}" (ID: ${o.id.substring(0, 8)}...)${v}`
        );
      } else if (l === "remote") {
        let v, x;
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const b = await o.getPublishStatusAsync();
              b && typeof b == "object" && (b.libraryName && (v = b.libraryName), b.libraryKey && (x = b.libraryKey));
            } catch (b) {
            }
          try {
            const b = figma.teamLibrary;
            if (typeof (b == null ? void 0 : b.getAvailableLibraryComponentSetsAsync) == "function") {
              const k = await b.getAvailableLibraryComponentSetsAsync();
              if (k && Array.isArray(k)) {
                for (const I of k)
                  if (I.key === o.key || I.name === o.name) {
                    I.libraryName && (v = I.libraryName), I.libraryKey && (x = I.libraryKey);
                    break;
                  }
              }
            }
          } catch (b) {
          }
          try {
            w.structure = await D(
              o,
              /* @__PURE__ */ new WeakSet(),
              t
            );
          } catch (b) {
            console.warn(
              `Failed to extract structure for remote component "${i}":`,
              b
            );
          }
        } catch (b) {
          console.warn(
            `Error getting library info for remote component "${i}":`,
            b
          );
        }
        v && (w.remoteLibraryName = v), x && (w.remoteLibraryKey = x), await f.log(
          `  Found INSTANCE: "${n}" -> REMOTE component "${i}" (ID: ${o.id.substring(0, 8)}...)`
        );
      }
      const u = t.instanceTable.addInstance(w);
      a._instanceRef = u, r.add("_instanceRef");
    } catch (o) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        o
      );
    }
  return a;
}
class K {
  constructor() {
    C(this, "instanceMap");
    // unique key -> index
    C(this, "instances");
    // index -> instance data
    C(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(t) {
    return t.instanceType === "internal" && t.componentNodeId ? `internal:${t.componentNodeId}` : t.instanceType === "normal" && t.componentGuid && t.componentVersion !== void 0 ? `normal:${t.componentGuid}:${t.componentVersion}` : t.instanceType === "remote" && t.remoteLibraryKey ? `remote:${t.remoteLibraryKey}:${t.componentName}` : `${t.instanceType}:${t.componentName}:COMPONENT`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(t) {
    const a = this.generateKey(t);
    if (this.instanceMap.has(a))
      return this.instanceMap.get(a);
    const r = this.nextIndex++;
    return this.instanceMap.set(a, r), this.instances[r] = t, r;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(t) {
    var r;
    const a = this.generateKey(t);
    return (r = this.instanceMap.get(a)) != null ? r : -1;
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
    for (let a = 0; a < this.instances.length; a++)
      t[String(a)] = this.instances[a];
    return t;
  }
  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(t) {
    const a = new K(), r = Object.entries(t).sort(
      (o, n) => parseInt(o[0], 10) - parseInt(n[0], 10)
    );
    for (const [o, n] of r) {
      const i = parseInt(o, 10), s = a.generateKey(n);
      a.instanceMap.set(s, i), a.instances[i] = n, a.nextIndex = Math.max(a.nextIndex, i + 1);
    }
    return a;
  }
  /**
   * Gets the total number of instances in the table
   */
  getSize() {
    return this.instances.length;
  }
}
const ge = {
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
function We() {
  const e = {};
  for (const [t, a] of Object.entries(ge))
    e[a] = t;
  return e;
}
function oe(e) {
  var t;
  return (t = ge[e]) != null ? t : e;
}
function He(e) {
  var t;
  return typeof e == "number" ? (t = We()[e]) != null ? t : e.toString() : e;
}
const fe = {
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
}, H = {};
for (const [e, t] of Object.entries(fe))
  H[t] = e;
class j {
  constructor() {
    C(this, "shortToLong");
    C(this, "longToShort");
    this.shortToLong = h({}, H), this.longToShort = h({}, fe);
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
      return t.map((a) => this.compressObject(a));
    if (typeof t == "object") {
      const a = {}, r = /* @__PURE__ */ new Set();
      for (const o of Object.keys(t))
        r.add(o);
      for (const [o, n] of Object.entries(t)) {
        const i = this.getShortName(o);
        if (i !== o && !r.has(i)) {
          let s = this.compressObject(n);
          i === "type" && typeof s == "string" && (s = oe(s)), a[i] = s;
        } else {
          let s = this.compressObject(n);
          o === "type" && typeof s == "string" && (s = oe(s)), a[o] = s;
        }
      }
      return a;
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
      return t.map((a) => this.expandObject(a));
    if (typeof t == "object") {
      const a = {};
      for (const [r, o] of Object.entries(t)) {
        const n = this.getLongName(r);
        let i = this.expandObject(o);
        (n === "type" || r === "type") && (typeof i == "number" || typeof i == "string") && (i = He(i)), a[n] = i;
      }
      return a;
    }
    return t;
  }
  /**
   * Gets the serialized string table for JSON export
   * Returns the mapping of short -> long names
   */
  getSerializedTable() {
    return h({}, this.shortToLong);
  }
  /**
   * Reconstructs a StringTable from a serialized table object
   */
  static fromTable(t) {
    const a = new j();
    a.shortToLong = h(h({}, H), t), a.longToShort = {};
    for (const [r, o] of Object.entries(
      a.shortToLong
    ))
      a.longToShort[o] = r;
    return a;
  }
}
function X(e) {
  let t = 1;
  return e.children && e.children.length > 0 && e.children.forEach((a) => {
    t += X(a);
  }), t;
}
async function D(e, t = /* @__PURE__ */ new WeakSet(), a = {}) {
  var y, p, m, A, w;
  if (!e || typeof e != "object")
    return e;
  const r = (y = a.maxNodes) != null ? y : 1e4, o = (p = a.nodeCount) != null ? p : 0;
  if (o >= r)
    return await f.warning(
      `Maximum node count (${r}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${r}) reached`,
      _nodeCount: o
    };
  const n = {
    visited: (m = a.visited) != null ? m : /* @__PURE__ */ new WeakSet(),
    depth: (A = a.depth) != null ? A : 0,
    maxDepth: (w = a.maxDepth) != null ? w : 100,
    nodeCount: o + 1,
    maxNodes: r,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: a.variableTable,
    collectionTable: a.collectionTable,
    instanceTable: a.instanceTable
  };
  if (t.has(e))
    return "[Circular Reference]";
  t.add(e), n.visited = t;
  const i = {}, s = await Be(e, n);
  Object.assign(i, s);
  const c = e.type;
  if (c)
    switch (c) {
      case "FRAME":
      case "COMPONENT": {
        const u = await re(e);
        Object.assign(i, u);
        break;
      }
      case "INSTANCE": {
        const u = await qe(
          e,
          n
        );
        Object.assign(i, u);
        const v = await re(
          e
        );
        Object.assign(i, v);
        break;
      }
      case "TEXT": {
        const u = await Fe(e);
        Object.assign(i, u);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const u = await Ue(e);
        Object.assign(i, u);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const u = await Ke(e);
        Object.assign(i, u);
        break;
      }
      default:
        n.unhandledKeys.add("_unknownType");
        break;
    }
  const d = Object.getOwnPropertyNames(e), l = /* @__PURE__ */ new Set([
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
    "variableConsumptionMap",
    "resolvedVariableModes",
    "inferredVariables",
    "constructor",
    "toString",
    "valueOf"
  ]);
  (c === "FRAME" || c === "COMPONENT" || c === "INSTANCE") && (l.add("layoutMode"), l.add("primaryAxisSizingMode"), l.add("counterAxisSizingMode"), l.add("primaryAxisAlignItems"), l.add("counterAxisAlignItems"), l.add("paddingLeft"), l.add("paddingRight"), l.add("paddingTop"), l.add("paddingBottom"), l.add("itemSpacing"), l.add("cornerRadius"), l.add("clipsContent"), l.add("layoutWrap"), l.add("layoutGrow")), c === "TEXT" && (l.add("characters"), l.add("fontName"), l.add("fontSize"), l.add("textAlignHorizontal"), l.add("textAlignVertical"), l.add("letterSpacing"), l.add("lineHeight"), l.add("textCase"), l.add("textDecoration"), l.add("textAutoResize"), l.add("paragraphSpacing"), l.add("paragraphIndent"), l.add("listOptions")), (c === "VECTOR" || c === "LINE") && (l.add("fillGeometry"), l.add("strokeGeometry")), (c === "RECTANGLE" || c === "ELLIPSE" || c === "STAR" || c === "POLYGON") && (l.add("pointCount"), l.add("innerRadius"), l.add("arcData")), c === "INSTANCE" && (l.add("mainComponent"), l.add("componentProperties"));
  for (const u of d)
    typeof e[u] != "function" && (l.has(u) || n.unhandledKeys.add(u));
  if (n.unhandledKeys.size > 0 && (i._unhandledKeys = Array.from(n.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const u = n.maxDepth;
    if (n.depth >= u)
      i.children = {
        _truncated: !0,
        _reason: `Maximum depth (${u}) reached`,
        _count: e.children.length
      };
    else if (n.nodeCount >= r)
      i.children = {
        _truncated: !0,
        _reason: `Maximum node count (${r}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const v = E(h({}, n), {
        depth: n.depth + 1
      }), x = [];
      let b = !1;
      for (const k of e.children) {
        if (v.nodeCount >= r) {
          i.children = {
            _truncated: !0,
            _reason: `Maximum node count (${r}) reached during children processing`,
            _processed: x.length,
            _total: e.children.length,
            children: x
          }, b = !0;
          break;
        }
        const I = await D(k, t, v);
        x.push(I), v.nodeCount && (n.nodeCount = v.nodeCount);
      }
      b || (i.children = x);
    }
  }
  return i;
}
async function Je(e) {
  await f.clear(), await f.log("=== Starting Page Export ===");
  try {
    const t = e.pageIndex;
    if (t === void 0 || typeof t != "number")
      return await f.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await f.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const a = figma.root.children;
    if (await f.log(`Loaded ${a.length} page(s)`), t < 0 || t >= a.length)
      return await f.error(
        `Invalid page index: ${t} (valid range: 0-${a.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const r = a[t];
    await f.log(
      `Selected page: "${r.name}" (index: ${t})`
    ), await f.log(
      "Initializing variable, collection, and instance tables..."
    );
    const o = new U(), n = new F(), i = new K();
    await f.log("Fetching team library variable collections...");
    let s = [];
    try {
      if (s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((P) => ({
        libraryName: P.libraryName,
        key: P.key,
        name: P.name
      })), await f.log(
        `Found ${s.length} library collection(s) in team library`
      ), s.length > 0)
        for (const P of s)
          await f.log(`  - ${P.name} (from ${P.libraryName})`);
    } catch (M) {
      await f.warning(
        `Could not get library variable collections: ${M instanceof Error ? M.message : String(M)}`
      );
    }
    await f.log("Extracting node data from page..."), await f.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await f.log(
      "Collections will be discovered as variables are processed:"
    );
    const c = await D(
      r,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: n,
        instanceTable: i
      }
    );
    await f.log("Node extraction finished");
    const d = X(c), l = o.getSize(), y = n.getSize(), p = i.getSize();
    if (await f.log("Extraction complete:"), await f.log(`  - Total nodes: ${d}`), await f.log(`  - Unique variables: ${l}`), await f.log(`  - Unique collections: ${y}`), await f.log(`  - Unique instances: ${p}`), y > 0) {
      await f.log("Collections found:");
      const M = n.getTable();
      for (const [P, V] of Object.values(M).entries()) {
        const Ae = V.collectionGuid ? ` (GUID: ${V.collectionGuid.substring(0, 8)}...)` : "";
        await f.log(
          `  ${P}: ${V.collectionName}${Ae} - ${V.modes.length} mode(s)`
        );
      }
    }
    await f.log("Creating string table and compressing data...");
    const m = new j(), A = m.compressObject(
      n.getSerializedTable()
    ), w = m.compressObject(
      o.getSerializedTable()
    ), u = m.compressObject(
      i.getSerializedTable()
    ), v = m.compressObject(c);
    await f.log("Creating export data structure...");
    const x = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.7.0",
        // Updated version for string table compression
        figmaApiVersion: figma.apiVersion,
        originalPageName: r.name,
        totalNodes: d,
        pluginVersion: "1.0.0"
      },
      stringTable: m.getSerializedTable(),
      collections: A,
      variables: w,
      instances: u,
      libraries: s,
      // Libraries might not need compression, but could be added later
      pageData: v
    };
    await f.log("Serializing to JSON...");
    const b = JSON.stringify(x, null, 2), k = (b.length / 1024).toFixed(2), I = r.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return await f.log(`JSON serialization complete: ${k} KB`), await f.log(`Export file: ${I}`), await f.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: I,
        jsonData: b,
        pageName: r.name,
        additionalPages: []
        // Will be populated when publishing referenced component pages
      }
    };
  } catch (t) {
    return await f.error(
      `Export failed: ${t instanceof Error ? t.message : "Unknown error occurred"}`
    ), t instanceof Error && t.stack && await f.error(`Stack trace: ${t.stack}`), console.error("Error exporting page:", t), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function ne(e, t) {
  for (const a of t)
    e.modes.find((o) => o.name === a) || e.addMode(a);
}
const T = "recursica:collectionId";
async function G(e) {
  if (e.remote === !0) {
    const a = le[e.id];
    if (!a) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await f.error(o), new Error(o);
    }
    return a.guid;
  } else {
    const a = e.getSharedPluginData(
      "recursica",
      T
    );
    if (a && a.trim() !== "")
      return a;
    const r = await ce();
    return e.setSharedPluginData("recursica", T, r), r;
  }
}
function pe(e, t) {
  if (t)
    return;
  const a = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(a))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function me(e) {
  let t;
  const a = e.collectionName.trim().toLowerCase(), r = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && r.includes(a))
    try {
      const s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((c) => c.name.trim().toLowerCase() === a);
      if (s) {
        pe(e.collectionName, !1);
        const c = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          s.key
        );
        if (c.length > 0) {
          const d = await figma.variables.importVariableByKeyAsync(c[0].key), l = await figma.variables.getVariableCollectionByIdAsync(
            d.variableCollectionId
          );
          if (l) {
            if (t = l, e.collectionGuid) {
              const y = t.getSharedPluginData(
                "recursica",
                T
              );
              (!y || y.trim() === "") && t.setSharedPluginData(
                "recursica",
                T,
                e.collectionGuid
              );
            } else
              await G(t);
            return await ne(t, e.modes), { collection: t };
          }
        }
      }
    } catch (i) {
      if (o === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", i);
    }
  if (o !== !1) {
    const i = await figma.variables.getLocalVariableCollectionsAsync();
    let s;
    if (e.collectionGuid && (s = i.find((c) => c.getSharedPluginData("recursica", T) === e.collectionGuid)), s || (s = i.find(
      (c) => c.name === e.collectionName
    )), s)
      if (t = s, e.collectionGuid) {
        const c = t.getSharedPluginData(
          "recursica",
          T
        );
        (!c || c.trim() === "") && t.setSharedPluginData(
          "recursica",
          T,
          e.collectionGuid
        );
      } else
        await G(t);
    else
      t = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? t.setSharedPluginData(
        "recursica",
        T,
        e.collectionGuid
      ) : await G(t);
  } else {
    const i = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), s = e.collectionName.trim().toLowerCase(), c = i.find((p) => p.name.trim().toLowerCase() === s);
    if (!c)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const d = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      c.key
    );
    if (d.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const l = await figma.variables.importVariableByKeyAsync(
      d[0].key
    ), y = await figma.variables.getVariableCollectionByIdAsync(
      l.variableCollectionId
    );
    if (!y)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (t = y, e.collectionGuid) {
      const p = t.getSharedPluginData(
        "recursica",
        T
      );
      (!p || p.trim() === "") && t.setSharedPluginData(
        "recursica",
        T,
        e.collectionGuid
      );
    } else
      G(t);
  }
  return await ne(t, e.modes), { collection: t };
}
async function Ye(e, t) {
  pe(e, t);
  {
    const r = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (o) => o.name === e
    );
    return r || figma.variables.createVariableCollection(e);
  }
}
async function Q(e, t) {
  for (const a of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(a);
      if (r && r.name === t)
        return r;
    } catch (r) {
      continue;
    }
  return null;
}
function Xe(e, t) {
  const a = e.resolvedType.toUpperCase(), r = t.toUpperCase();
  return a !== r ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${a}" but expected "${r}". Skipping binding.`
  ), !1) : !0;
}
async function Qe(e, t, a, r, o) {
  for (const [n, i] of Object.entries(t)) {
    const s = r.modes.find((d) => d.name === n);
    if (!s) {
      console.warn(
        `Mode "${n}" not found in collection "${r.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const c = s.modeId;
    try {
      if (i == null)
        continue;
      if (typeof i == "string" || typeof i == "number" || typeof i == "boolean") {
        e.setValueForMode(c, i);
        continue;
      }
      if (typeof i == "object" && i !== null && "_varRef" in i && typeof i._varRef == "number") {
        const d = i;
        let l = null;
        const y = a.getVariableByIndex(
          d._varRef
        );
        if (y) {
          let p = null;
          if (o && y._colRef !== void 0) {
            const m = o.getCollectionByIndex(
              y._colRef
            );
            m && (p = (await me(m)).collection);
          }
          p && (l = await Q(
            p,
            y.variableName
          ));
        }
        if (l) {
          const p = {
            type: "VARIABLE_ALIAS",
            id: l.id
          };
          e.setValueForMode(c, p);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${n}" in variable "${e.name}". Variable reference index: ${d._varRef}`
          );
      }
    } catch (d) {
      console.warn(
        `Error setting value for mode "${n}" in variable "${e.name}":`,
        d
      );
    }
  }
}
async function Ze(e, t, a, r) {
  const o = figma.variables.createVariable(
    e.variableName,
    t,
    e.variableType
  );
  return e.valuesByMode && await Qe(
    o,
    e.valuesByMode,
    a,
    t,
    // Pass collection to look up modes by name
    r
  ), o;
}
async function ye(e, t, a) {
  const r = t.getVariableByIndex(e._varRef);
  if (!r)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    const o = r._colRef;
    if (o === void 0)
      return console.warn(
        `Variable "${r.variableName}" missing collection reference (_colRef)`
      ), null;
    const n = a.getCollectionByIndex(o);
    if (!n)
      return console.warn(
        `Collection not found at index ${o} for variable "${r.variableName}"`
      ), null;
    const { collection: i } = await me(n);
    let s = await Q(i, r.variableName);
    return s ? Xe(s, r.variableType) ? s : null : r.valuesByMode ? (s = await Ze(
      r,
      i,
      t,
      a
      // Pass collection table for alias resolution
    ), s) : (console.warn(
      `Cannot create variable "${r.variableName}" without valuesByMode data`
    ), null);
  } catch (o) {
    if (console.error(
      `Error resolving variable reference for "${r.variableName}":`,
      o
    ), o instanceof Error && o.message.includes("External collection"))
      throw o;
    return null;
  }
}
function et(e, t) {
  if (!t || !$(e))
    return null;
  const a = t.getVariableByIndex(e._varRef);
  return a ? {
    type: "VARIABLE_ALIAS",
    id: a.id || "",
    // Fallback to empty string if id not available (new format)
    variableName: a.variableName,
    variableType: a.variableType,
    isLocal: a.isLocal || !1,
    collectionName: a.collectionName,
    collectionId: a.collectionId,
    variableKey: a.variableKey
  } : (console.log(`Variable not found in table at index ${e._varRef}`), null);
}
async function tt(e, t, a, r, o) {
  if (!(!t || typeof t != "object"))
    try {
      const n = e[a];
      if (!n || !Array.isArray(n))
        return;
      for (const [i, s] of Object.entries(t))
        if (i === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < n.length; c++) {
            const d = s[c];
            if ($(d) && r && o) {
              const l = await ye(
                d,
                r,
                o
              );
              l && n[c].boundVariables && (n[c].boundVariables[a] = {
                type: "VARIABLE_ALIAS",
                id: l.id
              });
            }
          }
        else {
          let c = null;
          $(s) && (c = et(s, r)), c && await at(e, i, c, r);
        }
    } catch (n) {
      console.log(`Error restoring bound variables for ${a}:`, n);
    }
}
async function at(e, t, a, r) {
  try {
    let o = null;
    if (r) {
      if (a.isLocal) {
        const n = await Ye(
          a.collectionName || "",
          !0
        );
        o = await Q(
          n,
          a.variableName || ""
        ), !o && a.variableName && a.variableType && console.warn(
          `Cannot create variable "${a.variableName}" without valuesByMode. Use resolveVariableReferenceOnImport instead.`
        );
      } else if (a.variableKey)
        try {
          o = await figma.variables.importVariableByKeyAsync(
            a.variableKey
          );
        } catch (n) {
          console.log(
            `Could not import team variable: ${a.variableName}`
          );
        }
    }
    if (o) {
      const n = {
        type: "VARIABLE_ALIAS",
        id: o.id
      };
      e.boundVariables || (e.boundVariables = {}), e.boundVariables[t] || (e.boundVariables[t] = n);
    }
  } catch (o) {
    console.log(`Error binding variable to property ${t}:`, o);
  }
}
function rt(e, t) {
  const a = Ee(t);
  if (e.visible === void 0 && (e.visible = a.visible), e.locked === void 0 && (e.locked = a.locked), e.opacity === void 0 && (e.opacity = a.opacity), e.rotation === void 0 && (e.rotation = a.rotation), e.blendMode === void 0 && (e.blendMode = a.blendMode), t === "FRAME" || t === "COMPONENT" || t === "INSTANCE") {
    const r = N;
    e.layoutMode === void 0 && (e.layoutMode = r.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = r.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = r.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = r.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = r.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = r.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = r.paddingRight), e.paddingTop === void 0 && (e.paddingTop = r.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = r.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = r.itemSpacing);
  }
  if (t === "TEXT") {
    const r = R;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = r.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = r.textAlignVertical), e.textCase === void 0 && (e.textCase = r.textCase), e.textDecoration === void 0 && (e.textDecoration = r.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = r.textAutoResize);
  }
}
async function Z(e, t, a = null, r = null, o = null) {
  var n;
  try {
    let i;
    switch (e.type) {
      case "FRAME":
        i = figma.createFrame();
        break;
      case "RECTANGLE":
        i = figma.createRectangle();
        break;
      case "ELLIPSE":
        i = figma.createEllipse();
        break;
      case "TEXT":
        i = figma.createText();
        break;
      case "VECTOR":
        i = figma.createVector();
        break;
      case "STAR":
        i = figma.createStar();
        break;
      case "LINE":
        i = figma.createLine();
        break;
      case "COMPONENT":
        i = figma.createComponent();
        break;
      case "INSTANCE":
        if (console.log("Found instance node: " + e.name), e.mainComponent && e.mainComponent.key)
          try {
            const s = await figma.importComponentByKeyAsync(
              e.mainComponent.key
            );
            s && s.type === "COMPONENT" ? (i = s.createInstance(), console.log(
              "Created instance from main component: " + e.mainComponent.name
            )) : (console.log("Main component not found, creating frame fallback"), i = figma.createFrame());
          } catch (s) {
            console.log(
              "Error creating instance: " + s + ", creating frame fallback"
            ), i = figma.createFrame();
          }
        else
          console.log("No main component info, creating frame fallback"), i = figma.createFrame();
        break;
      case "GROUP":
        i = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " + e.name + ", creating frame fallback"
        ), i = figma.createFrame();
        break;
      case "POLYGON":
        i = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " + e.type + ", creating frame instead"
        ), i = figma.createFrame();
        break;
    }
    if (!i)
      return null;
    if (rt(i, e.type || "FRAME"), e.name !== void 0 && (i.name = e.name || "Unnamed Node"), e.x !== void 0 && (i.x = e.x), e.y !== void 0 && (i.y = e.y), e.width !== void 0 && e.height !== void 0 && i.resize(e.width, e.height), e.visible !== void 0 && (i.visible = e.visible), e.locked !== void 0 && (i.locked = e.locked), e.opacity !== void 0 && (i.opacity = e.opacity), e.rotation !== void 0 && (i.rotation = e.rotation), e.blendMode !== void 0 && (i.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let s = e.fills;
        Array.isArray(s) && a && (s = s.map((c) => {
          if (c && typeof c == "object" && c.boundVariables) {
            const d = {};
            for (const [l, y] of Object.entries(
              c.boundVariables
            ))
              d[l] = y;
            return E(h({}, c), { boundVariables: d });
          }
          return c;
        })), i.fills = s, (n = e.boundVariables) != null && n.fills && await tt(
          i,
          e.boundVariables,
          "fills",
          a,
          r
        );
      } catch (s) {
        console.log("Error setting fills:", s);
      }
    if (e.strokes !== void 0 && e.strokes.length > 0)
      try {
        i.strokes = e.strokes;
      } catch (s) {
        console.log("Error setting strokes:", s);
      }
    if (e.strokeWeight !== void 0 && (i.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (i.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (i.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (i.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (i.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (i.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (i.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (i.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (i.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (i.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (i.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (i.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (i.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (i.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (i.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (i.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (i.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
      try {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), i.fontName = e.fontName;
          } catch (s) {
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular"
            }), i.fontName = { family: "Roboto", style: "Regular" };
          }
        else
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), i.fontName = { family: "Roboto", style: "Regular" };
        i.characters = e.characters, e.fontSize !== void 0 && (i.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (i.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (i.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (i.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (i.lineHeight = e.lineHeight), e.textCase !== void 0 && (i.textCase = e.textCase), e.textDecoration !== void 0 && (i.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (i.textAutoResize = e.textAutoResize);
      } catch (s) {
        console.log("Error setting text properties: " + s);
        try {
          i.characters = e.characters;
        } catch (c) {
          console.log("Could not set text characters: " + c);
        }
      }
    if (e.boundVariables) {
      for (const [s, c] of Object.entries(
        e.boundVariables
      ))
        if (s !== "fills" && $(c) && a && r) {
          const d = await ye(
            c,
            a,
            r
          );
          if (d) {
            const l = {
              type: "VARIABLE_ALIAS",
              id: d.id
            };
            i.boundVariables || (i.boundVariables = {}), i.boundVariables[s] || (i.boundVariables[s] = l);
          }
        }
    }
    if (e.children && Array.isArray(e.children))
      for (const s of e.children) {
        if (s._truncated) {
          console.log(
            `Skipping truncated children: ${s._reason || "Unknown"}`
          );
          continue;
        }
        const c = await Z(
          s,
          i,
          a,
          r
        );
        c && i.appendChild(c);
      }
    return t && t.appendChild(i), i;
  } catch (i) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      i
    ), null;
  }
}
async function it(e) {
  try {
    const t = e.jsonData;
    if (!t)
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    if (console.log("Importing page from JSON"), !t.pageData || !t.metadata)
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid JSON format. Expected pageData and metadata.",
        data: {}
      };
    const a = t.pageData, r = t.metadata;
    if (!t.stringTable)
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid JSON format. String table is required.",
        data: {}
      };
    let o;
    try {
      o = j.fromTable(t.stringTable), console.log("Loaded string table for key expansion");
    } catch (u) {
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: `Failed to load string table: ${u instanceof Error ? u.message : "Unknown error"}`,
        data: {}
      };
    }
    const n = (u) => o.expandObject(u);
    let i = null;
    if (t.collections)
      try {
        const u = n(t.collections);
        i = F.fromTable(u), console.log(
          `Loaded collections table with ${i.getSize()} collections`
        );
      } catch (u) {
        console.warn("Failed to load collections table:", u);
      }
    let s = null;
    if (t.variables)
      try {
        const u = n(t.variables);
        s = U.fromTable(u), console.log(
          `Loaded variable table with ${s.getSize()} variables`
        );
      } catch (u) {
        console.warn("Failed to load variable table:", u);
      }
    let c = null;
    if (t.instances)
      try {
        const u = n(t.instances);
        c = K.fromTable(u), console.log(
          `Loaded instance table with ${c.getSize()} instances`
        );
      } catch (u) {
        console.warn("Failed to load instance table:", u);
      }
    const d = "2.7.0", l = r.exportFormatVersion || "1.0.0";
    l !== d && console.warn(
      `Export format version mismatch: exported with ${l}, current version is ${d}. Import may have compatibility issues.`
    );
    const p = "Imported - " + (r.originalPageName ? r.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), m = figma.createPage();
    m.name = p, figma.root.appendChild(m), console.log("Created new page: " + p), console.log("Importing " + (r.totalNodes || "unknown") + " nodes");
    const A = n(a);
    if (A.children && Array.isArray(A.children)) {
      for (const u of A.children) {
        if (u._truncated) {
          console.log(
            `Skipping truncated children: ${u._reason || "Unknown"}`
          );
          continue;
        }
        await Z(
          u,
          m,
          s,
          i,
          c
        );
      }
      console.log("Successfully imported page content with all children");
    } else
      console.log("No children to import");
    return {
      type: "importPage",
      success: !0,
      error: !1,
      message: "Page imported successfully",
      data: {
        pageName: r.originalPageName,
        totalNodes: r.totalNodes || 0
      }
    };
  } catch (t) {
    return console.error("Error importing page:", t), {
      type: "importPage",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function ot(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    console.log("Found " + t.length + " pages in the document");
    const a = 11, r = t[a];
    if (!r)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const o = await D(
      r,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + r.name + " (index: " + a + ")"
    );
    const n = JSON.stringify(o, null, 2), i = JSON.parse(n), s = "Copy - " + i.name, c = figma.createPage();
    if (c.name = s, figma.root.appendChild(c), i.children && i.children.length > 0) {
      let y = function(m) {
        m.forEach((A) => {
          const w = (A.x || 0) + (A.width || 0);
          w > p && (p = w), A.children && A.children.length > 0 && y(A.children);
        });
      };
      console.log(
        "Recreating " + i.children.length + " top-level children..."
      );
      let p = 0;
      y(i.children), console.log("Original content rightmost edge: " + p);
      for (const m of i.children)
        await Z(m, c, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const d = X(i);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: i.name,
        newPageName: s,
        totalNodes: d
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
async function nt(e) {
  try {
    const t = e.accessToken, a = e.selectedRepo;
    return t ? (await figma.clientStorage.setAsync("accessToken", t), a && await figma.clientStorage.setAsync("selectedRepo", a), {
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
async function st(e) {
  try {
    const t = await figma.clientStorage.getAsync("accessToken"), a = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: t || void 0,
        selectedRepo: a || void 0
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
async function ct(e) {
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
async function lt(e) {
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
function J(e, t = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: t
  };
}
function be(e, t, a = {}) {
  const r = t instanceof Error ? t.message : t;
  return {
    type: e,
    success: !1,
    error: !0,
    message: r,
    data: a
  };
}
function Y(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const he = "RecursicaPublishedMetadata";
async function dt(e) {
  try {
    const t = figma.currentPage;
    await figma.loadAllPagesAsync();
    const r = figma.root.children.findIndex(
      (s) => s.id === t.id
    ), o = t.getPluginData(he);
    if (!o) {
      const d = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: Y(t.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: r
      };
      return J("getComponentMetadata", d);
    }
    const i = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: r
    };
    return J("getComponentMetadata", i);
  } catch (t) {
    return console.error("Error getting component metadata:", t), be(
      "getComponentMetadata",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
async function ut(e) {
  try {
    await figma.loadAllPagesAsync();
    const t = figma.root.children, a = [];
    for (const o of t) {
      if (o.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${o.name} (type: ${o.type})`
        );
        continue;
      }
      const n = o, i = n.getPluginData(he);
      if (i)
        try {
          const s = JSON.parse(i);
          a.push(s);
        } catch (s) {
          console.warn(
            `Failed to parse metadata for page "${n.name}":`,
            s
          );
          const d = {
            _ver: 1,
            id: "",
            name: Y(n.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          a.push(d);
        }
      else {
        const c = {
          _ver: 1,
          id: "",
          name: Y(n.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        a.push(c);
      }
    }
    return J("getAllComponents", {
      components: a
    });
  } catch (t) {
    return console.error("Error getting all components:", t), be(
      "getAllComponents",
      t instanceof Error ? t : "Unknown error occurred"
    );
  }
}
const z = /* @__PURE__ */ new Map();
let gt = 0;
function ft() {
  return `prompt_${Date.now()}_${++gt}`;
}
const pt = {
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
    var s;
    const a = typeof t == "number" ? { timeoutMs: t } : t, r = (s = a == null ? void 0 : a.timeoutMs) != null ? s : 3e5, o = a == null ? void 0 : a.okLabel, n = a == null ? void 0 : a.cancelLabel, i = ft();
    return new Promise((c, d) => {
      const l = r === -1 ? null : setTimeout(() => {
        z.delete(i), d(new Error(`Plugin prompt timeout: ${e}`));
      }, r);
      z.set(i, {
        resolve: c,
        reject: d,
        timeout: l
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: h(h({
          message: e,
          requestId: i
        }, o && { okLabel: o }), n && { cancelLabel: n })
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
    const { requestId: t, action: a } = e, r = z.get(t);
    if (!r) {
      console.warn(
        `Received response for unknown prompt request: ${t}`
      );
      return;
    }
    r.timeout && clearTimeout(r.timeout), z.delete(t), a === "ok" ? r.resolve() : r.reject(new Error("User cancelled"));
  }
};
async function mt(e) {
  try {
    const t = e.requestId, a = e.action;
    return !t || !a ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (pt.handleResponse({ requestId: t, action: a }), {
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
const yt = {
  getCurrentUser: Ie,
  loadPages: Ce,
  exportPage: Je,
  importPage: it,
  quickCopy: ot,
  storeAuthData: nt,
  loadAuthData: st,
  clearAuthData: ct,
  storeSelectedRepo: lt,
  getComponentMetadata: dt,
  getAllComponents: ut,
  pluginPromptResponse: mt
}, bt = yt;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Ve(e);
    return;
  }
  const t = e;
  try {
    const a = t.type, r = bt[a];
    if (!r) {
      console.warn("Unknown message type:", t.type);
      const n = {
        type: t.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + t.type,
        data: {},
        requestId: t.requestId
      };
      figma.ui.postMessage(n);
      return;
    }
    const o = await r(t.data);
    figma.ui.postMessage(E(h({}, o), {
      requestId: t.requestId
    }));
  } catch (a) {
    console.error("Error handling message:", a);
    const r = {
      type: t.type,
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {},
      requestId: t.requestId
    };
    figma.ui.postMessage(r);
  }
};
