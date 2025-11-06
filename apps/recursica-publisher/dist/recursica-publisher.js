var ae = Object.defineProperty, ie = Object.defineProperties;
var oe = Object.getOwnPropertyDescriptors;
var U = Object.getOwnPropertySymbols;
var ne = Object.prototype.hasOwnProperty, se = Object.prototype.propertyIsEnumerable;
var z = (e, i, r) => i in e ? ae(e, i, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[i] = r, v = (e, i) => {
  for (var r in i || (i = {}))
    ne.call(i, r) && z(e, r, i[r]);
  if (U)
    for (var r of U(i))
      se.call(i, r) && z(e, r, i[r]);
  return e;
}, E = (e, i) => ie(e, oe(i));
var I = (e, i, r) => z(e, typeof i != "symbol" ? i + "" : i, r);
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
async function le(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        pages: figma.root.children.map((o, t) => ({
          name: o.name,
          index: t
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
function u(e, i) {
  if (Array.isArray(e))
    return Array.isArray(i) ? e.length !== i.length || e.some((r, a) => u(r, i[a])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof i == "object" && i !== null) {
      const r = Object.keys(e), a = Object.keys(i);
      return r.length !== a.length ? !0 : r.some(
        (o) => !(o in i) || u(e[o], i[o])
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
    const r = i.collectionId;
    if (this.collectionMap.has(r))
      return this.collectionMap.get(r);
    const a = this.nextIndex++;
    return this.collectionMap.set(r, a), this.collections[a] = i, a;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(i) {
    var r;
    return (r = this.collectionMap.get(i)) != null ? r : -1;
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
    for (let r = 0; r < this.collections.length; r++)
      i[String(r)] = this.collections[r];
    return i;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   */
  static fromTable(i) {
    const r = new O(), a = Object.entries(i).sort(
      (o, t) => parseInt(o[0], 10) - parseInt(t[0], 10)
    );
    for (const [o, t] of a) {
      const n = parseInt(o, 10);
      r.collectionMap.set(t.collectionId, n), r.collections[n] = t, r.nextIndex = Math.max(
        r.nextIndex,
        n + 1
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
    const r = i.variableKey;
    if (!r)
      return -1;
    if (this.variableMap.has(r))
      return this.variableMap.get(r);
    const a = this.nextIndex++;
    return this.variableMap.set(r, a), this.variables[a] = i, a;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(i) {
    var r;
    return (r = this.variableMap.get(i)) != null ? r : -1;
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
    for (let r = 0; r < this.variables.length; r++)
      i[String(r)] = this.variables[r];
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
    for (let r = 0; r < this.variables.length; r++) {
      const a = this.variables[r], o = v(v(v(v(v(v({
        variableName: a.variableName,
        variableType: a.variableType
      }, a._colRef !== void 0 && { _colRef: a._colRef }), a.valuesByMode && { valuesByMode: a.valuesByMode }), a._colRef === void 0 && a.collectionRef !== void 0 && {
        collectionRef: a.collectionRef
      }), a._colRef === void 0 && a.collectionName && { collectionName: a.collectionName }), a._colRef === void 0 && a.collectionId && { collectionId: a.collectionId }), a._colRef === void 0 && a.isLocal !== void 0 && { isLocal: a.isLocal });
      i[String(r)] = o;
    }
    return i;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   */
  static fromTable(i) {
    var o;
    const r = new _(), a = Object.entries(i).sort(
      (t, n) => parseInt(t[0], 10) - parseInt(n[0], 10)
    );
    for (const [t, n] of a) {
      const s = parseInt(t, 10);
      n.variableKey && r.variableMap.set(n.variableKey, s);
      const c = E(v({}, n), {
        // Prefer _colRef, fallback to collectionRef for backward compatibility
        _colRef: (o = n._colRef) != null ? o : n.collectionRef
      });
      r.variables[s] = c, r.nextIndex = Math.max(r.nextIndex, s + 1);
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
function fe(e) {
  return {
    _varRef: e
  };
}
function V(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
async function D(e, i, r, a = /* @__PURE__ */ new Set()) {
  const o = {};
  for (const [t, n] of Object.entries(e)) {
    if (n == null) {
      o[t] = n;
      continue;
    }
    if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") {
      o[t] = n;
      continue;
    }
    if (typeof n == "object" && n !== null && "type" in n && n.type === "VARIABLE_ALIAS" && "id" in n) {
      const s = n.id;
      if (a.has(s)) {
        o[t] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      try {
        const c = await figma.variables.getVariableByIdAsync(s);
        if (!c) {
          o[t] = {
            type: "VARIABLE_ALIAS",
            id: s
          };
          continue;
        }
        const f = new Set(a);
        f.add(s);
        const l = await figma.variables.getVariableCollectionByIdAsync(
          c.variableCollectionId
        ), A = c.key;
        if (!A) {
          o[t] = {
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
          variableKey: A,
          id: s,
          isLocal: !c.remote
        }, p = await figma.variables.getVariableCollectionByIdAsync(
          c.variableCollectionId
        );
        if (p) {
          const g = await X(
            p,
            r
          );
          y._colRef = g;
        }
        c.valuesByMode && (y.valuesByMode = await D(
          c.valuesByMode,
          i,
          r,
          f
        ));
        const h = i.addVariable(y);
        o[t] = {
          type: "VARIABLE_ALIAS",
          id: s,
          _varRef: h
        };
      } catch (c) {
        console.log(
          "Could not resolve variable alias in valuesByMode:",
          s,
          c
        ), o[t] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
      }
    } else
      o[t] = n;
  }
  return o;
}
async function X(e, i) {
  const r = e.modes.map((o) => o.name), a = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: !e.remote,
    modes: r
  };
  return i.addCollection(a);
}
async function G(e, i, r) {
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
    const t = a.key;
    if (!t)
      return console.log("Variable missing key:", e.id), null;
    const n = await X(
      o,
      r
    ), s = {
      variableName: a.name,
      variableType: a.resolvedType,
      _colRef: n,
      // Reference to collection table (v2.4.0+)
      variableKey: t,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    a.valuesByMode && (s.valuesByMode = await D(
      a.valuesByMode,
      i,
      r,
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const c = i.addVariable(s);
    return fe(c);
  } catch (a) {
    return console.log("Could not resolve variable alias:", e.id, a), null;
  }
}
async function L(e, i, r) {
  if (!e || typeof e != "object") return e;
  const a = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const t = e[o];
      if (t && typeof t == "object" && !Array.isArray(t))
        if (t.type === "VARIABLE_ALIAS") {
          const n = await G(
            t,
            i,
            r
          );
          n && (a[o] = n);
        } else
          a[o] = await L(
            t,
            i,
            r
          );
      else Array.isArray(t) ? a[o] = await Promise.all(
        t.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await G(
          n,
          i,
          r
        ) || n : n && typeof n == "object" ? await L(
          n,
          i,
          r
        ) : n)
      ) : a[o] = t;
    }
  return a;
}
async function ue(e, i, r) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (a) => {
      if (!a || typeof a != "object") return a;
      const o = {};
      for (const t in a)
        Object.prototype.hasOwnProperty.call(a, t) && (t === "boundVariables" ? o[t] = await L(
          a[t],
          i,
          r
        ) : o[t] = a[t]);
      return o;
    })
  );
}
async function me(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  if (e.type && (r.type = e.type, a.add("type")), e.id && (r.id = e.id, a.add("id")), e.name !== void 0 && e.name !== "" && (r.name = e.name, a.add("name")), e.x !== void 0 && e.x !== 0 && (r.x = e.x, a.add("x")), e.y !== void 0 && e.y !== 0 && (r.y = e.y, a.add("y")), e.width !== void 0 && (r.width = e.width, a.add("width")), e.height !== void 0 && (r.height = e.height, a.add("height")), e.visible !== void 0 && u(e.visible, x.visible) && (r.visible = e.visible, a.add("visible")), e.locked !== void 0 && u(e.locked, x.locked) && (r.locked = e.locked, a.add("locked")), e.opacity !== void 0 && u(e.opacity, x.opacity) && (r.opacity = e.opacity, a.add("opacity")), e.rotation !== void 0 && u(e.rotation, x.rotation) && (r.rotation = e.rotation, a.add("rotation")), e.blendMode !== void 0 && u(e.blendMode, x.blendMode) && (r.blendMode = e.blendMode, a.add("blendMode")), e.effects !== void 0 && u(e.effects, x.effects) && (r.effects = e.effects, a.add("effects")), e.fills !== void 0) {
    const o = await ue(
      e.fills,
      i.variableTable,
      i.collectionTable
    );
    u(o, x.fills) && (r.fills = o), a.add("fills");
  }
  if (e.strokes !== void 0 && u(e.strokes, x.strokes) && (r.strokes = e.strokes, a.add("strokes")), e.strokeWeight !== void 0 && u(e.strokeWeight, x.strokeWeight) && (r.strokeWeight = e.strokeWeight, a.add("strokeWeight")), e.strokeAlign !== void 0 && u(e.strokeAlign, x.strokeAlign) && (r.strokeAlign = e.strokeAlign, a.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await L(
      e.boundVariables,
      i.variableTable,
      i.collectionTable
    );
    Object.keys(o).length > 0 && (r.boundVariables = o), a.add("boundVariables");
  }
  return r;
}
async function H(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && u(e.layoutMode, C.layoutMode) && (r.layoutMode = e.layoutMode, a.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && u(
    e.primaryAxisSizingMode,
    C.primaryAxisSizingMode
  ) && (r.primaryAxisSizingMode = e.primaryAxisSizingMode, a.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && u(
    e.counterAxisSizingMode,
    C.counterAxisSizingMode
  ) && (r.counterAxisSizingMode = e.counterAxisSizingMode, a.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && u(
    e.primaryAxisAlignItems,
    C.primaryAxisAlignItems
  ) && (r.primaryAxisAlignItems = e.primaryAxisAlignItems, a.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && u(
    e.counterAxisAlignItems,
    C.counterAxisAlignItems
  ) && (r.counterAxisAlignItems = e.counterAxisAlignItems, a.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && u(e.paddingLeft, C.paddingLeft) && (r.paddingLeft = e.paddingLeft, a.add("paddingLeft")), e.paddingRight !== void 0 && u(e.paddingRight, C.paddingRight) && (r.paddingRight = e.paddingRight, a.add("paddingRight")), e.paddingTop !== void 0 && u(e.paddingTop, C.paddingTop) && (r.paddingTop = e.paddingTop, a.add("paddingTop")), e.paddingBottom !== void 0 && u(e.paddingBottom, C.paddingBottom) && (r.paddingBottom = e.paddingBottom, a.add("paddingBottom")), e.itemSpacing !== void 0 && u(e.itemSpacing, C.itemSpacing) && (r.itemSpacing = e.itemSpacing, a.add("itemSpacing")), e.cornerRadius !== void 0 && u(e.cornerRadius, C.cornerRadius) && (r.cornerRadius = e.cornerRadius, a.add("cornerRadius")), e.clipsContent !== void 0 && u(e.clipsContent, C.clipsContent) && (r.clipsContent = e.clipsContent, a.add("clipsContent")), e.layoutWrap !== void 0 && u(e.layoutWrap, C.layoutWrap) && (r.layoutWrap = e.layoutWrap, a.add("layoutWrap")), e.layoutGrow !== void 0 && u(e.layoutGrow, C.layoutGrow) && (r.layoutGrow = e.layoutGrow, a.add("layoutGrow")), r;
}
async function ge(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (r.characters = e.characters, a.add("characters")), e.fontName !== void 0 && (r.fontName = e.fontName, a.add("fontName")), e.fontSize !== void 0 && (r.fontSize = e.fontSize, a.add("fontSize")), e.textAlignHorizontal !== void 0 && u(
    e.textAlignHorizontal,
    P.textAlignHorizontal
  ) && (r.textAlignHorizontal = e.textAlignHorizontal, a.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && u(
    e.textAlignVertical,
    P.textAlignVertical
  ) && (r.textAlignVertical = e.textAlignVertical, a.add("textAlignVertical")), e.letterSpacing !== void 0 && u(e.letterSpacing, P.letterSpacing) && (r.letterSpacing = e.letterSpacing, a.add("letterSpacing")), e.lineHeight !== void 0 && u(e.lineHeight, P.lineHeight) && (r.lineHeight = e.lineHeight, a.add("lineHeight")), e.textCase !== void 0 && u(e.textCase, P.textCase) && (r.textCase = e.textCase, a.add("textCase")), e.textDecoration !== void 0 && u(e.textDecoration, P.textDecoration) && (r.textDecoration = e.textDecoration, a.add("textDecoration")), e.textAutoResize !== void 0 && u(e.textAutoResize, P.textAutoResize) && (r.textAutoResize = e.textAutoResize, a.add("textAutoResize")), e.paragraphSpacing !== void 0 && u(
    e.paragraphSpacing,
    P.paragraphSpacing
  ) && (r.paragraphSpacing = e.paragraphSpacing, a.add("paragraphSpacing")), e.paragraphIndent !== void 0 && u(e.paragraphIndent, P.paragraphIndent) && (r.paragraphIndent = e.paragraphIndent, a.add("paragraphIndent")), e.listOptions !== void 0 && u(e.listOptions, P.listOptions) && (r.listOptions = e.listOptions, a.add("listOptions")), r;
}
async function ye(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && u(e.fillGeometry, N.fillGeometry) && (r.fillGeometry = e.fillGeometry, a.add("fillGeometry")), e.strokeGeometry !== void 0 && u(e.strokeGeometry, N.strokeGeometry) && (r.strokeGeometry = e.strokeGeometry, a.add("strokeGeometry")), e.strokeCap !== void 0 && u(e.strokeCap, N.strokeCap) && (r.strokeCap = e.strokeCap, a.add("strokeCap")), e.strokeJoin !== void 0 && u(e.strokeJoin, N.strokeJoin) && (r.strokeJoin = e.strokeJoin, a.add("strokeJoin")), e.dashPattern !== void 0 && u(e.dashPattern, N.dashPattern) && (r.dashPattern = e.dashPattern, a.add("dashPattern")), r;
}
async function he(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && u(e.cornerRadius, J.cornerRadius) && (r.cornerRadius = e.cornerRadius, a.add("cornerRadius")), e.pointCount !== void 0 && (r.pointCount = e.pointCount, a.add("pointCount")), e.innerRadius !== void 0 && (r.innerRadius = e.innerRadius, a.add("innerRadius")), e.pointCount !== void 0 && (r.pointCount = e.pointCount, a.add("pointCount")), r;
}
function be(e) {
  const i = [];
  let r = e.parent;
  try {
    for (; r; ) {
      let a, o, t;
      try {
        a = r.type, o = r.name, t = r.parent;
      } catch (n) {
        console.log(
          "Error accessing parent node properties in buildParentPath:",
          n
        );
        break;
      }
      if (a === "PAGE" || !t)
        break;
      o && o.trim() !== "" && i.unshift(o), r = t;
    }
  } catch (a) {
    console.log("Error during parent path traversal:", a);
  }
  return i.join("/");
}
async function Ae(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  if (r._isInstance = !0, a.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (o) {
        const t = {};
        try {
          t.instanceNodeName = e.name, t.instanceNodeId = e.id, t.instanceNodeType = e.type, t.componentName = o.name, t.componentType = o.type, t.componentId = o.id;
          try {
            t.componentKey = o.key;
          } catch (d) {
            t.componentKey = "(cannot access)";
          }
          try {
            t.componentRemote = o.remote;
          } catch (d) {
            t.componentRemote = "(cannot access)";
          }
          let p = [];
          try {
            p = Object.getOwnPropertyNames(o), t.ownProperties = p;
          } catch (d) {
            t.ownProperties = "(cannot access)";
          }
          const h = [];
          try {
            let d = Object.getPrototypeOf(o);
            for (; d && d !== Object.prototype; )
              h.push(
                ...Object.getOwnPropertyNames(d).filter(
                  (S) => !h.includes(S)
                )
              ), d = Object.getPrototypeOf(d);
            t.prototypeProperties = h;
          } catch (d) {
            t.prototypeProperties = "(cannot access)";
          }
          let g = [];
          try {
            g = Object.keys(o), t.enumerableProperties = g;
          } catch (d) {
            t.enumerableProperties = "(cannot access)";
          }
          const b = [];
          try {
            for (const d of [...p, ...h])
              if (!(d === "instances" || d === "children" || d === "parent"))
                try {
                  typeof o[d] == "function" && b.push(d);
                } catch (S) {
                }
            t.availableMethods = b;
          } catch (d) {
            t.availableMethods = "(cannot access)";
          }
          const m = [];
          try {
            for (const d of [...p, ...h])
              (d.toLowerCase().includes("library") || d.toLowerCase().includes("remote") || d.toLowerCase().includes("file")) && m.push(d);
            t.libraryRelatedProperties = m;
          } catch (d) {
            t.libraryRelatedProperties = "(cannot access)";
          }
          try {
            o.remote !== void 0 && (t.remoteValue = o.remote);
          } catch (d) {
          }
          try {
            o.libraryName !== void 0 && (t.libraryNameValue = o.libraryName);
          } catch (d) {
          }
          try {
            o.libraryKey !== void 0 && (t.libraryKeyValue = o.libraryKey);
          } catch (d) {
          }
          try {
            if (o.parent !== void 0) {
              const d = o.parent;
              if (d) {
                t.mainComponentHasParent = !0;
                try {
                  t.mainComponentParentType = d.type, t.mainComponentParentName = d.name, t.mainComponentParentId = d.id;
                } catch (S) {
                  t.mainComponentParentAccessError = String(S);
                }
              } else
                t.mainComponentHasParent = !1;
            } else
              t.mainComponentParentUndefined = !0;
          } catch (d) {
            t.mainComponentParentCheckError = String(d);
          }
          try {
            o.variantProperties !== void 0 && (t.mainComponentVariantProperties = o.variantProperties);
          } catch (d) {
          }
          try {
            o.componentPropertyDefinitions !== void 0 && (t.mainComponentPropertyDefinitions = Object.keys(
              o.componentPropertyDefinitions
            ));
          } catch (d) {
          }
        } catch (p) {
          t.debugError = String(p);
        }
        let n, s;
        try {
          e.variantProperties && (n = e.variantProperties, t.instanceVariantProperties = n), e.componentProperties && (s = e.componentProperties, t.instanceComponentProperties = s);
        } catch (p) {
          t.propertiesError = String(p);
        }
        let c, f;
        const l = [];
        try {
          let p = o.parent;
          const h = [];
          let g = 0;
          const b = 20;
          if (p)
            try {
              if (t.mainComponentParentExists = !0, t.mainComponentParentType = p.type, t.mainComponentParentName = p.name, t.mainComponentParentId = p.id, p.type === "COMPONENT_SET")
                try {
                  const m = p.parent;
                  if (m === null)
                    t.componentSetParentIsNull = !0;
                  else if (m === void 0)
                    t.componentSetParentIsUndefined = !0;
                  else {
                    t.componentSetParentExists = !0;
                    try {
                      t.componentSetParentType = m.type, t.componentSetParentName = m.name;
                    } catch (d) {
                      t.componentSetParentPropertyAccessError = String(d);
                    }
                  }
                } catch (m) {
                  t.componentSetParentCheckError = String(m);
                }
            } catch (m) {
              t.mainComponentParentDebugError = String(m);
            }
          else
            t.mainComponentParentExists = !1;
          for (; p && g < b; )
            try {
              const m = p.type, d = p.name;
              if (l.push(
                `${m}:${d || "(unnamed)"}`
              ), m === "COMPONENT_SET" && !f && (f = d, t.componentSetName = d, t.componentSetFound = !0), m === "PAGE")
                break;
              d && d.trim() !== "" && h.unshift(d);
              let S, R = !1;
              try {
                "parent" in p ? (R = !0, t[`hasParentPropertyAtDepth${g}`] = !0, S = p.parent, S === null ? t[`parentIsNullAtDepth${g}`] = !0 : S === void 0 ? t[`parentIsUndefinedAtDepth${g}`] = !0 : t[`parentExistsAtDepth${g}`] = !0) : t[`noParentPropertyAtDepth${g}`] = !0;
              } catch (w) {
                t.parentAccessErrorAtDepth = g, t.parentAccessError = String(w), t.parentAccessErrorName = w instanceof Error ? w.name : "Unknown", t.parentAccessErrorMessage = w instanceof Error ? w.message : String(w);
                break;
              }
              if (!S) {
                t.noParentAtDepth = g, t.parentAccessAttemptedAtDepth = R;
                break;
              }
              try {
                const w = S.type, re = S.name;
                t[`parentAtDepth${g + 1}Type`] = w, t[`parentAtDepth${g + 1}Name`] = re;
              } catch (w) {
                t.nextParentAccessErrorAtDepth = g, t.nextParentAccessError = String(w);
              }
              p = S, g++;
            } catch (m) {
              t.parentTraverseErrorAtDepth = g, t.parentTraverseError = String(m), t.parentTraverseErrorName = m instanceof Error ? m.name : "Unknown", t.parentTraverseErrorMessage = m instanceof Error ? m.message : String(m);
              break;
            }
          c = h.join("/"), t.mainComponentParentChain = l, t.mainComponentParentChainDepth = g, t.mainComponentParentPath = c, t.mainComponentParentPathParts = h;
        } catch (p) {
          t.mainComponentParentPathError = String(p);
        }
        const A = be(e);
        if (t.instanceParentPath = A, r.mainComponent = {
          id: o.id,
          name: o.name,
          key: o.key,
          // Component key for reference
          type: o.type
        }, f && (r.mainComponent.componentSetName = f), n && (r.mainComponent.variantProperties = n), s && (r.mainComponent.componentProperties = s), c && (r.mainComponent._path = c), A && (r.mainComponent._instancePath = A), o.remote === !0) {
          r.mainComponent.remote = !0;
          try {
            if (typeof o.getPublishStatusAsync == "function")
              try {
                const p = await o.getPublishStatusAsync();
                if (p && (t.publishStatus = p, p && typeof p == "object")) {
                  p.libraryName && (r.mainComponent.libraryName = p.libraryName), p.libraryKey && (r.mainComponent.libraryKey = p.libraryKey), p.fileKey && (r.mainComponent.fileKey = p.fileKey);
                  const h = {};
                  Object.keys(p).forEach((g) => {
                    (g.toLowerCase().includes("library") || g.toLowerCase().includes("file")) && (h[g] = p[g]);
                  }), Object.keys(h).length > 0 && (t.libraryRelatedFromPublishStatus = h);
                }
              } catch (p) {
                t.publishStatusError = String(p);
              }
            try {
              const p = figma.teamLibrary, h = Object.getOwnPropertyNames(
                p
              ).filter((g) => typeof p[g] == "function");
              if (t.teamLibraryAvailableMethods = h, typeof (p == null ? void 0 : p.getAvailableLibraryComponentSetsAsync) == "function") {
                const g = await p.getAvailableLibraryComponentSetsAsync();
                if (t.availableComponentSetsCount = (g == null ? void 0 : g.length) || 0, g && Array.isArray(g)) {
                  const b = [];
                  for (const m of g)
                    try {
                      const d = {
                        name: m.name,
                        key: m.key,
                        libraryName: m.libraryName,
                        libraryKey: m.libraryKey
                      };
                      if (b.push(d), m.key === o.key || m.name === o.name) {
                        t.matchingComponentSet = d, m.libraryName && (r.mainComponent.libraryName = m.libraryName), m.libraryKey && (r.mainComponent.libraryKey = m.libraryKey);
                        break;
                      }
                    } catch (d) {
                      b.push({
                        error: String(d)
                      });
                    }
                  t.componentSets = b;
                }
              } else
                t.componentSetsApiNote = "getAvailableLibraryComponentSetsAsync not available";
            } catch (p) {
              t.teamLibrarySearchError = String(p);
            }
            try {
              const p = await figma.importComponentByKeyAsync(
                o.key
              );
              p && (t.importedComponentInfo = {
                id: p.id,
                name: p.name,
                type: p.type,
                remote: p.remote
              }, p.libraryName && (r.mainComponent.libraryName = p.libraryName, t.importedComponentLibraryName = p.libraryName), p.libraryKey && (r.mainComponent.libraryKey = p.libraryKey, t.importedComponentLibraryKey = p.libraryKey));
            } catch (p) {
              t.importComponentError = String(p);
            }
          } catch (p) {
            t.libraryInfoError = String(p);
          }
        }
        Object.keys(t).length > 0 && (r.mainComponent._debug = t), a.add("mainComponent");
      }
    } catch (o) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        o
      );
    }
  return r;
}
function T(e) {
  let i = 1;
  return e.children && e.children.length > 0 && e.children.forEach((r) => {
    i += T(r);
  }), i;
}
async function F(e, i = /* @__PURE__ */ new WeakSet(), r = {}) {
  var A, y, p, h, g;
  if (!e || typeof e != "object")
    return e;
  const a = (A = r.maxNodes) != null ? A : 1e4, o = (y = r.nodeCount) != null ? y : 0;
  if (o >= a)
    return {
      _truncated: !0,
      _reason: `Maximum node count (${a}) reached`,
      _nodeCount: o
    };
  const t = {
    visited: (p = r.visited) != null ? p : /* @__PURE__ */ new WeakSet(),
    depth: (h = r.depth) != null ? h : 0,
    maxDepth: (g = r.maxDepth) != null ? g : 100,
    nodeCount: o + 1,
    maxNodes: a,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: r.variableTable,
    collectionTable: r.collectionTable
  };
  if (i.has(e))
    return "[Circular Reference]";
  i.add(e), t.visited = i;
  const n = {}, s = await me(e, t);
  Object.assign(n, s);
  const c = e.type;
  if (c)
    switch (c) {
      case "FRAME":
      case "COMPONENT": {
        const b = await H(e);
        Object.assign(n, b);
        break;
      }
      case "INSTANCE": {
        const b = await Ae(
          e
        );
        Object.assign(n, b);
        const m = await H(
          e
        );
        Object.assign(n, m);
        break;
      }
      case "TEXT": {
        const b = await ge(e);
        Object.assign(n, b);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const b = await ye(e);
        Object.assign(n, b);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const b = await he(e);
        Object.assign(n, b);
        break;
      }
      default:
        t.unhandledKeys.add("_unknownType");
        break;
    }
  const f = Object.getOwnPropertyNames(e), l = /* @__PURE__ */ new Set([
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
  for (const b of f)
    typeof e[b] != "function" && (l.has(b) || t.unhandledKeys.add(b));
  if (t.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(t.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const b = t.maxDepth;
    if (t.depth >= b)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${b}) reached`,
        _count: e.children.length
      };
    else if (t.nodeCount >= a)
      n.children = {
        _truncated: !0,
        _reason: `Maximum node count (${a}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const m = E(v({}, t), {
        depth: t.depth + 1
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
        d.push(w), m.nodeCount && (t.nodeCount = m.nodeCount);
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
    const r = figma.root.children;
    if (i < 0 || i >= r.length)
      return {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const a = r[i];
    console.log("Exporting page: " + a.name);
    const o = new _(), t = new O();
    let n = [];
    try {
      n = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((p) => ({
        libraryName: p.libraryName,
        key: p.key,
        name: p.name
      }));
    } catch (y) {
      console.log(
        "Could not get library variable collections:",
        y instanceof Error ? y.message : String(y)
      );
    }
    const s = await F(
      a,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: t
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
      collections: t.getTable(),
      variables: o.getSerializedTable(),
      libraries: n,
      pageData: s
    }, f = JSON.stringify(c, null, 2), l = a.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
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
        jsonData: f,
        pageName: a.name,
        additionalPages: []
        // Will be populated when publishing referenced component pages
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
  for (const r of i)
    e.modes.find((o) => o.name === r) || e.addMode(r);
}
function xe(e, i, r) {
  const a = /* @__PURE__ */ new Map(), o = Object.keys(r);
  for (let t = 0; t < i.length && t < o.length; t++) {
    const n = i[t], s = o[t], c = e.modes.find((f) => f.name === n);
    c ? a.set(s, c.modeId) : console.warn(
      `Mode "${n}" not found in collection "${e.name}" after ensuring modes exist.`
    );
  }
  return a;
}
async function Y(e) {
  let i;
  if (e.isLocal) {
    const a = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (o) => o.name === e.collectionName
    );
    a ? i = a : i = figma.variables.createVariableCollection(
      e.collectionName
    );
  } else {
    const a = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find(
      (s) => s.name === e.collectionName
    );
    if (!a)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const o = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      a.key
    );
    if (o.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const t = await figma.variables.importVariableByKeyAsync(
      o[0].key
    ), n = await figma.variables.getVariableCollectionByIdAsync(
      t.variableCollectionId
    );
    if (!n)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    i = n;
  }
  return await Ce(i, e.modes), { collection: i };
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
    const t = await figma.variables.importVariableByKeyAsync(
      o[0].key
    ), n = await figma.variables.getVariableCollectionByIdAsync(
      t.variableCollectionId
    );
    if (!n)
      throw new Error(
        `Failed to import external collection "${e}"`
      );
    return n;
  }
}
async function k(e, i) {
  for (const r of e.variableIds)
    try {
      const a = await figma.variables.getVariableByIdAsync(r);
      if (a && a.name === i)
        return a;
    } catch (a) {
      continue;
    }
  return null;
}
function W(e, i) {
  const r = e.resolvedType.toUpperCase(), a = i.toUpperCase();
  return r !== a ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${r}" but expected "${a}". Skipping binding.`
  ), !1) : !0;
}
async function Se(e, i, r, a, o) {
  for (const [t, n] of Object.entries(i)) {
    const s = a.get(t);
    if (!s) {
      console.warn(
        `Mode ID ${t} not found in mode mapping for variable "${e.name}". Skipping.`
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
        let f = null;
        if (c._varRef !== void 0) {
          const l = r.getVariableByIndex(
            c._varRef
          );
          if (l) {
            let A = null;
            if (o && l._colRef !== void 0) {
              const y = o.getCollectionByIndex(
                l._colRef
              );
              y && (A = (await Y(y)).collection);
            }
            !A && l.collectionName && l.isLocal !== void 0 && (A = await B(
              l.collectionName,
              l.isLocal
            )), A && (f = await k(
              A,
              l.variableName
            ));
          }
        }
        if (!f && c.id)
          try {
            f = await figma.variables.getVariableByIdAsync(
              c.id
            );
          } catch (l) {
          }
        if (f) {
          const l = {
            type: "VARIABLE_ALIAS",
            id: f.id
          };
          e.setValueForMode(s, l);
        } else
          console.warn(
            `Could not resolve variable alias for mode ${t} (mapped to ${s}) in variable "${e.name}". Original ID: ${c.id}`
          );
      }
    } catch (c) {
      console.warn(
        `Error setting value for mode ${t} (mapped to ${s}) in variable "${e.name}":`,
        c
      );
    }
  }
}
async function q(e, i, r, a, o) {
  const t = figma.variables.createVariable(
    e.variableName,
    i,
    e.variableType
  );
  return e.valuesByMode && await Se(
    t,
    e.valuesByMode,
    r,
    a,
    o
  ), t;
}
async function Q(e, i, r) {
  var o;
  const a = i.getVariableByIndex(e._varRef);
  if (!a)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    let t;
    const n = (o = a._colRef) != null ? o : a.collectionRef;
    if (n !== void 0 && (t = r.getCollectionByIndex(n)), !t && a.collectionId && a.isLocal !== void 0) {
      const f = r.getCollectionIndex(
        a.collectionId
      );
      f >= 0 && (t = r.getCollectionByIndex(f));
    }
    if (!t) {
      const f = await B(
        a.collectionName || "",
        a.isLocal || !1
      );
      let l = await k(f, a.variableName);
      return l ? W(l, a.variableType) ? l : null : a.valuesByMode ? (l = await q(
        a,
        f,
        i,
        /* @__PURE__ */ new Map(),
        // Empty mode mapping for legacy
        r
        // Pass collection table for alias resolution
      ), l) : (console.warn(
        `Cannot create variable "${a.variableName}" without valuesByMode data`
      ), null);
    }
    const { collection: s } = await Y(t);
    let c = await k(s, a.variableName);
    if (c)
      return W(c, a.variableType) ? c : null;
    {
      if (!a.valuesByMode)
        return console.warn(
          `Cannot create variable "${a.variableName}" without valuesByMode data`
        ), null;
      const f = xe(
        s,
        t.modes,
        a.valuesByMode
      );
      return c = await q(
        a,
        s,
        i,
        f,
        r
        // Pass collection table for alias resolution
      ), c;
    }
  } catch (t) {
    if (console.error(
      `Error resolving variable reference for "${a.variableName}":`,
      t
    ), t instanceof Error && t.message.includes("External collection"))
      throw t;
    return null;
  }
}
function we(e, i) {
  if (!i || !V(e))
    return null;
  const r = i.getVariableByIndex(e._varRef);
  return r ? {
    type: "VARIABLE_ALIAS",
    id: r.id || "",
    // Fallback to empty string if id not available (new format)
    variableName: r.variableName,
    variableType: r.variableType,
    isLocal: r.isLocal || !1,
    collectionName: r.collectionName,
    collectionId: r.collectionId,
    variableKey: r.variableKey
  } : (console.log(`Variable not found in table at index ${e._varRef}`), null);
}
async function Pe(e, i, r, a, o) {
  if (!(!i || typeof i != "object"))
    try {
      const t = e[r];
      if (!t || !Array.isArray(t))
        return;
      for (const [n, s] of Object.entries(i))
        if (n === "fills" && Array.isArray(s))
          for (let c = 0; c < s.length && c < t.length; c++) {
            let f = null;
            const l = s[c];
            if (V(l) && a && o) {
              const A = await Q(
                l,
                a,
                o
              );
              A && t[c].boundVariables && (t[c].boundVariables[r] = {
                type: "VARIABLE_ALIAS",
                id: A.id
              });
            } else l && typeof l == "object" && "type" in l && l.type === "VARIABLE_ALIAS" && (f = l, f && await Ee(
              t[c],
              f,
              r,
              a
            ));
          }
        else {
          let c = null;
          V(s) ? c = we(s, a) : s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && (c = s), c && await Z(e, n, c, a);
        }
    } catch (t) {
      console.log(`Error restoring bound variables for ${r}:`, t);
    }
}
async function Z(e, i, r, a) {
  try {
    let o = null;
    try {
      o = await figma.variables.getVariableByIdAsync(r.id);
    } catch (t) {
    }
    if (!o && a) {
      if (r.isLocal) {
        const t = await B(
          r.collectionName || "",
          !0
        );
        o = await k(
          t,
          r.variableName || ""
        ), !o && r.variableName && r.variableType && console.warn(
          `Cannot create variable "${r.variableName}" without valuesByMode. Use resolveVariableReferenceOnImport instead.`
        );
      } else if (r.variableKey)
        try {
          o = await figma.variables.importVariableByKeyAsync(
            r.variableKey
          );
        } catch (t) {
          console.log(
            `Could not import team variable: ${r.variableName}`
          );
        }
    }
    if (o) {
      const t = {
        type: "VARIABLE_ALIAS",
        id: o.id
      };
      e.boundVariables || (e.boundVariables = {}), e.boundVariables[i] || (e.boundVariables[i] = t);
    }
  } catch (o) {
    console.log(`Error binding variable to property ${i}:`, o);
  }
}
async function Ee(e, i, r, a) {
  if (!(!e || typeof e != "object"))
    try {
      let o = null;
      try {
        o = await figma.variables.getVariableByIdAsync(i.id);
      } catch (t) {
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
      o && e.boundVariables && (e.boundVariables[r] = {
        type: "VARIABLE_ALIAS",
        id: o.id
      });
    } catch (o) {
      console.log("Error binding variable to property object:", o);
    }
}
function Ie(e, i) {
  const r = de(i);
  if (e.visible === void 0 && (e.visible = r.visible), e.locked === void 0 && (e.locked = r.locked), e.opacity === void 0 && (e.opacity = r.opacity), e.rotation === void 0 && (e.rotation = r.rotation), e.blendMode === void 0 && (e.blendMode = r.blendMode), i === "FRAME" || i === "COMPONENT" || i === "INSTANCE") {
    const a = C;
    e.layoutMode === void 0 && (e.layoutMode = a.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = a.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = a.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = a.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = a.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = a.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = a.paddingRight), e.paddingTop === void 0 && (e.paddingTop = a.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = a.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = a.itemSpacing);
  }
  if (i === "TEXT") {
    const a = P;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = a.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = a.textAlignVertical), e.textCase === void 0 && (e.textCase = a.textCase), e.textDecoration === void 0 && (e.textDecoration = a.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = a.textAutoResize);
  }
}
async function j(e, i, r = null, a = null) {
  var o;
  try {
    let t;
    switch (e.type) {
      case "FRAME":
        t = figma.createFrame();
        break;
      case "RECTANGLE":
        t = figma.createRectangle();
        break;
      case "ELLIPSE":
        t = figma.createEllipse();
        break;
      case "TEXT":
        t = figma.createText();
        break;
      case "VECTOR":
        t = figma.createVector();
        break;
      case "STAR":
        t = figma.createStar();
        break;
      case "LINE":
        t = figma.createLine();
        break;
      case "COMPONENT":
        t = figma.createComponent();
        break;
      case "INSTANCE":
        if (console.log("Found instance node: " + e.name), e.mainComponent && e.mainComponent.key)
          try {
            const n = await figma.importComponentByKeyAsync(
              e.mainComponent.key
            );
            n && n.type === "COMPONENT" ? (t = n.createInstance(), console.log(
              "Created instance from main component: " + e.mainComponent.name
            )) : (console.log("Main component not found, creating frame fallback"), t = figma.createFrame());
          } catch (n) {
            console.log(
              "Error creating instance: " + n + ", creating frame fallback"
            ), t = figma.createFrame();
          }
        else
          console.log("No main component info, creating frame fallback"), t = figma.createFrame();
        break;
      case "GROUP":
        t = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " + e.name + ", creating frame fallback"
        ), t = figma.createFrame();
        break;
      case "POLYGON":
        t = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " + e.type + ", creating frame instead"
        ), t = figma.createFrame();
        break;
    }
    if (!t)
      return null;
    if (Ie(t, e.type || "FRAME"), e.name !== void 0 && (t.name = e.name || "Unnamed Node"), e.x !== void 0 && (t.x = e.x), e.y !== void 0 && (t.y = e.y), e.width !== void 0 && e.height !== void 0 && t.resize(e.width, e.height), e.visible !== void 0 && (t.visible = e.visible), e.locked !== void 0 && (t.locked = e.locked), e.opacity !== void 0 && (t.opacity = e.opacity), e.rotation !== void 0 && (t.rotation = e.rotation), e.blendMode !== void 0 && (t.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && r && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const c = {};
            for (const [f, l] of Object.entries(
              s.boundVariables
            ))
              c[f] = l;
            return E(v({}, s), { boundVariables: c });
          }
          return s;
        })), t.fills = n, (o = e.boundVariables) != null && o.fills && await Pe(
          t,
          e.boundVariables,
          "fills",
          r,
          a
        );
      } catch (n) {
        console.log("Error setting fills:", n);
      }
    if (e.strokes !== void 0 && e.strokes.length > 0)
      try {
        t.strokes = e.strokes;
      } catch (n) {
        console.log("Error setting strokes:", n);
      }
    if (e.strokeWeight !== void 0 && (t.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (t.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (t.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (t.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (t.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (t.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (t.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (t.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (t.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (t.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (t.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (t.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (t.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (t.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (t.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (t.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (t.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
      try {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), t.fontName = e.fontName;
          } catch (n) {
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular"
            }), t.fontName = { family: "Roboto", style: "Regular" };
          }
        else
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), t.fontName = { family: "Roboto", style: "Regular" };
        t.characters = e.characters, e.fontSize !== void 0 && (t.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (t.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (t.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (t.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (t.lineHeight = e.lineHeight), e.textCase !== void 0 && (t.textCase = e.textCase), e.textDecoration !== void 0 && (t.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (t.textAutoResize = e.textAutoResize);
      } catch (n) {
        console.log("Error setting text properties: " + n);
        try {
          t.characters = e.characters;
        } catch (s) {
          console.log("Could not set text characters: " + s);
        }
      }
    if (e.boundVariables) {
      for (const [n, s] of Object.entries(
        e.boundVariables
      ))
        if (n !== "fills")
          if (V(s) && r && a) {
            const c = await Q(
              s,
              r,
              a
            );
            if (c) {
              const f = {
                type: "VARIABLE_ALIAS",
                id: c.id
              };
              t.boundVariables || (t.boundVariables = {}), t.boundVariables[n] || (t.boundVariables[n] = f);
            }
          } else s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && await Z(
            t,
            n,
            s,
            r
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
          t,
          r,
          a
        );
        s && t.appendChild(s);
      }
    return i && i.appendChild(t), t;
  } catch (t) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      t
    ), null;
  }
}
async function Ne(e) {
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
    const r = i.pageData, a = i.metadata;
    let o = null;
    if (i.collections)
      try {
        o = O.fromTable(i.collections), console.log(
          `Loaded collections table with ${o.getSize()} collections`
        );
      } catch (y) {
        console.warn("Failed to load collections table:", y);
      }
    let t = null;
    if (i.variables)
      try {
        t = _.fromTable(i.variables), console.log(
          `Loaded variable table with ${t.getSize()} variables`
        );
      } catch (y) {
        console.warn("Failed to load variable table:", y);
      }
    const n = "2.3.0", s = a.exportFormatVersion || "1.0.0";
    s !== n && console.warn(
      `Export format version mismatch: exported with ${s}, current version is ${n}. Import may have compatibility issues.`
    );
    const f = "Imported - " + (a.originalPageName ? a.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), l = figma.createPage();
    if (l.name = f, figma.root.appendChild(l), console.log("Created new page: " + f), console.log("Importing " + (a.totalNodes || "unknown") + " nodes"), r.children && Array.isArray(r.children)) {
      for (const y of r.children) {
        if (y._truncated) {
          console.log(
            `Skipping truncated children: ${y._reason || "Unknown"}`
          );
          continue;
        }
        await j(
          y,
          l,
          t,
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
async function ke(e) {
  try {
    await figma.loadAllPagesAsync();
    const i = figma.root.children;
    console.log("Found " + i.length + " pages in the document");
    const r = 11, a = i[r];
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
      "Selected page: " + a.name + " (index: " + r + ")"
    );
    const t = JSON.stringify(o, null, 2), n = JSON.parse(t), s = "Copy - " + n.name, c = figma.createPage();
    if (c.name = s, figma.root.appendChild(c), n.children && n.children.length > 0) {
      let A = function(p) {
        p.forEach((h) => {
          const g = (h.x || 0) + (h.width || 0);
          g > y && (y = g), h.children && h.children.length > 0 && A(h.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let y = 0;
      A(n.children), console.log("Original content rightmost edge: " + y);
      for (const p of n.children)
        await j(p, c, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const f = T(n);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: n.name,
        newPageName: s,
        totalNodes: f
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
async function Re(e) {
  try {
    const i = e.accessToken, r = e.selectedRepo;
    return i ? (await figma.clientStorage.setAsync("accessToken", i), r && await figma.clientStorage.setAsync("selectedRepo", r), {
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
async function Me(e) {
  try {
    const i = await figma.clientStorage.getAsync("accessToken"), r = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        accessToken: i || void 0,
        selectedRepo: r || void 0
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
async function Ve(e) {
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
async function Le(e) {
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
function $(e, i = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: i
  };
}
function ee(e, i, r = {}) {
  const a = i instanceof Error ? i.message : i;
  return {
    type: e,
    success: !1,
    error: !0,
    message: a,
    data: r
  };
}
function K(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const te = "RecursicaPublishedMetadata";
async function Te(e) {
  try {
    const i = figma.currentPage;
    await figma.loadAllPagesAsync();
    const a = figma.root.children.findIndex(
      (s) => s.id === i.id
    ), o = i.getPluginData(te);
    if (!o) {
      const f = {
        componentMetadata: {
          _ver: 1,
          id: "",
          name: K(i.name),
          version: 0,
          publishDate: "",
          history: {}
        },
        currentPageIndex: a
      };
      return $("getComponentMetadata", f);
    }
    const n = {
      componentMetadata: JSON.parse(o),
      currentPageIndex: a
    };
    return $("getComponentMetadata", n);
  } catch (i) {
    return console.error("Error getting component metadata:", i), ee(
      "getComponentMetadata",
      i instanceof Error ? i : "Unknown error occurred"
    );
  }
}
async function Oe(e) {
  try {
    await figma.loadAllPagesAsync();
    const i = figma.root.children, r = [];
    for (const o of i) {
      if (o.type !== "PAGE") {
        console.warn(
          `Skipping non-PAGE node: ${o.name} (type: ${o.type})`
        );
        continue;
      }
      const t = o, n = t.getPluginData(te);
      if (n)
        try {
          const s = JSON.parse(n);
          r.push(s);
        } catch (s) {
          console.warn(
            `Failed to parse metadata for page "${t.name}":`,
            s
          );
          const f = {
            _ver: 1,
            id: "",
            name: K(t.name),
            version: 0,
            publishDate: "",
            history: {}
          };
          r.push(f);
        }
      else {
        const c = {
          _ver: 1,
          id: "",
          name: K(t.name),
          version: 0,
          publishDate: "",
          history: {}
        };
        r.push(c);
      }
    }
    return $("getAllComponents", {
      components: r
    });
  } catch (i) {
    return console.error("Error getting all components:", i), ee(
      "getAllComponents",
      i instanceof Error ? i : "Unknown error occurred"
    );
  }
}
const M = /* @__PURE__ */ new Map();
let _e = 0;
function Be() {
  return `prompt_${Date.now()}_${++_e}`;
}
const ze = {
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
    const r = typeof i == "number" ? { timeoutMs: i } : i, a = (s = r == null ? void 0 : r.timeoutMs) != null ? s : 3e5, o = r == null ? void 0 : r.okLabel, t = r == null ? void 0 : r.cancelLabel, n = Be();
    return new Promise((c, f) => {
      const l = a === -1 ? null : setTimeout(() => {
        M.delete(n), f(new Error(`Plugin prompt timeout: ${e}`));
      }, a);
      M.set(n, {
        resolve: c,
        reject: f,
        timeout: l
      }), figma.ui.postMessage({
        type: "PluginPrompt",
        payload: v(v({
          message: e,
          requestId: n
        }, o && { okLabel: o }), t && { cancelLabel: t })
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
    const { requestId: i, action: r } = e, a = M.get(i);
    if (!a) {
      console.warn(
        `Received response for unknown prompt request: ${i}`
      );
      return;
    }
    a.timeout && clearTimeout(a.timeout), M.delete(i), r === "ok" ? a.resolve() : a.reject(new Error("User cancelled"));
  }
};
async function $e(e) {
  try {
    const i = e.requestId, r = e.action;
    return !i || !r ? {
      type: "pluginPromptResponse",
      success: !1,
      error: !0,
      message: "Request ID and action are required",
      data: {}
    } : (ze.handleResponse({ requestId: i, action: r }), {
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
  importPage: Ne,
  quickCopy: ke,
  storeAuthData: Re,
  loadAuthData: Me,
  clearAuthData: Ve,
  storeSelectedRepo: Le,
  getComponentMetadata: Te,
  getAllComponents: Oe,
  pluginPromptResponse: $e
}, Fe = Ke;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  console.log("Received message:", e);
  try {
    const i = e.type, r = Fe[i];
    if (!r) {
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
    const a = await r(e.data);
    figma.ui.postMessage(E(v({}, a), {
      requestId: e.requestId
    }));
  } catch (i) {
    console.error("Error handling message:", i);
    const r = {
      type: e.type,
      success: !1,
      error: !0,
      message: i instanceof Error ? i.message : "Unknown error occurred",
      data: {},
      requestId: e.requestId
    };
    figma.ui.postMessage(r);
  }
};
