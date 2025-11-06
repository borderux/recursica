var ue = Object.defineProperty, fe = Object.defineProperties;
var ge = Object.getOwnPropertyDescriptors;
var H = Object.getOwnPropertySymbols;
var me = Object.prototype.hasOwnProperty, ye = Object.prototype.propertyIsEnumerable;
var K = (e, a, t) => a in e ? ue(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t, C = (e, a) => {
  for (var t in a || (a = {}))
    me.call(a, t) && K(e, t, a[t]);
  if (H)
    for (var t of H(a))
      ye.call(a, t) && K(e, t, a[t]);
  return e;
}, N = (e, a) => fe(e, ge(a));
var k = (e, a, t) => K(e, typeof a != "symbol" ? a + "" : a, t);
async function he(e) {
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
}, x = N(C({}, S), {
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
}), I = N(C({}, S), {
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
}), R = N(C({}, S), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), ee = N(C({}, S), {
  cornerRadius: 0
}), Ae = N(C({}, S), {
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
      return I;
    case "VECTOR":
      return R;
    case "LINE":
      return Ae;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return ee;
    default:
      return S;
  }
}
function g(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((t, i) => g(t, a[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const t = Object.keys(e), i = Object.keys(a);
      return t.length !== i.length ? !0 : t.some(
        (o) => !(o in a) || g(e[o], a[o])
      );
    }
    return !0;
  }
  return e !== a;
}
class $ {
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
      const i = this.collections[t], o = C({
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
    const t = new $(), i = Object.entries(a).sort(
      (r, n) => parseInt(r[0], 10) - parseInt(n[0], 10)
    );
    for (const [r, n] of i) {
      const s = parseInt(r, 10), c = (o = n.isLocal) != null ? o : !0, p = n.collectionId || n.collectionGuid || `temp:${s}:${n.collectionName || "unknown"}`, l = C({
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
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: variableKey, id, collectionName, collectionId, isLocal
   * Keeps: variableName, variableType, _colRef, valuesByMode, and legacy collectionRef
   */
  getSerializedTable() {
    const a = {};
    for (let t = 0; t < this.variables.length; t++) {
      const i = this.variables[t], o = C(C(C(C(C(C({
        variableName: i.variableName,
        variableType: i.variableType
      }, i._colRef !== void 0 && { _colRef: i._colRef }), i.valuesByMode && { valuesByMode: i.valuesByMode }), i._colRef === void 0 && i.collectionRef !== void 0 && {
        collectionRef: i.collectionRef
      }), i._colRef === void 0 && i.collectionName && { collectionName: i.collectionName }), i._colRef === void 0 && i.collectionId && { collectionId: i.collectionId }), i._colRef === void 0 && i.isLocal !== void 0 && { isLocal: i.isLocal });
      a[String(t)] = o;
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
      const c = N(C({}, n), {
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
function _(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
let we = 0;
const M = /* @__PURE__ */ new Map();
function xe(e) {
  if (e.type !== "GenerateGuidResponse" || !e.requestId)
    return;
  const a = M.get(e.requestId);
  a && (M.delete(e.requestId), e.error || !e.guid ? a.reject(
    new Error(e.message || "Failed to generate GUID from UI")
  ) : a.resolve(e.guid));
}
function te() {
  return new Promise((e, a) => {
    const t = `guid_${Date.now()}_${++we}`;
    M.set(t, { resolve: e, reject: a }), figma.ui.postMessage({
      type: "GenerateGuidRequest",
      requestId: t
    }), setTimeout(() => {
      M.has(t) && (M.delete(t), a(new Error("Timeout waiting for GUID from UI")));
    }, 5e3);
  });
}
const re = {
  // Example format (replace with actual collection IDs and GUIDs):
  // "VariableCollectionId:example123/2151:0": "550e8400-e29b-41d4-a716-446655440000",
};
async function ae(e, a, t, i = /* @__PURE__ */ new Set()) {
  const o = {};
  for (const [r, n] of Object.entries(e)) {
    if (n == null) {
      o[r] = n;
      continue;
    }
    if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") {
      o[r] = n;
      continue;
    }
    if (typeof n == "object" && n !== null && "type" in n && n.type === "VARIABLE_ALIAS" && "id" in n) {
      const s = n.id;
      if (i.has(s)) {
        o[r] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      const c = await figma.variables.getVariableByIdAsync(s);
      if (!c) {
        o[r] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      const p = new Set(i);
      p.add(s);
      const l = await figma.variables.getVariableCollectionByIdAsync(
        c.variableCollectionId
      ), h = c.key;
      if (!h) {
        o[r] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      const b = {
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
        const m = await ie(
          d,
          t
        );
        b._colRef = m;
      }
      c.valuesByMode && (b.valuesByMode = await ae(
        c.valuesByMode,
        a,
        t,
        p
      ));
      const v = a.addVariable(b);
      o[r] = {
        type: "VARIABLE_ALIAS",
        id: s,
        _varRef: v
      };
    } else
      o[r] = n;
  }
  return o;
}
const W = "recursica:collectionId";
async function Se(e) {
  if (e.remote === !0) {
    const t = re[e.id];
    if (!t)
      throw new Error(
        "Unrecognized remote variable collection. Please contact the developers to register your collection to proceed"
      );
    return t;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      W
    );
    if (t && t.trim() !== "")
      return t;
    const i = await te();
    return e.setSharedPluginData("recursica", W, i), i;
  }
}
function Pe(e, a) {
  if (a)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ie(e, a) {
  const t = !e.remote;
  Pe(e.name, t);
  const i = await Se(e), o = e.modes.map((n) => n.name), r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: t,
    modes: o,
    collectionGuid: i
  };
  return a.addCollection(r);
}
async function J(e, a, t) {
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
    i.valuesByMode && (s.valuesByMode = await ae(
      i.valuesByMode,
      a,
      t,
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const c = a.addVariable(s);
    return Ce(c);
  } catch (i) {
    const o = i instanceof Error ? i.message : String(i);
    throw console.error("Could not resolve variable alias:", e.id, i), new Error(
      `Failed to resolve variable alias ${e.id}: ${o}`
    );
  }
}
async function z(e, a, t) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const r = e[o];
      if (r && typeof r == "object" && !Array.isArray(r))
        if (r.type === "VARIABLE_ALIAS") {
          const n = await J(
            r,
            a,
            t
          );
          n && (i[o] = n);
        } else
          i[o] = await z(
            r,
            a,
            t
          );
      else Array.isArray(r) ? i[o] = await Promise.all(
        r.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await J(
          n,
          a,
          t
        ) || n : n && typeof n == "object" ? await z(
          n,
          a,
          t
        ) : n)
      ) : i[o] = r;
    }
  return i;
}
async function Ie(e, a, t) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const r in i)
        Object.prototype.hasOwnProperty.call(i, r) && (r === "boundVariables" ? o[r] = await z(
          i[r],
          a,
          t
        ) : o[r] = i[r]);
      return o;
    })
  );
}
async function Ne(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (t.type = e.type, i.add("type")), e.id && (t.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (t.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (t.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (t.y = e.y, i.add("y")), e.width !== void 0 && (t.width = e.width, i.add("width")), e.height !== void 0 && (t.height = e.height, i.add("height")), e.visible !== void 0 && g(e.visible, S.visible) && (t.visible = e.visible, i.add("visible")), e.locked !== void 0 && g(e.locked, S.locked) && (t.locked = e.locked, i.add("locked")), e.opacity !== void 0 && g(e.opacity, S.opacity) && (t.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && g(e.rotation, S.rotation) && (t.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && g(e.blendMode, S.blendMode) && (t.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && g(e.effects, S.effects) && (t.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await Ie(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    g(o, S.fills) && (t.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && g(e.strokes, S.strokes) && (t.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && g(e.strokeWeight, S.strokeWeight) && (t.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && g(e.strokeAlign, S.strokeAlign) && (t.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await z(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    );
    Object.keys(o).length > 0 && (t.boundVariables = o), i.add("boundVariables");
  }
  return t;
}
async function X(e, a) {
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
async function Ee(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (t.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (t.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (t.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && g(
    e.textAlignHorizontal,
    I.textAlignHorizontal
  ) && (t.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && g(
    e.textAlignVertical,
    I.textAlignVertical
  ) && (t.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && g(e.letterSpacing, I.letterSpacing) && (t.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && g(e.lineHeight, I.lineHeight) && (t.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && g(e.textCase, I.textCase) && (t.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && g(e.textDecoration, I.textDecoration) && (t.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && g(e.textAutoResize, I.textAutoResize) && (t.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && g(
    e.paragraphSpacing,
    I.paragraphSpacing
  ) && (t.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && g(e.paragraphIndent, I.paragraphIndent) && (t.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && g(e.listOptions, I.listOptions) && (t.listOptions = e.listOptions, i.add("listOptions")), t;
}
async function ke(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && g(e.fillGeometry, R.fillGeometry) && (t.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && g(e.strokeGeometry, R.strokeGeometry) && (t.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && g(e.strokeCap, R.strokeCap) && (t.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && g(e.strokeJoin, R.strokeJoin) && (t.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && g(e.dashPattern, R.dashPattern) && (t.dashPattern = e.dashPattern, i.add("dashPattern")), t;
}
async function Re(e, a) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && g(e.cornerRadius, ee.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (t.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), t;
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
async function Le(e, a) {
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
          const v = [];
          try {
            let u = Object.getPrototypeOf(o);
            for (; u && u !== Object.prototype; )
              v.push(
                ...Object.getOwnPropertyNames(u).filter(
                  (w) => !v.includes(w)
                )
              ), u = Object.getPrototypeOf(u);
            r.prototypeProperties = v;
          } catch (u) {
            r.prototypeProperties = "(cannot access)";
          }
          let m = [];
          try {
            m = Object.keys(o), r.enumerableProperties = m;
          } catch (u) {
            r.enumerableProperties = "(cannot access)";
          }
          const y = [];
          try {
            for (const u of [...d, ...v])
              if (!(u === "instances" || u === "children" || u === "parent"))
                try {
                  typeof o[u] == "function" && y.push(u);
                } catch (w) {
                }
            r.availableMethods = y;
          } catch (u) {
            r.availableMethods = "(cannot access)";
          }
          const f = [];
          try {
            for (const u of [...d, ...v])
              (u.toLowerCase().includes("library") || u.toLowerCase().includes("remote") || u.toLowerCase().includes("file")) && f.push(u);
            r.libraryRelatedProperties = f;
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
                } catch (w) {
                  r.mainComponentParentAccessError = String(w);
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
          const v = [];
          let m = 0;
          const y = 20;
          if (d)
            try {
              if (r.mainComponentParentExists = !0, r.mainComponentParentType = d.type, r.mainComponentParentName = d.name, r.mainComponentParentId = d.id, d.type === "COMPONENT_SET")
                try {
                  const f = d.parent;
                  if (f === null)
                    r.componentSetParentIsNull = !0;
                  else if (f === void 0)
                    r.componentSetParentIsUndefined = !0;
                  else {
                    r.componentSetParentExists = !0;
                    try {
                      r.componentSetParentType = f.type, r.componentSetParentName = f.name;
                    } catch (u) {
                      r.componentSetParentPropertyAccessError = String(u);
                    }
                  }
                } catch (f) {
                  r.componentSetParentCheckError = String(f);
                }
            } catch (f) {
              r.mainComponentParentDebugError = String(f);
            }
          else
            r.mainComponentParentExists = !1;
          for (; d && m < y; )
            try {
              const f = d.type, u = d.name;
              if (l.push(
                `${f}:${u || "(unnamed)"}`
              ), f === "COMPONENT_SET" && !p && (p = u, r.componentSetName = u, r.componentSetFound = !0), f === "PAGE")
                break;
              u && u.trim() !== "" && v.unshift(u);
              let w, V = !1;
              try {
                "parent" in d ? (V = !0, r[`hasParentPropertyAtDepth${m}`] = !0, w = d.parent, w === null ? r[`parentIsNullAtDepth${m}`] = !0 : w === void 0 ? r[`parentIsUndefinedAtDepth${m}`] = !0 : r[`parentExistsAtDepth${m}`] = !0) : r[`noParentPropertyAtDepth${m}`] = !0;
              } catch (P) {
                r.parentAccessErrorAtDepth = m, r.parentAccessError = String(P), r.parentAccessErrorName = P instanceof Error ? P.name : "Unknown", r.parentAccessErrorMessage = P instanceof Error ? P.message : String(P);
                break;
              }
              if (!w) {
                r.noParentAtDepth = m, r.parentAccessAttemptedAtDepth = V;
                break;
              }
              try {
                const P = w.type, pe = w.name;
                r[`parentAtDepth${m + 1}Type`] = P, r[`parentAtDepth${m + 1}Name`] = pe;
              } catch (P) {
                r.nextParentAccessErrorAtDepth = m, r.nextParentAccessError = String(P);
              }
              d = w, m++;
            } catch (f) {
              r.parentTraverseErrorAtDepth = m, r.parentTraverseError = String(f), r.parentTraverseErrorName = f instanceof Error ? f.name : "Unknown", r.parentTraverseErrorMessage = f instanceof Error ? f.message : String(f);
              break;
            }
          c = v.join("/"), r.mainComponentParentChain = l, r.mainComponentParentChainDepth = m, r.mainComponentParentPath = c, r.mainComponentParentPathParts = v;
        } catch (d) {
          r.mainComponentParentPathError = String(d);
        }
        const h = Me(e);
        if (r.instanceParentPath = h, t.mainComponent = {
          id: o.id,
          name: o.name,
          key: o.key,
          // Component key for reference
          type: o.type
        }, p && (t.mainComponent.componentSetName = p), n && (t.mainComponent.variantProperties = n), s && (t.mainComponent.componentProperties = s), c && (t.mainComponent._path = c), h && (t.mainComponent._instancePath = h), o.remote === !0) {
          t.mainComponent.remote = !0;
          try {
            if (typeof o.getPublishStatusAsync == "function")
              try {
                const d = await o.getPublishStatusAsync();
                if (d && (r.publishStatus = d, d && typeof d == "object")) {
                  d.libraryName && (t.mainComponent.libraryName = d.libraryName), d.libraryKey && (t.mainComponent.libraryKey = d.libraryKey), d.fileKey && (t.mainComponent.fileKey = d.fileKey);
                  const v = {};
                  Object.keys(d).forEach((m) => {
                    (m.toLowerCase().includes("library") || m.toLowerCase().includes("file")) && (v[m] = d[m]);
                  }), Object.keys(v).length > 0 && (r.libraryRelatedFromPublishStatus = v);
                }
              } catch (d) {
                r.publishStatusError = String(d);
              }
            try {
              const d = figma.teamLibrary, v = Object.getOwnPropertyNames(
                d
              ).filter((m) => typeof d[m] == "function");
              if (r.teamLibraryAvailableMethods = v, typeof (d == null ? void 0 : d.getAvailableLibraryComponentSetsAsync) == "function") {
                const m = await d.getAvailableLibraryComponentSetsAsync();
                if (r.availableComponentSetsCount = (m == null ? void 0 : m.length) || 0, m && Array.isArray(m)) {
                  const y = [];
                  for (const f of m)
                    try {
                      const u = {
                        name: f.name,
                        key: f.key,
                        libraryName: f.libraryName,
                        libraryKey: f.libraryKey
                      };
                      if (y.push(u), f.key === o.key || f.name === o.name) {
                        r.matchingComponentSet = u, f.libraryName && (t.mainComponent.libraryName = f.libraryName), f.libraryKey && (t.mainComponent.libraryKey = f.libraryKey);
                        break;
                      }
                    } catch (u) {
                      y.push({
                        error: String(u)
                      });
                    }
                  r.componentSets = y;
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
        }
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
const A = {
  clear: () => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: "__CLEAR__"
      }
    });
  },
  log: (e) => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: void 0,
        message: e
      }
    });
  },
  warning: (e) => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "warning",
        message: e
      }
    });
  },
  error: (e) => {
    figma.ui.postMessage({
      type: "DebugConsole",
      payload: {
        type: "error",
        message: e
      }
    });
  }
};
function j(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    a += j(t);
  }), a;
}
async function q(e, a = /* @__PURE__ */ new WeakSet(), t = {}) {
  var h, b, d, v, m;
  if (!e || typeof e != "object")
    return e;
  const i = (h = t.maxNodes) != null ? h : 1e4, o = (b = t.nodeCount) != null ? b : 0;
  if (o >= i)
    return A.warning(
      `Maximum node count (${i}) reached. Export truncated.`
    ), {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  o > 0 && o % 500 === 0 && A.log(`Processing node ${o}...`);
  const r = {
    visited: (d = t.visited) != null ? d : /* @__PURE__ */ new WeakSet(),
    depth: (v = t.depth) != null ? v : 0,
    maxDepth: (m = t.maxDepth) != null ? m : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: t.variableTable,
    collectionTable: t.collectionTable
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), r.visited = a;
  const n = {}, s = await Ne(e, r);
  Object.assign(n, s);
  const c = e.type;
  if (c)
    switch (c) {
      case "FRAME":
      case "COMPONENT": {
        const y = await X(e);
        Object.assign(n, y);
        break;
      }
      case "INSTANCE": {
        const y = await Le(
          e
        );
        Object.assign(n, y);
        const f = await X(
          e
        );
        Object.assign(n, f);
        break;
      }
      case "TEXT": {
        const y = await Ee(e);
        Object.assign(n, y);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const y = await ke(e);
        Object.assign(n, y);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const y = await Re(e);
        Object.assign(n, y);
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
  for (const y of p)
    typeof e[y] != "function" && (l.has(y) || r.unhandledKeys.add(y));
  if (r.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(r.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const y = r.maxDepth;
    if (r.depth >= y)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${y}) reached`,
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
      const f = N(C({}, r), {
        depth: r.depth + 1
      }), u = [];
      let w = !1;
      for (const V of e.children) {
        if (f.nodeCount >= i) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: u.length,
            _total: e.children.length,
            children: u
          }, w = !0;
          break;
        }
        const P = await q(V, a, f);
        u.push(P), f.nodeCount && (r.nodeCount = f.nodeCount);
      }
      w || (n.children = u);
    }
  }
  return n;
}
async function Ve(e) {
  A.clear(), A.log("=== Starting Page Export ===");
  try {
    const a = e.pageIndex;
    if (a === void 0 || typeof a != "number")
      return A.error(
        "Invalid page selection: pageIndex is undefined or not a number"
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    A.log("Loading all pages..."), await figma.loadAllPagesAsync();
    const t = figma.root.children;
    if (A.log(`Loaded ${t.length} page(s)`), a < 0 || a >= t.length)
      return A.error(
        `Invalid page index: ${a} (valid range: 0-${t.length - 1})`
      ), {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const i = t[a];
    A.log(
      `Selected page: "${i.name}" (index: ${a})`
    ), A.log("Initializing variable and collection tables...");
    const o = new B(), r = new $();
    A.log("Fetching team library variable collections...");
    let n = [];
    try {
      n = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((f) => ({
        libraryName: f.libraryName,
        key: f.key,
        name: f.name
      })), A.log(
        `Found ${n.length} library collection(s) in team library`
      ), n.length > 0 && n.forEach((f) => {
        A.log(`  - ${f.name} (from ${f.libraryName})`);
      });
    } catch (y) {
      A.warning(
        `Could not get library variable collections: ${y instanceof Error ? y.message : String(y)}`
      );
    }
    A.log("Extracting node data from page..."), A.log(
      "Starting recursive node extraction (max nodes: 10000)..."
    );
    const s = await q(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: r
      }
    );
    A.log("Node extraction finished");
    const c = j(s), p = o.getSize(), l = r.getSize();
    if (A.log("Extraction complete:"), A.log(`  - Total nodes: ${c}`), A.log(`  - Unique variables: ${p}`), A.log(`  - Unique collections: ${l}`), l > 0) {
      A.log("Collections found:");
      const y = r.getTable();
      Object.values(y).forEach((f, u) => {
        const w = f.collectionGuid ? ` (GUID: ${f.collectionGuid.substring(0, 8)}...)` : "";
        A.log(
          `  ${u}: ${f.collectionName}${w} - ${f.modes.length} mode(s)`
        );
      });
    }
    A.log("Creating export data structure...");
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
      collections: r.getSerializedTable(),
      variables: o.getSerializedTable(),
      libraries: n,
      pageData: s
    };
    A.log("Serializing to JSON...");
    const b = JSON.stringify(h, null, 2), d = (b.length / 1024).toFixed(2), v = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return A.log(`JSON serialization complete: ${d} KB`), A.log(`Export file: ${v}`), A.log("=== Export Complete ==="), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: v,
        jsonData: b,
        pageName: i.name,
        additionalPages: []
        // Will be populated when publishing referenced component pages
      }
    };
  } catch (a) {
    return A.error(
      `Export failed: ${a instanceof Error ? a.message : "Unknown error occurred"}`
    ), a instanceof Error && a.stack && A.error(`Stack trace: ${a.stack}`), console.error("Error exporting page:", a), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Y(e, a) {
  for (const t of a)
    e.modes.find((o) => o.name === t) || e.addMode(t);
}
function Te(e, a, t) {
  const i = /* @__PURE__ */ new Map(), o = Object.keys(t);
  for (let r = 0; r < a.length && r < o.length; r++) {
    const n = a[r], s = o[r], c = e.modes.find((p) => p.name === n);
    c ? i.set(s, c.modeId) : console.warn(
      `Mode "${n}" not found in collection "${e.name}" after ensuring modes exist.`
    );
  }
  return i;
}
const E = "recursica:collectionId";
async function T(e) {
  if (e.remote === !0) {
    const t = re[e.id];
    if (!t)
      throw new Error(
        "Unrecognized remote variable collection. Please contact the developers to register your collection to proceed"
      );
    return t;
  } else {
    const t = e.getSharedPluginData(
      "recursica",
      E
    );
    if (t && t.trim() !== "")
      return t;
    const i = await te();
    return e.setSharedPluginData("recursica", E, i), i;
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
              const h = a.getSharedPluginData(
                "recursica",
                E
              );
              (!h || h.trim() === "") && a.setSharedPluginData(
                "recursica",
                E,
                e.collectionGuid
              );
            } else
              await T(a);
            return await Y(a, e.modes), { collection: a };
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
        await T(a);
    else
      a = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? a.setSharedPluginData(
        "recursica",
        E,
        e.collectionGuid
      ) : await T(a);
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
    ), h = await figma.variables.getVariableCollectionByIdAsync(
      l.variableCollectionId
    );
    if (!h)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    if (a = h, e.collectionGuid) {
      const b = a.getSharedPluginData(
        "recursica",
        E
      );
      (!b || b.trim() === "") && a.setSharedPluginData(
        "recursica",
        E,
        e.collectionGuid
      );
    } else
      T(a);
  }
  return await Y(a, e.modes), { collection: a };
}
async function G(e, a) {
  if (oe(e, a), a) {
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
    const r = await figma.variables.importVariableByKeyAsync(
      o[0].key
    ), n = await figma.variables.getVariableCollectionByIdAsync(
      r.variableCollectionId
    );
    if (!n)
      throw new Error(
        `Failed to import external collection "${e}"`
      );
    return n;
  }
}
async function L(e, a) {
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
function Q(e, a) {
  const t = e.resolvedType.toUpperCase(), i = a.toUpperCase();
  return t !== i ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${t}" but expected "${i}". Skipping binding.`
  ), !1) : !0;
}
async function Oe(e, a, t, i, o) {
  for (const [r, n] of Object.entries(a)) {
    const s = i.get(r);
    if (!s) {
      console.warn(
        `Mode ID ${r} not found in mode mapping for variable "${e.name}". Skipping.`
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
        let p = null;
        if (c._varRef !== void 0) {
          const l = t.getVariableByIndex(
            c._varRef
          );
          if (l) {
            let h = null;
            if (o && l._colRef !== void 0) {
              const b = o.getCollectionByIndex(
                l._colRef
              );
              b && (h = (await ne(b)).collection);
            }
            !h && l.collectionName && l.isLocal !== void 0 && (h = await G(
              l.collectionName,
              l.isLocal
            )), h && (p = await L(
              h,
              l.variableName
            ));
          }
        }
        if (!p && c.id)
          try {
            p = await figma.variables.getVariableByIdAsync(
              c.id
            );
          } catch (l) {
          }
        if (p) {
          const l = {
            type: "VARIABLE_ALIAS",
            id: p.id
          };
          e.setValueForMode(s, l);
        } else
          console.warn(
            `Could not resolve variable alias for mode ${r} (mapped to ${s}) in variable "${e.name}". Original ID: ${c.id}`
          );
      }
    } catch (c) {
      console.warn(
        `Error setting value for mode ${r} (mapped to ${s}) in variable "${e.name}":`,
        c
      );
    }
  }
}
async function Z(e, a, t, i, o) {
  const r = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  return e.valuesByMode && await Oe(
    r,
    e.valuesByMode,
    t,
    i,
    o
  ), r;
}
async function se(e, a, t) {
  var o;
  const i = a.getVariableByIndex(e._varRef);
  if (!i)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    let r;
    const n = (o = i._colRef) != null ? o : i.collectionRef;
    if (n !== void 0 && (r = t.getCollectionByIndex(n)), !r && i.collectionId && i.isLocal !== void 0) {
      const p = t.getCollectionIndex(
        i.collectionId
      );
      p >= 0 && (r = t.getCollectionByIndex(p));
    }
    if (!r) {
      const p = await G(
        i.collectionName || "",
        i.isLocal || !1
      );
      let l = await L(p, i.variableName);
      return l ? Q(l, i.variableType) ? l : null : i.valuesByMode ? (l = await Z(
        i,
        p,
        a,
        /* @__PURE__ */ new Map(),
        // Empty mode mapping for legacy
        t
        // Pass collection table for alias resolution
      ), l) : (console.warn(
        `Cannot create variable "${i.variableName}" without valuesByMode data`
      ), null);
    }
    const { collection: s } = await ne(r);
    let c = await L(s, i.variableName);
    if (c)
      return Q(c, i.variableType) ? c : null;
    {
      if (!i.valuesByMode)
        return console.warn(
          `Cannot create variable "${i.variableName}" without valuesByMode data`
        ), null;
      const p = Te(
        s,
        r.modes,
        i.valuesByMode
      );
      return c = await Z(
        i,
        s,
        a,
        p,
        t
        // Pass collection table for alias resolution
      ), c;
    }
  } catch (r) {
    if (console.error(
      `Error resolving variable reference for "${i.variableName}":`,
      r
    ), r instanceof Error && r.message.includes("External collection"))
      throw r;
    return null;
  }
}
function _e(e, a) {
  if (!a || !_(e))
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
async function ze(e, a, t, i, o) {
  if (!(!a || typeof a != "object"))
    try {
      const r = e[t];
      if (!r || !Array.isArray(r))
        return;
      for (const [n, s] of Object.entries(a))
        if (n === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < r.length; c++) {
            let p = null;
            const l = s[c];
            if (_(l) && i && o) {
              const h = await se(
                l,
                i,
                o
              );
              h && r[c].boundVariables && (r[c].boundVariables[t] = {
                type: "VARIABLE_ALIAS",
                id: h.id
              });
            } else l && typeof l == "object" && "type" in l && l.type === "VARIABLE_ALIAS" && (p = l, p && await $e(
              r[c],
              p,
              t,
              i
            ));
          }
        else {
          let c = null;
          _(s) ? c = _e(s, i) : s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && (c = s), c && await ce(e, n, c, i);
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${t}:`, r);
    }
}
async function ce(e, a, t, i) {
  try {
    let o = null;
    try {
      o = await figma.variables.getVariableByIdAsync(t.id);
    } catch (r) {
    }
    if (!o && i) {
      if (t.isLocal) {
        const r = await G(
          t.collectionName || "",
          !0
        );
        o = await L(
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
async function $e(e, a, t, i) {
  if (!(!e || typeof e != "object"))
    try {
      let o = null;
      try {
        o = await figma.variables.getVariableByIdAsync(a.id);
      } catch (r) {
        if (i) {
          if (a.isLocal) {
            const n = await G(
              a.collectionName || "",
              !0
            );
            o = await L(
              n,
              a.variableName || ""
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
      }
      o && e.boundVariables && (e.boundVariables[t] = {
        type: "VARIABLE_ALIAS",
        id: o.id
      });
    } catch (o) {
      console.log("Error binding variable to property object:", o);
    }
}
function Be(e, a) {
  const t = ve(a);
  if (e.visible === void 0 && (e.visible = t.visible), e.locked === void 0 && (e.locked = t.locked), e.opacity === void 0 && (e.opacity = t.opacity), e.rotation === void 0 && (e.rotation = t.rotation), e.blendMode === void 0 && (e.blendMode = t.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const i = x;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (a === "TEXT") {
    const i = I;
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
    if (Be(r, e.type || "FRAME"), e.name !== void 0 && (r.name = e.name || "Unnamed Node"), e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y), e.width !== void 0 && e.height !== void 0 && r.resize(e.width, e.height), e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (r.opacity = e.opacity), e.rotation !== void 0 && (r.rotation = e.rotation), e.blendMode !== void 0 && (r.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && t && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const c = {};
            for (const [p, l] of Object.entries(
              s.boundVariables
            ))
              c[p] = l;
            return N(C({}, s), { boundVariables: c });
          }
          return s;
        })), r.fills = n, (o = e.boundVariables) != null && o.fills && await ze(
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
        if (n !== "fills")
          if (_(s) && t && i) {
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
          } else s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && await ce(
            r,
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
async function Ge(e) {
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
        o = $.fromTable(a.collections), console.log(
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
        await D(
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
    const o = await q(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + t + ")"
    );
    const r = JSON.stringify(o, null, 2), n = JSON.parse(r), s = "Copy - " + n.name, c = figma.createPage();
    if (c.name = s, figma.root.appendChild(c), n.children && n.children.length > 0) {
      let h = function(d) {
        d.forEach((v) => {
          const m = (v.x || 0) + (v.width || 0);
          m > b && (b = m), v.children && v.children.length > 0 && h(v.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let b = 0;
      h(n.children), console.log("Original content rightmost edge: " + b);
      for (const d of n.children)
        await D(d, c, null, null);
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
async function Ue(e) {
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
async function Fe(e) {
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
async function je(e) {
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
async function qe(e) {
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
function F(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const de = "RecursicaPublishedMetadata";
async function De(e) {
  try {
    const a = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (s) => s.id === a.id
    ), o = a.getPluginData(de);
    if (!o) {
      const p = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: F(a.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return U("getComponentMetadata", p);
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
async function He(e) {
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
          const p = {
            _ver: 1,
            id: "",
            name: F(r.name),
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
          name: F(r.name),
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
const O = /* @__PURE__ */ new Map();
let We = 0;
function Je() {
  return `prompt_${Date.now()}_${++We}`;
}
const Xe = {
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
    const t = typeof a == "number" ? { timeoutMs: a } : a, i = (s = t == null ? void 0 : t.timeoutMs) != null ? s : 3e5, o = t == null ? void 0 : t.okLabel, r = t == null ? void 0 : t.cancelLabel, n = Je();
    return new Promise((c, p) => {
      const l = i === -1 ? null : setTimeout(() => {
        O.delete(n), p(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      O.set(n, {
        resolve: c,
        reject: p,
        timeout: l
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: C(C({
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
    const { requestId: a, action: t } = e, i = O.get(a);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${a}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), O.delete(a), t === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
};
async function Ye(e) {
  try {
    const a = e.requestId, t = e.action;
    return !a || !t ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Xe.handleResponse({ requestId: a, action: t }), {
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
const Qe = {
  getCurrentUser: he,
  loadPages: be,
  exportPage: Ve,
  importPage: Ge,
  quickCopy: Ke,
  storeAuthData: Ue,
  loadAuthData: Fe,
  clearAuthData: je,
  storeSelectedRepo: qe,
  getComponentMetadata: De,
  getAllComponents: He,
  pluginPromptResponse: Ye
}, Ze = Qe;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  if (console.log("Received message:", e), e.type === "GenerateGuidResponse") {
    xe(e);
    return;
  }
  const a = e;
  try {
    const t = a.type, i = Ze[t];
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
    figma.ui.postMessage(N(C({}, o), {
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
