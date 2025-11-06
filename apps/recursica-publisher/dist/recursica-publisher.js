var ce = Object.defineProperty, le = Object.defineProperties;
var de = Object.getOwnPropertyDescriptors;
var H = Object.getOwnPropertySymbols;
var pe = Object.prototype.hasOwnProperty, ue = Object.prototype.propertyIsEnumerable;
var $ = (e, r, t) => r in e ? ce(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, v = (e, r) => {
  for (var t in r || (r = {}))
    pe.call(r, t) && $(e, t, r[t]);
  if (H)
    for (var t of H(r))
      ue.call(r, t) && $(e, t, r[t]);
  return e;
}, N = (e, r) => le(e, de(r));
var k = (e, r, t) => $(e, typeof r != "symbol" ? r + "" : r, t);
async function fe(e) {
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
async function me(e) {
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
const x = {
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
}, C = N(v({}, x), {
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
}), P = N(v({}, x), {
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
}), E = N(v({}, x), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), Q = N(v({}, x), {
  cornerRadius: 0
}), ge = N(v({}, x), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function ye(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return C;
    case "TEXT":
      return P;
    case "VECTOR":
      return E;
    case "LINE":
      return ge;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return Q;
    default:
      return x;
  }
}
function f(e, r) {
  if (Array.isArray(e))
    return Array.isArray(r) ? e.length !== r.length || e.some((t, i) => f(t, r[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof r == "object" && r !== null) {
      const t = Object.keys(e), i = Object.keys(r);
      return t.length !== i.length ? !0 : t.some(
        (o) => !(o in r) || f(e[o], r[o])
      );
    }
    return !0;
  }
  return e !== r;
}
class z {
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
      const i = this.collections[t], o = v({
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
    const t = new z(), i = Object.entries(r).sort(
      (a, n) => parseInt(a[0], 10) - parseInt(n[0], 10)
    );
    for (const [a, n] of i) {
      const s = parseInt(a, 10), c = (o = n.isLocal) != null ? o : !0, p = n.collectionId || n.collectionGuid || `temp:${s}:${n.collectionName || "unknown"}`, l = v({
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
      const i = this.variables[t], o = v(v(v(v(v(v({
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
      const c = N(v({}, n), {
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
function he(e) {
  return {
    _varRef: e
  };
}
function T(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
async function Z(e, r, t, i = /* @__PURE__ */ new Set()) {
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
      try {
        const c = await figma.variables.getVariableByIdAsync(s);
        if (!c) {
          o[a] = {
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
          o[a] = {
            type: "VARIABLE_ALIAS",
            id: s
          };
          continue;
        }
        const y = {
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
          const g = await ee(
            d,
            t
          );
          y._colRef = g;
        }
        c.valuesByMode && (y.valuesByMode = await Z(
          c.valuesByMode,
          r,
          t,
          p
        ));
        const b = r.addVariable(y);
        o[a] = {
          type: "VARIABLE_ALIAS",
          id: s,
          _varRef: b
        };
      } catch (c) {
        console.log(
          "Could not resolve variable alias in valuesByMode:",
          s,
          c
        ), o[a] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
      }
    } else
      o[a] = n;
  }
  return o;
}
const D = "recursica:collectionId";
function be(e) {
  const r = e.getSharedPluginData(
    "recursica",
    D
  );
  if (r && r.trim() !== "")
    return r;
  const t = crypto.randomUUID();
  return e.setSharedPluginData("recursica", D, t), t;
}
function Ae(e, r) {
  if (r)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ee(e, r) {
  const t = !e.remote;
  Ae(e.name, t);
  const i = be(e), o = e.modes.map((n) => n.name), a = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: t,
    modes: o,
    collectionGuid: i
  };
  return r.addCollection(a);
}
async function W(e, r, t) {
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
    const n = await ee(
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
    i.valuesByMode && (s.valuesByMode = await Z(
      i.valuesByMode,
      r,
      t,
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const c = r.addVariable(s);
    return he(c);
  } catch (i) {
    return console.log("Could not resolve variable alias:", e.id, i), null;
  }
}
async function O(e, r, t) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const a = e[o];
      if (a && typeof a == "object" && !Array.isArray(a))
        if (a.type === "VARIABLE_ALIAS") {
          const n = await W(
            a,
            r,
            t
          );
          n && (i[o] = n);
        } else
          i[o] = await O(
            a,
            r,
            t
          );
      else Array.isArray(a) ? i[o] = await Promise.all(
        a.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await W(
          n,
          r,
          t
        ) || n : n && typeof n == "object" ? await O(
          n,
          r,
          t
        ) : n)
      ) : i[o] = a;
    }
  return i;
}
async function ve(e, r, t) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (a === "boundVariables" ? o[a] = await O(
          i[a],
          r,
          t
        ) : o[a] = i[a]);
      return o;
    })
  );
}
async function Ce(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (t.type = e.type, i.add("type")), e.id && (t.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (t.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (t.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (t.y = e.y, i.add("y")), e.width !== void 0 && (t.width = e.width, i.add("width")), e.height !== void 0 && (t.height = e.height, i.add("height")), e.visible !== void 0 && f(e.visible, x.visible) && (t.visible = e.visible, i.add("visible")), e.locked !== void 0 && f(e.locked, x.locked) && (t.locked = e.locked, i.add("locked")), e.opacity !== void 0 && f(e.opacity, x.opacity) && (t.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && f(e.rotation, x.rotation) && (t.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && f(e.blendMode, x.blendMode) && (t.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && f(e.effects, x.effects) && (t.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await ve(
      e.fills,
      r.variableTable,
      r.collectionTable
    );
    f(o, x.fills) && (t.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && f(e.strokes, x.strokes) && (t.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && f(e.strokeWeight, x.strokeWeight) && (t.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && f(e.strokeAlign, x.strokeAlign) && (t.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await O(
      e.boundVariables,
      r.variableTable,
      r.collectionTable
    );
    Object.keys(o).length > 0 && (t.boundVariables = o), i.add("boundVariables");
  }
  return t;
}
async function q(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && f(e.layoutMode, C.layoutMode) && (t.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && f(
    e.primaryAxisSizingMode,
    C.primaryAxisSizingMode
  ) && (t.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && f(
    e.counterAxisSizingMode,
    C.counterAxisSizingMode
  ) && (t.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && f(
    e.primaryAxisAlignItems,
    C.primaryAxisAlignItems
  ) && (t.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && f(
    e.counterAxisAlignItems,
    C.counterAxisAlignItems
  ) && (t.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && f(e.paddingLeft, C.paddingLeft) && (t.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && f(e.paddingRight, C.paddingRight) && (t.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && f(e.paddingTop, C.paddingTop) && (t.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && f(e.paddingBottom, C.paddingBottom) && (t.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && f(e.itemSpacing, C.itemSpacing) && (t.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && f(e.cornerRadius, C.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && f(e.clipsContent, C.clipsContent) && (t.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && f(e.layoutWrap, C.layoutWrap) && (t.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && f(e.layoutGrow, C.layoutGrow) && (t.layoutGrow = e.layoutGrow, i.add("layoutGrow")), t;
}
async function xe(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (t.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (t.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (t.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && f(
    e.textAlignHorizontal,
    P.textAlignHorizontal
  ) && (t.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && f(
    e.textAlignVertical,
    P.textAlignVertical
  ) && (t.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && f(e.letterSpacing, P.letterSpacing) && (t.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && f(e.lineHeight, P.lineHeight) && (t.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && f(e.textCase, P.textCase) && (t.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && f(e.textDecoration, P.textDecoration) && (t.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && f(e.textAutoResize, P.textAutoResize) && (t.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && f(
    e.paragraphSpacing,
    P.paragraphSpacing
  ) && (t.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && f(e.paragraphIndent, P.paragraphIndent) && (t.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && f(e.listOptions, P.listOptions) && (t.listOptions = e.listOptions, i.add("listOptions")), t;
}
async function we(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && f(e.fillGeometry, E.fillGeometry) && (t.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && f(e.strokeGeometry, E.strokeGeometry) && (t.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && f(e.strokeCap, E.strokeCap) && (t.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && f(e.strokeJoin, E.strokeJoin) && (t.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && f(e.dashPattern, E.dashPattern) && (t.dashPattern = e.dashPattern, i.add("dashPattern")), t;
}
async function Se(e, r) {
  const t = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && f(e.cornerRadius, Q.cornerRadius) && (t.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (t.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, i.add("pointCount")), t;
}
function Pe(e) {
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
async function Ne(e, r) {
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
          } catch (u) {
            a.componentKey = "(cannot access)";
          }
          try {
            a.componentRemote = o.remote;
          } catch (u) {
            a.componentRemote = "(cannot access)";
          }
          let d = [];
          try {
            d = Object.getOwnPropertyNames(o), a.ownProperties = d;
          } catch (u) {
            a.ownProperties = "(cannot access)";
          }
          const b = [];
          try {
            let u = Object.getPrototypeOf(o);
            for (; u && u !== Object.prototype; )
              b.push(
                ...Object.getOwnPropertyNames(u).filter(
                  (w) => !b.includes(w)
                )
              ), u = Object.getPrototypeOf(u);
            a.prototypeProperties = b;
          } catch (u) {
            a.prototypeProperties = "(cannot access)";
          }
          let g = [];
          try {
            g = Object.keys(o), a.enumerableProperties = g;
          } catch (u) {
            a.enumerableProperties = "(cannot access)";
          }
          const A = [];
          try {
            for (const u of [...d, ...b])
              if (!(u === "instances" || u === "children" || u === "parent"))
                try {
                  typeof o[u] == "function" && A.push(u);
                } catch (w) {
                }
            a.availableMethods = A;
          } catch (u) {
            a.availableMethods = "(cannot access)";
          }
          const m = [];
          try {
            for (const u of [...d, ...b])
              (u.toLowerCase().includes("library") || u.toLowerCase().includes("remote") || u.toLowerCase().includes("file")) && m.push(u);
            a.libraryRelatedProperties = m;
          } catch (u) {
            a.libraryRelatedProperties = "(cannot access)";
          }
          try {
            o.remote !== void 0 && (a.remoteValue = o.remote);
          } catch (u) {
          }
          try {
            o.libraryName !== void 0 && (a.libraryNameValue = o.libraryName);
          } catch (u) {
          }
          try {
            o.libraryKey !== void 0 && (a.libraryKeyValue = o.libraryKey);
          } catch (u) {
          }
          try {
            if (o.parent !== void 0) {
              const u = o.parent;
              if (u) {
                a.mainComponentHasParent = !0;
                try {
                  a.mainComponentParentType = u.type, a.mainComponentParentName = u.name, a.mainComponentParentId = u.id;
                } catch (w) {
                  a.mainComponentParentAccessError = String(w);
                }
              } else
                a.mainComponentHasParent = !1;
            } else
              a.mainComponentParentUndefined = !0;
          } catch (u) {
            a.mainComponentParentCheckError = String(u);
          }
          try {
            o.variantProperties !== void 0 && (a.mainComponentVariantProperties = o.variantProperties);
          } catch (u) {
          }
          try {
            o.componentPropertyDefinitions !== void 0 && (a.mainComponentPropertyDefinitions = Object.keys(
              o.componentPropertyDefinitions
            ));
          } catch (u) {
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
        let c, p;
        const l = [];
        try {
          let d = o.parent;
          const b = [];
          let g = 0;
          const A = 20;
          if (d)
            try {
              if (a.mainComponentParentExists = !0, a.mainComponentParentType = d.type, a.mainComponentParentName = d.name, a.mainComponentParentId = d.id, d.type === "COMPONENT_SET")
                try {
                  const m = d.parent;
                  if (m === null)
                    a.componentSetParentIsNull = !0;
                  else if (m === void 0)
                    a.componentSetParentIsUndefined = !0;
                  else {
                    a.componentSetParentExists = !0;
                    try {
                      a.componentSetParentType = m.type, a.componentSetParentName = m.name;
                    } catch (u) {
                      a.componentSetParentPropertyAccessError = String(u);
                    }
                  }
                } catch (m) {
                  a.componentSetParentCheckError = String(m);
                }
            } catch (m) {
              a.mainComponentParentDebugError = String(m);
            }
          else
            a.mainComponentParentExists = !1;
          for (; d && g < A; )
            try {
              const m = d.type, u = d.name;
              if (l.push(
                `${m}:${u || "(unnamed)"}`
              ), m === "COMPONENT_SET" && !p && (p = u, a.componentSetName = u, a.componentSetFound = !0), m === "PAGE")
                break;
              u && u.trim() !== "" && b.unshift(u);
              let w, M = !1;
              try {
                "parent" in d ? (M = !0, a[`hasParentPropertyAtDepth${g}`] = !0, w = d.parent, w === null ? a[`parentIsNullAtDepth${g}`] = !0 : w === void 0 ? a[`parentIsUndefinedAtDepth${g}`] = !0 : a[`parentExistsAtDepth${g}`] = !0) : a[`noParentPropertyAtDepth${g}`] = !0;
              } catch (S) {
                a.parentAccessErrorAtDepth = g, a.parentAccessError = String(S), a.parentAccessErrorName = S instanceof Error ? S.name : "Unknown", a.parentAccessErrorMessage = S instanceof Error ? S.message : String(S);
                break;
              }
              if (!w) {
                a.noParentAtDepth = g, a.parentAccessAttemptedAtDepth = M;
                break;
              }
              try {
                const S = w.type, se = w.name;
                a[`parentAtDepth${g + 1}Type`] = S, a[`parentAtDepth${g + 1}Name`] = se;
              } catch (S) {
                a.nextParentAccessErrorAtDepth = g, a.nextParentAccessError = String(S);
              }
              d = w, g++;
            } catch (m) {
              a.parentTraverseErrorAtDepth = g, a.parentTraverseError = String(m), a.parentTraverseErrorName = m instanceof Error ? m.name : "Unknown", a.parentTraverseErrorMessage = m instanceof Error ? m.message : String(m);
              break;
            }
          c = b.join("/"), a.mainComponentParentChain = l, a.mainComponentParentChainDepth = g, a.mainComponentParentPath = c, a.mainComponentParentPathParts = b;
        } catch (d) {
          a.mainComponentParentPathError = String(d);
        }
        const h = Pe(e);
        if (a.instanceParentPath = h, t.mainComponent = {
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
                if (d && (a.publishStatus = d, d && typeof d == "object")) {
                  d.libraryName && (t.mainComponent.libraryName = d.libraryName), d.libraryKey && (t.mainComponent.libraryKey = d.libraryKey), d.fileKey && (t.mainComponent.fileKey = d.fileKey);
                  const b = {};
                  Object.keys(d).forEach((g) => {
                    (g.toLowerCase().includes("library") || g.toLowerCase().includes("file")) && (b[g] = d[g]);
                  }), Object.keys(b).length > 0 && (a.libraryRelatedFromPublishStatus = b);
                }
              } catch (d) {
                a.publishStatusError = String(d);
              }
            try {
              const d = figma.teamLibrary, b = Object.getOwnPropertyNames(
                d
              ).filter((g) => typeof d[g] == "function");
              if (a.teamLibraryAvailableMethods = b, typeof (d == null ? void 0 : d.getAvailableLibraryComponentSetsAsync) == "function") {
                const g = await d.getAvailableLibraryComponentSetsAsync();
                if (a.availableComponentSetsCount = (g == null ? void 0 : g.length) || 0, g && Array.isArray(g)) {
                  const A = [];
                  for (const m of g)
                    try {
                      const u = {
                        name: m.name,
                        key: m.key,
                        libraryName: m.libraryName,
                        libraryKey: m.libraryKey
                      };
                      if (A.push(u), m.key === o.key || m.name === o.name) {
                        a.matchingComponentSet = u, m.libraryName && (t.mainComponent.libraryName = m.libraryName), m.libraryKey && (t.mainComponent.libraryKey = m.libraryKey);
                        break;
                      }
                    } catch (u) {
                      A.push({
                        error: String(u)
                      });
                    }
                  a.componentSets = A;
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
function _(e) {
  let r = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    r += _(t);
  }), r;
}
async function F(e, r = /* @__PURE__ */ new WeakSet(), t = {}) {
  var h, y, d, b, g;
  if (!e || typeof e != "object")
    return e;
  const i = (h = t.maxNodes) != null ? h : 1e4, o = (y = t.nodeCount) != null ? y : 0;
  if (o >= i)
    return {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  const a = {
    visited: (d = t.visited) != null ? d : /* @__PURE__ */ new WeakSet(),
    depth: (b = t.depth) != null ? b : 0,
    maxDepth: (g = t.maxDepth) != null ? g : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: t.variableTable,
    collectionTable: t.collectionTable
  };
  if (r.has(e))
    return "[Circular Reference]";
  r.add(e), a.visited = r;
  const n = {}, s = await Ce(e, a);
  Object.assign(n, s);
  const c = e.type;
  if (c)
    switch (c) {
      case "FRAME":
      case "COMPONENT": {
        const A = await q(e);
        Object.assign(n, A);
        break;
      }
      case "INSTANCE": {
        const A = await Ne(
          e
        );
        Object.assign(n, A);
        const m = await q(
          e
        );
        Object.assign(n, m);
        break;
      }
      case "TEXT": {
        const A = await xe(e);
        Object.assign(n, A);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const A = await we(e);
        Object.assign(n, A);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const A = await Se(e);
        Object.assign(n, A);
        break;
      }
      default:
        a.unhandledKeys.add("_unknownType");
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
  for (const A of p)
    typeof e[A] != "function" && (l.has(A) || a.unhandledKeys.add(A));
  if (a.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(a.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const A = a.maxDepth;
    if (a.depth >= A)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${A}) reached`,
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
      const m = N(v({}, a), {
        depth: a.depth + 1
      }), u = [];
      let w = !1;
      for (const M of e.children) {
        if (m.nodeCount >= i) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: u.length,
            _total: e.children.length,
            children: u
          }, w = !0;
          break;
        }
        const S = await F(M, r, m);
        u.push(S), m.nodeCount && (a.nodeCount = m.nodeCount);
      }
      w || (n.children = u);
    }
  }
  return n;
}
async function Ie(e) {
  try {
    const r = e.pageIndex;
    if (r === void 0 || typeof r != "number")
      return {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    if (r < 0 || r >= t.length)
      return {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const i = t[r];
    console.log("Exporting page: " + i.name);
    const o = new B(), a = new z();
    let n = [];
    try {
      n = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((d) => ({
        libraryName: d.libraryName,
        key: d.key,
        name: d.name
      }));
    } catch (y) {
      console.log(
        "Could not get library variable collections:",
        y instanceof Error ? y.message : String(y)
      );
    }
    const s = await F(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: a
      }
    ), c = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.5.0",
        // Updated version for collection GUID system and serialized collection table
        figmaApiVersion: figma.apiVersion,
        originalPageName: i.name,
        totalNodes: _(s),
        pluginVersion: "1.0.0"
      },
      collections: a.getSerializedTable(),
      variables: o.getSerializedTable(),
      libraries: n,
      pageData: s
    }, p = JSON.stringify(c, null, 2), l = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return console.log(
      "Export complete. Total nodes:",
      _(s)
    ), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: l,
        jsonData: p,
        pageName: i.name,
        additionalPages: []
        // Will be populated when publishing referenced component pages
      }
    };
  } catch (r) {
    return console.error("Error exporting page:", r), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function J(e, r) {
  for (const t of r)
    e.modes.find((o) => o.name === t) || e.addMode(t);
}
function ke(e, r, t) {
  const i = /* @__PURE__ */ new Map(), o = Object.keys(t);
  for (let a = 0; a < r.length && a < o.length; a++) {
    const n = r[a], s = o[a], c = e.modes.find((p) => p.name === n);
    c ? i.set(s, c.modeId) : console.warn(
      `Mode "${n}" not found in collection "${e.name}" after ensuring modes exist.`
    );
  }
  return i;
}
const I = "recursica:collectionId";
function L(e) {
  const r = e.getSharedPluginData(
    "recursica",
    I
  );
  if (r && r.trim() !== "")
    return r;
  const t = crypto.randomUUID();
  return e.setSharedPluginData("recursica", I, t), t;
}
function te(e, r) {
  if (r)
    return;
  const t = e.trim().toLowerCase();
  if (!["token", "tokens", "theme", "themes"].includes(t))
    throw new Error(
      `Invalid collection name: "${e}". Non-local collections must be named "Token", "Tokens", "Theme", or "Themes" (case-insensitive).`
    );
}
async function ae(e) {
  let r;
  const t = e.collectionName.trim().toLowerCase(), i = ["token", "tokens", "theme", "themes"], o = e.isLocal;
  if (o === !1 || o === void 0 && i.includes(t))
    try {
      const s = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find((c) => c.name.trim().toLowerCase() === t);
      if (s) {
        te(e.collectionName, !1);
        const c = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
          s.key
        );
        if (c.length > 0) {
          const p = await figma.variables.importVariableByKeyAsync(c[0].key), l = await figma.variables.getVariableCollectionByIdAsync(
            p.variableCollectionId
          );
          if (l) {
            if (r = l, e.collectionGuid) {
              const h = r.getSharedPluginData(
                "recursica",
                I
              );
              (!h || h.trim() === "") && r.setSharedPluginData(
                "recursica",
                I,
                e.collectionGuid
              );
            } else
              L(r);
            return await J(r, e.modes), { collection: r };
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
    if (e.collectionGuid && (s = n.find((c) => c.getSharedPluginData("recursica", I) === e.collectionGuid)), s || (s = n.find(
      (c) => c.name === e.collectionName
    )), s)
      if (r = s, e.collectionGuid) {
        const c = r.getSharedPluginData(
          "recursica",
          I
        );
        (!c || c.trim() === "") && r.setSharedPluginData(
          "recursica",
          I,
          e.collectionGuid
        );
      } else
        L(r);
    else
      r = figma.variables.createVariableCollection(
        e.collectionName
      ), e.collectionGuid ? r.setSharedPluginData(
        "recursica",
        I,
        e.collectionGuid
      ) : L(r);
  } else {
    const n = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), s = e.collectionName.trim().toLowerCase(), c = n.find((y) => y.name.trim().toLowerCase() === s);
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
    if (r = h, e.collectionGuid) {
      const y = r.getSharedPluginData(
        "recursica",
        I
      );
      (!y || y.trim() === "") && r.setSharedPluginData(
        "recursica",
        I,
        e.collectionGuid
      );
    } else
      L(r);
  }
  return await J(r, e.modes), { collection: r };
}
async function G(e, r) {
  if (te(e, r), r) {
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
async function R(e, r) {
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
function X(e, r) {
  const t = e.resolvedType.toUpperCase(), i = r.toUpperCase();
  return t !== i ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${t}" but expected "${i}". Skipping binding.`
  ), !1) : !0;
}
async function Ee(e, r, t, i, o) {
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
        let p = null;
        if (c._varRef !== void 0) {
          const l = t.getVariableByIndex(
            c._varRef
          );
          if (l) {
            let h = null;
            if (o && l._colRef !== void 0) {
              const y = o.getCollectionByIndex(
                l._colRef
              );
              y && (h = (await ae(y)).collection);
            }
            !h && l.collectionName && l.isLocal !== void 0 && (h = await G(
              l.collectionName,
              l.isLocal
            )), h && (p = await R(
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
async function Y(e, r, t, i, o) {
  const a = figma.variables.createVariable(
    e.variableName,
    r,
    e.variableType
  );
  return e.valuesByMode && await Ee(
    a,
    e.valuesByMode,
    t,
    i,
    o
  ), a;
}
async function re(e, r, t) {
  var o;
  const i = r.getVariableByIndex(e._varRef);
  if (!i)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    let a;
    const n = (o = i._colRef) != null ? o : i.collectionRef;
    if (n !== void 0 && (a = t.getCollectionByIndex(n)), !a && i.collectionId && i.isLocal !== void 0) {
      const p = t.getCollectionIndex(
        i.collectionId
      );
      p >= 0 && (a = t.getCollectionByIndex(p));
    }
    if (!a) {
      const p = await G(
        i.collectionName || "",
        i.isLocal || !1
      );
      let l = await R(p, i.variableName);
      return l ? X(l, i.variableType) ? l : null : i.valuesByMode ? (l = await Y(
        i,
        p,
        r,
        /* @__PURE__ */ new Map(),
        // Empty mode mapping for legacy
        t
        // Pass collection table for alias resolution
      ), l) : (console.warn(
        `Cannot create variable "${i.variableName}" without valuesByMode data`
      ), null);
    }
    const { collection: s } = await ae(a);
    let c = await R(s, i.variableName);
    if (c)
      return X(c, i.variableType) ? c : null;
    {
      if (!i.valuesByMode)
        return console.warn(
          `Cannot create variable "${i.variableName}" without valuesByMode data`
        ), null;
      const p = ke(
        s,
        a.modes,
        i.valuesByMode
      );
      return c = await Y(
        i,
        s,
        r,
        p,
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
function Re(e, r) {
  if (!r || !T(e))
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
async function Me(e, r, t, i, o) {
  if (!(!r || typeof r != "object"))
    try {
      const a = e[t];
      if (!a || !Array.isArray(a))
        return;
      for (const [n, s] of Object.entries(r))
        if (n === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < a.length; c++) {
            let p = null;
            const l = s[c];
            if (T(l) && i && o) {
              const h = await re(
                l,
                i,
                o
              );
              h && a[c].boundVariables && (a[c].boundVariables[t] = {
                type: "VARIABLE_ALIAS",
                id: h.id
              });
            } else l && typeof l == "object" && "type" in l && l.type === "VARIABLE_ALIAS" && (p = l, p && await Le(
              a[c],
              p,
              t,
              i
            ));
          }
        else {
          let c = null;
          T(s) ? c = Re(s, i) : s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && (c = s), c && await ie(e, n, c, i);
        }
    } catch (a) {
      console.log(`Error restoring bound variables for ${t}:`, a);
    }
}
async function ie(e, r, t, i) {
  try {
    let o = null;
    try {
      o = await figma.variables.getVariableByIdAsync(t.id);
    } catch (a) {
    }
    if (!o && i) {
      if (t.isLocal) {
        const a = await G(
          t.collectionName || "",
          !0
        );
        o = await R(
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
async function Le(e, r, t, i) {
  if (!(!e || typeof e != "object"))
    try {
      let o = null;
      try {
        o = await figma.variables.getVariableByIdAsync(r.id);
      } catch (a) {
        if (i) {
          if (r.isLocal) {
            const n = await G(
              r.collectionName || "",
              !0
            );
            o = await R(
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
function Ve(e, r) {
  const t = ye(r);
  if (e.visible === void 0 && (e.visible = t.visible), e.locked === void 0 && (e.locked = t.locked), e.opacity === void 0 && (e.opacity = t.opacity), e.rotation === void 0 && (e.rotation = t.rotation), e.blendMode === void 0 && (e.blendMode = t.blendMode), r === "FRAME" || r === "COMPONENT" || r === "INSTANCE") {
    const i = C;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (r === "TEXT") {
    const i = P;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function j(e, r, t = null, i = null) {
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
    if (Ve(a, e.type || "FRAME"), e.name !== void 0 && (a.name = e.name || "Unnamed Node"), e.x !== void 0 && (a.x = e.x), e.y !== void 0 && (a.y = e.y), e.width !== void 0 && e.height !== void 0 && a.resize(e.width, e.height), e.visible !== void 0 && (a.visible = e.visible), e.locked !== void 0 && (a.locked = e.locked), e.opacity !== void 0 && (a.opacity = e.opacity), e.rotation !== void 0 && (a.rotation = e.rotation), e.blendMode !== void 0 && (a.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && t && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const c = {};
            for (const [p, l] of Object.entries(
              s.boundVariables
            ))
              c[p] = l;
            return N(v({}, s), { boundVariables: c });
          }
          return s;
        })), a.fills = n, (o = e.boundVariables) != null && o.fills && await Me(
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
          if (T(s) && t && i) {
            const c = await re(
              s,
              t,
              i
            );
            if (c) {
              const p = {
                type: "VARIABLE_ALIAS",
                id: c.id
              };
              a.boundVariables || (a.boundVariables = {}), a.boundVariables[n] || (a.boundVariables[n] = p);
            }
          } else s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && await ie(
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
        const s = await j(
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
async function Te(e) {
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
        o = z.fromTable(r.collections), console.log(
          `Loaded collections table with ${o.getSize()} collections`
        );
      } catch (y) {
        console.warn("Failed to load collections table:", y);
      }
    let a = null;
    if (r.variables)
      try {
        a = B.fromTable(r.variables), console.log(
          `Loaded variable table with ${a.getSize()} variables`
        );
      } catch (y) {
        console.warn("Failed to load variable table:", y);
      }
    const n = "2.3.0", s = i.exportFormatVersion || "1.0.0";
    s !== n && console.warn(
      `Export format version mismatch: exported with ${s}, current version is ${n}. Import may have compatibility issues.`
    );
    const p = "Imported - " + (i.originalPageName ? i.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), l = figma.createPage();
    if (l.name = p, figma.root.appendChild(l), console.log("Created new page: " + p), console.log("Importing " + (i.totalNodes || "unknown") + " nodes"), t.children && Array.isArray(t.children)) {
      for (const y of t.children) {
        if (y._truncated) {
          console.log(
            `Skipping truncated children: ${y._reason || "Unknown"}`
          );
          continue;
        }
        await j(
          y,
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
async function Oe(e) {
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
    const o = await F(
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
        d.forEach((b) => {
          const g = (b.x || 0) + (b.width || 0);
          g > y && (y = g), b.children && b.children.length > 0 && h(b.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let y = 0;
      h(n.children), console.log("Original content rightmost edge: " + y);
      for (const d of n.children)
        await j(d, c, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const p = _(n);
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
async function _e(e) {
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
async function ze(e) {
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
async function Be(e) {
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
async function Ge(e) {
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
function K(e, r = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: r
  };
}
function oe(e, r, t = {}) {
  const i = r instanceof Error ? r.message : r;
  return {
    type: e,
    success: !1,
    error: !0,
    message: i,
    data: t
  };
}
function U(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const ne = "RecursicaPublishedMetadata";
async function $e(e) {
  try {
    const r = figma.currentPage;
    await figma.loadAllPagesAsync();
    const i = figma.root.children.findIndex(
      (s) => s.id === r.id
    ), o = r.getPluginData(ne);
    if (!o) {
      const p = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: U(r.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: i
      };
      return K("getComponentMetadata", p);
    }
    const n = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: i
    };
    return K("getComponentMetadata", n);
  } catch (r) {
    return console.error("Error getting component metadata:", r), oe(
      "getComponentMetadata",
      r instanceof Error ? r : "Unknown error occurred"
    );
  }
}
async function Ke(e) {
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
      const a = o, n = a.getPluginData(ne);
      if (n)
        try {
          const s = JSON.parse(n);
          t.push(s);
        } catch (s) {
          console.warn(
            `Failed to parse metadata for page "${a.name}":`,
            s
          );
          const p = {
            _ver: 1,
            id: "",
            name: U(a.name),
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
          name: U(a.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        t.push(c);
      }
    }
    return K("getAllComponents", {
      components: t
    });
  } catch (r) {
    return console.error("Error getting all components:", r), oe(
      "getAllComponents",
      r instanceof Error ? r : "Unknown error occurred"
    );
  }
}
const V = /* @__PURE__ */ new Map();
let Ue = 0;
function Fe() {
  return `prompt_${Date.now()}_${++Ue}`;
}
const je = {
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
    const t = typeof r == "number" ? { timeoutMs: r } : r, i = (s = t == null ? void 0 : t.timeoutMs) != null ? s : 3e5, o = t == null ? void 0 : t.okLabel, a = t == null ? void 0 : t.cancelLabel, n = Fe();
    return new Promise((c, p) => {
      const l = i === -1 ? null : setTimeout(() => {
        V.delete(n), p(new Error(`Plugin prompt timeout: ${e}`));
      }, i);
      V.set(n, {
        resolve: c,
        reject: p,
        timeout: l
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: v(v({
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
    const { requestId: r, action: t } = e, i = V.get(r);
    if (!i) {
      console.warn(
        `Received response for unknown prompt request: ${r}`
      );
      return;
    }
    i.timeout && clearTimeout(i.timeout), V.delete(r), t === "ok" ? i.resolve() : i.reject(new Error("User cancelled"));
  }
};
async function He(e) {
  try {
    const r = e.requestId, t = e.action;
    return !r || !t ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (je.handleResponse({ requestId: r, action: t }), {
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
const De = {
  getCurrentUser: fe,
  loadPages: me,
  exportPage: Ie,
  importPage: Te,
  quickCopy: Oe,
  storeAuthData: _e,
  loadAuthData: ze,
  clearAuthData: Be,
  storeSelectedRepo: Ge,
  getComponentMetadata: $e,
  getAllComponents: Ke,
  pluginPromptResponse: He
}, We = De;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  console.log("Received message:", e);
  try {
    const r = e.type, t = We[r];
    if (!t) {
      console.warn("Unknown message type:", e.type);
      const o = {
        type: e.type,
        success: !1,
        error: !0,
        message: "Unknown message type: " + e.type,
        data: {},
        requestId: e.requestId
      };
      figma.ui.postMessage(o);
      return;
    }
    const i = await t(e.data);
    figma.ui.postMessage(N(v({}, i), {
      requestId: e.requestId
    }));
  } catch (r) {
    console.error("Error handling message:", r);
    const t = {
      type: e.type,
      success: !1,
      error: !0,
      message: r instanceof Error ? r.message : "Unknown error occurred",
      data: {},
      requestId: e.requestId
    };
    figma.ui.postMessage(t);
  }
};
