var fe = Object.defineProperty, ge = Object.defineProperties;
var pe = Object.getOwnPropertyDescriptors;
var X = Object.getOwnPropertySymbols;
var me = Object.prototype.hasOwnProperty, ye = Object.prototype.propertyIsEnumerable;
var K = (e, a, t) => a in e ? fe(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t, h = (e, a) => {
  for (var t in a || (a = {}))
    me.call(a, t) && K(e, t, a[t]);
  if (X)
    for (var t of X(a))
      ye.call(a, t) && K(e, t, a[t]);
  return e;
}, k = (e, a) => ge(e, pe(a));
var R = (e, a, t) => K(e, typeof a != "symbol" ? a + "" : a, t);
async function be(e) {
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
async function he(e) {
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
const I = {
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
}, x = k(h({}, I), {
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
}), N = k(h({}, I), {
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
}), T = k(h({}, I), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), ae = k(h({}, I), {
  cornerRadius: 0
}), Ae = k(h({}, I), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function ve(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return x;
    case "TEXT":
      return N;
    case "VECTOR":
      return T;
    case "LINE":
      return Ae;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return ae;
    default:
      return I;
  }
}
function u(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((t, i) => u(t, a[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const t = Object.keys(e), i = Object.keys(a);
      return t.length !== i.length ? !0 : t.some(
        (o) => !(o in a) || u(e[o], a[o])
      );
    }
    return !0;
  }
  return e !== a;
}
class B {
  constructor() {
    R(this, "collectionMap");
    // collectionId -> index
    R(this, "collections");
    // index -> collection data
    R(this, "nextIndex");
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
      const i = this.collections[t], o = h({
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
    const t = new B(), i = Object.entries(a).sort(
      (r, n) => parseInt(r[0], 10) - parseInt(n[0], 10)
    );
    for (const [r, n] of i) {
      const s = parseInt(r, 10), c = (o = n.isLocal) != null ? o : !0, d = n.collectionId || n.collectionGuid || `temp:${s}:${n.collectionName || "unknown"}`, l = h({
        collectionName: n.collectionName || "",
        collectionId: d,
        isLocal: c,
        modes: n.modes || []
      }, n.collectionGuid && {
        collectionGuid: n.collectionGuid
      });
      t.collectionMap.set(d, s), t.collections[s] = l, t.nextIndex = Math.max(
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
class F {
  constructor() {
    R(this, "variableMap");
    // variableKey -> index
    R(this, "variables");
    // index -> variable data
    R(this, "nextIndex");
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
      ), r = h(h(h(h(h(h({
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
    const t = new F(), i = Object.entries(a).sort(
      (r, n) => parseInt(r[0], 10) - parseInt(n[0], 10)
    );
    for (const [r, n] of i) {
      const s = parseInt(r, 10);
      n.variableKey && t.variableMap.set(n.variableKey, s);
      const c = k(h({}, n), {
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
function we(e) {
  return {
    _varRef: e
  };
}
function $(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let xe = 0;
const L = /* @__PURE__ */ new Map();
function Ie(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = L.get(e.requestId);
  a && (L.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function ie() {
  return new Promise((e, a) => {
    const t = `guid_${Date.now()}_${++xe}`;
    L.set(t, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: t
    }), setTimeout(() => {
      L.has(t) && (L.delete(t), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const re = {
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
const g = {
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
function Ce(e, a) {
  const t = a.modes.find((i) => i.modeId === e);
  return t ? t.name : e;
}
async function oe(e, a, t, i, o = /* @__PURE__ */ new Set()) {
  const r = {};
  for (const [n, s] of Object.entries(e)) {
    const c = Ce(n, i);
    if (s == null) {
      r[c] = s;
      continue;
    }
    if (typeof s == "string" || typeof s == "number" || typeof s == "boolean") {
      r[c] = s;
      continue;
    }
    if (typeof s == "object" && s !== null && "type" in s && s.type === "VARIABLE_ALIAS" && "id" in s) {
      const d = s.id;
      if (o.has(d)) {
        r[c] = {
          type: "VARIABLE_ALIAS",
          id: d
        };
        continue;
      }
      const l = await figma.variables.getVariableByIdAsync(d);
      if (!l) {
        r[c] = {
          type: "VARIABLE_ALIAS",
          id: d
        };
        continue;
      }
      const y = new Set(o);
      y.add(d);
      const f = await figma.variables.getVariableCollectionByIdAsync(
        l.variableCollectionId
      ), w = l.key;
      if (!w) {
        r[c] = {
          type: "VARIABLE_ALIAS",
          id: d
        };
        continue;
      }
      const A = {
        variableName: l.name,
        variableType: l.resolvedType,
        collectionName: f == null ? void 0 : f.name,
        collectionId: l.variableCollectionId,
        variableKey: w,
        id: d,
        isLocal: !l.remote
      };
      if (f) {
        const m = await ne(
          f,
          t
        );
        A._colRef = m, l.valuesByMode && (A.valuesByMode = await oe(
          l.valuesByMode,
          a,
          t,
          f,
          // Pass collection for mode ID to name conversion
          y
        ));
      }
      const C = a.addVariable(A);
      r[c] = {
        type: "VARIABLE_ALIAS",
        id: d,
        _varRef: C
      };
    } else
      r[c] = s;
  }
  return r;
}
const Y = "recursica:collectionId";
async function Ne(e) {
  if (e.remote === !0) {
    const t = re[e.id];
    if (!t) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await g.error(o), new Error(o);
    }
    return t.guid;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      Y
    );
    if (t && t.trim() !== "")
      return t;
    const i = await ie();
    return e.setSharedPluginData("recursica", Y, i), i;
  }
}
function Se(e, a) {
  if (a)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ne(e, a) {
  const t = !e.remote, i = a.getCollectionIndex(e.id);
  if (i !== -1)
    return i;
  Se(e.name, t);
  const o = await Ne(e), r = e.modes.map((d) => d.name), n = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: t,
    modes: r,
    collectionGuid: o
  }, s = a.addCollection(n), c = t ? "local" : "remote";
  return await g.log(
    `  Added ${c} collection: "${e.name}" (ID: ${e.id.substring(0, 20)}...)`
  ), s;
}
async function Q(e, a, t) {
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
    const n = await ne(
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
    i.valuesByMode && (s.valuesByMode = await oe(
      i.valuesByMode,
      a,
      t,
      o,
      // Pass collection for mode ID to name conversion
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const c = a.addVariable(s);
    return we(c);
  } catch (i) {
    const o = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function G(e, a, t) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const r = e[o];
      if (r && typeof r == "object" && !Array.isArray(r))
        if (r.type === "VARIABLE_ALIAS") {
          const n = await Q(
            r,
            a,
            t
          );
          n && (i[o] = n);
        } else
          i[o] = await G(
            r,
            a,
            t
          );
      else Array.isArray(r) ? i[o] = await Promise.all(
        r.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await Q(
          n,
          a,
          t
        ) || n : n && typeof n == "object" ? await G(
          n,
          a,
          t
        ) : n)
      ) : i[o] = r;
    }
  return i;
}
async function ke(e, a, t) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const r in i)
        Object.prototype.hasOwnProperty.call(i, r) && (r === "boundVariables" ? o[r] = await G(
          i[r],
          a,
          t
        ) : o[r] = i[r]);
      return o;
    })
  );
}
async function Re(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (t.type = e.type, i.add("type")), e.id && (t.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (t.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (t.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (t.y = e.y, i.add("y")), e.width !== void 0 && (t.width = e.width, i.add("width")), e.height !== void 0 && (t.height = e.height, i.add("height")), e.visible !== void 0 && u(e.visible, I.visible) && (t.visible = e.visible, i.add("visible")), e.locked !== void 0 && u(e.locked, I.locked) && (t.locked = e.locked, i.add("locked")), e.opacity !== void 0 && u(e.opacity, I.opacity) && (t.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && u(e.rotation, I.rotation) && (t.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && u(e.blendMode, I.blendMode) && (t.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && u(e.effects, I.effects) && (t.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await ke(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    u(o, I.fills) && (t.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && u(e.strokes, I.strokes) && (t.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && u(e.strokeWeight, I.strokeWeight) && (t.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && u(e.strokeAlign, I.strokeAlign) && (t.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await G(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    );
    Object.keys(o).length > 0 && (t.boundVariables = o), i.add("boundVariables");
  }
  return t;
}
async function Z(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && u(e.layoutMode, x.layoutMode) && (t.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && u(
    e.primaryAxisSizingMode,
    x.primaryAxisSizingMode
  ) && (t.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && u(
    e.counterAxisSizingMode,
    x.counterAxisSizingMode
  ) && (t.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && u(
    e.primaryAxisAlignItems,
    x.primaryAxisAlignItems
  ) && (t.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && u(
    e.counterAxisAlignItems,
    x.counterAxisAlignItems
  ) && (t.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && u(e.paddingLeft, x.paddingLeft) && (t.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && u(e.paddingRight, x.paddingRight) && (t.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && u(e.paddingTop, x.paddingTop) && (t.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && u(e.paddingBottom, x.paddingBottom) && (t.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && u(e.itemSpacing, x.itemSpacing) && (t.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && u(e.cornerRadius, x.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && u(e.clipsContent, x.clipsContent) && (t.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && u(e.layoutWrap, x.layoutWrap) && (t.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && u(e.layoutGrow, x.layoutGrow) && (t.layoutGrow = e.layoutGrow, i.add("layoutGrow")), t;
}
async function Ee(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (t.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (t.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (t.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && u(
    e.textAlignHorizontal,
    N.textAlignHorizontal
  ) && (t.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && u(
    e.textAlignVertical,
    N.textAlignVertical
  ) && (t.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && u(e.letterSpacing, N.letterSpacing) && (t.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && u(e.lineHeight, N.lineHeight) && (t.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && u(e.textCase, N.textCase) && (t.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && u(e.textDecoration, N.textDecoration) && (t.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && u(e.textAutoResize, N.textAutoResize) && (t.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && u(
    e.paragraphSpacing,
    N.paragraphSpacing
  ) && (t.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && u(e.paragraphIndent, N.paragraphIndent) && (t.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && u(e.listOptions, N.listOptions) && (t.listOptions = e.listOptions, i.add("listOptions")), t;
}
async function Me(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && u(e.fillGeometry, T.fillGeometry) && (t.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && u(e.strokeGeometry, T.strokeGeometry) && (t.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && u(e.strokeCap, T.strokeCap) && (t.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && u(e.strokeJoin, T.strokeJoin) && (t.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && u(e.dashPattern, T.dashPattern) && (t.dashPattern = e.dashPattern, i.add("dashPattern")), t;
}
async function Pe(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && u(e.cornerRadius, ae.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (t.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), t;
}
const Te = "RecursicaPublishedMetadata";
function ee(e) {
  let a = e;
  for (; a; ) {
    if (a.type === "PAGE")
      return a;
    try {
      a = a.parent;
    } catch (t) {
      return null;
    }
  }
  return null;
}
function Le(e) {
  const a = [];
  let t = e.parent;
  try {
    for (; t; ) {
      let i, o, r;
      try {
        i = t.type, o = t.name, r = t.parent;
      } catch (n) {
        break;
      }
      if (i === "PAGE" || !r)
        break;
      o && o.trim() !== "" && a.unshift(o), t = r;
    }
  } catch (i) {
  }
  return a.join("/");
}
function Ve(e) {
  try {
    const a = e.getSharedPluginData(
      "recursica",
      Te
    );
    if (!a || a.trim() === "")
      return null;
    const t = JSON.parse(a);
    return {
      id: t.id,
      version: t.version
    };
  } catch (a) {
    return null;
  }
}
async function _e(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (t._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (!o)
        return t;
      const r = e.name || "(unnamed)", n = o.name || "(unnamed)", s = o.remote === !0, c = ee(e), d = ee(o);
      let l;
      s ? l = "remote" : d && c && d.id === c.id ? l = "internal" : (d && c && (d.id, c.id), l = "normal");
      let y, f;
      try {
        e.variantProperties && (y = e.variantProperties), e.componentProperties && (f = e.componentProperties);
      } catch (p) {
      }
      const w = Le(e);
      let A, C;
      try {
        let p = o.parent;
        const v = [];
        let b = 0;
        const P = 20;
        for (; p && b < P; )
          try {
            const S = p.type, V = p.name;
            if (S === "COMPONENT_SET" && !C && (C = V), S === "PAGE")
              break;
            V && V.trim() !== "" && v.unshift(V), p = p.parent, b++;
          } catch (S) {
            break;
          }
        A = v.join("/");
      } catch (p) {
      }
      const m = h(h(h(h(h({
        instanceType: l,
        componentName: n,
        componentType: o.type
      }, C && { componentSetName: C }), y && { variantProperties: y }), f && { componentProperties: f }), A && { _path: A }), w && { _instancePath: w });
      if (l === "internal")
        m.componentNodeId = o.id, await g.log(
          `  Found INSTANCE: "${r}" -> INTERNAL component "${n}" (ID: ${o.id.substring(0, 8)}...)`
        );
      else if (l === "normal") {
        if (d) {
          const p = Ve(d);
          p != null && p.id && p.version !== void 0 && (m.componentGuid = p.id, m.componentVersion = p.version, m.componentPageName = d.name);
        }
        await g.log(
          `  Found INSTANCE: "${r}" -> NORMAL component "${n}" (ID: ${o.id.substring(0, 8)}...)`
        );
      } else if (l === "remote") {
        let p, v;
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const b = await o.getPublishStatusAsync();
              b && typeof b == "object" && (b.libraryName && (p = b.libraryName), b.libraryKey && (v = b.libraryKey));
            } catch (b) {
            }
          try {
            const b = figma.teamLibrary;
            if (typeof (b == null ? void 0 : b.getAvailableLibraryComponentSetsAsync) == "function") {
              const P = await b.getAvailableLibraryComponentSetsAsync();
              if (P && Array.isArray(P)) {
                for (const S of P)
                  if (S.key === o.key || S.name === o.name) {
                    S.libraryName && (p = S.libraryName), S.libraryKey && (v = S.libraryKey);
                    break;
                  }
              }
            }
          } catch (b) {
          }
          try {
            m.structure = await U(
              o,
              /* @__PURE__ */ new WeakSet(),
              a
            );
          } catch (b) {
            console.warn(
              `Failed to extract structure for remote component "${n}":`,
              b
            );
          }
        } catch (b) {
          console.warn(
            `Error getting library info for remote component "${n}":`,
            b
          );
        }
        p && (m.remoteLibraryName = p), v && (m.remoteLibraryKey = v), await g.log(
          `  Found INSTANCE: "${r}" -> REMOTE component "${n}" (ID: ${o.id.substring(0, 8)}...)`
        );
      }
      const M = a.instanceTable.addInstance(m);
      t._instanceRef = M, i.add("_instanceRef");
    } catch (o) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        o
      );
    }
  return t;
}
class H {
  constructor() {
    R(this, "instanceMap");
    // unique key -> index
    R(this, "instances");
    // index -> instance data
    R(this, "nextIndex");
    this.instanceMap = /* @__PURE__ */ new Map(), this.instances = [], this.nextIndex = 0;
  }
  /**
   * Generates a unique key for an instance based on its type
   */
  generateKey(a) {
    return a.instanceType === "internal" && a.componentNodeId ? `internal:${a.componentNodeId}` : a.instanceType === "normal" && a.componentGuid && a.componentVersion !== void 0 ? `normal:${a.componentGuid}:${a.componentVersion}` : a.instanceType === "remote" && a.remoteLibraryKey ? `remote:${a.remoteLibraryKey}:${a.componentName}` : `${a.instanceType}:${a.componentName}:${a.componentType || "unknown"}`;
  }
  /**
   * Adds an instance to the table if it doesn't already exist
   * Returns the index of the instance (existing or newly added)
   */
  addInstance(a) {
    const t = this.generateKey(a);
    if (this.instanceMap.has(t))
      return this.instanceMap.get(t);
    const i = this.nextIndex++;
    return this.instanceMap.set(t, i), this.instances[i] = a, i;
  }
  /**
   * Gets the index of an instance by its unique key
   * Returns -1 if not found
   */
  getInstanceIndex(a) {
    var i;
    const t = this.generateKey(a);
    return (i = this.instanceMap.get(t)) != null ? i : -1;
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
    for (let t = 0; t < this.instances.length; t++)
      a[String(t)] = this.instances[t];
    return a;
  }
  /**
   * Reconstructs an InstanceTable from a serialized table object
   */
  static fromTable(a) {
    const t = new H(), i = Object.entries(a).sort(
      (o, r) => parseInt(o[0], 10) - parseInt(r[0], 10)
    );
    for (const [o, r] of i) {
      const n = parseInt(o, 10), s = t.generateKey(r);
      t.instanceMap.set(s, n), t.instances[n] = r, t.nextIndex = Math.max(t.nextIndex, n + 1);
    }
    return t;
  }
  /**
   * Gets the total number of instances in the table
   */
  getSize() {
    return this.instances.length;
  }
}
function W(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    a += W(t);
  }), a;
}
async function U(e, a = /* @__PURE__ */ new WeakSet(), t = {}) {
  var y, f, w, A, C;
  if (!e || typeof e != "object")
    return e;
  const i = (y = t.maxNodes) != null ? y : 1e4, o = (f = t.nodeCount) != null ? f : 0;
  if (o >= i)
    return await g.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  const r = {
    visited: (w = t.visited) != null ? w : /* @__PURE__ */ new WeakSet(),
    depth: (A = t.depth) != null ? A : 0,
    maxDepth: (C = t.maxDepth) != null ? C : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: t.variableTable,
    collectionTable: t.collectionTable,
    instanceTable: t.instanceTable
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), r.visited = a;
  const n = {}, s = await Re(e, r);
  Object.assign(n, s);
  const c = e.type;
  if (c)
    switch (c) {
      case "FRAME":
      case "COMPONENT": {
        const m = await Z(e);
        Object.assign(n, m);
        break;
      }
      case "INSTANCE": {
        const m = await _e(
          e,
          r
        );
        Object.assign(n, m);
        const M = await Z(
          e
        );
        Object.assign(n, M);
        break;
      }
      case "TEXT": {
        const m = await Ee(e);
        Object.assign(n, m);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const m = await Me(e);
        Object.assign(n, m);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const m = await Pe(e);
        Object.assign(n, m);
        break;
      }
      default:
        r.unhandledKeys.add("_unknownType");
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
  for (const m of d)
    typeof e[m] != "function" && (l.has(m) || r.unhandledKeys.add(m));
  if (r.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(r.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const m = r.maxDepth;
    if (r.depth >= m)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${m}) reached`,
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
      const M = k(h({}, r), {
        depth: r.depth + 1
      }), p = [];
      let v = !1;
      for (const b of e.children) {
        if (M.nodeCount >= i) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: p.length,
            _total: e.children.length,
            children: p
          }, v = !0;
          break;
        }
        const P = await U(b, a, M);
        p.push(P), M.nodeCount && (r.nodeCount = M.nodeCount);
      }
      v || (n.children = p);
    }
  }
  return n;
}
async function Oe(e) {
  await g.clear(), await g.log("=== Starting Page Export ===");
  try {
    const a = e.pageIndex;
    if (a === void 0 || typeof a != "number")
      return await g.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await g.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const t = figma.root.children;
    if (await g.log(`Loaded ${t.length} page(s)`), a < 0 || a >= t.length)
      return await g.error(
        `Invalid page index: ${a} (valid range: 0-${t.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const i = t[a];
    await g.log(
      `Selected page: "${i.name}" (index: ${a})`
    ), await g.log(
      "Initializing variable, collection, and instance tables..."
    );
    const o = new F(), r = new B(), n = new H();
    await g.log("Fetching team library variable collections...");
    let s = [];
    try {
      if (s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((v) => ({
        libraryName: v.libraryName,
        key: v.key,
        name: v.name
      })), await g.log(
        `Found ${s.length} library collection(s) in team library`
      ), s.length > 0)
        for (const v of s)
          await g.log(`  - ${v.name} (from ${v.libraryName})`);
    } catch (p) {
      await g.warning(
        `Could not get library variable collections: ${p instanceof Error ? p.message : String(p)}`
      );
    }
    await g.log("Extracting node data from page..."), await g.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await g.log(
      "Collections will be discovered as variables are processed:"
    );
    const c = await U(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: r,
        instanceTable: n
      }
    );
    await g.log("Node extraction finished");
    const d = W(c), l = o.getSize(), y = r.getSize(), f = n.getSize();
    if (await g.log("Extraction complete:"), await g.log(`  - Total nodes: ${d}`), await g.log(`  - Unique variables: ${l}`), await g.log(`  - Unique collections: ${y}`), await g.log(`  - Unique instances: ${f}`), y > 0) {
      await g.log("Collections found:");
      const p = r.getTable();
      for (const [v, b] of Object.values(p).entries()) {
        const P = b.collectionGuid ? ` (GUID: ${b.collectionGuid.substring(0, 8)}...)` : "";
        await g.log(
          `  ${v}: ${b.collectionName}${P} - ${b.modes.length} mode(s)`
        );
      }
    }
    await g.log("Creating export data structure...");
    const w = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.6.0",
        // Updated version for instance table system
        figmaApiVersion: figma.apiVersion,
        originalPageName: i.name,
        totalNodes: d,
        pluginVersion: "1.0.0"
      },
      collections: r.getSerializedTable(),
      variables: o.getSerializedTable(),
      instances: n.getSerializedTable(),
      libraries: s,
      pageData: c
    };
    await g.log("Serializing to JSON...");
    const A = JSON.stringify(w, null, 2), C = (A.length / 1024).toFixed(2), m = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return await g.log(`JSON serialization complete: ${C} KB`), await g.log(`Export file: ${m}`), await g.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: m,
        jsonData: A,
        pageName: i.name,
        additionalPages: []
        // Will be populated when publishing referenced component pages
      }
    };
  } catch (a) {
    return await g.error(
      `Export failed: ${a instanceof Error ? a.message : "Unknown error occurred"}`
    ), a instanceof Error && a.stack && await g.error(`Stack trace: ${a.stack}`), console.error("Error exporting page:", a), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function te(e, a) {
  for (const t of a)
    e.modes.find((o) => o.name === t) || e.addMode(t);
}
const E = "recursica:collectionId";
async function O(e) {
  if (e.remote === !0) {
    const t = re[e.id];
    if (!t) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await g.error(o), new Error(o);
    }
    return t.guid;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      E
    );
    if (t && t.trim() !== "")
      return t;
    const i = await ie();
    return e.setSharedPluginData("recursica", E, i), i;
  }
}
function se(e, a) {
  if (a)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ce(e) {
  let a;
  const t = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && i.includes(t))
    try {
      const s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((c) => c.name.trim().toLowerCase() === t);
      if (s) {
        se(e.collectionName, !1);
        const c = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          s.key
        );
        if (c.length > 0) {
          const d = await figma.variables.importVariableByKeyAsync(c[0].key), l = await figma.variables.getVariableCollectionByIdAsync(
            d.variableCollectionId
          );
          if (l) {
            if (a = l, e.collectionGuid) {
              const y = a.getSharedPluginData(
                "recursica",
                E
              );
              (!y || y.trim() === "") && a.setSharedPluginData(
                "recursica",
                E,
                e.collectionGuid
              );
            } else
              await O(a);
            return await te(a, e.modes), { collection: a };
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
    if (e.collectionGuid && (s = n.find((c) => c.getSharedPluginData("recursica", E) === e.collectionGuid)), s || (s = n.find(
      (c) => c.name === e.collectionName
    )), s)
      if (a = s, e.collectionGuid) {
        const c = a.getSharedPluginData(
          "recursica",
          E
        );
        (!c || c.trim() === "") && a.setSharedPluginData(
          "recursica",
          E,
          e.collectionGuid
        );
      } else
        await O(a);
    else
      a = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? a.setSharedPluginData(
        "recursica",
        E,
        e.collectionGuid
      ) : await O(a);
  } else {
    const n = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), s = e.collectionName.trim().toLowerCase(), c = n.find((f) => f.name.trim().toLowerCase() === s);
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
    if (a = y, e.collectionGuid) {
      const f = a.getSharedPluginData(
        "recursica",
        E
      );
      (!f || f.trim() === "") && a.setSharedPluginData(
        "recursica",
        E,
        e.collectionGuid
      );
    } else
      O(a);
  }
  return await te(a, e.modes), { collection: a };
}
async function ze(e, a) {
  se(e, a);
  {
    const i = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (o) => o.name === e
    );
    return i || figma.variables.createVariableCollection(e);
  }
}
async function J(e, a) {
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
function $e(e, a) {
  const t = e.resolvedType.toUpperCase(), i = a.toUpperCase();
  return t !== i ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${t}" but expected "${i}". Skipping binding.`
  ), !1) : !0;
}
async function Ge(e, a, t, i, o) {
  for (const [r, n] of Object.entries(a)) {
    const s = i.modes.find((d) => d.name === r);
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
        const d = n;
        let l = null;
        const y = t.getVariableByIndex(
          d._varRef
        );
        if (y) {
          let f = null;
          if (o && y._colRef !== void 0) {
            const w = o.getCollectionByIndex(
              y._colRef
            );
            w && (f = (await ce(w)).collection);
          }
          f && (l = await J(
            f,
            y.variableName
          ));
        }
        if (l) {
          const f = {
            type: "VARIABLE_ALIAS",
            id: l.id
          };
          e.setValueForMode(c, f);
        } else
          console.warn(
            `Could not resolve variable alias for mode "${r}" in variable "${e.name}". Variable reference index: ${d._varRef}`
          );
      }
    } catch (d) {
      console.warn(
        `Error setting value for mode "${r}" in variable "${e.name}":`,
        d
      );
    }
  }
}
async function Be(e, a, t, i) {
  const o = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  return e.valuesByMode && await Ge(
    o,
    e.valuesByMode,
    t,
    a,
    // Pass collection to look up modes by name
    i
  ), o;
}
async function le(e, a, t) {
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
    const { collection: n } = await ce(r);
    let s = await J(n, i.variableName);
    return s ? $e(s, i.variableType) ? s : null : i.valuesByMode ? (s = await Be(
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
function Fe(e, a) {
  if (!a || !$(e))
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
async function Ue(e, a, t, i, o) {
  if (!(!a || typeof a != "object"))
    try {
      const r = e[t];
      if (!r || !Array.isArray(r))
        return;
      for (const [n, s] of Object.entries(a))
        if (n === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < r.length; c++) {
            const d = s[c];
            if ($(d) && i && o) {
              const l = await le(
                d,
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
          $(s) && (c = Fe(s, i)), c && await Ke(e, n, c, i);
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${t}:`, r);
    }
}
async function Ke(e, a, t, i) {
  try {
    let o = null;
    if (i) {
      if (t.isLocal) {
        const r = await ze(
          t.collectionName || "",
          !0
        );
        o = await J(
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
function je(e, a) {
  const t = ve(a);
  if (e.visible === void 0 && (e.visible = t.visible), e.locked === void 0 && (e.locked = t.locked), e.opacity === void 0 && (e.opacity = t.opacity), e.rotation === void 0 && (e.rotation = t.rotation), e.blendMode === void 0 && (e.blendMode = t.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const i = x;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (a === "TEXT") {
    const i = N;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function D(e, a, t = null, i = null) {
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
    if (je(r, e.type || "FRAME"), e.name !== void 0 && (r.name = e.name || "Unnamed Node"), e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y), e.width !== void 0 && e.height !== void 0 && r.resize(e.width, e.height), e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (r.opacity = e.opacity), e.rotation !== void 0 && (r.rotation = e.rotation), e.blendMode !== void 0 && (r.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && t && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const c = {};
            for (const [d, l] of Object.entries(
              s.boundVariables
            ))
              c[d] = l;
            return k(h({}, s), { boundVariables: c });
          }
          return s;
        })), r.fills = n, (o = e.boundVariables) != null && o.fills && await Ue(
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
        if (n !== "fills" && $(s) && t && i) {
          const c = await le(
            s,
            t,
            i
          );
          if (c) {
            const d = {
              type: "VARIABLE_ALIAS",
              id: c.id
            };
            r.boundVariables || (r.boundVariables = {}), r.boundVariables[n] || (r.boundVariables[n] = d);
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
        const s = await D(
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
async function qe(e) {
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
        o = B.fromTable(a.collections), console.log(
          `Loaded collections table with ${o.getSize()} collections`
        );
      } catch (f) {
        console.warn("Failed to load collections table:", f);
      }
    let r = null;
    if (a.variables)
      try {
        r = F.fromTable(a.variables), console.log(
          `Loaded variable table with ${r.getSize()} variables`
        );
      } catch (f) {
        console.warn("Failed to load variable table:", f);
      }
    const n = "2.3.0", s = i.exportFormatVersion || "1.0.0";
    s !== n && console.warn(
      `Export format version mismatch: exported with ${s}, current version is ${n}. Import may have compatibility issues.`
    );
    const d = "Imported - " + (i.originalPageName ? i.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), l = figma.createPage();
    if (l.name = d, figma.root.appendChild(l), console.log("Created new page: " + d), console.log("Importing " + (i.totalNodes || "unknown") + " nodes"), t.children && Array.isArray(t.children)) {
      for (const f of t.children) {
        if (f._truncated) {
          console.log(
            `Skipping truncated children: ${f._reason || "Unknown"}`
          );
          continue;
        }
        await D(
          f,
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
async function He(e) {
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
    const o = await U(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + t + ")"
    );
    const r = JSON.stringify(o, null, 2), n = JSON.parse(r), s = "Copy - " + n.name, c = figma.createPage();
    if (c.name = s, figma.root.appendChild(c), n.children && n.children.length > 0) {
      let y = function(w) {
        w.forEach((A) => {
          const C = (A.x || 0) + (A.width || 0);
          C > f && (f = C), A.children && A.children.length > 0 && y(A.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let f = 0;
      y(n.children), console.log("Original content rightmost edge: " + f);
      for (const w of n.children)
        await D(w, c, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const d = W(n);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: n.name,
        newPageName: s,
        totalNodes: d
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
async function We(e) {
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
async function Je(e) {
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
async function De(e) {
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
async function Xe(e) {
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
function j(e, a = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: a
  };
}
function de(e, a, t = {}) {
  const i = a instanceof Error ? a.message : a;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: t
  };
}
function q(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const ue = "RecursicaPublishedMetadata";
async function Ye(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (s) => s.id === a.id
    ), o = a.getPluginData(ue);
    if (!o) {
      const d = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: q(a.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return j("getComponentMetadata", d);
    }
    const n = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return j("getComponentMetadata", n);
  } catch (a) {
    return console.error("Error getting component metadata:", a), de(
      "getComponentMetadata",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function Qe(e) {
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
      const r = o, n = r.getPluginData(ue);
      if (n)
        try {
          const s = JSON.parse(n);
          t.push(s);
        } catch (s) {
          console.warn(
            `Failed to parse metadata for page "${r.name}":`,
            s
          );
          const d = {
            _ver: 1,
            id: "",
            name: q(r.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          t.push(d);
        }
      else {
        const c = {
          _ver: 1,
          id: "",
          name: q(r.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        t.push(c);
      }
    }
    return j("getAllComponents", {
      components: t
    });
  } catch (a) {
    return console.error("Error getting all components:", a), de(
      "getAllComponents",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
const z = /* @__PURE__ */ new Map();
let Ze = 0;
function et() {
  return `prompt_${Date.now()}_${++Ze}`;
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
  prompt: (e, a) => {
    var s;
    const t = typeof a == "number" ? { timeoutMs: a } : a, i = (s = t == null ? void 0 : t.timeoutMs) != null ? s : 3e5, o = t == null ? void 0 : t.okLabel, r = t == null ? void 0 : t.cancelLabel, n = et();
    return new Promise((c, d) => {
      const l = i === -1 ? null : setTimeout(() => {
        z.delete(n), d(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      z.set(n, {
        resolve: c,
        reject: d,
        timeout: l
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: h(h({
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
    const { requestId: a, action: t } = e, i = z.get(a);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${a}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), z.delete(a), t === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
};
async function at(e) {
  try {
    const a = e.requestId, t = e.action;
    return !a || !t ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (tt.handleResponse({ requestId: a, action: t }), {
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
const it = {
  getCurrentUser: be,
  loadPages: he,
  exportPage: Oe,
  importPage: qe,
  quickCopy: He,
  storeAuthData: We,
  loadAuthData: Je,
  clearAuthData: De,
  storeSelectedRepo: Xe,
  getComponentMetadata: Ye,
  getAllComponents: Qe,
  pluginPromptResponse: at
}, rt = it;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Ie(e);
    return;
  }
  const a = e;
  try {
    const t = a.type, i = rt[t];
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
    figma.ui.postMessage(k(h({}, o), {
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
