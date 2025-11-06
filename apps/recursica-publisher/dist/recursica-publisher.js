var fe = Object.defineProperty, ge = Object.defineProperties;
var me = Object.getOwnPropertyDescriptors;
var W = Object.getOwnPropertySymbols;
var ye = Object.prototype.hasOwnProperty, be = Object.prototype.propertyIsEnumerable;
var U = (e, r, t) => r in e ? fe(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, w = (e, r) => {
  for (var t in r || (r = {}))
    ye.call(r, t) && U(e, t, r[t]);
  if (W)
    for (var t of W(r))
      be.call(r, t) && U(e, t, r[t]);
  return e;
}, N = (e, r) => ge(e, me(r));
var k = (e, r, t) => U(e, typeof r != "symbol" ? r + "" : r, t);
async function he(e) {
  var r;
  try {
    return {
      type: "getCurrentUser",
      success: !0,
      error: !1,
      message: "Current user retrieved successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        userId: ((r = figma.currentUser) == null ? void 0 : r.id) || null
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
async function Ae(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((o, a) => ({
          name: o.name,
          index: a
        }))
      }
    };
  } catch (r) {
    return console.error("Error loading pages:", r), {
      type: "loadPages",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
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
}, x = N(w({}, S), {
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
}), P = N(w({}, S), {
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
}), R = N(w({}, S), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), te = N(w({}, S), {
  cornerRadius: 0
}), ve = N(w({}, S), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function we(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return x;
    case "TEXT":
      return P;
    case "VECTOR":
      return R;
    case "LINE":
      return ve;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return te;
    default:
      return S;
  }
}
function g(e, r) {
  if (Array.isArray(e))
    return Array.isArray(r) ? e.length !== r.length || e.some((t, i) => g(t, r[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof r == "object" && r !== null) {
      const t = Object.keys(e), i = Object.keys(r);
      return t.length !== i.length ? !0 : t.some(
        (o) => !(o in r) || g(e[o], r[o])
      );
    }
    return !0;
  }
  return e !== r;
}
class G {
  constructor() {
    k(this, "collectionMap");
    // collectionId -> index
    k(this, "collections");
    // index -> collection data
    k(this, "nextIndex");
    this.collectionMap = /* @__PURE__ */ new Map(), this.collections = [], this.nextIndex = 0;
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(r) {
    const t = r.collectionId;
    if (this.collectionMap.has(t))
      return this.collectionMap.get(t);
    const i = this.nextIndex++;
    return this.collectionMap.set(t, i), this.collections[i] = r, i;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(r) {
    var t;
    return (t = this.collectionMap.get(r)) != null ? t : -1;
  }
  /**
   * Gets a collection entry by index
   */
  getCollectionByIndex(r) {
    return this.collections[r];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for internal operations (includes all fields)
   */
  getTable() {
    const r = {};
    for (let t = 0; t < this.collections.length; t++)
      r[String(t)] = this.collections[t];
    return r;
  }
  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: collectionId, isLocal (internal-only fields)
   * Keeps: collectionName, collectionGuid, modes
   */
  getSerializedTable() {
    const r = {};
    for (let t = 0; t < this.collections.length; t++) {
      const i = this.collections[t], o = w({
        collectionName: i.collectionName,
        modes: i.modes
      }, i.collectionGuid && { collectionGuid: i.collectionGuid });
      r[String(t)] = o;
    }
    return r;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   * Handles both new format (without collectionId/isLocal) and legacy format (with collectionId/isLocal)
   */
  static fromTable(r) {
    var o;
    const t = new G(), i = Object.entries(r).sort(
      (a, n) => parseInt(a[0], 10) - parseInt(n[0], 10)
    );
    for (const [a, n] of i) {
      const s = parseInt(a, 10), c = (o = n.isLocal) != null ? o : !0, u = n.collectionId || n.collectionGuid || `temp:${s}:${n.collectionName || "unknown"}`, l = w({
        collectionName: n.collectionName || "",
        collectionId: u,
        isLocal: c,
        modes: n.modes || []
      }, n.collectionGuid && {
        collectionGuid: n.collectionGuid
      });
      t.collectionMap.set(u, s), t.collections[s] = l, t.nextIndex = Math.max(
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
    k(this, "variableMap");
    // variableKey -> index
    k(this, "variables");
    // index -> variable data
    k(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(r) {
    const t = r.variableKey;
    if (!t)
      return -1;
    if (this.variableMap.has(t))
      return this.variableMap.get(t);
    const i = this.nextIndex++;
    return this.variableMap.set(t, i), this.variables[i] = r, i;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(r) {
    var t;
    return (t = this.variableMap.get(r)) != null ? t : -1;
  }
  /**
   * Gets a variable entry by index
   */
  getVariableByIndex(r) {
    return this.variables[r];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   * Includes all fields (for backward compatibility)
   */
  getTable() {
    const r = {};
    for (let t = 0; t < this.variables.length; t++)
      r[String(t)] = this.variables[t];
    return r;
  }
  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: variableKey, id, collectionName, collectionId, isLocal
   * Keeps: variableName, variableType, _colRef, valuesByMode, and legacy collectionRef
   */
  getSerializedTable() {
    const r = {};
    for (let t = 0; t < this.variables.length; t++) {
      const i = this.variables[t], o = w(w(w(w(w(w({
        variableName: i.variableName,
        variableType: i.variableType
      }, i._colRef !== void 0 && { _colRef: i._colRef }), i.valuesByMode && { valuesByMode: i.valuesByMode }), i._colRef === void 0 && i.collectionRef !== void 0 && {
        collectionRef: i.collectionRef
      }), i._colRef === void 0 && i.collectionName && { collectionName: i.collectionName }), i._colRef === void 0 && i.collectionId && { collectionId: i.collectionId }), i._colRef === void 0 && i.isLocal !== void 0 && { isLocal: i.isLocal });
      r[String(t)] = o;
    }
    return r;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   */
  static fromTable(r) {
    var o;
    const t = new B(), i = Object.entries(r).sort(
      (a, n) => parseInt(a[0], 10) - parseInt(n[0], 10)
    );
    for (const [a, n] of i) {
      const s = parseInt(a, 10);
      n.variableKey && t.variableMap.set(n.variableKey, s);
      const c = N(w({}, n), {
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
function Ce(e) {
  return {
    _varRef: e
  };
}
function z(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let xe = 0;
const M = /* @__PURE__ */ new Map();
function Se(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const r = M.get(e.requestId);
  r && (M.delete(e.requestId), e.error || !e.guid ? r.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : r.resolve(e.guid));
}
function ae() {
  return new Promise((e, r) => {
    const t = `guid_${Date.now()}_${++xe}`;
    M.set(t, { resolve: e, reject: r }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: t
    }), setTimeout(() => {
      M.has(t) && (M.delete(t), r(new Error("Timeout waiting for GUID from UI")));
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
async function T() {
  return new Promise((e) => setTimeout(e, 0));
}
const b = {
  clear: async () => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    }), await T();
  },
  log: async (e) => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    }), await T();
  },
  warning: async (e) => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    }), await T();
  },
  error: async (e) => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    }), await T();
  }
};
async function ie(e, r, t, i = /* @__PURE__ */ new Set()) {
  const o = {};
  for (const [a, n] of Object.entries(e)) {
    if (n == null) {
      o[a] = n;
      continue;
    }
    if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") {
      o[a] = n;
      continue;
    }
    if (typeof n == "object" && n !== null && "type" in n && n.type === "VARIABLE_ALIAS" && "id" in n) {
      const s = n.id;
      if (i.has(s)) {
        o[a] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      const c = await figma.variables.getVariableByIdAsync(s);
      if (!c) {
        o[a] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      const u = new Set(i);
      u.add(s);
      const l = await figma.variables.getVariableCollectionByIdAsync(
        c.variableCollectionId
      ), h = c.key;
      if (!h) {
        o[a] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      const A = {
        variableName: c.name,
        variableType: c.resolvedType,
        collectionName: l == null ? void 0 : l.name,
        collectionId: c.variableCollectionId,
        variableKey: h,
        id: s,
        isLocal: !c.remote
      }, d = await figma.variables.getVariableCollectionByIdAsync(
        c.variableCollectionId
      );
      if (d) {
        const m = await oe(
          d,
          t
        );
        A._colRef = m;
      }
      c.valuesByMode && (A.valuesByMode = await ie(
        c.valuesByMode,
        r,
        t,
        u
      ));
      const v = r.addVariable(A);
      o[a] = {
        type: "VARIABLE_ALIAS",
        id: s,
        _varRef: v
      };
    } else
      o[a] = n;
  }
  return o;
}
const J = "recursica:collectionId";
async function Ie(e) {
  if (e.remote === !0) {
    const t = re[e.id];
    if (!t) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await b.error(o), new Error(o);
    }
    return t.guid;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      J
    );
    if (t && t.trim() !== "")
      return t;
    const i = await ae();
    return e.setSharedPluginData("recursica", J, i), i;
  }
}
function Pe(e, r) {
  if (r)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function oe(e, r) {
  const t = !e.remote;
  Pe(e.name, t);
  const i = await Ie(e), o = e.modes.map((n) => n.name), a = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: t,
    modes: o,
    collectionGuid: i
  };
  return r.addCollection(a);
}
async function X(e, r, t) {
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
    const a = i.key;
    if (!a)
      return console.log("Variable missing key:", e.id), null;
    const n = await oe(
      o,
      t
    ), s = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: n,
      // Reference to collection table (v2.4.0+)
      variableKey: a,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (s.valuesByMode = await ie(
      i.valuesByMode,
      r,
      t,
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const c = r.addVariable(s);
    return Ce(c);
  } catch (i) {
    const o = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function $(e, r, t) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const a = e[o];
      if (a && typeof a == "object" && !Array.isArray(a))
        if (a.type === "VARIABLE_ALIAS") {
          const n = await X(
            a,
            r,
            t
          );
          n && (i[o] = n);
        } else
          i[o] = await $(
            a,
            r,
            t
          );
      else Array.isArray(a) ? i[o] = await Promise.all(
        a.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await X(
          n,
          r,
          t
        ) || n : n && typeof n == "object" ? await $(
          n,
          r,
          t
        ) : n)
      ) : i[o] = a;
    }
  return i;
}
async function Ne(e, r, t) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (a === "boundVariables" ? o[a] = await $(
          i[a],
          r,
          t
        ) : o[a] = i[a]);
      return o;
    })
  );
}
async function Ee(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (t.type = e.type, i.add("type")), e.id && (t.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (t.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (t.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (t.y = e.y, i.add("y")), e.width !== void 0 && (t.width = e.width, i.add("width")), e.height !== void 0 && (t.height = e.height, i.add("height")), e.visible !== void 0 && g(e.visible, S.visible) && (t.visible = e.visible, i.add("visible")), e.locked !== void 0 && g(e.locked, S.locked) && (t.locked = e.locked, i.add("locked")), e.opacity !== void 0 && g(e.opacity, S.opacity) && (t.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && g(e.rotation, S.rotation) && (t.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && g(e.blendMode, S.blendMode) && (t.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && g(e.effects, S.effects) && (t.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await Ne(
      e.fills,
      r.variableTable,
      r.collectionTable
    );
    g(o, S.fills) && (t.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && g(e.strokes, S.strokes) && (t.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && g(e.strokeWeight, S.strokeWeight) && (t.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && g(e.strokeAlign, S.strokeAlign) && (t.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await $(
      e.boundVariables,
      r.variableTable,
      r.collectionTable
    );
    Object.keys(o).length > 0 && (t.boundVariables = o), i.add("boundVariables");
  }
  return t;
}
async function Y(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && g(e.layoutMode, x.layoutMode) && (t.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && g(
    e.primaryAxisSizingMode,
    x.primaryAxisSizingMode
  ) && (t.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && g(
    e.counterAxisSizingMode,
    x.counterAxisSizingMode
  ) && (t.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && g(
    e.primaryAxisAlignItems,
    x.primaryAxisAlignItems
  ) && (t.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && g(
    e.counterAxisAlignItems,
    x.counterAxisAlignItems
  ) && (t.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && g(e.paddingLeft, x.paddingLeft) && (t.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && g(e.paddingRight, x.paddingRight) && (t.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && g(e.paddingTop, x.paddingTop) && (t.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && g(e.paddingBottom, x.paddingBottom) && (t.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && g(e.itemSpacing, x.itemSpacing) && (t.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && g(e.cornerRadius, x.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && g(e.clipsContent, x.clipsContent) && (t.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && g(e.layoutWrap, x.layoutWrap) && (t.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && g(e.layoutGrow, x.layoutGrow) && (t.layoutGrow = e.layoutGrow, i.add("layoutGrow")), t;
}
async function ke(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (t.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (t.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (t.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && g(
    e.textAlignHorizontal,
    P.textAlignHorizontal
  ) && (t.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && g(
    e.textAlignVertical,
    P.textAlignVertical
  ) && (t.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && g(e.letterSpacing, P.letterSpacing) && (t.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && g(e.lineHeight, P.lineHeight) && (t.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && g(e.textCase, P.textCase) && (t.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && g(e.textDecoration, P.textDecoration) && (t.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && g(e.textAutoResize, P.textAutoResize) && (t.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && g(
    e.paragraphSpacing,
    P.paragraphSpacing
  ) && (t.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && g(e.paragraphIndent, P.paragraphIndent) && (t.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && g(e.listOptions, P.listOptions) && (t.listOptions = e.listOptions, i.add("listOptions")), t;
}
async function Re(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && g(e.fillGeometry, R.fillGeometry) && (t.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && g(e.strokeGeometry, R.strokeGeometry) && (t.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && g(e.strokeCap, R.strokeCap) && (t.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && g(e.strokeJoin, R.strokeJoin) && (t.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && g(e.dashPattern, R.dashPattern) && (t.dashPattern = e.dashPattern, i.add("dashPattern")), t;
}
async function Me(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && g(e.cornerRadius, te.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (t.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), t;
}
function Le(e) {
  const r = [];
  let t = e.parent;
  try {
    for (; t; ) {
      let i, o, a;
      try {
        i = t.type, o = t.name, a = t.parent;
      } catch (n) {
        console.log(
          "Error accessing parent node properties in buildParentPath:",
          n
        );
        break;
      }
      if (i === "PAGE" || !a)
        break;
      o && o.trim() !== "" && r.unshift(o), t = a;
    }
  } catch (i) {
    console.log("Error during parent path traversal:", i);
  }
  return r.join("/");
}
async function Ve(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (t._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (o) {
        const a = {};
        try {
          a.instanceNodeName = e.name, a.instanceNodeId = e.id, a.instanceNodeType = e.type, a.componentName = o.name, a.componentType = o.type, a.componentId = o.id;
          try {
            a.componentKey = o.key;
          } catch (p) {
            a.componentKey = "(cannot access)";
          }
          try {
            a.componentRemote = o.remote;
          } catch (p) {
            a.componentRemote = "(cannot access)";
          }
          let d = [];
          try {
            d = Object.getOwnPropertyNames(o), a.ownProperties = d;
          } catch (p) {
            a.ownProperties = "(cannot access)";
          }
          const v = [];
          try {
            let p = Object.getPrototypeOf(o);
            for (; p && p !== Object.prototype; )
              v.push(
                ...Object.getOwnPropertyNames(p).filter(
                  (C) => !v.includes(C)
                )
              ), p = Object.getPrototypeOf(p);
            a.prototypeProperties = v;
          } catch (p) {
            a.prototypeProperties = "(cannot access)";
          }
          let m = [];
          try {
            m = Object.keys(o), a.enumerableProperties = m;
          } catch (p) {
            a.enumerableProperties = "(cannot access)";
          }
          const y = [];
          try {
            for (const p of [...d, ...v])
              if (!(p === "instances" || p === "children" || p === "parent"))
                try {
                  typeof o[p] == "function" && y.push(p);
                } catch (C) {
                }
            a.availableMethods = y;
          } catch (p) {
            a.availableMethods = "(cannot access)";
          }
          const f = [];
          try {
            for (const p of [...d, ...v])
              (p.toLowerCase().includes("library") || p.toLowerCase().includes("remote") || p.toLowerCase().includes("file")) && f.push(p);
            a.libraryRelatedProperties = f;
          } catch (p) {
            a.libraryRelatedProperties = "(cannot access)";
          }
          try {
            o.remote !== void 0 && (a.remoteValue = o.remote);
          } catch (p) {
          }
          try {
            o.libraryName !== void 0 && (a.libraryNameValue = o.libraryName);
          } catch (p) {
          }
          try {
            o.libraryKey !== void 0 && (a.libraryKeyValue = o.libraryKey);
          } catch (p) {
          }
          try {
            if (o.parent !== void 0) {
              const p = o.parent;
              if (p) {
                a.mainComponentHasParent = !0;
                try {
                  a.mainComponentParentType = p.type, a.mainComponentParentName = p.name, a.mainComponentParentId = p.id;
                } catch (C) {
                  a.mainComponentParentAccessError = String(C);
                }
              } else
                a.mainComponentHasParent = !1;
            } else
              a.mainComponentParentUndefined = !0;
          } catch (p) {
            a.mainComponentParentCheckError = String(p);
          }
          try {
            o.variantProperties !== void 0 && (a.mainComponentVariantProperties = o.variantProperties);
          } catch (p) {
          }
          try {
            o.componentPropertyDefinitions !== void 0 && (a.mainComponentPropertyDefinitions = Object.keys(
              o.componentPropertyDefinitions
            ));
          } catch (p) {
          }
        } catch (d) {
          a.debugError = String(d);
        }
        let n, s;
        try {
          e.variantProperties && (n = e.variantProperties, a.instanceVariantProperties = n), e.componentProperties && (s = e.componentProperties, a.instanceComponentProperties = s);
        } catch (d) {
          a.propertiesError = String(d);
        }
        let c, u;
        const l = [];
        try {
          let d = o.parent;
          const v = [];
          let m = 0;
          const y = 20;
          if (d)
            try {
              if (a.mainComponentParentExists = !0, a.mainComponentParentType = d.type, a.mainComponentParentName = d.name, a.mainComponentParentId = d.id, d.type === "COMPONENT_SET")
                try {
                  const f = d.parent;
                  if (f === null)
                    a.componentSetParentIsNull = !0;
                  else if (f === void 0)
                    a.componentSetParentIsUndefined = !0;
                  else {
                    a.componentSetParentExists = !0;
                    try {
                      a.componentSetParentType = f.type, a.componentSetParentName = f.name;
                    } catch (p) {
                      a.componentSetParentPropertyAccessError = String(p);
                    }
                  }
                } catch (f) {
                  a.componentSetParentCheckError = String(f);
                }
            } catch (f) {
              a.mainComponentParentDebugError = String(f);
            }
          else
            a.mainComponentParentExists = !1;
          for (; d && m < y; )
            try {
              const f = d.type, p = d.name;
              if (l.push(
                `${f}:${p || "(unnamed)"}`
              ), f === "COMPONENT_SET" && !u && (u = p, a.componentSetName = p, a.componentSetFound = !0), f === "PAGE")
                break;
              p && p.trim() !== "" && v.unshift(p);
              let C, V = !1;
              try {
                "parent" in d ? (V = !0, a[`hasParentPropertyAtDepth${m}`] = !0, C = d.parent, C === null ? a[`parentIsNullAtDepth${m}`] = !0 : C === void 0 ? a[`parentIsUndefinedAtDepth${m}`] = !0 : a[`parentExistsAtDepth${m}`] = !0) : a[`noParentPropertyAtDepth${m}`] = !0;
              } catch (I) {
                a.parentAccessErrorAtDepth = m, a.parentAccessError = String(I), a.parentAccessErrorName = I instanceof Error ? I.name : "Unknown", a.parentAccessErrorMessage = I instanceof Error ? I.message : String(I);
                break;
              }
              if (!C) {
                a.noParentAtDepth = m, a.parentAccessAttemptedAtDepth = V;
                break;
              }
              try {
                const I = C.type, ue = C.name;
                a[`parentAtDepth${m + 1}Type`] = I, a[`parentAtDepth${m + 1}Name`] = ue;
              } catch (I) {
                a.nextParentAccessErrorAtDepth = m, a.nextParentAccessError = String(I);
              }
              d = C, m++;
            } catch (f) {
              a.parentTraverseErrorAtDepth = m, a.parentTraverseError = String(f), a.parentTraverseErrorName = f instanceof Error ? f.name : "Unknown", a.parentTraverseErrorMessage = f instanceof Error ? f.message : String(f);
              break;
            }
          c = v.join("/"), a.mainComponentParentChain = l, a.mainComponentParentChainDepth = m, a.mainComponentParentPath = c, a.mainComponentParentPathParts = v;
        } catch (d) {
          a.mainComponentParentPathError = String(d);
        }
        const h = Le(e);
        if (a.instanceParentPath = h, t.mainComponent = {
          id: o.id,
          name: o.name,
          key: o.key,
          // Component key for reference
          type: o.type
        }, u && (t.mainComponent.componentSetName = u), n && (t.mainComponent.variantProperties = n), s && (t.mainComponent.componentProperties = s), c && (t.mainComponent._path = c), h && (t.mainComponent._instancePath = h), o.remote === !0) {
          t.mainComponent.remote = !0;
          try {
            if (typeof o.getPublishStatusAsync == "function")
              try {
                const d = await o.getPublishStatusAsync();
                if (d && (a.publishStatus = d, d && typeof d == "object")) {
                  d.libraryName && (t.mainComponent.libraryName = d.libraryName), d.libraryKey && (t.mainComponent.libraryKey = d.libraryKey), d.fileKey && (t.mainComponent.fileKey = d.fileKey);
                  const v = {};
                  Object.keys(d).forEach((m) => {
                    (m.toLowerCase().includes("library") || m.toLowerCase().includes("file")) && (v[m] = d[m]);
                  }), Object.keys(v).length > 0 && (a.libraryRelatedFromPublishStatus = v);
                }
              } catch (d) {
                a.publishStatusError = String(d);
              }
            try {
              const d = figma.teamLibrary, v = Object.getOwnPropertyNames(
                d
              ).filter((m) => typeof d[m] == "function");
              if (a.teamLibraryAvailableMethods = v, typeof (d == null ? void 0 : d.getAvailableLibraryComponentSetsAsync) == "function") {
                const m = await d.getAvailableLibraryComponentSetsAsync();
                if (a.availableComponentSetsCount = (m == null ? void 0 : m.length) || 0, m && Array.isArray(m)) {
                  const y = [];
                  for (const f of m)
                    try {
                      const p = {
                        name: f.name,
                        key: f.key,
                        libraryName: f.libraryName,
                        libraryKey: f.libraryKey
                      };
                      if (y.push(p), f.key === o.key || f.name === o.name) {
                        a.matchingComponentSet = p, f.libraryName && (t.mainComponent.libraryName = f.libraryName), f.libraryKey && (t.mainComponent.libraryKey = f.libraryKey);
                        break;
                      }
                    } catch (p) {
                      y.push({
                        error: String(p)
                      });
                    }
                  a.componentSets = y;
                }
              } else
                a.componentSetsApiNote = "getAvailableLibraryComponentSetsAsync not available";
            } catch (d) {
              a.teamLibrarySearchError = String(d);
            }
            try {
              const d = await figma.importComponentByKeyAsync(
                o.key
              );
              d && (a.importedComponentInfo = {
                id: d.id,
                name: d.name,
                type: d.type,
                remote: d.remote
              }, d.libraryName && (t.mainComponent.libraryName = d.libraryName, a.importedComponentLibraryName = d.libraryName), d.libraryKey && (t.mainComponent.libraryKey = d.libraryKey, a.importedComponentLibraryKey = d.libraryKey));
            } catch (d) {
              a.importComponentError = String(d);
            }
          } catch (d) {
            a.libraryInfoError = String(d);
          }
        }
        Object.keys(a).length > 0 && (t.mainComponent._debug = a), i.add("mainComponent");
      }
    } catch (o) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        o
      );
    }
  return t;
}
function D(e) {
  let r = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    r += D(t);
  }), r;
}
async function q(e, r = /* @__PURE__ */ new WeakSet(), t = {}) {
  var h, A, d, v, m;
  if (!e || typeof e != "object")
    return e;
  const i = (h = t.maxNodes) != null ? h : 1e4, o = (A = t.nodeCount) != null ? A : 0;
  if (o >= i)
    return await b.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  o > 0 && o % 500 === 0 && await b.log(`Processing node ${o}...`);
  const a = {
    visited: (d = t.visited) != null ? d : /* @__PURE__ */ new WeakSet(),
    depth: (v = t.depth) != null ? v : 0,
    maxDepth: (m = t.maxDepth) != null ? m : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: t.variableTable,
    collectionTable: t.collectionTable
  };
  if (r.has(e))
    return "[Circular Reference]";
  r.add(e), a.visited = r;
  const n = {}, s = await Ee(e, a);
  Object.assign(n, s);
  const c = e.type;
  if (c)
    switch (c) {
      case "FRAME":
      case "COMPONENT": {
        const y = await Y(e);
        Object.assign(n, y);
        break;
      }
      case "INSTANCE": {
        const y = await Ve(
          e
        );
        Object.assign(n, y);
        const f = await Y(
          e
        );
        Object.assign(n, f);
        break;
      }
      case "TEXT": {
        const y = await ke(e);
        Object.assign(n, y);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const y = await Re(e);
        Object.assign(n, y);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const y = await Me(e);
        Object.assign(n, y);
        break;
      }
      default:
        a.unhandledKeys.add("_unknownType");
        break;
    }
  const u = Object.getOwnPropertyNames(e), l = /* @__PURE__ */ new Set([
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
  for (const y of u)
    typeof e[y] != "function" && (l.has(y) || a.unhandledKeys.add(y));
  if (a.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(a.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const y = a.maxDepth;
    if (a.depth >= y)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${y}) reached`,
        _count: e.children.length
      };
    else if (a.nodeCount >= i)
      n.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const f = N(w({}, a), {
        depth: a.depth + 1
      }), p = [];
      let C = !1;
      for (const V of e.children) {
        if (f.nodeCount >= i) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: p.length,
            _total: e.children.length,
            children: p
          }, C = !0;
          break;
        }
        const I = await q(V, r, f);
        p.push(I), f.nodeCount && (a.nodeCount = f.nodeCount);
      }
      C || (n.children = p);
    }
  }
  return n;
}
async function Te(e) {
  await b.clear(), await b.log("=== Starting Page Export ===");
  try {
    const r = e.pageIndex;
    if (r === void 0 || typeof r != "number")
      return await b.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await b.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const t = figma.root.children;
    if (await b.log(`Loaded ${t.length} page(s)`), r < 0 || r >= t.length)
      return await b.error(
        `Invalid page index: ${r} (valid range: 0-${t.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const i = t[r];
    await b.log(
      `Selected page: "${i.name}" (index: ${r})`
    ), await b.log("Initializing variable and collection tables...");
    const o = new B(), a = new G();
    await b.log("Fetching team library variable collections...");
    let n = [];
    try {
      if (n = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((f) => ({
        libraryName: f.libraryName,
        key: f.key,
        name: f.name
      })), await b.log(
        `Found ${n.length} library collection(s) in team library`
      ), n.length > 0)
        for (const f of n)
          await b.log(`  - ${f.name} (from ${f.libraryName})`);
    } catch (y) {
      await b.warning(
        `Could not get library variable collections: ${y instanceof Error ? y.message : String(y)}`
      );
    }
    await b.log("Extracting node data from page..."), await b.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    );
    const s = await q(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: a
      }
    );
    await b.log("Node extraction finished");
    const c = D(s), u = o.getSize(), l = a.getSize();
    if (await b.log("Extraction complete:"), await b.log(`  - Total nodes: ${c}`), await b.log(`  - Unique variables: ${u}`), await b.log(`  - Unique collections: ${l}`), l > 0) {
      await b.log("Collections found:");
      const y = a.getTable();
      for (const [f, p] of Object.values(y).entries()) {
        const C = p.collectionGuid ? ` (GUID: ${p.collectionGuid.substring(0, 8)}...)` : "";
        await b.log(
          `  ${f}: ${p.collectionName}${C} - ${p.modes.length} mode(s)`
        );
      }
    }
    await b.log("Creating export data structure...");
    const h = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.5.0",
        // Updated version for collection GUID system and serialized collection table
        figmaApiVersion: figma.apiVersion,
        originalPageName: i.name,
        totalNodes: c,
        pluginVersion: "1.0.0"
      },
      collections: a.getSerializedTable(),
      variables: o.getSerializedTable(),
      libraries: n,
      pageData: s
    };
    await b.log("Serializing to JSON...");
    const A = JSON.stringify(h, null, 2), d = (A.length / 1024).toFixed(2), v = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return await b.log(`JSON serialization complete: ${d} KB`), await b.log(`Export file: ${v}`), await b.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: v,
        jsonData: A,
        pageName: i.name,
        additionalPages: []
        // Will be populated when publishing referenced component pages
      }
    };
  } catch (r) {
    return await b.error(
      `Export failed: ${r instanceof Error ? r.message : "Unknown error occurred"}`
    ), r instanceof Error && r.stack && await b.error(`Stack trace: ${r.stack}`), console.error("Error exporting page:", r), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Q(e, r) {
  for (const t of r)
    e.modes.find((o) => o.name === t) || e.addMode(t);
}
function Oe(e, r, t) {
  const i = /* @__PURE__ */ new Map(), o = Object.keys(t);
  for (let a = 0; a < r.length && a < o.length; a++) {
    const n = r[a], s = o[a], c = e.modes.find((u) => u.name === n);
    c ? i.set(s, c.modeId) : console.warn(
      `Mode "${n}" not found in collection "${e.name}" after ensuring modes exist.`
    );
  }
  return i;
}
const E = "recursica:collectionId";
async function O(e) {
  if (e.remote === !0) {
    const t = re[e.id];
    if (!t) {
      const o = `Unrecognized remote variable collection. Please contact the developers to register your collection to proceed. Collection Name: "${e.name}", Collection ID: ${e.id}`;
      throw await b.error(o), new Error(o);
    }
    return t.guid;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      E
    );
    if (t && t.trim() !== "")
      return t;
    const i = await ae();
    return e.setSharedPluginData("recursica", E, i), i;
  }
}
function ne(e, r) {
  if (r)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function se(e) {
  let r;
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
          const u = await figma.variables.importVariableByKeyAsync(c[0].key), l = await figma.variables.getVariableCollectionByIdAsync(
            u.variableCollectionId
          );
          if (l) {
            if (r = l, e.collectionGuid) {
              const h = r.getSharedPluginData(
                "recursica",
                E
              );
              (!h || h.trim() === "") && r.setSharedPluginData(
                "recursica",
                E,
                e.collectionGuid
              );
            } else
              await O(r);
            return await Q(r, e.modes), { collection: r };
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
      if (r = s, e.collectionGuid) {
        const c = r.getSharedPluginData(
          "recursica",
          E
        );
        (!c || c.trim() === "") && r.setSharedPluginData(
          "recursica",
          E,
          e.collectionGuid
        );
      } else
        await O(r);
    else
      r = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? r.setSharedPluginData(
        "recursica",
        E,
        e.collectionGuid
      ) : await O(r);
  } else {
    const n = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), s = e.collectionName.trim().toLowerCase(), c = n.find((A) => A.name.trim().toLowerCase() === s);
    if (!c)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const u = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      c.key
    );
    if (u.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const l = await figma.variables.importVariableByKeyAsync(
      u[0].key
    ), h = await figma.variables.getVariableCollectionByIdAsync(
      l.variableCollectionId
    );
    if (!h)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (r = h, e.collectionGuid) {
      const A = r.getSharedPluginData(
        "recursica",
        E
      );
      (!A || A.trim() === "") && r.setSharedPluginData(
        "recursica",
        E,
        e.collectionGuid
      );
    } else
      O(r);
  }
  return await Q(r, e.modes), { collection: r };
}
async function K(e, r) {
  if (ne(e, r), r) {
    const i = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (o) => o.name === e
    );
    return i || figma.variables.createVariableCollection(e);
  } else {
    const i = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find(
      (s) => s.name === e
    );
    if (!i)
      throw new Error(
        `External collection "${e}" not found in team library. Please ensure the collection is published and available.`
      );
    const o = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      i.key
    );
    if (o.length === 0)
      throw new Error(
        `External collection "${e}" exists but has no variables. Cannot import.`
      );
    const a = await figma.variables.importVariableByKeyAsync(
      o[0].key
    ), n = await figma.variables.getVariableCollectionByIdAsync(
      a.variableCollectionId
    );
    if (!n)
      throw new Error(
        `Failed to import external collection "${e}"`
      );
    return n;
  }
}
async function L(e, r) {
  for (const t of e.variableIds)
    try {
      const i = await figma.variables.getVariableByIdAsync(t);
      if (i && i.name === r)
        return i;
    } catch (i) {
      continue;
    }
  return null;
}
function Z(e, r) {
  const t = e.resolvedType.toUpperCase(), i = r.toUpperCase();
  return t !== i ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${t}" but expected "${i}". Skipping binding.`
  ), !1) : !0;
}
async function _e(e, r, t, i, o) {
  for (const [a, n] of Object.entries(r)) {
    const s = i.get(a);
    if (!s) {
      console.warn(
        `Mode ID ${a} not found in mode mapping for variable "${e.name}". Skipping.`
      );
      continue;
    }
    try {
      if (n == null)
        continue;
      if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") {
        e.setValueForMode(s, n);
        continue;
      }
      if (typeof n == "object" && n !== null && "type" in n && n.type === "VARIABLE_ALIAS") {
        const c = n;
        let u = null;
        if (c._varRef !== void 0) {
          const l = t.getVariableByIndex(
            c._varRef
          );
          if (l) {
            let h = null;
            if (o && l._colRef !== void 0) {
              const A = o.getCollectionByIndex(
                l._colRef
              );
              A && (h = (await se(A)).collection);
            }
            !h && l.collectionName && l.isLocal !== void 0 && (h = await K(
              l.collectionName,
              l.isLocal
            )), h && (u = await L(
              h,
              l.variableName
            ));
          }
        }
        if (!u && c.id)
          try {
            u = await figma.variables.getVariableByIdAsync(
              c.id
            );
          } catch (l) {
          }
        if (u) {
          const l = {
            type: "VARIABLE_ALIAS",
            id: u.id
          };
          e.setValueForMode(s, l);
        } else
          console.warn(
            `Could not resolve variable alias for mode ${a} (mapped to ${s}) in variable "${e.name}". Original ID: ${c.id}`
          );
      }
    } catch (c) {
      console.warn(
        `Error setting value for mode ${a} (mapped to ${s}) in variable "${e.name}":`,
        c
      );
    }
  }
}
async function ee(e, r, t, i, o) {
  const a = figma.variables.createVariable(
    e.variableName,
    r,
    e.variableType
  );
  return e.valuesByMode && await _e(
    a,
    e.valuesByMode,
    t,
    i,
    o
  ), a;
}
async function ce(e, r, t) {
  var o;
  const i = r.getVariableByIndex(e._varRef);
  if (!i)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    let a;
    const n = (o = i._colRef) != null ? o : i.collectionRef;
    if (n !== void 0 && (a = t.getCollectionByIndex(n)), !a && i.collectionId && i.isLocal !== void 0) {
      const u = t.getCollectionIndex(
        i.collectionId
      );
      u >= 0 && (a = t.getCollectionByIndex(u));
    }
    if (!a) {
      const u = await K(
        i.collectionName || "",
        i.isLocal || !1
      );
      let l = await L(u, i.variableName);
      return l ? Z(l, i.variableType) ? l : null : i.valuesByMode ? (l = await ee(
        i,
        u,
        r,
        /* @__PURE__ */ new Map(),
        // Empty mode mapping for legacy
        t
        // Pass collection table for alias resolution
      ), l) : (console.warn(
        `Cannot create variable "${i.variableName}" without valuesByMode data`
      ), null);
    }
    const { collection: s } = await se(a);
    let c = await L(s, i.variableName);
    if (c)
      return Z(c, i.variableType) ? c : null;
    {
      if (!i.valuesByMode)
        return console.warn(
          `Cannot create variable "${i.variableName}" without valuesByMode data`
        ), null;
      const u = Oe(
        s,
        a.modes,
        i.valuesByMode
      );
      return c = await ee(
        i,
        s,
        r,
        u,
        t
        // Pass collection table for alias resolution
      ), c;
    }
  } catch (a) {
    if (console.error(
      `Error resolving variable reference for "${i.variableName}":`,
      a
    ), a instanceof Error && a.message.includes("External collection"))
      throw a;
    return null;
  }
}
function ze(e, r) {
  if (!r || !z(e))
    return null;
  const t = r.getVariableByIndex(e._varRef);
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
async function $e(e, r, t, i, o) {
  if (!(!r || typeof r != "object"))
    try {
      const a = e[t];
      if (!a || !Array.isArray(a))
        return;
      for (const [n, s] of Object.entries(r))
        if (n === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < a.length; c++) {
            let u = null;
            const l = s[c];
            if (z(l) && i && o) {
              const h = await ce(
                l,
                i,
                o
              );
              h && a[c].boundVariables && (a[c].boundVariables[t] = {
                type: "VARIABLE_ALIAS",
                id: h.id
              });
            } else l && typeof l == "object" && "type" in l && l.type === "VARIABLE_ALIAS" && (u = l, u && await Ge(
              a[c],
              u,
              t,
              i
            ));
          }
        else {
          let c = null;
          z(s) ? c = ze(s, i) : s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && (c = s), c && await le(e, n, c, i);
        }
    } catch (a) {
      console.log(`Error restoring bound variables for ${t}:`, a);
    }
}
async function le(e, r, t, i) {
  try {
    let o = null;
    try {
      o = await figma.variables.getVariableByIdAsync(t.id);
    } catch (a) {
    }
    if (!o && i) {
      if (t.isLocal) {
        const a = await K(
          t.collectionName || "",
          !0
        );
        o = await L(
          a,
          t.variableName || ""
        ), !o && t.variableName && t.variableType && console.warn(
          `Cannot create variable "${t.variableName}" without valuesByMode. Use resolveVariableReferenceOnImport instead.`
        );
      } else if (t.variableKey)
        try {
          o = await figma.variables.importVariableByKeyAsync(
            t.variableKey
          );
        } catch (a) {
          console.log(
            `Could not import team variable: ${t.variableName}`
          );
        }
    }
    if (o) {
      const a = {
        type: "VARIABLE_ALIAS",
        id: o.id
      };
      e.boundVariables || (e.boundVariables = {}), e.boundVariables[r] || (e.boundVariables[r] = a);
    }
  } catch (o) {
    console.log(`Error binding variable to property ${r}:`, o);
  }
}
async function Ge(e, r, t, i) {
  if (!(!e || typeof e != "object"))
    try {
      let o = null;
      try {
        o = await figma.variables.getVariableByIdAsync(r.id);
      } catch (a) {
        if (i) {
          if (r.isLocal) {
            const n = await K(
              r.collectionName || "",
              !0
            );
            o = await L(
              n,
              r.variableName || ""
            );
          } else if (r.variableKey)
            try {
              o = await figma.variables.importVariableByKeyAsync(
                r.variableKey
              );
            } catch (n) {
              console.log(
                `Could not import team variable: ${r.variableName}`
              );
            }
        }
      }
      o && e.boundVariables && (e.boundVariables[t] = {
        type: "VARIABLE_ALIAS",
        id: o.id
      });
    } catch (o) {
      console.log("Error binding variable to property object:", o);
    }
}
function Be(e, r) {
  const t = we(r);
  if (e.visible === void 0 && (e.visible = t.visible), e.locked === void 0 && (e.locked = t.locked), e.opacity === void 0 && (e.opacity = t.opacity), e.rotation === void 0 && (e.rotation = t.rotation), e.blendMode === void 0 && (e.blendMode = t.blendMode), r === "FRAME" || r === "COMPONENT" || r === "INSTANCE") {
    const i = x;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (r === "TEXT") {
    const i = P;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function H(e, r, t = null, i = null) {
  var o;
  try {
    let a;
    switch (e.type) {
      case "FRAME":
        a = figma.createFrame();
        break;
      case "RECTANGLE":
        a = figma.createRectangle();
        break;
      case "ELLIPSE":
        a = figma.createEllipse();
        break;
      case "TEXT":
        a = figma.createText();
        break;
      case "VECTOR":
        a = figma.createVector();
        break;
      case "STAR":
        a = figma.createStar();
        break;
      case "LINE":
        a = figma.createLine();
        break;
      case "COMPONENT":
        a = figma.createComponent();
        break;
      case "INSTANCE":
        if (console.log("Found instance node: " + e.name), e.mainComponent && e.mainComponent.key)
          try {
            const n = await figma.importComponentByKeyAsync(
              e.mainComponent.key
            );
            n && n.type === "COMPONENT" ? (a = n.createInstance(), console.log(
              "Created instance from main component: " + e.mainComponent.name
            )) : (console.log("Main component not found, creating frame fallback"), a = figma.createFrame());
          } catch (n) {
            console.log(
              "Error creating instance: " + n + ", creating frame fallback"
            ), a = figma.createFrame();
          }
        else
          console.log("No main component info, creating frame fallback"), a = figma.createFrame();
        break;
      case "GROUP":
        a = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " + e.name + ", creating frame fallback"
        ), a = figma.createFrame();
        break;
      case "POLYGON":
        a = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " + e.type + ", creating frame instead"
        ), a = figma.createFrame();
        break;
    }
    if (!a)
      return null;
    if (Be(a, e.type || "FRAME"), e.name !== void 0 && (a.name = e.name || "Unnamed Node"), e.x !== void 0 && (a.x = e.x), e.y !== void 0 && (a.y = e.y), e.width !== void 0 && e.height !== void 0 && a.resize(e.width, e.height), e.visible !== void 0 && (a.visible = e.visible), e.locked !== void 0 && (a.locked = e.locked), e.opacity !== void 0 && (a.opacity = e.opacity), e.rotation !== void 0 && (a.rotation = e.rotation), e.blendMode !== void 0 && (a.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && t && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const c = {};
            for (const [u, l] of Object.entries(
              s.boundVariables
            ))
              c[u] = l;
            return N(w({}, s), { boundVariables: c });
          }
          return s;
        })), a.fills = n, (o = e.boundVariables) != null && o.fills && await $e(
          a,
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
        a.strokes = e.strokes;
      } catch (n) {
        console.log("Error setting strokes:", n);
      }
    if (e.strokeWeight !== void 0 && (a.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (a.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (a.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (a.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (a.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (a.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (a.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (a.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (a.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (a.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (a.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (a.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (a.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (a.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (a.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (a.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (a.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
      try {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), a.fontName = e.fontName;
          } catch (n) {
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular"
            }), a.fontName = { family: "Roboto", style: "Regular" };
          }
        else
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), a.fontName = { family: "Roboto", style: "Regular" };
        a.characters = e.characters, e.fontSize !== void 0 && (a.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (a.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (a.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (a.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (a.lineHeight = e.lineHeight), e.textCase !== void 0 && (a.textCase = e.textCase), e.textDecoration !== void 0 && (a.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (a.textAutoResize = e.textAutoResize);
      } catch (n) {
        console.log("Error setting text properties: " + n);
        try {
          a.characters = e.characters;
        } catch (s) {
          console.log("Could not set text characters: " + s);
        }
      }
    if (e.boundVariables) {
      for (const [n, s] of Object.entries(
        e.boundVariables
      ))
        if (n !== "fills")
          if (z(s) && t && i) {
            const c = await ce(
              s,
              t,
              i
            );
            if (c) {
              const u = {
                type: "VARIABLE_ALIAS",
                id: c.id
              };
              a.boundVariables || (a.boundVariables = {}), a.boundVariables[n] || (a.boundVariables[n] = u);
            }
          } else s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && await le(
            a,
            n,
            s,
            t
          );
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
          a,
          t,
          i
        );
        s && a.appendChild(s);
      }
    return r && r.appendChild(a), a;
  } catch (a) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      a
    ), null;
  }
}
async function Ke(e) {
  try {
    const r = e.jsonData;
    if (!r)
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    if (console.log("Importing page from JSON"), !r.pageData || !r.metadata)
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid JSON format. Expected pageData and metadata.",
        data: {}
      };
    const t = r.pageData, i = r.metadata;
    let o = null;
    if (r.collections)
      try {
        o = G.fromTable(r.collections), console.log(
          `Loaded collections table with ${o.getSize()} collections`
        );
      } catch (A) {
        console.warn("Failed to load collections table:", A);
      }
    let a = null;
    if (r.variables)
      try {
        a = B.fromTable(r.variables), console.log(
          `Loaded variable table with ${a.getSize()} variables`
        );
      } catch (A) {
        console.warn("Failed to load variable table:", A);
      }
    const n = "2.3.0", s = i.exportFormatVersion || "1.0.0";
    s !== n && console.warn(
      `Export format version mismatch: exported with ${s}, current version is ${n}. Import may have compatibility issues.`
    );
    const u = "Imported - " + (i.originalPageName ? i.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), l = figma.createPage();
    if (l.name = u, figma.root.appendChild(l), console.log("Created new page: " + u), console.log("Importing " + (i.totalNodes || "unknown") + " nodes"), t.children && Array.isArray(t.children)) {
      for (const A of t.children) {
        if (A._truncated) {
          console.log(
            `Skipping truncated children: ${A._reason || "Unknown"}`
          );
          continue;
        }
        await H(
          A,
          l,
          a,
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
  } catch (r) {
    return console.error("Error importing page:", r), {
      type: "importPage",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ue(e) {
  try {
    await figma.loadAllPagesAsync();
    const r = figma.root.children;
    console.log("Found " + r.length + " pages in the document");
    const t = 11, i = r[t];
    if (!i)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const o = await q(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + t + ")"
    );
    const a = JSON.stringify(o, null, 2), n = JSON.parse(a), s = "Copy - " + n.name, c = figma.createPage();
    if (c.name = s, figma.root.appendChild(c), n.children && n.children.length > 0) {
      let h = function(d) {
        d.forEach((v) => {
          const m = (v.x || 0) + (v.width || 0);
          m > A && (A = m), v.children && v.children.length > 0 && h(v.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let A = 0;
      h(n.children), console.log("Original content rightmost edge: " + A);
      for (const d of n.children)
        await H(d, c, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const u = D(n);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: n.name,
        newPageName: s,
        totalNodes: u
      }
    };
  } catch (r) {
    return console.error("Error performing quick copy:", r), {
      type: "quickCopy",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Fe(e) {
  try {
    const r = e.accessToken, t = e.selectedRepo;
    return r ? (await figma.clientStorage.setAsync("accessToken", r), t && await figma.clientStorage.setAsync("selectedRepo", t), {
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
  } catch (r) {
    return {
      type: "storeAuthData",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function je(e) {
  try {
    const r = await figma.clientStorage.getAsync("accessToken"), t = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: r || void 0,
        selectedRepo: t || void 0
      }
    };
  } catch (r) {
    return {
      type: "loadAuthData",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
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
  } catch (r) {
    return {
      type: "clearAuthData",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function qe(e) {
  try {
    const r = e.selectedRepo;
    return r ? (await figma.clientStorage.setAsync("selectedRepo", r), {
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
  } catch (r) {
    return {
      type: "storeSelectedRepo",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {}
    };
  }
}
function F(e, r = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: r
  };
}
function de(e, r, t = {}) {
  const i = r instanceof Error ? r.message : r;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: t
  };
}
function j(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const pe = "RecursicaPublishedMetadata";
async function He(e) {
  try {
    const r = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (s) => s.id === r.id
    ), o = r.getPluginData(pe);
    if (!o) {
      const u = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: j(r.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return F("getComponentMetadata", u);
    }
    const n = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return F("getComponentMetadata", n);
  } catch (r) {
    return console.error("Error getting component metadata:", r), de(
      "getComponentMetadata",
      r instanceof Error ? r : "Unknown error occurred"
    );
  }
}
async function We(e) {
  try {
    await figma.loadAllPagesAsync();
    const r = figma.root.children, t = [];
    for (const o of r) {
      if (o.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${o.name} (type: ${o.type})`
        );
        continue;
      }
      const a = o, n = a.getPluginData(pe);
      if (n)
        try {
          const s = JSON.parse(n);
          t.push(s);
        } catch (s) {
          console.warn(
            `Failed to parse metadata for page "${a.name}":`,
            s
          );
          const u = {
            _ver: 1,
            id: "",
            name: j(a.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          t.push(u);
        }
      else {
        const c = {
          _ver: 1,
          id: "",
          name: j(a.name),
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
  } catch (r) {
    return console.error("Error getting all components:", r), de(
      "getAllComponents",
      r instanceof Error ? r : "Unknown error occurred"
    );
  }
}
const _ = /* @__PURE__ */ new Map();
let Je = 0;
function Xe() {
  return `prompt_${Date.now()}_${++Je}`;
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
  prompt: (e, r) => {
    var s;
    const t = typeof r == "number" ? { timeoutMs: r } : r, i = (s = t == null ? void 0 : t.timeoutMs) != null ? s : 3e5, o = t == null ? void 0 : t.okLabel, a = t == null ? void 0 : t.cancelLabel, n = Xe();
    return new Promise((c, u) => {
      const l = i === -1 ? null : setTimeout(() => {
        _.delete(n), u(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      _.set(n, {
        resolve: c,
        reject: u,
        timeout: l
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: w(w({
          message: e,
          requestId: n
        }, o && { okLabel: o }), a && { cancelLabel: a })
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
    const { requestId: r, action: t } = e, i = _.get(r);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${r}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), _.delete(r), t === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
};
async function Qe(e) {
  try {
    const r = e.requestId, t = e.action;
    return !r || !t ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Ye.handleResponse({ requestId: r, action: t }), {
      type: "pluginPromptResponse",
      success: !0,
      error: !1,
      message: "Prompt response handled successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    });
  } catch (r) {
    return {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {}
    };
  }
}
const Ze = {
  getCurrentUser: he,
  loadPages: Ae,
  exportPage: Te,
  importPage: Ke,
  quickCopy: Ue,
  storeAuthData: Fe,
  loadAuthData: je,
  clearAuthData: De,
  storeSelectedRepo: qe,
  getComponentMetadata: He,
  getAllComponents: We,
  pluginPromptResponse: Qe
}, et = Ze;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    Se(e);
    return;
  }
  const r = e;
  try {
    const t = r.type, i = et[t];
    if (!i) {
      console.warn("Unknown message type:", r.type);
      const a = {
        type: r.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + r.type,
        data: {},
        requestId: r.requestId
      };
      figma.ui.postMessage(a);
      return;
    }
    const o = await i(r.data);
    figma.ui.postMessage(N(w({}, o), {
      requestId: r.requestId
    }));
  } catch (t) {
    console.error("Error handling message:", t);
    const i = {
      type: r.type,
      success: !1,
      error: !0,
      message: t instanceof Error ? t.message : "Unknown error occurred",
      data: {},
      requestId: r.requestId
    };
    figma.ui.postMessage(i);
  }
};
