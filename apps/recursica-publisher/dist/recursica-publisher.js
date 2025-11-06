var ae = Object.defineProperty, ie = Object.defineProperties;
var oe = Object.getOwnPropertyDescriptors;
var U = Object.getOwnPropertySymbols;
var ne = Object.prototype.hasOwnProperty, se = Object.prototype.propertyIsEnumerable;
var z = (e, i, t) => i in e ? ae(e, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[i] = t, v = (e, i) => {
  for (var t in i || (i = {}))
    ne.call(i, t) && z(e, t, i[t]);
  if (U)
    for (var t of U(i))
      se.call(i, t) && z(e, t, i[t]);
  return e;
}, E = (e, i) => ie(e, oe(i));
var I = (e, i, t) => z(e, typeof i != "symbol" ? i + "" : i, t);
async function ce(e) {
  var i;
  try {
    return {
      type: "getCurrentUser",
      success: !0,
      error: !1,
      message: "Current user retrieved successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        userId: ((i = figma.currentUser) == null ? void 0 : i.id) || null
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
async function le(e) {
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
  } catch (i) {
    return console.error("Error loading pages:", i), {
      type: "loadPages",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
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
}, C = E(v({}, x), {
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
}), P = E(v({}, x), {
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
}), N = E(v({}, x), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), J = E(v({}, x), {
  cornerRadius: 0
}), pe = E(v({}, x), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function de(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return C;
    case "TEXT":
      return P;
    case "VECTOR":
      return N;
    case "LINE":
      return pe;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return J;
    default:
      return x;
  }
}
function f(e, i) {
  if (Array.isArray(e))
    return Array.isArray(i) ? e.length !== i.length || e.some((t, a) => f(t, i[a])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof i == "object" && i !== null) {
      const t = Object.keys(e), a = Object.keys(i);
      return t.length !== a.length ? !0 : t.some(
        (o) => !(o in i) || f(e[o], i[o])
      );
    }
    return !0;
  }
  return e !== i;
}
class O {
  constructor() {
    I(this, "collectionMap");
    // collectionId -> index
    I(this, "collections");
    // index -> collection data
    I(this, "nextIndex");
    this.collectionMap = /* @__PURE__ */ new Map(), this.collections = [], this.nextIndex = 0;
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(i) {
    const t = i.collectionId;
    if (this.collectionMap.has(t))
      return this.collectionMap.get(t);
    const a = this.nextIndex++;
    return this.collectionMap.set(t, a), this.collections[a] = i, a;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(i) {
    var t;
    return (t = this.collectionMap.get(i)) != null ? t : -1;
  }
  /**
   * Gets a collection entry by index
   */
  getCollectionByIndex(i) {
    return this.collections[i];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   */
  getTable() {
    const i = {};
    for (let t = 0; t < this.collections.length; t++)
      i[String(t)] = this.collections[t];
    return i;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   */
  static fromTable(i) {
    const t = new O(), a = Object.entries(i).sort(
      (o, r) => parseInt(o[0], 10) - parseInt(r[0], 10)
    );
    for (const [o, r] of a) {
      const n = parseInt(o, 10);
      t.collectionMap.set(r.collectionId, n), t.collections[n] = r, t.nextIndex = Math.max(
        t.nextIndex,
        n + 1
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
class _ {
  constructor() {
    I(this, "variableMap");
    // variableKey -> index
    I(this, "variables");
    // index -> variable data
    I(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(i) {
    const t = i.variableKey;
    if (!t)
      return -1;
    if (this.variableMap.has(t))
      return this.variableMap.get(t);
    const a = this.nextIndex++;
    return this.variableMap.set(t, a), this.variables[a] = i, a;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(i) {
    var t;
    return (t = this.variableMap.get(i)) != null ? t : -1;
  }
  /**
   * Gets a variable entry by index
   */
  getVariableByIndex(i) {
    return this.variables[i];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   * Includes all fields (for backward compatibility)
   */
  getTable() {
    const i = {};
    for (let t = 0; t < this.variables.length; t++)
      i[String(t)] = this.variables[t];
    return i;
  }
  /**
   * Gets the table with only serialized fields (excludes internal-only fields)
   * Used for JSON serialization to reduce size
   * Filters out: variableKey, id, collectionName, collectionId, isLocal
   * Keeps: variableName, variableType, _colRef, valuesByMode, and legacy collectionRef
   */
  getSerializedTable() {
    const i = {};
    for (let t = 0; t < this.variables.length; t++) {
      const a = this.variables[t], o = v(v(v(v(v(v({
        variableName: a.variableName,
        variableType: a.variableType
      }, a._colRef !== void 0 && { _colRef: a._colRef }), a.valuesByMode && { valuesByMode: a.valuesByMode }), a._colRef === void 0 && a.collectionRef !== void 0 && {
        collectionRef: a.collectionRef
      }), a._colRef === void 0 && a.collectionName && { collectionName: a.collectionName }), a._colRef === void 0 && a.collectionId && { collectionId: a.collectionId }), a._colRef === void 0 && a.isLocal !== void 0 && { isLocal: a.isLocal });
      i[String(t)] = o;
    }
    return i;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   */
  static fromTable(i) {
    var o;
    const t = new _(), a = Object.entries(i).sort(
      (r, n) => parseInt(r[0], 10) - parseInt(n[0], 10)
    );
    for (const [r, n] of a) {
      const s = parseInt(r, 10);
      n.variableKey && t.variableMap.set(n.variableKey, s);
      const c = E(v({}, n), {
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
function fe(e) {
  return {
    _varRef: e
  };
}
function V(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
async function D(e, i, t, a = /* @__PURE__ */ new Set()) {
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
      if (a.has(s)) {
        o[r] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      try {
        const c = await figma.variables.getVariableByIdAsync(s);
        if (!c) {
          o[r] = {
            type: "VARIABLE_ALIAS",
            id: s
          };
          continue;
        }
        const u = new Set(a);
        u.add(s);
        const l = await figma.variables.getVariableCollectionByIdAsync(
          c.variableCollectionId
        ), y = c.key;
        if (!y) {
          o[r] = {
            type: "VARIABLE_ALIAS",
            id: s
          };
          continue;
        }
        const h = {
          variableName: c.name,
          variableType: c.resolvedType,
          collectionName: l == null ? void 0 : l.name,
          collectionId: c.variableCollectionId,
          variableKey: y,
          id: s,
          isLocal: !c.remote
        }, p = await figma.variables.getVariableCollectionByIdAsync(
          c.variableCollectionId
        );
        if (p) {
          const g = await X(
            p,
            t
          );
          h._colRef = g;
        }
        c.valuesByMode && (h.valuesByMode = await D(
          c.valuesByMode,
          i,
          t,
          u
        ));
        const b = i.addVariable(h);
        o[r] = {
          type: "VARIABLE_ALIAS",
          id: s,
          _varRef: b
        };
      } catch (c) {
        console.log(
          "Could not resolve variable alias in valuesByMode:",
          s,
          c
        ), o[r] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
      }
    } else
      o[r] = n;
  }
  return o;
}
async function X(e, i) {
  const t = {};
  for (const o of e.modes)
    t[o.modeId] = o.name;
  const a = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: !e.remote,
    modes: t
  };
  return i.addCollection(a);
}
async function G(e, i, t) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const a = await figma.variables.getVariableByIdAsync(e.id);
    if (!a)
      return console.log("Could not resolve variable alias:", e.id), null;
    const o = await figma.variables.getVariableCollectionByIdAsync(
      a.variableCollectionId
    );
    if (!o)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const r = a.key;
    if (!r)
      return console.log("Variable missing key:", e.id), null;
    const n = await X(
      o,
      t
    ), s = {
      variableName: a.name,
      variableType: a.resolvedType,
      _colRef: n,
      // Reference to collection table (v2.4.0+)
      variableKey: r,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    a.valuesByMode && (s.valuesByMode = await D(
      a.valuesByMode,
      i,
      t,
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const c = i.addVariable(s);
    return fe(c);
  } catch (a) {
    return console.log("Could not resolve variable alias:", e.id, a), null;
  }
}
async function L(e, i, t) {
  if (!e || typeof e != "object") return e;
  const a = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const r = e[o];
      if (r && typeof r == "object" && !Array.isArray(r))
        if (r.type === "VARIABLE_ALIAS") {
          const n = await G(
            r,
            i,
            t
          );
          n && (a[o] = n);
        } else
          a[o] = await L(
            r,
            i,
            t
          );
      else Array.isArray(r) ? a[o] = await Promise.all(
        r.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await G(
          n,
          i,
          t
        ) || n : n && typeof n == "object" ? await L(
          n,
          i,
          t
        ) : n)
      ) : a[o] = r;
    }
  return a;
}
async function ue(e, i, t) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (a) => {
      if (!a || typeof a != "object") return a;
      const o = {};
      for (const r in a)
        Object.prototype.hasOwnProperty.call(a, r) && (r === "boundVariables" ? o[r] = await L(
          a[r],
          i,
          t
        ) : o[r] = a[r]);
      return o;
    })
  );
}
async function me(e, i) {
  const t = {}, a = /* @__PURE__ */ new Set();
  if (e.type && (t.type = e.type, a.add("type")), e.id && (t.id = e.id, a.add("id")), e.name !== void 0 && e.name !== "" && (t.name = e.name, a.add("name")), e.x !== void 0 && e.x !== 0 && (t.x = e.x, a.add("x")), e.y !== void 0 && e.y !== 0 && (t.y = e.y, a.add("y")), e.width !== void 0 && (t.width = e.width, a.add("width")), e.height !== void 0 && (t.height = e.height, a.add("height")), e.visible !== void 0 && f(e.visible, x.visible) && (t.visible = e.visible, a.add("visible")), e.locked !== void 0 && f(e.locked, x.locked) && (t.locked = e.locked, a.add("locked")), e.opacity !== void 0 && f(e.opacity, x.opacity) && (t.opacity = e.opacity, a.add("opacity")), e.rotation !== void 0 && f(e.rotation, x.rotation) && (t.rotation = e.rotation, a.add("rotation")), e.blendMode !== void 0 && f(e.blendMode, x.blendMode) && (t.blendMode = e.blendMode, a.add("blendMode")), e.effects !== void 0 && f(e.effects, x.effects) && (t.effects = e.effects, a.add("effects")), e.fills !== void 0) {
    const o = await ue(
      e.fills,
      i.variableTable,
      i.collectionTable
    );
    f(o, x.fills) && (t.fills = o), a.add("fills");
  }
  if (e.strokes !== void 0 && f(e.strokes, x.strokes) && (t.strokes = e.strokes, a.add("strokes")), e.strokeWeight !== void 0 && f(e.strokeWeight, x.strokeWeight) && (t.strokeWeight = e.strokeWeight, a.add("strokeWeight")), e.strokeAlign !== void 0 && f(e.strokeAlign, x.strokeAlign) && (t.strokeAlign = e.strokeAlign, a.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await L(
      e.boundVariables,
      i.variableTable,
      i.collectionTable
    );
    Object.keys(o).length > 0 && (t.boundVariables = o), a.add("boundVariables");
  }
  return t;
}
async function H(e, i) {
  const t = {}, a = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && f(e.layoutMode, C.layoutMode) && (t.layoutMode = e.layoutMode, a.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && f(
    e.primaryAxisSizingMode,
    C.primaryAxisSizingMode
  ) && (t.primaryAxisSizingMode = e.primaryAxisSizingMode, a.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && f(
    e.counterAxisSizingMode,
    C.counterAxisSizingMode
  ) && (t.counterAxisSizingMode = e.counterAxisSizingMode, a.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && f(
    e.primaryAxisAlignItems,
    C.primaryAxisAlignItems
  ) && (t.primaryAxisAlignItems = e.primaryAxisAlignItems, a.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && f(
    e.counterAxisAlignItems,
    C.counterAxisAlignItems
  ) && (t.counterAxisAlignItems = e.counterAxisAlignItems, a.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && f(e.paddingLeft, C.paddingLeft) && (t.paddingLeft = e.paddingLeft, a.add("paddingLeft")), e.paddingRight !== void 0 && f(e.paddingRight, C.paddingRight) && (t.paddingRight = e.paddingRight, a.add("paddingRight")), e.paddingTop !== void 0 && f(e.paddingTop, C.paddingTop) && (t.paddingTop = e.paddingTop, a.add("paddingTop")), e.paddingBottom !== void 0 && f(e.paddingBottom, C.paddingBottom) && (t.paddingBottom = e.paddingBottom, a.add("paddingBottom")), e.itemSpacing !== void 0 && f(e.itemSpacing, C.itemSpacing) && (t.itemSpacing = e.itemSpacing, a.add("itemSpacing")), e.cornerRadius !== void 0 && f(e.cornerRadius, C.cornerRadius) && (t.cornerRadius = e.cornerRadius, a.add("cornerRadius")), e.clipsContent !== void 0 && f(e.clipsContent, C.clipsContent) && (t.clipsContent = e.clipsContent, a.add("clipsContent")), e.layoutWrap !== void 0 && f(e.layoutWrap, C.layoutWrap) && (t.layoutWrap = e.layoutWrap, a.add("layoutWrap")), e.layoutGrow !== void 0 && f(e.layoutGrow, C.layoutGrow) && (t.layoutGrow = e.layoutGrow, a.add("layoutGrow")), t;
}
async function ge(e, i) {
  const t = {}, a = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (t.characters = e.characters, a.add("characters")), e.fontName !== void 0 && (t.fontName = e.fontName, a.add("fontName")), e.fontSize !== void 0 && (t.fontSize = e.fontSize, a.add("fontSize")), e.textAlignHorizontal !== void 0 && f(
    e.textAlignHorizontal,
    P.textAlignHorizontal
  ) && (t.textAlignHorizontal = e.textAlignHorizontal, a.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && f(
    e.textAlignVertical,
    P.textAlignVertical
  ) && (t.textAlignVertical = e.textAlignVertical, a.add("textAlignVertical")), e.letterSpacing !== void 0 && f(e.letterSpacing, P.letterSpacing) && (t.letterSpacing = e.letterSpacing, a.add("letterSpacing")), e.lineHeight !== void 0 && f(e.lineHeight, P.lineHeight) && (t.lineHeight = e.lineHeight, a.add("lineHeight")), e.textCase !== void 0 && f(e.textCase, P.textCase) && (t.textCase = e.textCase, a.add("textCase")), e.textDecoration !== void 0 && f(e.textDecoration, P.textDecoration) && (t.textDecoration = e.textDecoration, a.add("textDecoration")), e.textAutoResize !== void 0 && f(e.textAutoResize, P.textAutoResize) && (t.textAutoResize = e.textAutoResize, a.add("textAutoResize")), e.paragraphSpacing !== void 0 && f(
    e.paragraphSpacing,
    P.paragraphSpacing
  ) && (t.paragraphSpacing = e.paragraphSpacing, a.add("paragraphSpacing")), e.paragraphIndent !== void 0 && f(e.paragraphIndent, P.paragraphIndent) && (t.paragraphIndent = e.paragraphIndent, a.add("paragraphIndent")), e.listOptions !== void 0 && f(e.listOptions, P.listOptions) && (t.listOptions = e.listOptions, a.add("listOptions")), t;
}
async function ye(e, i) {
  const t = {}, a = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && f(e.fillGeometry, N.fillGeometry) && (t.fillGeometry = e.fillGeometry, a.add("fillGeometry")), e.strokeGeometry !== void 0 && f(e.strokeGeometry, N.strokeGeometry) && (t.strokeGeometry = e.strokeGeometry, a.add("strokeGeometry")), e.strokeCap !== void 0 && f(e.strokeCap, N.strokeCap) && (t.strokeCap = e.strokeCap, a.add("strokeCap")), e.strokeJoin !== void 0 && f(e.strokeJoin, N.strokeJoin) && (t.strokeJoin = e.strokeJoin, a.add("strokeJoin")), e.dashPattern !== void 0 && f(e.dashPattern, N.dashPattern) && (t.dashPattern = e.dashPattern, a.add("dashPattern")), t;
}
async function he(e, i) {
  const t = {}, a = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && f(e.cornerRadius, J.cornerRadius) && (t.cornerRadius = e.cornerRadius, a.add("cornerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, a.add("pointCount")), e.innerRadius !== void 0 && (t.innerRadius = e.innerRadius, a.add("innerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, a.add("pointCount")), t;
}
function be(e) {
  const i = [];
  let t = e.parent;
  try {
    for (; t; ) {
      let a, o, r;
      try {
        a = t.type, o = t.name, r = t.parent;
      } catch (n) {
        console.log(
          "Error accessing parent node properties in buildParentPath:",
          n
        );
        break;
      }
      if (a === "PAGE" || !r)
        break;
      o && o.trim() !== "" && i.unshift(o), t = r;
    }
  } catch (a) {
    console.log("Error during parent path traversal:", a);
  }
  return i.join("/");
}
async function Ae(e, i) {
  const t = {}, a = /* @__PURE__ */ new Set();
  if (t._isInstance = !0, a.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (o) {
        const r = {};
        try {
          r.instanceNodeName = e.name, r.instanceNodeId = e.id, r.instanceNodeType = e.type, r.componentName = o.name, r.componentType = o.type, r.componentId = o.id;
          try {
            r.componentKey = o.key;
          } catch (d) {
            r.componentKey = "(cannot access)";
          }
          try {
            r.componentRemote = o.remote;
          } catch (d) {
            r.componentRemote = "(cannot access)";
          }
          let p = [];
          try {
            p = Object.getOwnPropertyNames(o), r.ownProperties = p;
          } catch (d) {
            r.ownProperties = "(cannot access)";
          }
          const b = [];
          try {
            let d = Object.getPrototypeOf(o);
            for (; d && d !== Object.prototype; )
              b.push(
                ...Object.getOwnPropertyNames(d).filter(
                  (S) => !b.includes(S)
                )
              ), d = Object.getPrototypeOf(d);
            r.prototypeProperties = b;
          } catch (d) {
            r.prototypeProperties = "(cannot access)";
          }
          let g = [];
          try {
            g = Object.keys(o), r.enumerableProperties = g;
          } catch (d) {
            r.enumerableProperties = "(cannot access)";
          }
          const A = [];
          try {
            for (const d of [...p, ...b])
              if (!(d === "instances" || d === "children" || d === "parent"))
                try {
                  typeof o[d] == "function" && A.push(d);
                } catch (S) {
                }
            r.availableMethods = A;
          } catch (d) {
            r.availableMethods = "(cannot access)";
          }
          const m = [];
          try {
            for (const d of [...p, ...b])
              (d.toLowerCase().includes("library") || d.toLowerCase().includes("remote") || d.toLowerCase().includes("file")) && m.push(d);
            r.libraryRelatedProperties = m;
          } catch (d) {
            r.libraryRelatedProperties = "(cannot access)";
          }
          try {
            o.remote !== void 0 && (r.remoteValue = o.remote);
          } catch (d) {
          }
          try {
            o.libraryName !== void 0 && (r.libraryNameValue = o.libraryName);
          } catch (d) {
          }
          try {
            o.libraryKey !== void 0 && (r.libraryKeyValue = o.libraryKey);
          } catch (d) {
          }
          try {
            if (o.parent !== void 0) {
              const d = o.parent;
              if (d) {
                r.mainComponentHasParent = !0;
                try {
                  r.mainComponentParentType = d.type, r.mainComponentParentName = d.name, r.mainComponentParentId = d.id;
                } catch (S) {
                  r.mainComponentParentAccessError = String(S);
                }
              } else
                r.mainComponentHasParent = !1;
            } else
              r.mainComponentParentUndefined = !0;
          } catch (d) {
            r.mainComponentParentCheckError = String(d);
          }
          try {
            o.variantProperties !== void 0 && (r.mainComponentVariantProperties = o.variantProperties);
          } catch (d) {
          }
          try {
            o.componentPropertyDefinitions !== void 0 && (r.mainComponentPropertyDefinitions = Object.keys(
              o.componentPropertyDefinitions
            ));
          } catch (d) {
          }
        } catch (p) {
          r.debugError = String(p);
        }
        let n, s;
        try {
          e.variantProperties && (n = e.variantProperties, r.instanceVariantProperties = n), e.componentProperties && (s = e.componentProperties, r.instanceComponentProperties = s);
        } catch (p) {
          r.propertiesError = String(p);
        }
        let c, u;
        const l = [];
        try {
          let p = o.parent;
          const b = [];
          let g = 0;
          const A = 20;
          if (p)
            try {
              if (r.mainComponentParentExists = !0, r.mainComponentParentType = p.type, r.mainComponentParentName = p.name, r.mainComponentParentId = p.id, p.type === "COMPONENT_SET")
                try {
                  const m = p.parent;
                  if (m === null)
                    r.componentSetParentIsNull = !0;
                  else if (m === void 0)
                    r.componentSetParentIsUndefined = !0;
                  else {
                    r.componentSetParentExists = !0;
                    try {
                      r.componentSetParentType = m.type, r.componentSetParentName = m.name;
                    } catch (d) {
                      r.componentSetParentPropertyAccessError = String(d);
                    }
                  }
                } catch (m) {
                  r.componentSetParentCheckError = String(m);
                }
            } catch (m) {
              r.mainComponentParentDebugError = String(m);
            }
          else
            r.mainComponentParentExists = !1;
          for (; p && g < A; )
            try {
              const m = p.type, d = p.name;
              if (l.push(
                `${m}:${d || "(unnamed)"}`
              ), m === "COMPONENT_SET" && !u && (u = d, r.componentSetName = d, r.componentSetFound = !0), m === "PAGE")
                break;
              d && d.trim() !== "" && b.unshift(d);
              let S, R = !1;
              try {
                "parent" in p ? (R = !0, r[`hasParentPropertyAtDepth${g}`] = !0, S = p.parent, S === null ? r[`parentIsNullAtDepth${g}`] = !0 : S === void 0 ? r[`parentIsUndefinedAtDepth${g}`] = !0 : r[`parentExistsAtDepth${g}`] = !0) : r[`noParentPropertyAtDepth${g}`] = !0;
              } catch (w) {
                r.parentAccessErrorAtDepth = g, r.parentAccessError = String(w), r.parentAccessErrorName = w instanceof Error ? w.name : "Unknown", r.parentAccessErrorMessage = w instanceof Error ? w.message : String(w);
                break;
              }
              if (!S) {
                r.noParentAtDepth = g, r.parentAccessAttemptedAtDepth = R;
                break;
              }
              try {
                const w = S.type, re = S.name;
                r[`parentAtDepth${g + 1}Type`] = w, r[`parentAtDepth${g + 1}Name`] = re;
              } catch (w) {
                r.nextParentAccessErrorAtDepth = g, r.nextParentAccessError = String(w);
              }
              p = S, g++;
            } catch (m) {
              r.parentTraverseErrorAtDepth = g, r.parentTraverseError = String(m), r.parentTraverseErrorName = m instanceof Error ? m.name : "Unknown", r.parentTraverseErrorMessage = m instanceof Error ? m.message : String(m);
              break;
            }
          c = b.join("/"), r.mainComponentParentChain = l, r.mainComponentParentChainDepth = g, r.mainComponentParentPath = c, r.mainComponentParentPathParts = b;
        } catch (p) {
          r.mainComponentParentPathError = String(p);
        }
        const y = be(e);
        if (r.instanceParentPath = y, t.mainComponent = {
          id: o.id,
          name: o.name,
          key: o.key,
          // Component key for reference
          type: o.type
        }, u && (t.mainComponent.componentSetName = u), n && (t.mainComponent.variantProperties = n), s && (t.mainComponent.componentProperties = s), c && (t.mainComponent._path = c), y && (t.mainComponent._instancePath = y), o.remote === !0) {
          t.mainComponent.remote = !0;
          try {
            if (typeof o.getPublishStatusAsync == "function")
              try {
                const p = await o.getPublishStatusAsync();
                if (p && (r.publishStatus = p, p && typeof p == "object")) {
                  p.libraryName && (t.mainComponent.libraryName = p.libraryName), p.libraryKey && (t.mainComponent.libraryKey = p.libraryKey), p.fileKey && (t.mainComponent.fileKey = p.fileKey);
                  const b = {};
                  Object.keys(p).forEach((g) => {
                    (g.toLowerCase().includes("library") || g.toLowerCase().includes("file")) && (b[g] = p[g]);
                  }), Object.keys(b).length > 0 && (r.libraryRelatedFromPublishStatus = b);
                }
              } catch (p) {
                r.publishStatusError = String(p);
              }
            try {
              const p = figma.teamLibrary, b = Object.getOwnPropertyNames(
                p
              ).filter((g) => typeof p[g] == "function");
              if (r.teamLibraryAvailableMethods = b, typeof (p == null ? void 0 : p.getAvailableLibraryComponentSetsAsync) == "function") {
                const g = await p.getAvailableLibraryComponentSetsAsync();
                if (r.availableComponentSetsCount = (g == null ? void 0 : g.length) || 0, g && Array.isArray(g)) {
                  const A = [];
                  for (const m of g)
                    try {
                      const d = {
                        name: m.name,
                        key: m.key,
                        libraryName: m.libraryName,
                        libraryKey: m.libraryKey
                      };
                      if (A.push(d), m.key === o.key || m.name === o.name) {
                        r.matchingComponentSet = d, m.libraryName && (t.mainComponent.libraryName = m.libraryName), m.libraryKey && (t.mainComponent.libraryKey = m.libraryKey);
                        break;
                      }
                    } catch (d) {
                      A.push({
                        error: String(d)
                      });
                    }
                  r.componentSets = A;
                }
              } else
                r.componentSetsApiNote = "getAvailableLibraryComponentSetsAsync not available";
            } catch (p) {
              r.teamLibrarySearchError = String(p);
            }
            try {
              const p = await figma.importComponentByKeyAsync(
                o.key
              );
              p && (r.importedComponentInfo = {
                id: p.id,
                name: p.name,
                type: p.type,
                remote: p.remote
              }, p.libraryName && (t.mainComponent.libraryName = p.libraryName, r.importedComponentLibraryName = p.libraryName), p.libraryKey && (t.mainComponent.libraryKey = p.libraryKey, r.importedComponentLibraryKey = p.libraryKey));
            } catch (p) {
              r.importComponentError = String(p);
            }
          } catch (p) {
            r.libraryInfoError = String(p);
          }
        }
        Object.keys(r).length > 0 && (t.mainComponent._debug = r), a.add("mainComponent");
      }
    } catch (o) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        o
      );
    }
  return t;
}
function T(e) {
  let i = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    i += T(t);
  }), i;
}
async function F(e, i = /* @__PURE__ */ new WeakSet(), t = {}) {
  var y, h, p, b, g;
  if (!e || typeof e != "object")
    return e;
  const a = (y = t.maxNodes) != null ? y : 1e4, o = (h = t.nodeCount) != null ? h : 0;
  if (o >= a)
    return {
      _truncated: !0,
      _reason: `Maximum node count (${a}) reached`,
      _nodeCount: o
    };
  const r = {
    visited: (p = t.visited) != null ? p : /* @__PURE__ */ new WeakSet(),
    depth: (b = t.depth) != null ? b : 0,
    maxDepth: (g = t.maxDepth) != null ? g : 100,
    nodeCount: o + 1,
    maxNodes: a,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: t.variableTable,
    collectionTable: t.collectionTable
  };
  if (i.has(e))
    return "[Circular Reference]";
  i.add(e), r.visited = i;
  const n = {}, s = await me(e, r);
  Object.assign(n, s);
  const c = e.type;
  if (c)
    switch (c) {
      case "FRAME":
      case "COMPONENT": {
        const A = await H(e);
        Object.assign(n, A);
        break;
      }
      case "INSTANCE": {
        const A = await Ae(
          e
        );
        Object.assign(n, A);
        const m = await H(
          e
        );
        Object.assign(n, m);
        break;
      }
      case "TEXT": {
        const A = await ge(e);
        Object.assign(n, A);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const A = await ye(e);
        Object.assign(n, A);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const A = await he(e);
        Object.assign(n, A);
        break;
      }
      default:
        r.unhandledKeys.add("_unknownType");
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
  for (const A of u)
    typeof e[A] != "function" && (l.has(A) || r.unhandledKeys.add(A));
  if (r.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(r.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const A = r.maxDepth;
    if (r.depth >= A)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${A}) reached`,
        _count: e.children.length
      };
    else if (r.nodeCount >= a)
      n.children = {
        _truncated: !0,
        _reason: `Maximum node count (${a}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const m = E(v({}, r), {
        depth: r.depth + 1
      }), d = [];
      let S = !1;
      for (const R of e.children) {
        if (m.nodeCount >= a) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${a}) reached during children processing`,
            _processed: d.length,
            _total: e.children.length,
            children: d
          }, S = !0;
          break;
        }
        const w = await F(R, i, m);
        d.push(w), m.nodeCount && (r.nodeCount = m.nodeCount);
      }
      S || (n.children = d);
    }
  }
  return n;
}
async function ve(e) {
  try {
    const i = e.pageIndex;
    if (i === void 0 || typeof i != "number")
      return {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await figma.loadAllPagesAsync();
    const t = figma.root.children;
    if (i < 0 || i >= t.length)
      return {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const a = t[i];
    console.log("Exporting page: " + a.name);
    const o = new _(), r = new O();
    let n = [];
    try {
      n = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((p) => ({
        libraryName: p.libraryName,
        key: p.key,
        name: p.name
      }));
    } catch (h) {
      console.log(
        "Could not get library variable collections:",
        h instanceof Error ? h.message : String(h)
      );
    }
    const s = await F(
      a,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: r
      }
    ), c = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.4.0",
        // Updated version for simplified variable table (removed unnecessary fields)
        figmaApiVersion: figma.apiVersion,
        originalPageName: a.name,
        totalNodes: T(s),
        pluginVersion: "1.0.0"
      },
      collections: r.getTable(),
      variables: o.getSerializedTable(),
      libraries: n,
      pageData: s
    }, u = JSON.stringify(c, null, 2), l = a.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return console.log(
      "Export complete. Total nodes:",
      T(s)
    ), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: l,
        jsonData: u,
        pageName: a.name
      }
    };
  } catch (i) {
    return console.error("Error exporting page:", i), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ce(e, i) {
  const t = /* @__PURE__ */ new Map();
  for (const [a, o] of Object.entries(i)) {
    const r = e.modes.find((n) => n.name === o);
    if (r)
      t.set(a, r.modeId);
    else {
      const n = e.addMode(o);
      t.set(a, n);
    }
  }
  return t;
}
async function Y(e) {
  let i;
  if (e.isLocal) {
    const o = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (r) => r.name === e.collectionName
    );
    o ? i = o : i = figma.variables.createVariableCollection(
      e.collectionName
    );
  } else {
    const o = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find(
      (c) => c.name === e.collectionName
    );
    if (!o)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const r = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      o.key
    );
    if (r.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const n = await figma.variables.importVariableByKeyAsync(
      r[0].key
    ), s = await figma.variables.getVariableCollectionByIdAsync(
      n.variableCollectionId
    );
    if (!s)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    i = s;
  }
  const t = await Ce(
    i,
    e.modes
  );
  return { collection: i, modeMapping: t };
}
async function B(e, i) {
  if (i) {
    const a = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (o) => o.name === e
    );
    return a || figma.variables.createVariableCollection(e);
  } else {
    const a = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find(
      (s) => s.name === e
    );
    if (!a)
      throw new Error(
        `External collection "${e}" not found in team library. Please ensure the collection is published and available.`
      );
    const o = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      a.key
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
async function k(e, i) {
  for (const t of e.variableIds)
    try {
      const a = await figma.variables.getVariableByIdAsync(t);
      if (a && a.name === i)
        return a;
    } catch (a) {
      continue;
    }
  return null;
}
function W(e, i) {
  const t = e.resolvedType.toUpperCase(), a = i.toUpperCase();
  return t !== a ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${t}" but expected "${a}". Skipping binding.`
  ), !1) : !0;
}
async function xe(e, i, t, a, o) {
  for (const [r, n] of Object.entries(i)) {
    const s = a.get(r);
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
        let u = null;
        if (c._varRef !== void 0) {
          const l = t.getVariableByIndex(
            c._varRef
          );
          if (l) {
            let y = null;
            if (o && l._colRef !== void 0) {
              const h = o.getCollectionByIndex(
                l._colRef
              );
              h && (y = (await Y(h)).collection);
            }
            !y && l.collectionName && l.isLocal !== void 0 && (y = await B(
              l.collectionName,
              l.isLocal
            )), y && (u = await k(
              y,
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
async function q(e, i, t, a, o) {
  const r = figma.variables.createVariable(
    e.variableName,
    i,
    e.variableType
  );
  return e.valuesByMode && await xe(
    r,
    e.valuesByMode,
    t,
    a,
    o
  ), r;
}
async function Q(e, i, t) {
  var o;
  const a = i.getVariableByIndex(e._varRef);
  if (!a)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    let r;
    const n = (o = a._colRef) != null ? o : a.collectionRef;
    if (n !== void 0 && (r = t.getCollectionByIndex(n)), !r && a.collectionId && a.isLocal !== void 0) {
      const l = t.getCollectionIndex(
        a.collectionId
      );
      l >= 0 && (r = t.getCollectionByIndex(l));
    }
    if (!r) {
      const l = await B(
        a.collectionName || "",
        a.isLocal || !1
      );
      let y = await k(l, a.variableName);
      return y ? W(y, a.variableType) ? y : null : a.valuesByMode ? (y = await q(
        a,
        l,
        i,
        /* @__PURE__ */ new Map(),
        // Empty mode mapping for legacy
        t
        // Pass collection table for alias resolution
      ), y) : (console.warn(
        `Cannot create variable "${a.variableName}" without valuesByMode data`
      ), null);
    }
    const { collection: s, modeMapping: c } = await Y(r);
    let u = await k(s, a.variableName);
    return u ? W(u, a.variableType) ? u : null : a.valuesByMode ? (u = await q(
      a,
      s,
      i,
      c,
      t
      // Pass collection table for alias resolution
    ), u) : (console.warn(
      `Cannot create variable "${a.variableName}" without valuesByMode data`
    ), null);
  } catch (r) {
    if (console.error(
      `Error resolving variable reference for "${a.variableName}":`,
      r
    ), r instanceof Error && r.message.includes("External collection"))
      throw r;
    return null;
  }
}
function Se(e, i) {
  if (!i || !V(e))
    return null;
  const t = i.getVariableByIndex(e._varRef);
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
async function we(e, i, t, a, o) {
  if (!(!i || typeof i != "object"))
    try {
      const r = e[t];
      if (!r || !Array.isArray(r))
        return;
      for (const [n, s] of Object.entries(i))
        if (n === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < r.length; c++) {
            let u = null;
            const l = s[c];
            if (V(l) && a && o) {
              const y = await Q(
                l,
                a,
                o
              );
              y && r[c].boundVariables && (r[c].boundVariables[t] = {
                type: "VARIABLE_ALIAS",
                id: y.id
              });
            } else l && typeof l == "object" && "type" in l && l.type === "VARIABLE_ALIAS" && (u = l, u && await Pe(
              r[c],
              u,
              t,
              a
            ));
          }
        else {
          let c = null;
          V(s) ? c = Se(s, a) : s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && (c = s), c && await Z(e, n, c, a);
        }
    } catch (r) {
      console.log(`Error restoring bound variables for ${t}:`, r);
    }
}
async function Z(e, i, t, a) {
  try {
    let o = null;
    try {
      o = await figma.variables.getVariableByIdAsync(t.id);
    } catch (r) {
    }
    if (!o && a) {
      if (t.isLocal) {
        const r = await B(
          t.collectionName || "",
          !0
        );
        o = await k(
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
      e.boundVariables || (e.boundVariables = {}), e.boundVariables[i] || (e.boundVariables[i] = r);
    }
  } catch (o) {
    console.log(`Error binding variable to property ${i}:`, o);
  }
}
async function Pe(e, i, t, a) {
  if (!(!e || typeof e != "object"))
    try {
      let o = null;
      try {
        o = await figma.variables.getVariableByIdAsync(i.id);
      } catch (r) {
        if (a) {
          if (i.isLocal) {
            const n = await B(
              i.collectionName || "",
              !0
            );
            o = await k(
              n,
              i.variableName || ""
            );
          } else if (i.variableKey)
            try {
              o = await figma.variables.importVariableByKeyAsync(
                i.variableKey
              );
            } catch (n) {
              console.log(
                `Could not import team variable: ${i.variableName}`
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
function Ee(e, i) {
  const t = de(i);
  if (e.visible === void 0 && (e.visible = t.visible), e.locked === void 0 && (e.locked = t.locked), e.opacity === void 0 && (e.opacity = t.opacity), e.rotation === void 0 && (e.rotation = t.rotation), e.blendMode === void 0 && (e.blendMode = t.blendMode), i === "FRAME" || i === "COMPONENT" || i === "INSTANCE") {
    const a = C;
    e.layoutMode === void 0 && (e.layoutMode = a.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = a.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = a.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = a.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = a.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = a.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = a.paddingRight), e.paddingTop === void 0 && (e.paddingTop = a.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = a.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = a.itemSpacing);
  }
  if (i === "TEXT") {
    const a = P;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = a.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = a.textAlignVertical), e.textCase === void 0 && (e.textCase = a.textCase), e.textDecoration === void 0 && (e.textDecoration = a.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = a.textAutoResize);
  }
}
async function j(e, i, t = null, a = null) {
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
    if (Ee(r, e.type || "FRAME"), e.name !== void 0 && (r.name = e.name || "Unnamed Node"), e.x !== void 0 && (r.x = e.x), e.y !== void 0 && (r.y = e.y), e.width !== void 0 && e.height !== void 0 && r.resize(e.width, e.height), e.visible !== void 0 && (r.visible = e.visible), e.locked !== void 0 && (r.locked = e.locked), e.opacity !== void 0 && (r.opacity = e.opacity), e.rotation !== void 0 && (r.rotation = e.rotation), e.blendMode !== void 0 && (r.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && t && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const c = {};
            for (const [u, l] of Object.entries(
              s.boundVariables
            ))
              c[u] = l;
            return E(v({}, s), { boundVariables: c });
          }
          return s;
        })), r.fills = n, (o = e.boundVariables) != null && o.fills && await we(
          r,
          e.boundVariables,
          "fills",
          t,
          a
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
          if (V(s) && t && a) {
            const c = await Q(
              s,
              t,
              a
            );
            if (c) {
              const u = {
                type: "VARIABLE_ALIAS",
                id: c.id
              };
              r.boundVariables || (r.boundVariables = {}), r.boundVariables[n] || (r.boundVariables[n] = u);
            }
          } else s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && await Z(
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
        const s = await j(
          n,
          r,
          t,
          a
        );
        s && r.appendChild(s);
      }
    return i && i.appendChild(r), r;
  } catch (r) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      r
    ), null;
  }
}
async function Ie(e) {
  try {
    const i = e.jsonData;
    if (!i)
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: "JSON data is required",
        data: {}
      };
    if (console.log("Importing page from JSON"), !i.pageData || !i.metadata)
      return {
        type: "importPage",
        success: !1,
        error: !0,
        message: "Invalid JSON format. Expected pageData and metadata.",
        data: {}
      };
    const t = i.pageData, a = i.metadata;
    let o = null;
    if (i.collections)
      try {
        o = O.fromTable(i.collections), console.log(
          `Loaded collections table with ${o.getSize()} collections`
        );
      } catch (h) {
        console.warn("Failed to load collections table:", h);
      }
    let r = null;
    if (i.variables)
      try {
        r = _.fromTable(i.variables), console.log(
          `Loaded variable table with ${r.getSize()} variables`
        );
      } catch (h) {
        console.warn("Failed to load variable table:", h);
      }
    const n = "2.3.0", s = a.exportFormatVersion || "1.0.0";
    s !== n && console.warn(
      `Export format version mismatch: exported with ${s}, current version is ${n}. Import may have compatibility issues.`
    );
    const u = "Imported - " + (a.originalPageName ? a.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), l = figma.createPage();
    if (l.name = u, figma.root.appendChild(l), console.log("Created new page: " + u), console.log("Importing " + (a.totalNodes || "unknown") + " nodes"), t.children && Array.isArray(t.children)) {
      for (const h of t.children) {
        if (h._truncated) {
          console.log(
            `Skipping truncated children: ${h._reason || "Unknown"}`
          );
          continue;
        }
        await j(
          h,
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
        pageName: a.originalPageName,
        totalNodes: a.totalNodes || 0
      }
    };
  } catch (i) {
    return console.error("Error importing page:", i), {
      type: "importPage",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ne(e) {
  try {
    await figma.loadAllPagesAsync();
    const i = figma.root.children;
    console.log("Found " + i.length + " pages in the document");
    const t = 11, a = i[t];
    if (!a)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const o = await F(
      a,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + a.name + " (index: " + t + ")"
    );
    const r = JSON.stringify(o, null, 2), n = JSON.parse(r), s = "Copy - " + n.name, c = figma.createPage();
    if (c.name = s, figma.root.appendChild(c), n.children && n.children.length > 0) {
      let y = function(p) {
        p.forEach((b) => {
          const g = (b.x || 0) + (b.width || 0);
          g > h && (h = g), b.children && b.children.length > 0 && y(b.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let h = 0;
      y(n.children), console.log("Original content rightmost edge: " + h);
      for (const p of n.children)
        await j(p, c, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const u = T(n);
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
  } catch (i) {
    return console.error("Error performing quick copy:", i), {
      type: "quickCopy",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function ke(e) {
  try {
    const i = e.accessToken, t = e.selectedRepo;
    return i ? (await figma.clientStorage.setAsync("accessToken", i), t && await figma.clientStorage.setAsync("selectedRepo", t), {
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
  } catch (i) {
    return {
      type: "storeAuthData",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Re(e) {
  try {
    const i = await figma.clientStorage.getAsync("accessToken"), t = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: i || void 0,
        selectedRepo: t || void 0
      }
    };
  } catch (i) {
    return {
      type: "loadAuthData",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Me(e) {
  try {
    return await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), {
      type: "clearAuthData",
      success: !0,
      error: !1,
      message: "Auth data cleared successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    };
  } catch (i) {
    return {
      type: "clearAuthData",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function Ve(e) {
  try {
    const i = e.selectedRepo;
    return i ? (await figma.clientStorage.setAsync("selectedRepo", i), {
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
  } catch (i) {
    return {
      type: "storeSelectedRepo",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
function K(e, i = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: i
  };
}
function ee(e, i, t = {}) {
  const a = i instanceof Error ? i.message : i;
  return {
    type: e,
    success: !1,
    error: !0,
    message: a,
    data: t
  };
}
function $(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const te = "RecursicaPublishedMetadata";
async function Le(e) {
  try {
    const i = figma.currentPage, t = i.getPluginData(te);
    if (!t) {
      const s = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: $(i.name),
          version: 0,
          publishDate: "",
          history: {}
        }
      };
      return K("getComponentMetadata", s);
    }
    const o = {
      componentMetadata: JSON.parse(t)
    };
    return K("getComponentMetadata", o);
  } catch (i) {
    return console.error("Error getting component metadata:", i), ee(
      "getComponentMetadata",
      i instanceof Error ? i : "Unknown error occurred"
    );
  }
}
async function Te(e) {
  try {
    await figma.loadAllPagesAsync();
    const i = figma.root.children, t = [];
    for (const o of i) {
      if (o.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${o.name} (type: ${o.type})`
        );
        continue;
      }
      const r = o, n = r.getPluginData(te);
      if (n)
        try {
          const s = JSON.parse(n);
          t.push(s);
        } catch (s) {
          console.warn(
            `Failed to parse metadata for page "${r.name}":`,
            s
          );
          const u = {
            _ver: 1,
            id: "",
            name: $(r.name),
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
          name: $(r.name),
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
  } catch (i) {
    return console.error("Error getting all components:", i), ee(
      "getAllComponents",
      i instanceof Error ? i : "Unknown error occurred"
    );
  }
}
const M = /* @__PURE__ */ new Map();
let Oe = 0;
function _e() {
  return `prompt_${Date.now()}_${++Oe}`;
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
  prompt: (e, i) => {
    var s;
    const t = typeof i == "number" ? { timeoutMs: i } : i, a = (s = t == null ? void 0 : t.timeoutMs) != null ? s : 3e5, o = t == null ? void 0 : t.okLabel, r = t == null ? void 0 : t.cancelLabel, n = _e();
    return new Promise((c, u) => {
      const l = a === -1 ? null : setTimeout(() => {
        M.delete(n), u(new Error(`Plugin prompt timeout: ${e}`));
      }, a);
      M.set(n, {
        resolve: c,
        reject: u,
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
    const { requestId: i, action: t } = e, a = M.get(i);
    if (!a) {
      console.warn(
        `Received response for unknown prompt request: ${i}`
      );
      return;
    }
    a.timeout && clearTimeout(a.timeout), M.delete(i), t === "ok" ? a.resolve() : a.reject(new Error("User cancelled"));
  }
};
async function ze(e) {
  try {
    const i = e.requestId, t = e.action;
    return !i || !t ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (Be.handleResponse({ requestId: i, action: t }), {
      type: "pluginPromptResponse",
      success: !0,
      error: !1,
      message: "Prompt response handled successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {}
    });
  } catch (i) {
    return {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {}
    };
  }
}
const Ke = {
  getCurrentUser: ce,
  loadPages: le,
  exportPage: ve,
  importPage: Ie,
  quickCopy: Ne,
  storeAuthData: ke,
  loadAuthData: Re,
  clearAuthData: Me,
  storeSelectedRepo: Ve,
  getComponentMetadata: Le,
  getAllComponents: Te,
  pluginPromptResponse: ze
}, $e = Ke;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  console.log("Received message:", e);
  try {
    const i = e.type, t = $e[i];
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
    const a = await t(e.data);
    figma.ui.postMessage(E(v({}, a), {
      requestId: e.requestId
    }));
  } catch (i) {
    console.error("Error handling message:", i);
    const t = {
      type: e.type,
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {},
      requestId: e.requestId
    };
    figma.ui.postMessage(t);
  }
};
