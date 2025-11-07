var fe = Object.defineProperty, ge = Object.defineProperties;
var pe = Object.getOwnPropertyDescriptors;
var D = Object.getOwnPropertySymbols;
var me = Object.prototype.hasOwnProperty, ye = Object.prototype.propertyIsEnumerable;
var F = (e, a, t) => a in e ? fe(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t, h = (e, a) => {
  for (var t in a || (a = {}))
    me.call(a, t) && F(e, t, a[t]);
  if (D)
    for (var t of D(a))
      ye.call(a, t) && F(e, t, a[t]);
  return e;
}, R = (e, a) => ge(e, pe(a));
var E = (e, a, t) => F(e, typeof a != "symbol" ? a + "" : a, t);
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
const C = {
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
}, I = R(h({}, C), {
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
}), k = R(h({}, C), {
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
}), P = R(h({}, C), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), te = R(h({}, C), {
  cornerRadius: 0
}), ve = R(h({}, C), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function Ae(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return I;
    case "TEXT":
      return k;
    case "VECTOR":
      return P;
    case "LINE":
      return ve;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return te;
    default:
      return C;
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
class z {
  constructor() {
    E(this, "collectionMap");
    // collectionId -> index
    E(this, "collections");
    // index -> collection data
    E(this, "nextIndex");
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
    const t = new z(), i = Object.entries(a).sort(
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
class G {
  constructor() {
    E(this, "variableMap");
    // variableKey -> index
    E(this, "variables");
    // index -> variable data
    E(this, "nextIndex");
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
    const t = new G(), i = Object.entries(a).sort(
      (r, n) => parseInt(r[0], 10) - parseInt(n[0], 10)
    );
    for (const [r, n] of i) {
      const s = parseInt(r, 10);
      n.variableKey && t.variableMap.set(n.variableKey, s);
      const c = R(h({}, n), {
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
function O(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let xe = 0;
const T = /* @__PURE__ */ new Map();
function Ie(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = T.get(e.requestId);
  a && (T.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function ae() {
  return new Promise((e, a) => {
    const t = `guid_${Date.now()}_${++xe}`;
    T.set(t, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: t
    }), setTimeout(() => {
      T.has(t) && (T.delete(t), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const ie = {
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
async function L() {
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
    }), await L();
  },
  log: async (e) => {
    console.log(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await L();
  },
  warning: async (e) => {
    console.warn(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await L();
  },
  error: async (e) => {
    console.error(e), figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await L();
  }
};
function Ce(e, a) {
  const t = a.modes.find((i) => i.modeId === e);
  return t ? t.name : e;
}
async function re(e, a, t, i, o = /* @__PURE__ */ new Set()) {
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
      const m = new Set(o);
      m.add(d);
      const f = await figma.variables.getVariableCollectionByIdAsync(
        l.variableCollectionId
      ), b = l.key;
      if (!b) {
        r[c] = {
          type: "VARIABLE_ALIAS",
          id: d
        };
        continue;
      }
      const w = {
        variableName: l.name,
        variableType: l.resolvedType,
        collectionName: f == null ? void 0 : f.name,
        collectionId: l.variableCollectionId,
        variableKey: b,
        id: d,
        isLocal: !l.remote
      };
      if (f) {
        const v = await oe(
          f,
          t
        );
        w._colRef = v, l.valuesByMode && (w.valuesByMode = await re(
          l.valuesByMode,
          a,
          t,
          f,
          // Pass collection for mode ID to name conversion
          m
        ));
      }
      const x = a.addVariable(w);
      r[c] = {
        type: "VARIABLE_ALIAS",
        id: d,
        _varRef: x
      };
    } else
      r[c] = s;
  }
  return r;
}
const X = "recursica:collectionId";
async function Ne(e) {
  if (e.remote === !0) {
    const t = ie[e.id];
    if (!t) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await g.error(o), new Error(o);
    }
    return t.guid;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      X
    );
    if (t && t.trim() !== "")
      return t;
    const i = await ae();
    return e.setSharedPluginData("recursica", X, i), i;
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
async function oe(e, a) {
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
    const n = await oe(
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
    return we(c);
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
async function ke(e, a, t) {
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
async function Re(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (t.type = e.type, i.add("type")), e.id && (t.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (t.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (t.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (t.y = e.y, i.add("y")), e.width !== void 0 && (t.width = e.width, i.add("width")), e.height !== void 0 && (t.height = e.height, i.add("height")), e.visible !== void 0 && u(e.visible, C.visible) && (t.visible = e.visible, i.add("visible")), e.locked !== void 0 && u(e.locked, C.locked) && (t.locked = e.locked, i.add("locked")), e.opacity !== void 0 && u(e.opacity, C.opacity) && (t.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && u(e.rotation, C.rotation) && (t.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && u(e.blendMode, C.blendMode) && (t.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && u(e.effects, C.effects) && (t.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await ke(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    u(o, C.fills) && (t.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && u(e.strokes, C.strokes) && (t.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && u(e.strokeWeight, C.strokeWeight) && (t.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && u(e.strokeAlign, C.strokeAlign) && (t.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
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
  return e.layoutMode !== void 0 && u(e.layoutMode, I.layoutMode) && (t.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && u(
    e.primaryAxisSizingMode,
    I.primaryAxisSizingMode
  ) && (t.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && u(
    e.counterAxisSizingMode,
    I.counterAxisSizingMode
  ) && (t.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && u(
    e.primaryAxisAlignItems,
    I.primaryAxisAlignItems
  ) && (t.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && u(
    e.counterAxisAlignItems,
    I.counterAxisAlignItems
  ) && (t.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && u(e.paddingLeft, I.paddingLeft) && (t.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && u(e.paddingRight, I.paddingRight) && (t.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && u(e.paddingTop, I.paddingTop) && (t.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && u(e.paddingBottom, I.paddingBottom) && (t.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && u(e.itemSpacing, I.itemSpacing) && (t.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && u(e.cornerRadius, I.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && u(e.clipsContent, I.clipsContent) && (t.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && u(e.layoutWrap, I.layoutWrap) && (t.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && u(e.layoutGrow, I.layoutGrow) && (t.layoutGrow = e.layoutGrow, i.add("layoutGrow")), t;
}
async function Ee(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (t.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (t.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (t.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && u(
    e.textAlignHorizontal,
    k.textAlignHorizontal
  ) && (t.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && u(
    e.textAlignVertical,
    k.textAlignVertical
  ) && (t.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && u(e.letterSpacing, k.letterSpacing) && (t.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && u(e.lineHeight, k.lineHeight) && (t.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && u(e.textCase, k.textCase) && (t.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && u(e.textDecoration, k.textDecoration) && (t.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && u(e.textAutoResize, k.textAutoResize) && (t.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && u(
    e.paragraphSpacing,
    k.paragraphSpacing
  ) && (t.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && u(e.paragraphIndent, k.paragraphIndent) && (t.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && u(e.listOptions, k.listOptions) && (t.listOptions = e.listOptions, i.add("listOptions")), t;
}
async function Me(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && u(e.fillGeometry, P.fillGeometry) && (t.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && u(e.strokeGeometry, P.strokeGeometry) && (t.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && u(e.strokeCap, P.strokeCap) && (t.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && u(e.strokeJoin, P.strokeJoin) && (t.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && u(e.dashPattern, P.dashPattern) && (t.dashPattern = e.dashPattern, i.add("dashPattern")), t;
}
async function Pe(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && u(e.cornerRadius, te.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (t.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), t;
}
const Te = "RecursicaPublishedMetadata";
function Z(e) {
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
async function Ve(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (t._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (!o)
        return t;
      const r = e.name || "(unnamed)", n = o.name || "(unnamed)", s = o.remote === !0, c = Z(e), d = Z(o);
      let l;
      s ? l = "remote" : d && c && d.id === c.id ? l = "internal" : (d && c && (d.id, c.id), l = "normal");
      let m, f;
      try {
        e.variantProperties && (m = e.variantProperties), e.componentProperties && (f = e.componentProperties);
      } catch (A) {
      }
      let b, w;
      try {
        let A = o.parent;
        const y = [];
        let p = 0;
        const S = 20;
        for (; A && p < S; )
          try {
            const N = A.type, J = A.name;
            if (N === "COMPONENT_SET" && !w && (w = J), N === "PAGE")
              break;
            const ue = J || "";
            y.unshift(ue), A = A.parent, p++;
          } catch (N) {
            break;
          }
        b = y;
      } catch (A) {
      }
      const x = h(h(h(h({
        instanceType: l,
        componentName: n,
        componentType: o.type
      }, w && { componentSetName: w }), m && { variantProperties: m }), f && { componentProperties: f }), l === "normal" ? { path: b || [] } : b && b.length > 0 && {
        path: b
      });
      if (l === "internal")
        x.componentNodeId = o.id, await g.log(
          `  Found INSTANCE: "${r}" -> INTERNAL component "${n}" (ID: ${o.id.substring(0, 8)}...)`
        );
      else if (l === "normal") {
        if (d) {
          const y = Le(d);
          y != null && y.id && y.version !== void 0 && (x.componentGuid = y.id, x.componentVersion = y.version, x.componentPageName = d.name);
        }
        b === void 0 && console.warn(
          `Failed to build path for normal instance "${r}" -> component "${n}". Path is required for resolution.`
        );
        const A = b && b.length > 0 ? ` at path [${b.join(" → ")}]` : " at page root";
        await g.log(
          `  Found INSTANCE: "${r}" -> NORMAL component "${n}" (ID: ${o.id.substring(0, 8)}...)${A}`
        );
      } else if (l === "remote") {
        let A, y;
        try {
          if (typeof o.getPublishStatusAsync == "function")
            try {
              const p = await o.getPublishStatusAsync();
              p && typeof p == "object" && (p.libraryName && (A = p.libraryName), p.libraryKey && (y = p.libraryKey));
            } catch (p) {
            }
          try {
            const p = figma.teamLibrary;
            if (typeof (p == null ? void 0 : p.getAvailableLibraryComponentSetsAsync) == "function") {
              const S = await p.getAvailableLibraryComponentSetsAsync();
              if (S && Array.isArray(S)) {
                for (const N of S)
                  if (N.key === o.key || N.name === o.name) {
                    N.libraryName && (A = N.libraryName), N.libraryKey && (y = N.libraryKey);
                    break;
                  }
              }
            }
          } catch (p) {
          }
          try {
            x.structure = await B(
              o,
              /* @__PURE__ */ new WeakSet(),
              a
            );
          } catch (p) {
            console.warn(
              `Failed to extract structure for remote component "${n}":`,
              p
            );
          }
        } catch (p) {
          console.warn(
            `Error getting library info for remote component "${n}":`,
            p
          );
        }
        A && (x.remoteLibraryName = A), y && (x.remoteLibraryKey = y), await g.log(
          `  Found INSTANCE: "${r}" -> REMOTE component "${n}" (ID: ${o.id.substring(0, 8)}...)`
        );
      }
      const v = a.instanceTable.addInstance(x);
      t._instanceRef = v, i.add("_instanceRef");
    } catch (o) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        o
      );
    }
  return t;
}
class j {
  constructor() {
    E(this, "instanceMap");
    // unique key -> index
    E(this, "instances");
    // index -> instance data
    E(this, "nextIndex");
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
    const t = new j(), i = Object.entries(a).sort(
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
function q(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    a += q(t);
  }), a;
}
async function B(e, a = /* @__PURE__ */ new WeakSet(), t = {}) {
  var m, f, b, w, x;
  if (!e || typeof e != "object")
    return e;
  const i = (m = t.maxNodes) != null ? m : 1e4, o = (f = t.nodeCount) != null ? f : 0;
  if (o >= i)
    return await g.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  const r = {
    visited: (b = t.visited) != null ? b : /* @__PURE__ */ new WeakSet(),
    depth: (w = t.depth) != null ? w : 0,
    maxDepth: (x = t.maxDepth) != null ? x : 100,
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
        const v = await Q(e);
        Object.assign(n, v);
        break;
      }
      case "INSTANCE": {
        const v = await Ve(
          e,
          r
        );
        Object.assign(n, v);
        const A = await Q(
          e
        );
        Object.assign(n, A);
        break;
      }
      case "TEXT": {
        const v = await Ee(e);
        Object.assign(n, v);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const v = await Me(e);
        Object.assign(n, v);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const v = await Pe(e);
        Object.assign(n, v);
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
  for (const v of d)
    typeof e[v] != "function" && (l.has(v) || r.unhandledKeys.add(v));
  if (r.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(r.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const v = r.maxDepth;
    if (r.depth >= v)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${v}) reached`,
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
      const A = R(h({}, r), {
        depth: r.depth + 1
      }), y = [];
      let p = !1;
      for (const S of e.children) {
        if (A.nodeCount >= i) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: y.length,
            _total: e.children.length,
            children: y
          }, p = !0;
          break;
        }
        const N = await B(S, a, A);
        y.push(N), A.nodeCount && (r.nodeCount = A.nodeCount);
      }
      p || (n.children = y);
    }
  }
  return n;
}
async function _e(e) {
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
    const o = new G(), r = new z(), n = new j();
    await g.log("Fetching team library variable collections...");
    let s = [];
    try {
      if (s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((p) => ({
        libraryName: p.libraryName,
        key: p.key,
        name: p.name
      })), await g.log(
        `Found ${s.length} library collection(s) in team library`
      ), s.length > 0)
        for (const p of s)
          await g.log(`  - ${p.name} (from ${p.libraryName})`);
    } catch (y) {
      await g.warning(
        `Could not get library variable collections: ${y instanceof Error ? y.message : String(y)}`
      );
    }
    await g.log("Extracting node data from page..."), await g.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    ), await g.log(
      "Collections will be discovered as variables are processed:"
    );
    const c = await B(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: r,
        instanceTable: n
      }
    );
    await g.log("Node extraction finished");
    const d = q(c), l = o.getSize(), m = r.getSize(), f = n.getSize();
    if (await g.log("Extraction complete:"), await g.log(`  - Total nodes: ${d}`), await g.log(`  - Unique variables: ${l}`), await g.log(`  - Unique collections: ${m}`), await g.log(`  - Unique instances: ${f}`), m > 0) {
      await g.log("Collections found:");
      const y = r.getTable();
      for (const [p, S] of Object.values(y).entries()) {
        const N = S.collectionGuid ? ` (GUID: ${S.collectionGuid.substring(0, 8)}...)` : "";
        await g.log(
          `  ${p}: ${S.collectionName}${N} - ${S.modes.length} mode(s)`
        );
      }
    }
    await g.log("Creating export data structure...");
    const b = {
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
    const w = JSON.stringify(b, null, 2), x = (w.length / 1024).toFixed(2), v = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return await g.log(`JSON serialization complete: ${x} KB`), await g.log(`Export file: ${v}`), await g.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: v,
        jsonData: w,
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
async function ee(e, a) {
  for (const t of a)
    e.modes.find((o) => o.name === t) || e.addMode(t);
}
const M = "recursica:collectionId";
async function V(e) {
  if (e.remote === !0) {
    const t = ie[e.id];
    if (!t) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await g.error(o), new Error(o);
    }
    return t.guid;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      M
    );
    if (t && t.trim() !== "")
      return t;
    const i = await ae();
    return e.setSharedPluginData("recursica", M, i), i;
  }
}
function ne(e, a) {
  if (a)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function se(e) {
  let a;
  const t = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && i.includes(t))
    try {
      const s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((c) => c.name.trim().toLowerCase() === t);
      if (s) {
        ne(e.collectionName, !1);
        const c = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          s.key
        );
        if (c.length > 0) {
          const d = await figma.variables.importVariableByKeyAsync(c[0].key), l = await figma.variables.getVariableCollectionByIdAsync(
            d.variableCollectionId
          );
          if (l) {
            if (a = l, e.collectionGuid) {
              const m = a.getSharedPluginData(
                "recursica",
                M
              );
              (!m || m.trim() === "") && a.setSharedPluginData(
                "recursica",
                M,
                e.collectionGuid
              );
            } else
              await V(a);
            return await ee(a, e.modes), { collection: a };
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
    if (e.collectionGuid && (s = n.find((c) => c.getSharedPluginData("recursica", M) === e.collectionGuid)), s || (s = n.find(
      (c) => c.name === e.collectionName
    )), s)
      if (a = s, e.collectionGuid) {
        const c = a.getSharedPluginData(
          "recursica",
          M
        );
        (!c || c.trim() === "") && a.setSharedPluginData(
          "recursica",
          M,
          e.collectionGuid
        );
      } else
        await V(a);
    else
      a = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? a.setSharedPluginData(
        "recursica",
        M,
        e.collectionGuid
      ) : await V(a);
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
    ), m = await figma.variables.getVariableCollectionByIdAsync(
      l.variableCollectionId
    );
    if (!m)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (a = m, e.collectionGuid) {
      const f = a.getSharedPluginData(
        "recursica",
        M
      );
      (!f || f.trim() === "") && a.setSharedPluginData(
        "recursica",
        M,
        e.collectionGuid
      );
    } else
      V(a);
  }
  return await ee(a, e.modes), { collection: a };
}
async function Oe(e, a) {
  ne(e, a);
  {
    const i = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (o) => o.name === e
    );
    return i || figma.variables.createVariableCollection(e);
  }
}
async function H(e, a) {
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
async function ze(e, a, t, i, o) {
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
        const m = t.getVariableByIndex(
          d._varRef
        );
        if (m) {
          let f = null;
          if (o && m._colRef !== void 0) {
            const b = o.getCollectionByIndex(
              m._colRef
            );
            b && (f = (await se(b)).collection);
          }
          f && (l = await H(
            f,
            m.variableName
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
async function Ge(e, a, t, i) {
  const o = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  return e.valuesByMode && await ze(
    o,
    e.valuesByMode,
    t,
    a,
    // Pass collection to look up modes by name
    i
  ), o;
}
async function ce(e, a, t) {
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
    const { collection: n } = await se(r);
    let s = await H(n, i.variableName);
    return s ? $e(s, i.variableType) ? s : null : i.valuesByMode ? (s = await Ge(
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
function Be(e, a) {
  if (!a || !O(e))
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
async function Fe(e, a, t, i, o) {
  if (!(!a || typeof a != "object"))
    try {
      const r = e[t];
      if (!r || !Array.isArray(r))
        return;
      for (const [n, s] of Object.entries(a))
        if (n === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < r.length; c++) {
            const d = s[c];
            if (O(d) && i && o) {
              const l = await ce(
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
          O(s) && (c = Be(s, i)), c && await Ue(e, n, c, i);
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${t}:`, r);
    }
}
async function Ue(e, a, t, i) {
  try {
    let o = null;
    if (i) {
      if (t.isLocal) {
        const r = await Oe(
          t.collectionName || "",
          !0
        );
        o = await H(
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
function Ke(e, a) {
  const t = Ae(a);
  if (e.visible === void 0 && (e.visible = t.visible), e.locked === void 0 && (e.locked = t.locked), e.opacity === void 0 && (e.opacity = t.opacity), e.rotation === void 0 && (e.rotation = t.rotation), e.blendMode === void 0 && (e.blendMode = t.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const i = I;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (a === "TEXT") {
    const i = k;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function W(e, a, t = null, i = null) {
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
    if (Ke(r, e.type || "FRAME"), e.name !== void 0 && (r.name = e.name || "Unnamed Node"), e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y), e.width !== void 0 && e.height !== void 0 && r.resize(e.width, e.height), e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (r.opacity = e.opacity), e.rotation !== void 0 && (r.rotation = e.rotation), e.blendMode !== void 0 && (r.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && t && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const c = {};
            for (const [d, l] of Object.entries(
              s.boundVariables
            ))
              c[d] = l;
            return R(h({}, s), { boundVariables: c });
          }
          return s;
        })), r.fills = n, (o = e.boundVariables) != null && o.fills && await Fe(
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
        if (n !== "fills" && O(s) && t && i) {
          const c = await ce(
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
        const s = await W(
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
async function je(e) {
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
        o = z.fromTable(a.collections), console.log(
          `Loaded collections table with ${o.getSize()} collections`
        );
      } catch (f) {
        console.warn("Failed to load collections table:", f);
      }
    let r = null;
    if (a.variables)
      try {
        r = G.fromTable(a.variables), console.log(
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
        await W(
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
async function qe(e) {
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
    const o = await B(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + t + ")"
    );
    const r = JSON.stringify(o, null, 2), n = JSON.parse(r), s = "Copy - " + n.name, c = figma.createPage();
    if (c.name = s, figma.root.appendChild(c), n.children && n.children.length > 0) {
      let m = function(b) {
        b.forEach((w) => {
          const x = (w.x || 0) + (w.width || 0);
          x > f && (f = x), w.children && w.children.length > 0 && m(w.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let f = 0;
      m(n.children), console.log("Original content rightmost edge: " + f);
      for (const b of n.children)
        await W(b, c, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const d = q(n);
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
async function He(e) {
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
async function We(e) {
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
async function Je(e) {
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
async function De(e) {
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
function U(e, a = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: a
  };
}
function le(e, a, t = {}) {
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
const de = "RecursicaPublishedMetadata";
async function Xe(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (s) => s.id === a.id
    ), o = a.getPluginData(de);
    if (!o) {
      const d = {
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
      return U("getComponentMetadata", d);
    }
    const n = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return U("getComponentMetadata", n);
  } catch (a) {
    return console.error("Error getting component metadata:", a), le(
      "getComponentMetadata",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
async function Ye(e) {
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
      const r = o, n = r.getPluginData(de);
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
            name: K(r.name),
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
          name: K(r.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        t.push(c);
      }
    }
    return U("getAllComponents", {
      components: t
    });
  } catch (a) {
    return console.error("Error getting all components:", a), le(
      "getAllComponents",
      a instanceof Error ? a : "Unknown error occurred"
    );
  }
}
const _ = /* @__PURE__ */ new Map();
let Qe = 0;
function Ze() {
  return `prompt_${Date.now()}_${++Qe}`;
}
const et = {
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
    const t = typeof a == "number" ? { timeoutMs: a } : a, i = (s = t == null ? void 0 : t.timeoutMs) != null ? s : 3e5, o = t == null ? void 0 : t.okLabel, r = t == null ? void 0 : t.cancelLabel, n = Ze();
    return new Promise((c, d) => {
      const l = i === -1 ? null : setTimeout(() => {
        _.delete(n), d(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      _.set(n, {
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
async function tt(e) {
  try {
    const a = e.requestId, t = e.action;
    return !a || !t ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (et.handleResponse({ requestId: a, action: t }), {
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
const at = {
  getCurrentUser: be,
  loadPages: he,
  exportPage: _e,
  importPage: je,
  quickCopy: qe,
  storeAuthData: He,
  loadAuthData: We,
  clearAuthData: Je,
  storeSelectedRepo: De,
  getComponentMetadata: Xe,
  getAllComponents: Ye,
  pluginPromptResponse: tt
}, it = at;
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
    const t = a.type, i = it[t];
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
    figma.ui.postMessage(R(h({}, o), {
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
