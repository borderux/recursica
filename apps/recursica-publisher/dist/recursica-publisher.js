var pe = Object.defineProperty, ue = Object.defineProperties;
var fe = Object.getOwnPropertyDescriptors;
var J = Object.getOwnPropertySymbols;
var me = Object.prototype.hasOwnProperty, ge = Object.prototype.propertyIsEnumerable;
var U = (e, a, t) => a in e ? pe(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t, v = (e, a) => {
  for (var t in a || (a = {}))
    me.call(a, t) && U(e, t, a[t]);
  if (J)
    for (var t of J(a))
      ge.call(a, t) && U(e, t, a[t]);
  return e;
}, k = (e, a) => ue(e, fe(a));
var M = (e, a, t) => U(e, typeof a != "symbol" ? a + "" : a, t);
async function ye(e) {
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
  } catch (t) {
    return {
      type: "getCurrentUser",
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function be(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((o, r) => ({
          name: o.name,
          index: r
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
const N = {
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
}, S = k(v({}, N), {
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
}), I = k(v({}, N), {
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
}), T = k(v({}, N), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), ee = k(v({}, N), {
  cornerRadius: 0
}), he = k(v({}, N), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Ae(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return S;
    case "TEXT":
      return I;
    case "VECTOR":
      return T;
    case "LINE":
      return he;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return ee;
    default:
      return N;
  }
}
function m(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((t, i) => m(t, a[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const t = Object.keys(e), i = Object.keys(a);
      return t.length !== i.length ? !0 : t.some(
        (o) => !(o in a) || m(e[o], a[o])
      );
    }
    return !0;
  }
  return e !== a;
}
class G {
  constructor() {
    M(this, "collectionMap");
    // collectionId -> index
    M(this, "collections");
    // index -> collection data
    M(this, "nextIndex");
    this.collectionMap = /* @__PURE__ */ new Map(), this.collections = [], this.nextIndex = 0;
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(a) {
    const t = a.collectionId;
    if (this.collectionMap.has(t))
      return this.collectionMap.get(t);
    const i = this.nextIndex++;
    return this.collectionMap.set(t, i), this.collections[i] = a, i;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(a) {
    var t;
    return (t = this.collectionMap.get(a)) != null ? t : -1;
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
    for (let t = 0; t < this.collections.length; t++)
      a[String(t)] = this.collections[t];
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
    for (let t = 0; t < this.collections.length; t++) {
      const i = this.collections[t], o = v({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
      a[String(t)] = o;
    }
    return a;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(a) {
    var o;
    const t = new G(), i = Object.entries(a).sort(
      (r, n) => parseInt(r[0], 10) - parseInt(n[0], 10)
    );
    for (const [r, n] of i) {
      const s = parseInt(r, 10), c = (o = n.isLocal) != null ? o : !0, p = n.collectionId || n.collectionGuid || `temp:${s}:${n.collectionName || "unknown"}`, l = v({
        collectionName: n.collectionName || "",
        collectionId: p,
        isLocal: c,
        modes: n.modes || []
      }, n.collectionGuid && {
        collectionGuid: n.collectionGuid
      });
      t.collectionMap.set(p, s), t.collections[s] = l, t.nextIndex = Math.max(
        t.nextIndex,
        s + 1
      );
    }
    return t;
  }
  /**
   * Gets the total number of collections in the table
   */
  getSize() {
    return this.collections.length;
  }
}
class B {
  constructor() {
    M(this, "variableMap");
    // variableKey -> index
    M(this, "variables");
    // index -> variable data
    M(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(a) {
    const t = a.variableKey;
    if (!t)
      return -1;
    if (this.variableMap.has(t))
      return this.variableMap.get(t);
    const i = this.nextIndex++;
    return this.variableMap.set(t, i), this.variables[i] = a, i;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(a) {
    var t;
    return (t = this.variableMap.get(a)) != null ? t : -1;
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
    for (let t = 0; t < this.variables.length; t++)
      a[String(t)] = this.variables[t];
    return a;
  }
  /**
   * Serializes valuesByMode, removing type and id from VariableAliasSerialized objects
   * Only keeps _varRef since that's sufficient to identify a variable reference
   */
  serializeValuesByMode(a) {
    if (!a)
      return;
    const t = {};
    for (const [i, o] of Object.entries(a))
      typeof o == "object" && o !== null && "_varRef" in o && typeof o._varRef == "number" ? t[i] = {
        _varRef: o._varRef
      } : t[i] = o;
    return t;
  }
  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: variableKey, id, collectionName, collectionId, isLocal
   * Also removes type and id from VariableAliasSerialized in valuesByMode (only keeps _varRef)
   * Keeps: variableName, variableType, _colRef, valuesByMode, and legacy collectionRef
   */
  getSerializedTable() {
    const a = {};
    for (let t = 0; t < this.variables.length; t++) {
      const i = this.variables[t], o = this.serializeValuesByMode(
        i.valuesByMode
      ), r = v(v(v(v(v(v({
        variableName: i.variableName,
        variableType: i.variableType
      }, i._colRef !== void 0 && { _colRef: i._colRef }), o && { valuesByMode: o }), i._colRef === void 0 && i.collectionRef !== void 0 && {
        collectionRef: i.collectionRef
      }), i._colRef === void 0 && i.collectionName && { collectionName: i.collectionName }), i._colRef === void 0 && i.collectionId && { collectionId: i.collectionId }), i._colRef === void 0 && i.isLocal !== void 0 && { isLocal: i.isLocal });
      a[String(t)] = r;
    }
    return a;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   */
  static fromTable(a) {
    var o;
    const t = new B(), i = Object.entries(a).sort(
      (r, n) => parseInt(r[0], 10) - parseInt(n[0], 10)
    );
    for (const [r, n] of i) {
      const s = parseInt(r, 10);
      n.variableKey && t.variableMap.set(n.variableKey, s);
      const c = k(v({}, n), {
        // Prefer _colRef, fallback to collectionRef for backward compatibility
        _colRef: (o = n._colRef) != null ? o : n.collectionRef
      });
      t.variables[s] = c, t.nextIndex = Math.max(t.nextIndex, s + 1);
    }
    return t;
  }
  /**
   * Gets the total number of variables in the table
   */
  getSize() {
    return this.variables.length;
  }
}
function ve(e) {
  return {
    _varRef: e
  };
}
function z(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let Ce = 0;
const L = /* @__PURE__ */ new Map();
function we(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = L.get(e.requestId);
  a && (L.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function te() {
  return new Promise((e, a) => {
    const t = `guid_${Date.now()}_${++Ce}`;
    L.set(t, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: t
    }), setTimeout(() => {
      L.has(t) && (L.delete(t), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const ae = {
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
async function V() {
  return new Promise((e) => setTimeout(e, 0));
}
const h = {
  clear: async () => {
    console.clear(), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    }), await V();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await V();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await V();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await V();
  }
};
function xe(e, a) {
  const t = a.modes.find((i) => i.modeId === e);
  return t ? t.name : e;
}
async function re(e, a, t, i, o = /* @__PURE__ */ new Set()) {
  const r = {};
  for (const [n, s] of Object.entries(e)) {
    const c = xe(n, i);
    if (s == null) {
      r[c] = s;
      continue;
    }
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean") {
      r[c] = s;
      continue;
    }
    if (typeof s == "object" && s !== null && "type" in s && s.type === "VARIABLE_ALIAS" && "id" in s) {
      const p = s.id;
      if (o.has(p)) {
        r[c] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const l = await figma.variables.getVariableByIdAsync(p);
      if (!l) {
        r[c] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const A = new Set(o);
      A.add(p);
      const b = await figma.variables.getVariableCollectionByIdAsync(
        l.variableCollectionId
      ), w = l.key;
      if (!w) {
        r[c] = {
          type: "VARIABLE_ALIAS",
          id: p
        };
        continue;
      }
      const C = {
        variableName: l.name,
        variableType: l.resolvedType,
        collectionName: b == null ? void 0 : b.name,
        collectionId: l.variableCollectionId,
        variableKey: w,
        id: p,
        isLocal: !l.remote
      };
      if (b) {
        const g = await ie(
          b,
          t
        );
        C._colRef = g, l.valuesByMode && (C.valuesByMode = await re(
          l.valuesByMode,
          a,
          t,
          b,
          // Pass collection for mode ID to name conversion
          A
        ));
      }
      const d = a.addVariable(C);
      r[c] = {
        type: "VARIABLE_ALIAS",
        id: p,
        _varRef: d
      };
    } else
      r[c] = s;
  }
  return r;
}
const X = "recursica:collectionId";
async function Se(e) {
  if (e.remote === !0) {
    const t = ae[e.id];
    if (!t) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await h.error(o), new Error(o);
    }
    return t.guid;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      X
    );
    if (t && t.trim() !== "")
      return t;
    const i = await te();
    return e.setSharedPluginData("recursica", X, i), i;
  }
}
function Ne(e, a) {
  if (a)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ie(e, a) {
  const t = !e.remote, i = a.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  Ne(e.name, t);
  const o = await Se(e), r = e.modes.map((p) => p.name), n = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: t,
    modes: r,
    collectionGuid: o
  }, s = a.addCollection(n), c = t ? "local" : "remote";
  return await h.log(
    `  Added ${c} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), s;
}
async function Y(e, a, t) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const i = await figma.variables.getVariableByIdAsync(e.id);
    if (!i)
      return console.log("Could not resolve variable alias:", e.id), null;
    const o = await figma.variables.getVariableCollectionByIdAsync(
      i.variableCollectionId
    );
    if (!o)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const r = i.key;
    if (!r)
      return console.log("Variable missing key:", e.id), null;
    const n = await ie(
      o,
      t
    ), s = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: n,
      // Reference to collection table (v2.4.0+)
      variableKey: r,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (s.valuesByMode = await re(
      i.valuesByMode,
      a,
      t,
      o,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const c = a.addVariable(s);
    return ve(c);
  } catch (i) {
    const o = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function $(e, a, t) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const r = e[o];
      if (r && typeof r == "object" && !Array.isArray(r))
        if (r.type === "VARIABLE_ALIAS") {
          const n = await Y(
            r,
            a,
            t
          );
          n && (i[o] = n);
        } else
          i[o] = await $(
            r,
            a,
            t
          );
      else Array.isArray(r) ? i[o] = await Promise.all(
        r.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await Y(
          n,
          a,
          t
        ) || n : n && typeof n == "object" ? await $(
          n,
          a,
          t
        ) : n)
      ) : i[o] = r;
    }
  return i;
}
async function Pe(e, a, t) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const r in i)
        Object.prototype.hasOwnProperty.call(i, r) && (r === "boundVariables" ? o[r] = await $(
          i[r],
          a,
          t
        ) : o[r] = i[r]);
      return o;
    })
  );
}
async function Ie(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (t.type = e.type, i.add("type")), e.id && (t.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (t.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (t.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (t.y = e.y, i.add("y")), e.width !== void 0 && (t.width = e.width, i.add("width")), e.height !== void 0 && (t.height = e.height, i.add("height")), e.visible !== void 0 && m(e.visible, N.visible) && (t.visible = e.visible, i.add("visible")), e.locked !== void 0 && m(e.locked, N.locked) && (t.locked = e.locked, i.add("locked")), e.opacity !== void 0 && m(e.opacity, N.opacity) && (t.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && m(e.rotation, N.rotation) && (t.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && m(e.blendMode, N.blendMode) && (t.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && m(e.effects, N.effects) && (t.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await Pe(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    m(o, N.fills) && (t.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && m(e.strokes, N.strokes) && (t.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && m(e.strokeWeight, N.strokeWeight) && (t.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && m(e.strokeAlign, N.strokeAlign) && (t.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await $(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    );
    Object.keys(o).length > 0 && (t.boundVariables = o), i.add("boundVariables");
  }
  return t;
}
async function Q(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && m(e.layoutMode, S.layoutMode) && (t.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && m(
    e.primaryAxisSizingMode,
    S.primaryAxisSizingMode
  ) && (t.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && m(
    e.counterAxisSizingMode,
    S.counterAxisSizingMode
  ) && (t.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && m(
    e.primaryAxisAlignItems,
    S.primaryAxisAlignItems
  ) && (t.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && m(
    e.counterAxisAlignItems,
    S.counterAxisAlignItems
  ) && (t.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && m(e.paddingLeft, S.paddingLeft) && (t.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && m(e.paddingRight, S.paddingRight) && (t.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && m(e.paddingTop, S.paddingTop) && (t.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && m(e.paddingBottom, S.paddingBottom) && (t.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && m(e.itemSpacing, S.itemSpacing) && (t.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && m(e.cornerRadius, S.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && m(e.clipsContent, S.clipsContent) && (t.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && m(e.layoutWrap, S.layoutWrap) && (t.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && m(e.layoutGrow, S.layoutGrow) && (t.layoutGrow = e.layoutGrow, i.add("layoutGrow")), t;
}
async function Ee(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (t.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (t.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (t.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && m(
    e.textAlignHorizontal,
    I.textAlignHorizontal
  ) && (t.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && m(
    e.textAlignVertical,
    I.textAlignVertical
  ) && (t.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && m(e.letterSpacing, I.letterSpacing) && (t.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && m(e.lineHeight, I.lineHeight) && (t.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && m(e.textCase, I.textCase) && (t.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && m(e.textDecoration, I.textDecoration) && (t.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && m(e.textAutoResize, I.textAutoResize) && (t.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && m(
    e.paragraphSpacing,
    I.paragraphSpacing
  ) && (t.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && m(e.paragraphIndent, I.paragraphIndent) && (t.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && m(e.listOptions, I.listOptions) && (t.listOptions = e.listOptions, i.add("listOptions")), t;
}
async function ke(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && m(e.fillGeometry, T.fillGeometry) && (t.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && m(e.strokeGeometry, T.strokeGeometry) && (t.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && m(e.strokeCap, T.strokeCap) && (t.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && m(e.strokeJoin, T.strokeJoin) && (t.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && m(e.dashPattern, T.dashPattern) && (t.dashPattern = e.dashPattern, i.add("dashPattern")), t;
}
async function Re(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && m(e.cornerRadius, ee.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (t.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), t;
}
function Me(e) {
  const a = [];
  let t = e.parent;
  try {
    for (; t; ) {
      let i, o, r;
      try {
        i = t.type, o = t.name, r = t.parent;
      } catch (n) {
        console.log(
          "Error accessing parent node properties in buildParentPath:",
          n
        );
        break;
      }
      if (i === "PAGE" || !r)
        break;
      o && o.trim() !== "" && a.unshift(o), t = r;
    }
  } catch (i) {
    console.log("Error during parent path traversal:", i);
  }
  return a.join("/");
}
async function Te(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (t._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (o) {
        const r = {};
        try {
          r.instanceNodeName = e.name, r.instanceNodeId = e.id, r.instanceNodeType = e.type, r.componentName = o.name, r.componentType = o.type, r.componentId = o.id;
          try {
            r.componentKey = o.key;
          } catch (u) {
            r.componentKey = "(cannot access)";
          }
          try {
            r.componentRemote = o.remote;
          } catch (u) {
            r.componentRemote = "(cannot access)";
          }
          let d = [];
          try {
            d = Object.getOwnPropertyNames(o), r.ownProperties = d;
          } catch (u) {
            r.ownProperties = "(cannot access)";
          }
          const g = [];
          try {
            let u = Object.getPrototypeOf(o);
            for (; u && u !== Object.prototype; )
              g.push(
                ...Object.getOwnPropertyNames(u).filter(
                  (P) => !g.includes(P)
                )
              ), u = Object.getPrototypeOf(u);
            r.prototypeProperties = g;
          } catch (u) {
            r.prototypeProperties = "(cannot access)";
          }
          let f = [];
          try {
            f = Object.keys(o), r.enumerableProperties = f;
          } catch (u) {
            r.enumerableProperties = "(cannot access)";
          }
          const x = [];
          try {
            for (const u of [...d, ...g])
              if (!(u === "instances" || u === "children" || u === "parent"))
                try {
                  typeof o[u] == "function" && x.push(u);
                } catch (P) {
                }
            r.availableMethods = x;
          } catch (u) {
            r.availableMethods = "(cannot access)";
          }
          const y = [];
          try {
            for (const u of [...d, ...g])
              (u.toLowerCase().includes("library") || u.toLowerCase().includes("remote") || u.toLowerCase().includes("file")) && y.push(u);
            r.libraryRelatedProperties = y;
          } catch (u) {
            r.libraryRelatedProperties = "(cannot access)";
          }
          try {
            o.remote !== void 0 && (r.remoteValue = o.remote);
          } catch (u) {
          }
          try {
            o.libraryName !== void 0 && (r.libraryNameValue = o.libraryName);
          } catch (u) {
          }
          try {
            o.libraryKey !== void 0 && (r.libraryKeyValue = o.libraryKey);
          } catch (u) {
          }
          try {
            if (o.parent !== void 0) {
              const u = o.parent;
              if (u) {
                r.mainComponentHasParent = !0;
                try {
                  r.mainComponentParentType = u.type, r.mainComponentParentName = u.name, r.mainComponentParentId = u.id;
                } catch (P) {
                  r.mainComponentParentAccessError = String(P);
                }
              } else
                r.mainComponentHasParent = !1;
            } else
              r.mainComponentParentUndefined = !0;
          } catch (u) {
            r.mainComponentParentCheckError = String(u);
          }
          try {
            o.variantProperties !== void 0 && (r.mainComponentVariantProperties = o.variantProperties);
          } catch (u) {
          }
          try {
            o.componentPropertyDefinitions !== void 0 && (r.mainComponentPropertyDefinitions = Object.keys(
              o.componentPropertyDefinitions
            ));
          } catch (u) {
          }
        } catch (d) {
          r.debugError = String(d);
        }
        let n, s;
        try {
          e.variantProperties && (n = e.variantProperties, r.instanceVariantProperties = n), e.componentProperties && (s = e.componentProperties, r.instanceComponentProperties = s);
        } catch (d) {
          r.propertiesError = String(d);
        }
        let c, p;
        const l = [];
        try {
          let d = o.parent;
          const g = [];
          let f = 0;
          const x = 20;
          if (d)
            try {
              if (r.mainComponentParentExists = !0, r.mainComponentParentType = d.type, r.mainComponentParentName = d.name, r.mainComponentParentId = d.id, d.type === "COMPONENT_SET")
                try {
                  const y = d.parent;
                  if (y === null)
                    r.componentSetParentIsNull = !0;
                  else if (y === void 0)
                    r.componentSetParentIsUndefined = !0;
                  else {
                    r.componentSetParentExists = !0;
                    try {
                      r.componentSetParentType = y.type, r.componentSetParentName = y.name;
                    } catch (u) {
                      r.componentSetParentPropertyAccessError = String(u);
                    }
                  }
                } catch (y) {
                  r.componentSetParentCheckError = String(y);
                }
            } catch (y) {
              r.mainComponentParentDebugError = String(y);
            }
          else
            r.mainComponentParentExists = !1;
          for (; d && f < x; )
            try {
              const y = d.type, u = d.name;
              if (l.push(
                `${y}:${u || "(unnamed)"}`
              ), y === "COMPONENT_SET" && !p && (p = u, r.componentSetName = u, r.componentSetFound = !0), y === "PAGE")
                break;
              u && u.trim() !== "" && g.unshift(u);
              let P, W = !1;
              try {
                "parent" in d ? (W = !0, r[`hasParentPropertyAtDepth${f}`] = !0, P = d.parent, P === null ? r[`parentIsNullAtDepth${f}`] = !0 : P === void 0 ? r[`parentIsUndefinedAtDepth${f}`] = !0 : r[`parentExistsAtDepth${f}`] = !0) : r[`noParentPropertyAtDepth${f}`] = !0;
              } catch (E) {
                r.parentAccessErrorAtDepth = f, r.parentAccessError = String(E), r.parentAccessErrorName = E instanceof Error ? E.name : "Unknown", r.parentAccessErrorMessage = E instanceof Error ? E.message : String(E);
                break;
              }
              if (!P) {
                r.noParentAtDepth = f, r.parentAccessAttemptedAtDepth = W;
                break;
              }
              try {
                const E = P.type, de = P.name;
                r[`parentAtDepth${f + 1}Type`] = E, r[`parentAtDepth${f + 1}Name`] = de;
              } catch (E) {
                r.nextParentAccessErrorAtDepth = f, r.nextParentAccessError = String(E);
              }
              d = P, f++;
            } catch (y) {
              r.parentTraverseErrorAtDepth = f, r.parentTraverseError = String(y), r.parentTraverseErrorName = y instanceof Error ? y.name : "Unknown", r.parentTraverseErrorMessage = y instanceof Error ? y.message : String(y);
              break;
            }
          c = g.join("/"), r.mainComponentParentChain = l, r.mainComponentParentChainDepth = f, r.mainComponentParentPath = c, r.mainComponentParentPathParts = g;
        } catch (d) {
          r.mainComponentParentPathError = String(d);
        }
        const A = Me(e);
        r.instanceParentPath = A, t.mainComponent = {
          id: o.id,
          name: o.name,
          key: o.key,
          // Component key for reference
          type: o.type
        }, p && (t.mainComponent.componentSetName = p), n && (t.mainComponent.variantProperties = n), s && (t.mainComponent.componentProperties = s), c && (t.mainComponent._path = c), A && (t.mainComponent._instancePath = A);
        const b = o.remote === !0, w = e.name || "(unnamed)", C = o.name || "(unnamed)";
        if (b) {
          await h.log(
            `  Found INSTANCE: "${w}" -> REMOTE component "${C}" (ID: ${o.id.substring(0, 8)}...)`
          ), t.mainComponent.remote = !0;
          try {
            if (typeof o.getPublishStatusAsync == "function")
              try {
                const d = await o.getPublishStatusAsync();
                if (d && (r.publishStatus = d, d && typeof d == "object")) {
                  d.libraryName && (t.mainComponent.libraryName = d.libraryName), d.libraryKey && (t.mainComponent.libraryKey = d.libraryKey), d.fileKey && (t.mainComponent.fileKey = d.fileKey);
                  const g = {};
                  Object.keys(d).forEach((f) => {
                    (f.toLowerCase().includes("library") || f.toLowerCase().includes("file")) && (g[f] = d[f]);
                  }), Object.keys(g).length > 0 && (r.libraryRelatedFromPublishStatus = g);
                }
              } catch (d) {
                r.publishStatusError = String(d);
              }
            try {
              const d = figma.teamLibrary, g = Object.getOwnPropertyNames(
                d
              ).filter((f) => typeof d[f] == "function");
              if (r.teamLibraryAvailableMethods = g, typeof (d == null ? void 0 : d.getAvailableLibraryComponentSetsAsync) == "function") {
                const f = await d.getAvailableLibraryComponentSetsAsync();
                if (r.availableComponentSetsCount = (f == null ? void 0 : f.length) || 0, f && Array.isArray(f)) {
                  const x = [];
                  for (const y of f)
                    try {
                      const u = {
                        name: y.name,
                        key: y.key,
                        libraryName: y.libraryName,
                        libraryKey: y.libraryKey
                      };
                      if (x.push(u), y.key === o.key || y.name === o.name) {
                        r.matchingComponentSet = u, y.libraryName && (t.mainComponent.libraryName = y.libraryName), y.libraryKey && (t.mainComponent.libraryKey = y.libraryKey);
                        break;
                      }
                    } catch (u) {
                      x.push({
                        error: String(u)
                      });
                    }
                  r.componentSets = x;
                }
              } else
                r.componentSetsApiNote = "getAvailableLibraryComponentSetsAsync not available";
            } catch (d) {
              r.teamLibrarySearchError = String(d);
            }
            try {
              const d = await figma.importComponentByKeyAsync(
                o.key
              );
              d && (r.importedComponentInfo = {
                id: d.id,
                name: d.name,
                type: d.type,
                remote: d.remote
              }, d.libraryName && (t.mainComponent.libraryName = d.libraryName, r.importedComponentLibraryName = d.libraryName), d.libraryKey && (t.mainComponent.libraryKey = d.libraryKey, r.importedComponentLibraryKey = d.libraryKey));
            } catch (d) {
              r.importComponentError = String(d);
            }
          } catch (d) {
            r.libraryInfoError = String(d);
          }
        } else
          await h.log(
            `  Found INSTANCE: "${w}" -> LOCAL component "${C}" (ID: ${o.id.substring(0, 8)}...)`
          );
        Object.keys(r).length > 0 && (t.mainComponent._debug = r), i.add("mainComponent");
      }
    } catch (o) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        o
      );
    }
  return t;
}
function j(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    a += j(t);
  }), a;
}
async function D(e, a = /* @__PURE__ */ new WeakSet(), t = {}) {
  var A, b, w, C, d;
  if (!e || typeof e != "object")
    return e;
  const i = (A = t.maxNodes) != null ? A : 1e4, o = (b = t.nodeCount) != null ? b : 0;
  if (o >= i)
    return await h.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  const r = {
    visited: (w = t.visited) != null ? w : /* @__PURE__ */ new WeakSet(),
    depth: (C = t.depth) != null ? C : 0,
    maxDepth: (d = t.maxDepth) != null ? d : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: t.variableTable,
    collectionTable: t.collectionTable
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), r.visited = a;
  const n = {}, s = await Ie(e, r);
  Object.assign(n, s);
  const c = e.type;
  if (c)
    switch (c) {
      case "FRAME":
      case "COMPONENT": {
        const g = await Q(e);
        Object.assign(n, g);
        break;
      }
      case "INSTANCE": {
        const g = await Te(
          e
        );
        Object.assign(n, g);
        const f = await Q(
          e
        );
        Object.assign(n, f);
        break;
      }
      case "TEXT": {
        const g = await Ee(e);
        Object.assign(n, g);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const g = await ke(e);
        Object.assign(n, g);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const g = await Re(e);
        Object.assign(n, g);
        break;
      }
      default:
        r.unhandledKeys.add("_unknownType");
        break;
    }
  const p = Object.getOwnPropertyNames(e), l = /* @__PURE__ */ new Set([
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
  for (const g of p)
    typeof e[g] != "function" && (l.has(g) || r.unhandledKeys.add(g));
  if (r.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(r.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const g = r.maxDepth;
    if (r.depth >= g)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${g}) reached`,
        _count: e.children.length
      };
    else if (r.nodeCount >= i)
      n.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const f = k(v({}, r), {
        depth: r.depth + 1
      }), x = [];
      let y = !1;
      for (const u of e.children) {
        if (f.nodeCount >= i) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: x.length,
            _total: e.children.length,
            children: x
          }, y = !0;
          break;
        }
        const P = await D(u, a, f);
        x.push(P), f.nodeCount && (r.nodeCount = f.nodeCount);
      }
      y || (n.children = x);
    }
  }
  return n;
}
async function Le(e) {
  await h.clear(), await h.log("=== Starting Page Export ===");
  try {
    const a = e.pageIndex;
    if (a === void 0 || typeof a != "number")
      return await h.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await h.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const t = figma.root.children;
    if (await h.log(`Loaded ${t.length} page(s)`), a < 0 || a >= t.length)
      return await h.error(
        `Invalid page index: ${a} (valid range: 0-${t.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const i = t[a];
    await h.log(
      `Selected page: "${i.name}" (index: ${a})`
    ), await h.log("Initializing variable and collection tables...");
    const o = new B(), r = new G();
    await h.log("Fetching team library variable collections...");
    let n = [];
    try {
      if (n = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((f) => ({
        libraryName: f.libraryName,
        key: f.key,
        name: f.name
      })), await h.log(
        `Found ${n.length} library collection(s) in team library`
      ), n.length > 0)
        for (const f of n)
          await h.log(`  - ${f.name} (from ${f.libraryName})`);
    } catch (g) {
      await h.warning(
        `Could not get library variable collections: ${g instanceof Error ? g.message : String(g)}`
      );
    }
    await h.log("Extracting node data from page..."), await h.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await h.log(
      "Collections will be discovered as variables are processed:"
    );
    const s = await D(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: r
      }
    );
    await h.log("Node extraction finished");
    const c = j(s), p = o.getSize(), l = r.getSize();
    if (await h.log("Extraction complete:"), await h.log(`  - Total nodes: ${c}`), await h.log(`  - Unique variables: ${p}`), await h.log(`  - Unique collections: ${l}`), l > 0) {
      await h.log("Collections found:");
      const g = r.getTable();
      for (const [f, x] of Object.values(g).entries()) {
        const y = x.collectionGuid ? ` (GUID: ${x.collectionGuid.substring(0, 8)}...)` : "";
        await h.log(
          `  ${f}: ${x.collectionName}${y} - ${x.modes.length} mode(s)`
        );
      }
    }
    await h.log("Creating export data structure...");
    const A = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.5.0",
        // Updated version for collection GUID system and serialized collection table
        figmaApiVersion: figma.apiVersion,
        originalPageName: i.name,
        totalNodes: c,
        pluginVersion: "1.0.0"
      },
      collections: r.getSerializedTable(),
      variables: o.getSerializedTable(),
      libraries: n,
      pageData: s
    };
    await h.log("Serializing to JSON...");
    const b = JSON.stringify(A, null, 2), w = (b.length / 1024).toFixed(2), C = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return await h.log(`JSON serialization complete: ${w} KB`), await h.log(`Export file: ${C}`), await h.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: C,
        jsonData: b,
        pageName: i.name,
        additionalPages: []
        // Will be populated when publishing referenced component pages
      }
    };
  } catch (a) {
    return await h.error(
      `Export failed: ${a instanceof Error ? a.message : "Unknown error occurred"}`
    ), a instanceof Error && a.stack && await h.error(`Stack trace: ${a.stack}`), console.error("Error exporting page:", a), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Z(e, a) {
  for (const t of a)
    e.modes.find((o) => o.name === t) || e.addMode(t);
}
const R = "recursica:collectionId";
async function O(e) {
  if (e.remote === !0) {
    const t = ae[e.id];
    if (!t) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await h.error(o), new Error(o);
    }
    return t.guid;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      R
    );
    if (t && t.trim() !== "")
      return t;
    const i = await te();
    return e.setSharedPluginData("recursica", R, i), i;
  }
}
function oe(e, a) {
  if (a)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ne(e) {
  let a;
  const t = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && i.includes(t))
    try {
      const s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((c) => c.name.trim().toLowerCase() === t);
      if (s) {
        oe(e.collectionName, !1);
        const c = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          s.key
        );
        if (c.length > 0) {
          const p = await figma.variables.importVariableByKeyAsync(c[0].key), l = await figma.variables.getVariableCollectionByIdAsync(
            p.variableCollectionId
          );
          if (l) {
            if (a = l, e.collectionGuid) {
              const A = a.getSharedPluginData(
                "recursica",
                R
              );
              (!A || A.trim() === "") && a.setSharedPluginData(
                "recursica",
                R,
                e.collectionGuid
              );
            } else
              await O(a);
            return await Z(a, e.modes), { collection: a };
          }
        }
      }
    } catch (n) {
      if (o === !1)
        throw new Error(
          `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
        );
      console.log("Could not import external collection, trying local:", n);
    }
  if (o !== !1) {
    const n = await figma.variables.getLocalVariableCollectionsAsync();
    let s;
    if (e.collectionGuid && (s = n.find((c) => c.getSharedPluginData("recursica", R) === e.collectionGuid)), s || (s = n.find(
      (c) => c.name === e.collectionName
    )), s)
      if (a = s, e.collectionGuid) {
        const c = a.getSharedPluginData(
          "recursica",
          R
        );
        (!c || c.trim() === "") && a.setSharedPluginData(
          "recursica",
          R,
          e.collectionGuid
        );
      } else
        await O(a);
    else
      a = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? a.setSharedPluginData(
        "recursica",
        R,
        e.collectionGuid
      ) : await O(a);
  } else {
    const n = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), s = e.collectionName.trim().toLowerCase(), c = n.find((b) => b.name.trim().toLowerCase() === s);
    if (!c)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const p = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      c.key
    );
    if (p.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const l = await figma.variables.importVariableByKeyAsync(
      p[0].key
    ), A = await figma.variables.getVariableCollectionByIdAsync(
      l.variableCollectionId
    );
    if (!A)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (a = A, e.collectionGuid) {
      const b = a.getSharedPluginData(
        "recursica",
        R
      );
      (!b || b.trim() === "") && a.setSharedPluginData(
        "recursica",
        R,
        e.collectionGuid
      );
    } else
      O(a);
  }
  return await Z(a, e.modes), { collection: a };
}
async function Ve(e, a) {
  oe(e, a);
  {
    const i = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (o) => o.name === e
    );
    return i || figma.variables.createVariableCollection(e);
  }
}
async function q(e, a) {
  for (const t of e.variableIds)
    try {
      const i = await figma.variables.getVariableByIdAsync(t);
      if (i && i.name === a)
        return i;
    } catch (i) {
      continue;
    }
  return null;
}
function Oe(e, a) {
  const t = e.resolvedType.toUpperCase(), i = a.toUpperCase();
  return t !== i ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${t}" but expected "${i}". Skipping binding.`
  ), !1) : !0;
}
async function _e(e, a, t, i, o) {
  for (const [r, n] of Object.entries(a)) {
    const s = i.modes.find((p) => p.name === r);
    if (!s) {
      console.warn(
        `Mode "${r}" not found in collection "${i.name}" for variable "${e.name}". Skipping.`
      );
      continue;
    }
    const c = s.modeId;
    try {
      if (n == null)
        continue;
      if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") {
        e.setValueForMode(c, n);
        continue;
      }
      if (typeof n == "object" && n !== null && "_varRef" in n && typeof n._varRef == "number") {
        const p = n;
        let l = null;
        const A = t.getVariableByIndex(
          p._varRef
        );
        if (A) {
          let b = null;
          if (o && A._colRef !== void 0) {
            const w = o.getCollectionByIndex(
              A._colRef
            );
            w && (b = (await ne(w)).collection);
          }
          b && (l = await q(
            b,
            A.variableName
          ));
        }
        if (l) {
          const b = {
            type: "VARIABLE_ALIAS",
            id: l.id
          };
          e.setValueForMode(c, b);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${r}" in variable "${e.name}". Variable reference index: ${p._varRef}`
          );
      }
    } catch (p) {
      console.warn(
        `Error setting value for mode "${r}" in variable "${e.name}":`,
        p
      );
    }
  }
}
async function ze(e, a, t, i) {
  const o = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  return e.valuesByMode && await _e(
    o,
    e.valuesByMode,
    t,
    a,
    // Pass collection to look up modes by name
    i
  ), o;
}
async function se(e, a, t) {
  const i = a.getVariableByIndex(e._varRef);
  if (!i)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    const o = i._colRef;
    if (o === void 0)
      return console.warn(
        `Variable "${i.variableName}" missing collection reference (_colRef)`
      ), null;
    const r = t.getCollectionByIndex(o);
    if (!r)
      return console.warn(
        `Collection not found at index ${o} for variable "${i.variableName}"`
      ), null;
    const { collection: n } = await ne(r);
    let s = await q(n, i.variableName);
    return s ? Oe(s, i.variableType) ? s : null : i.valuesByMode ? (s = await ze(
      i,
      n,
      a,
      t
      // Pass collection table for alias resolution
    ), s) : (console.warn(
      `Cannot create variable "${i.variableName}" without valuesByMode data`
    ), null);
  } catch (o) {
    if (console.error(
      `Error resolving variable reference for "${i.variableName}":`,
      o
    ), o instanceof Error && o.message.includes("External collection"))
      throw o;
    return null;
  }
}
function $e(e, a) {
  if (!a || !z(e))
    return null;
  const t = a.getVariableByIndex(e._varRef);
  return t ? {
    type: "VARIABLE_ALIAS",
    id: t.id || "",
    // Fallback to empty string if id not available (new format)
    variableName: t.variableName,
    variableType: t.variableType,
    isLocal: t.isLocal || !1,
    collectionName: t.collectionName,
    collectionId: t.collectionId,
    variableKey: t.variableKey
  } : (console.log(`Variable not found in table at index ${e._varRef}`), null);
}
async function Ge(e, a, t, i, o) {
  if (!(!a || typeof a != "object"))
    try {
      const r = e[t];
      if (!r || !Array.isArray(r))
        return;
      for (const [n, s] of Object.entries(a))
        if (n === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < r.length; c++) {
            const p = s[c];
            if (z(p) && i && o) {
              const l = await se(
                p,
                i,
                o
              );
              l && r[c].boundVariables && (r[c].boundVariables[t] = {
                type: "VARIABLE_ALIAS",
                id: l.id
              });
            }
          }
        else {
          let c = null;
          z(s) && (c = $e(s, i)), c && await Be(e, n, c, i);
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${t}:`, r);
    }
}
async function Be(e, a, t, i) {
  try {
    let o = null;
    if (i) {
      if (t.isLocal) {
        const r = await Ve(
          t.collectionName || "",
          !0
        );
        o = await q(
          r,
          t.variableName || ""
        ), !o && t.variableName && t.variableType && console.warn(
          `Cannot create variable "${t.variableName}" without valuesByMode. Use resolveVariableReferenceOnImport instead.`
        );
      } else if (t.variableKey)
        try {
          o = await figma.variables.importVariableByKeyAsync(
            t.variableKey
          );
        } catch (r) {
          console.log(
            `Could not import team variable: ${t.variableName}`
          );
        }
    }
    if (o) {
      const r = {
        type: "VARIABLE_ALIAS",
        id: o.id
      };
      e.boundVariables || (e.boundVariables = {}), e.boundVariables[a] || (e.boundVariables[a] = r);
    }
  } catch (o) {
    console.log(`Error binding variable to property ${a}:`, o);
  }
}
function Ue(e, a) {
  const t = Ae(a);
  if (e.visible === void 0 && (e.visible = t.visible), e.locked === void 0 && (e.locked = t.locked), e.opacity === void 0 && (e.opacity = t.opacity), e.rotation === void 0 && (e.rotation = t.rotation), e.blendMode === void 0 && (e.blendMode = t.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const i = S;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (a === "TEXT") {
    const i = I;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function H(e, a, t = null, i = null) {
  var o;
  try {
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
        r = figma.createComponent();
        break;
      case "INSTANCE":
        if (console.log("Found instance node: " + e.name), e.mainComponent && e.mainComponent.key)
          try {
            const n = await figma.importComponentByKeyAsync(
              e.mainComponent.key
            );
            n && n.type === "COMPONENT" ? (r = n.createInstance(), console.log(
              "Created instance from main component: " + e.mainComponent.name
            )) : (console.log("Main component not found, creating frame fallback"), r = figma.createFrame());
          } catch (n) {
            console.log(
              "Error creating instance: " + n + ", creating frame fallback"
            ), r = figma.createFrame();
          }
        else
          console.log("No main component info, creating frame fallback"), r = figma.createFrame();
        break;
      case "GROUP":
        r = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " + e.name + ", creating frame fallback"
        ), r = figma.createFrame();
        break;
      case "POLYGON":
        r = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " + e.type + ", creating frame instead"
        ), r = figma.createFrame();
        break;
    }
    if (!r)
      return null;
    if (Ue(r, e.type || "FRAME"), e.name !== void 0 && (r.name = e.name || "Unnamed Node"), e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y), e.width !== void 0 && e.height !== void 0 && r.resize(e.width, e.height), e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (r.opacity = e.opacity), e.rotation !== void 0 && (r.rotation = e.rotation), e.blendMode !== void 0 && (r.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && t && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const c = {};
            for (const [p, l] of Object.entries(
              s.boundVariables
            ))
              c[p] = l;
            return k(v({}, s), { boundVariables: c });
          }
          return s;
        })), r.fills = n, (o = e.boundVariables) != null && o.fills && await Ge(
          r,
          e.boundVariables,
          "fills",
          t,
          i
        );
      } catch (n) {
        console.log("Error setting fills:", n);
      }
    if (e.strokes !== void 0 && e.strokes.length > 0)
      try {
        r.strokes = e.strokes;
      } catch (n) {
        console.log("Error setting strokes:", n);
      }
    if (e.strokeWeight !== void 0 && (r.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (r.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (r.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (r.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (r.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (r.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (r.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (r.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (r.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (r.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (r.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (r.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (r.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (r.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (r.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (r.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (r.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
      try {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), r.fontName = e.fontName;
          } catch (n) {
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
        r.characters = e.characters, e.fontSize !== void 0 && (r.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (r.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (r.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (r.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (r.lineHeight = e.lineHeight), e.textCase !== void 0 && (r.textCase = e.textCase), e.textDecoration !== void 0 && (r.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (r.textAutoResize = e.textAutoResize);
      } catch (n) {
        console.log("Error setting text properties: " + n);
        try {
          r.characters = e.characters;
        } catch (s) {
          console.log("Could not set text characters: " + s);
        }
      }
    if (e.boundVariables) {
      for (const [n, s] of Object.entries(
        e.boundVariables
      ))
        if (n !== "fills" && z(s) && t && i) {
          const c = await se(
            s,
            t,
            i
          );
          if (c) {
            const p = {
              type: "VARIABLE_ALIAS",
              id: c.id
            };
            r.boundVariables || (r.boundVariables = {}), r.boundVariables[n] || (r.boundVariables[n] = p);
          }
        }
    }
    if (e.children && Array.isArray(e.children))
      for (const n of e.children) {
        if (n._truncated) {
          console.log(
            `Skipping truncated children: ${n._reason || "Unknown"}`
          );
          continue;
        }
        const s = await H(
          n,
          r,
          t,
          i
        );
        s && r.appendChild(s);
      }
    return a && a.appendChild(r), r;
  } catch (r) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      r
    ), null;
  }
}
async function Fe(e) {
  try {
    const a = e.jsonData;
    if (!a)
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    if (console.log("Importing page from JSON"), !a.pageData || !a.metadata)
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid JSON format. Expected pageData and metadata.",
        data: {}
      };
    const t = a.pageData, i = a.metadata;
    let o = null;
    if (a.collections)
      try {
        o = G.fromTable(a.collections), console.log(
          `Loaded collections table with ${o.getSize()} collections`
        );
      } catch (b) {
        console.warn("Failed to load collections table:", b);
      }
    let r = null;
    if (a.variables)
      try {
        r = B.fromTable(a.variables), console.log(
          `Loaded variable table with ${r.getSize()} variables`
        );
      } catch (b) {
        console.warn("Failed to load variable table:", b);
      }
    const n = "2.3.0", s = i.exportFormatVersion || "1.0.0";
    s !== n && console.warn(
      `Export format version mismatch: exported with ${s}, current version is ${n}. Import may have compatibility issues.`
    );
    const p = "Imported - " + (i.originalPageName ? i.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), l = figma.createPage();
    if (l.name = p, figma.root.appendChild(l), console.log("Created new page: " + p), console.log("Importing " + (i.totalNodes || "unknown") + " nodes"), t.children && Array.isArray(t.children)) {
      for (const b of t.children) {
        if (b._truncated) {
          console.log(
            `Skipping truncated children: ${b._reason || "Unknown"}`
          );
          continue;
        }
        await H(
          b,
          l,
          r,
          o
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
        pageName: i.originalPageName,
        totalNodes: i.totalNodes || 0
      }
    };
  } catch (a) {
    return console.error("Error importing page:", a), {
      type: "importPage",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ke(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    console.log("Found " + a.length + " pages in the document");
    const t = 11, i = a[t];
    if (!i)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const o = await D(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + t + ")"
    );
    const r = JSON.stringify(o, null, 2), n = JSON.parse(r), s = "Copy - " + n.name, c = figma.createPage();
    if (c.name = s, figma.root.appendChild(c), n.children && n.children.length > 0) {
      let A = function(w) {
        w.forEach((C) => {
          const d = (C.x || 0) + (C.width || 0);
          d > b && (b = d), C.children && C.children.length > 0 && A(C.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let b = 0;
      A(n.children), console.log("Original content rightmost edge: " + b);
      for (const w of n.children)
        await H(w, c, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const p = j(n);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: n.name,
        newPageName: s,
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
async function je(e) {
  try {
    const a = e.accessToken, t = e.selectedRepo;
    return a ? (await figma.clientStorage.setAsync("accessToken", a), t && await figma.clientStorage.setAsync("selectedRepo", t), {
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
async function De(e) {
  try {
    const a = await figma.clientStorage.getAsync("accessToken"), t = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: a || void 0,
        selectedRepo: t || void 0
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
async function qe(e) {
  try {
    return await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), {
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
async function He(e) {
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
function F(e, a = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: a
  };
}
function ce(e, a, t = {}) {
  const i = a instanceof Error ? a.message : a;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: t
  };
}
function K(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const le = "RecursicaPublishedMetadata";
async function We(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (s) => s.id === a.id
    ), o = a.getPluginData(le);
    if (!o) {
      const p = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: K(a.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return F("getComponentMetadata", p);
    }
    const n = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return F("getComponentMetadata", n);
  } catch (a) {
    return console.error("Error getting component metadata:", a), ce(
      "getComponentMetadata",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function Je(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children, t = [];
    for (const o of a) {
      if (o.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${o.name} (type: ${o.type})`
        );
        continue;
      }
      const r = o, n = r.getPluginData(le);
      if (n)
        try {
          const s = JSON.parse(n);
          t.push(s);
        } catch (s) {
          console.warn(
            `Failed to parse metadata for page "${r.name}":`,
            s
          );
          const p = {
            _ver: 1,
            id: "",
            name: K(r.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          t.push(p);
        }
      else {
        const c = {
          _ver: 1,
          id: "",
          name: K(r.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        t.push(c);
      }
    }
    return F("getAllComponents", {
      components: t
    });
  } catch (a) {
    return console.error("Error getting all components:", a), ce(
      "getAllComponents",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
const _ = /* @__PURE__ */ new Map();
let Xe = 0;
function Ye() {
  return `prompt_${Date.now()}_${++Xe}`;
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
    var s;
    const t = typeof a == "number" ? { timeoutMs: a } : a, i = (s = t == null ? void 0 : t.timeoutMs) != null ? s : 3e5, o = t == null ? void 0 : t.okLabel, r = t == null ? void 0 : t.cancelLabel, n = Ye();
    return new Promise((c, p) => {
      const l = i === -1 ? null : setTimeout(() => {
        _.delete(n), p(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      _.set(n, {
        resolve: c,
        reject: p,
        timeout: l
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: v(v({
          message: e,
          requestId: n
        }, o && { okLabel: o }), r && { cancelLabel: r })
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
    const { requestId: a, action: t } = e, i = _.get(a);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${a}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), _.delete(a), t === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
};
async function Ze(e) {
  try {
    const a = e.requestId, t = e.action;
    return !a || !t ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Qe.handleResponse({ requestId: a, action: t }), {
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
const et = {
  getCurrentUser: ye,
  loadPages: be,
  exportPage: Le,
  importPage: Fe,
  quickCopy: Ke,
  storeAuthData: je,
  loadAuthData: De,
  clearAuthData: qe,
  storeSelectedRepo: He,
  getComponentMetadata: We,
  getAllComponents: Je,
  pluginPromptResponse: Ze
}, tt = et;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    we(e);
    return;
  }
  const a = e;
  try {
    const t = a.type, i = tt[t];
    if (!i) {
      console.warn("Unknown message type:", a.type);
      const r = {
        type: a.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + a.type,
        data: {},
        requestId: a.requestId
      };
      figma.ui.postMessage(r);
      return;
    }
    const o = await i(a.data);
    figma.ui.postMessage(k(v({}, o), {
      requestId: a.requestId
    }));
  } catch (t) {
    console.error("Error handling message:", t);
    const i = {
      type: a.type,
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {},
      requestId: a.requestId
    };
    figma.ui.postMessage(i);
  }
};
