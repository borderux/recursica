var Z = Object.defineProperty, D = Object.defineProperties;
var ee = Object.getOwnPropertyDescriptors;
var F = Object.getOwnPropertySymbols;
var te = Object.prototype.hasOwnProperty, re = Object.prototype.propertyIsEnumerable;
var B = (e, a, r) => a in e ? Z(e, a, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[a] = r, v = (e, a) => {
  for (var r in a || (a = {}))
    te.call(a, r) && B(e, r, a[r]);
  if (F)
    for (var r of F(a))
      re.call(a, r) && B(e, r, a[r]);
  return e;
}, I = (e, a) => D(e, ee(a));
var P = (e, a, r) => B(e, typeof a != "symbol" ? a + "" : a, r);
async function ie(e) {
  var a;
  try {
    return {
      type: "getCurrentUser",
      success: !0,
      error: !1,
      message: "Current user retrieved successfully",
      data: {
        userId: ((a = figma.currentUser) == null ? void 0 : a.id) || null
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
async function ae(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      data: {
        pages: figma.root.children.map((i, o) => ({
          name: i.name,
          index: o
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
}, x = I(v({}, C), {
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
}), E = I(v({}, C), {
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
}), N = I(v({}, C), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), H = I(v({}, C), {
  cornerRadius: 0
}), oe = I(v({}, C), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function ne(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return x;
    case "TEXT":
      return E;
    case "VECTOR":
      return N;
    case "LINE":
      return oe;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return H;
    default:
      return C;
  }
}
function f(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((r, i) => f(r, a[i])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const r = Object.keys(e), i = Object.keys(a);
      return r.length !== i.length ? !0 : r.some(
        (o) => !(o in a) || f(e[o], a[o])
      );
    }
    return !0;
  }
  return e !== a;
}
class T {
  constructor() {
    P(this, "collectionMap");
    // collectionId -> index
    P(this, "collections");
    // index -> collection data
    P(this, "nextIndex");
    this.collectionMap = /* @__PURE__ */ new Map(), this.collections = [], this.nextIndex = 0;
  }
  /**
   * Adds a collection to the table if it doesn't already exist
   * Returns the index of the collection (existing or newly added)
   */
  addCollection(a) {
    const r = a.collectionId;
    if (this.collectionMap.has(r))
      return this.collectionMap.get(r);
    const i = this.nextIndex++;
    return this.collectionMap.set(r, i), this.collections[i] = a, i;
  }
  /**
   * Gets the index of a collection by its collectionId
   * Returns -1 if not found
   */
  getCollectionIndex(a) {
    var r;
    return (r = this.collectionMap.get(a)) != null ? r : -1;
  }
  /**
   * Gets a collection entry by index
   */
  getCollectionByIndex(a) {
    return this.collections[a];
  }
  /**
   * Gets the complete table as an object with string keys
   * Used for JSON serialization
   */
  getTable() {
    const a = {};
    for (let r = 0; r < this.collections.length; r++)
      a[String(r)] = this.collections[r];
    return a;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   */
  static fromTable(a) {
    const r = new T(), i = Object.entries(a).sort(
      (o, t) => parseInt(o[0], 10) - parseInt(t[0], 10)
    );
    for (const [o, t] of i) {
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
class O {
  constructor() {
    P(this, "variableMap");
    // variableKey -> index
    P(this, "variables");
    // index -> variable data
    P(this, "nextIndex");
    this.variableMap = /* @__PURE__ */ new Map(), this.variables = [], this.nextIndex = 0;
  }
  /**
   * Adds a variable to the table if it doesn't already exist
   * Returns the index of the variable (existing or newly added)
   */
  addVariable(a) {
    const r = a.variableKey;
    if (!r)
      return -1;
    if (this.variableMap.has(r))
      return this.variableMap.get(r);
    const i = this.nextIndex++;
    return this.variableMap.set(r, i), this.variables[i] = a, i;
  }
  /**
   * Gets the index of a variable by its variableKey
   * Returns -1 if not found
   */
  getVariableIndex(a) {
    var r;
    return (r = this.variableMap.get(a)) != null ? r : -1;
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
    for (let r = 0; r < this.variables.length; r++)
      a[String(r)] = this.variables[r];
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
    for (let r = 0; r < this.variables.length; r++) {
      const i = this.variables[r], o = v(v(v(v(v(v({
        variableName: i.variableName,
        variableType: i.variableType
      }, i._colRef !== void 0 && { _colRef: i._colRef }), i.valuesByMode && { valuesByMode: i.valuesByMode }), i._colRef === void 0 && i.collectionRef !== void 0 && {
        collectionRef: i.collectionRef
      }), i._colRef === void 0 && i.collectionName && { collectionName: i.collectionName }), i._colRef === void 0 && i.collectionId && { collectionId: i.collectionId }), i._colRef === void 0 && i.isLocal !== void 0 && { isLocal: i.isLocal });
      a[String(r)] = o;
    }
    return a;
  }
  /**
   * Reconstructs a VariableTable from a serialized table object
   * Handles both new format (without variableKey) and legacy format (with variableKey)
   */
  static fromTable(a) {
    var o;
    const r = new O(), i = Object.entries(a).sort(
      (t, n) => parseInt(t[0], 10) - parseInt(n[0], 10)
    );
    for (const [t, n] of i) {
      const s = parseInt(t, 10);
      n.variableKey && r.variableMap.set(n.variableKey, s);
      const d = I(v({}, n), {
        // Prefer _colRef, fallback to collectionRef for backward compatibility
        _colRef: (o = n._colRef) != null ? o : n.collectionRef
      });
      r.variables[s] = d, r.nextIndex = Math.max(r.nextIndex, s + 1);
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
function se(e) {
  return {
    _varRef: e
  };
}
function M(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
async function W(e, a, r, i = /* @__PURE__ */ new Set()) {
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
      if (i.has(s)) {
        o[t] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      try {
        const d = await figma.variables.getVariableByIdAsync(s);
        if (!d) {
          o[t] = {
            type: "VARIABLE_ALIAS",
            id: s
          };
          continue;
        }
        const u = new Set(i);
        u.add(s);
        const c = await figma.variables.getVariableCollectionByIdAsync(
          d.variableCollectionId
        ), g = d.key;
        if (!g) {
          o[t] = {
            type: "VARIABLE_ALIAS",
            id: s
          };
          continue;
        }
        const A = {
          variableName: d.name,
          variableType: d.resolvedType,
          collectionName: c == null ? void 0 : c.name,
          collectionId: d.variableCollectionId,
          variableKey: g,
          id: s,
          isLocal: !d.remote
        }, l = await figma.variables.getVariableCollectionByIdAsync(
          d.variableCollectionId
        );
        if (l) {
          const y = await J(
            l,
            r
          );
          A._colRef = y;
        }
        d.valuesByMode && (A.valuesByMode = await W(
          d.valuesByMode,
          a,
          r,
          u
        ));
        const h = a.addVariable(A);
        o[t] = {
          type: "VARIABLE_ALIAS",
          id: s,
          _varRef: h
        };
      } catch (d) {
        console.log(
          "Could not resolve variable alias in valuesByMode:",
          s,
          d
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
async function J(e, a) {
  const r = {};
  for (const o of e.modes)
    r[o.modeId] = o.name;
  const i = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: !e.remote,
    modes: r
  };
  return a.addCollection(i);
}
async function $(e, a, r) {
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
    const t = i.key;
    if (!t)
      return console.log("Variable missing key:", e.id), null;
    const n = await J(
      o,
      r
    ), s = {
      variableName: i.name,
      variableType: i.resolvedType,
      _colRef: n,
      // Reference to collection table (v2.4.0+)
      variableKey: t,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    i.valuesByMode && (s.valuesByMode = await W(
      i.valuesByMode,
      a,
      r,
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const d = a.addVariable(s);
    return se(d);
  } catch (i) {
    return console.log("Could not resolve variable alias:", e.id, i), null;
  }
}
async function V(e, a, r) {
  if (!e || typeof e != "object") return e;
  const i = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const t = e[o];
      if (t && typeof t == "object" && !Array.isArray(t))
        if (t.type === "VARIABLE_ALIAS") {
          const n = await $(
            t,
            a,
            r
          );
          n && (i[o] = n);
        } else
          i[o] = await V(
            t,
            a,
            r
          );
      else Array.isArray(t) ? i[o] = await Promise.all(
        t.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await $(
          n,
          a,
          r
        ) || n : n && typeof n == "object" ? await V(
          n,
          a,
          r
        ) : n)
      ) : i[o] = t;
    }
  return i;
}
async function ce(e, a, r) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (i) => {
      if (!i || typeof i != "object") return i;
      const o = {};
      for (const t in i)
        Object.prototype.hasOwnProperty.call(i, t) && (t === "boundVariables" ? o[t] = await V(
          i[t],
          a,
          r
        ) : o[t] = i[t]);
      return o;
    })
  );
}
async function le(e, a) {
  const r = {}, i = /* @__PURE__ */ new Set();
  if (e.type && (r.type = e.type, i.add("type")), e.id && (r.id = e.id, i.add("id")), e.name !== void 0 && e.name !== "" && (r.name = e.name, i.add("name")), e.x !== void 0 && e.x !== 0 && (r.x = e.x, i.add("x")), e.y !== void 0 && e.y !== 0 && (r.y = e.y, i.add("y")), e.width !== void 0 && (r.width = e.width, i.add("width")), e.height !== void 0 && (r.height = e.height, i.add("height")), e.visible !== void 0 && f(e.visible, C.visible) && (r.visible = e.visible, i.add("visible")), e.locked !== void 0 && f(e.locked, C.locked) && (r.locked = e.locked, i.add("locked")), e.opacity !== void 0 && f(e.opacity, C.opacity) && (r.opacity = e.opacity, i.add("opacity")), e.rotation !== void 0 && f(e.rotation, C.rotation) && (r.rotation = e.rotation, i.add("rotation")), e.blendMode !== void 0 && f(e.blendMode, C.blendMode) && (r.blendMode = e.blendMode, i.add("blendMode")), e.effects !== void 0 && f(e.effects, C.effects) && (r.effects = e.effects, i.add("effects")), e.fills !== void 0) {
    const o = await ce(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    f(o, C.fills) && (r.fills = o), i.add("fills");
  }
  if (e.strokes !== void 0 && f(e.strokes, C.strokes) && (r.strokes = e.strokes, i.add("strokes")), e.strokeWeight !== void 0 && f(e.strokeWeight, C.strokeWeight) && (r.strokeWeight = e.strokeWeight, i.add("strokeWeight")), e.strokeAlign !== void 0 && f(e.strokeAlign, C.strokeAlign) && (r.strokeAlign = e.strokeAlign, i.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await V(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    );
    Object.keys(o).length > 0 && (r.boundVariables = o), i.add("boundVariables");
  }
  return r;
}
async function j(e, a) {
  const r = {}, i = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && f(e.layoutMode, x.layoutMode) && (r.layoutMode = e.layoutMode, i.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && f(
    e.primaryAxisSizingMode,
    x.primaryAxisSizingMode
  ) && (r.primaryAxisSizingMode = e.primaryAxisSizingMode, i.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && f(
    e.counterAxisSizingMode,
    x.counterAxisSizingMode
  ) && (r.counterAxisSizingMode = e.counterAxisSizingMode, i.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && f(
    e.primaryAxisAlignItems,
    x.primaryAxisAlignItems
  ) && (r.primaryAxisAlignItems = e.primaryAxisAlignItems, i.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && f(
    e.counterAxisAlignItems,
    x.counterAxisAlignItems
  ) && (r.counterAxisAlignItems = e.counterAxisAlignItems, i.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && f(e.paddingLeft, x.paddingLeft) && (r.paddingLeft = e.paddingLeft, i.add("paddingLeft")), e.paddingRight !== void 0 && f(e.paddingRight, x.paddingRight) && (r.paddingRight = e.paddingRight, i.add("paddingRight")), e.paddingTop !== void 0 && f(e.paddingTop, x.paddingTop) && (r.paddingTop = e.paddingTop, i.add("paddingTop")), e.paddingBottom !== void 0 && f(e.paddingBottom, x.paddingBottom) && (r.paddingBottom = e.paddingBottom, i.add("paddingBottom")), e.itemSpacing !== void 0 && f(e.itemSpacing, x.itemSpacing) && (r.itemSpacing = e.itemSpacing, i.add("itemSpacing")), e.cornerRadius !== void 0 && f(e.cornerRadius, x.cornerRadius) && (r.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.clipsContent !== void 0 && f(e.clipsContent, x.clipsContent) && (r.clipsContent = e.clipsContent, i.add("clipsContent")), e.layoutWrap !== void 0 && f(e.layoutWrap, x.layoutWrap) && (r.layoutWrap = e.layoutWrap, i.add("layoutWrap")), e.layoutGrow !== void 0 && f(e.layoutGrow, x.layoutGrow) && (r.layoutGrow = e.layoutGrow, i.add("layoutGrow")), r;
}
async function de(e, a) {
  const r = {}, i = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (r.characters = e.characters, i.add("characters")), e.fontName !== void 0 && (r.fontName = e.fontName, i.add("fontName")), e.fontSize !== void 0 && (r.fontSize = e.fontSize, i.add("fontSize")), e.textAlignHorizontal !== void 0 && f(
    e.textAlignHorizontal,
    E.textAlignHorizontal
  ) && (r.textAlignHorizontal = e.textAlignHorizontal, i.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && f(
    e.textAlignVertical,
    E.textAlignVertical
  ) && (r.textAlignVertical = e.textAlignVertical, i.add("textAlignVertical")), e.letterSpacing !== void 0 && f(e.letterSpacing, E.letterSpacing) && (r.letterSpacing = e.letterSpacing, i.add("letterSpacing")), e.lineHeight !== void 0 && f(e.lineHeight, E.lineHeight) && (r.lineHeight = e.lineHeight, i.add("lineHeight")), e.textCase !== void 0 && f(e.textCase, E.textCase) && (r.textCase = e.textCase, i.add("textCase")), e.textDecoration !== void 0 && f(e.textDecoration, E.textDecoration) && (r.textDecoration = e.textDecoration, i.add("textDecoration")), e.textAutoResize !== void 0 && f(e.textAutoResize, E.textAutoResize) && (r.textAutoResize = e.textAutoResize, i.add("textAutoResize")), e.paragraphSpacing !== void 0 && f(
    e.paragraphSpacing,
    E.paragraphSpacing
  ) && (r.paragraphSpacing = e.paragraphSpacing, i.add("paragraphSpacing")), e.paragraphIndent !== void 0 && f(e.paragraphIndent, E.paragraphIndent) && (r.paragraphIndent = e.paragraphIndent, i.add("paragraphIndent")), e.listOptions !== void 0 && f(e.listOptions, E.listOptions) && (r.listOptions = e.listOptions, i.add("listOptions")), r;
}
async function pe(e, a) {
  const r = {}, i = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && f(e.fillGeometry, N.fillGeometry) && (r.fillGeometry = e.fillGeometry, i.add("fillGeometry")), e.strokeGeometry !== void 0 && f(e.strokeGeometry, N.strokeGeometry) && (r.strokeGeometry = e.strokeGeometry, i.add("strokeGeometry")), e.strokeCap !== void 0 && f(e.strokeCap, N.strokeCap) && (r.strokeCap = e.strokeCap, i.add("strokeCap")), e.strokeJoin !== void 0 && f(e.strokeJoin, N.strokeJoin) && (r.strokeJoin = e.strokeJoin, i.add("strokeJoin")), e.dashPattern !== void 0 && f(e.dashPattern, N.dashPattern) && (r.dashPattern = e.dashPattern, i.add("dashPattern")), r;
}
async function fe(e, a) {
  const r = {}, i = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && f(e.cornerRadius, H.cornerRadius) && (r.cornerRadius = e.cornerRadius, i.add("cornerRadius")), e.pointCount !== void 0 && (r.pointCount = e.pointCount, i.add("pointCount")), e.innerRadius !== void 0 && (r.innerRadius = e.innerRadius, i.add("innerRadius")), e.pointCount !== void 0 && (r.pointCount = e.pointCount, i.add("pointCount")), r;
}
function ge(e) {
  const a = [];
  let r = e.parent;
  try {
    for (; r; ) {
      let i, o, t;
      try {
        i = r.type, o = r.name, t = r.parent;
      } catch (n) {
        console.log(
          "Error accessing parent node properties in buildParentPath:",
          n
        );
        break;
      }
      if (i === "PAGE" || !t)
        break;
      o && o.trim() !== "" && a.unshift(o), r = t;
    }
  } catch (i) {
    console.log("Error during parent path traversal:", i);
  }
  return a.join("/");
}
async function me(e, a) {
  const r = {}, i = /* @__PURE__ */ new Set();
  if (r._isInstance = !0, i.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (o) {
        const t = {};
        try {
          t.instanceNodeName = e.name, t.instanceNodeId = e.id, t.instanceNodeType = e.type, t.componentName = o.name, t.componentType = o.type, t.componentId = o.id;
          try {
            t.componentKey = o.key;
          } catch (p) {
            t.componentKey = "(cannot access)";
          }
          try {
            t.componentRemote = o.remote;
          } catch (p) {
            t.componentRemote = "(cannot access)";
          }
          let l = [];
          try {
            l = Object.getOwnPropertyNames(o), t.ownProperties = l;
          } catch (p) {
            t.ownProperties = "(cannot access)";
          }
          const h = [];
          try {
            let p = Object.getPrototypeOf(o);
            for (; p && p !== Object.prototype; )
              h.push(
                ...Object.getOwnPropertyNames(p).filter(
                  (S) => !h.includes(S)
                )
              ), p = Object.getPrototypeOf(p);
            t.prototypeProperties = h;
          } catch (p) {
            t.prototypeProperties = "(cannot access)";
          }
          let y = [];
          try {
            y = Object.keys(o), t.enumerableProperties = y;
          } catch (p) {
            t.enumerableProperties = "(cannot access)";
          }
          const b = [];
          try {
            for (const p of [...l, ...h])
              if (!(p === "instances" || p === "children" || p === "parent"))
                try {
                  typeof o[p] == "function" && b.push(p);
                } catch (S) {
                }
            t.availableMethods = b;
          } catch (p) {
            t.availableMethods = "(cannot access)";
          }
          const m = [];
          try {
            for (const p of [...l, ...h])
              (p.toLowerCase().includes("library") || p.toLowerCase().includes("remote") || p.toLowerCase().includes("file")) && m.push(p);
            t.libraryRelatedProperties = m;
          } catch (p) {
            t.libraryRelatedProperties = "(cannot access)";
          }
          try {
            o.remote !== void 0 && (t.remoteValue = o.remote);
          } catch (p) {
          }
          try {
            o.libraryName !== void 0 && (t.libraryNameValue = o.libraryName);
          } catch (p) {
          }
          try {
            o.libraryKey !== void 0 && (t.libraryKeyValue = o.libraryKey);
          } catch (p) {
          }
          try {
            if (o.parent !== void 0) {
              const p = o.parent;
              if (p) {
                t.mainComponentHasParent = !0;
                try {
                  t.mainComponentParentType = p.type, t.mainComponentParentName = p.name, t.mainComponentParentId = p.id;
                } catch (S) {
                  t.mainComponentParentAccessError = String(S);
                }
              } else
                t.mainComponentHasParent = !1;
            } else
              t.mainComponentParentUndefined = !0;
          } catch (p) {
            t.mainComponentParentCheckError = String(p);
          }
          try {
            o.variantProperties !== void 0 && (t.mainComponentVariantProperties = o.variantProperties);
          } catch (p) {
          }
          try {
            o.componentPropertyDefinitions !== void 0 && (t.mainComponentPropertyDefinitions = Object.keys(
              o.componentPropertyDefinitions
            ));
          } catch (p) {
          }
        } catch (l) {
          t.debugError = String(l);
        }
        let n, s;
        try {
          e.variantProperties && (n = e.variantProperties, t.instanceVariantProperties = n), e.componentProperties && (s = e.componentProperties, t.instanceComponentProperties = s);
        } catch (l) {
          t.propertiesError = String(l);
        }
        let d, u;
        const c = [];
        try {
          let l = o.parent;
          const h = [];
          let y = 0;
          const b = 20;
          if (l)
            try {
              if (t.mainComponentParentExists = !0, t.mainComponentParentType = l.type, t.mainComponentParentName = l.name, t.mainComponentParentId = l.id, l.type === "COMPONENT_SET")
                try {
                  const m = l.parent;
                  if (m === null)
                    t.componentSetParentIsNull = !0;
                  else if (m === void 0)
                    t.componentSetParentIsUndefined = !0;
                  else {
                    t.componentSetParentExists = !0;
                    try {
                      t.componentSetParentType = m.type, t.componentSetParentName = m.name;
                    } catch (p) {
                      t.componentSetParentPropertyAccessError = String(p);
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
          for (; l && y < b; )
            try {
              const m = l.type, p = l.name;
              if (c.push(
                `${m}:${p || "(unnamed)"}`
              ), m === "COMPONENT_SET" && !u && (u = p, t.componentSetName = p, t.componentSetFound = !0), m === "PAGE")
                break;
              p && p.trim() !== "" && h.unshift(p);
              let S, R = !1;
              try {
                "parent" in l ? (R = !0, t[`hasParentPropertyAtDepth${y}`] = !0, S = l.parent, S === null ? t[`parentIsNullAtDepth${y}`] = !0 : S === void 0 ? t[`parentIsUndefinedAtDepth${y}`] = !0 : t[`parentExistsAtDepth${y}`] = !0) : t[`noParentPropertyAtDepth${y}`] = !0;
              } catch (w) {
                t.parentAccessErrorAtDepth = y, t.parentAccessError = String(w), t.parentAccessErrorName = w instanceof Error ? w.name : "Unknown", t.parentAccessErrorMessage = w instanceof Error ? w.message : String(w);
                break;
              }
              if (!S) {
                t.noParentAtDepth = y, t.parentAccessAttemptedAtDepth = R;
                break;
              }
              try {
                const w = S.type, Q = S.name;
                t[`parentAtDepth${y + 1}Type`] = w, t[`parentAtDepth${y + 1}Name`] = Q;
              } catch (w) {
                t.nextParentAccessErrorAtDepth = y, t.nextParentAccessError = String(w);
              }
              l = S, y++;
            } catch (m) {
              t.parentTraverseErrorAtDepth = y, t.parentTraverseError = String(m), t.parentTraverseErrorName = m instanceof Error ? m.name : "Unknown", t.parentTraverseErrorMessage = m instanceof Error ? m.message : String(m);
              break;
            }
          d = h.join("/"), t.mainComponentParentChain = c, t.mainComponentParentChainDepth = y, t.mainComponentParentPath = d, t.mainComponentParentPathParts = h;
        } catch (l) {
          t.mainComponentParentPathError = String(l);
        }
        const g = ge(e);
        if (t.instanceParentPath = g, r.mainComponent = {
          id: o.id,
          name: o.name,
          key: o.key,
          // Component key for reference
          type: o.type
        }, u && (r.mainComponent.componentSetName = u), n && (r.mainComponent.variantProperties = n), s && (r.mainComponent.componentProperties = s), d && (r.mainComponent._path = d), g && (r.mainComponent._instancePath = g), o.remote === !0) {
          r.mainComponent.remote = !0;
          try {
            if (typeof o.getPublishStatusAsync == "function")
              try {
                const l = await o.getPublishStatusAsync();
                if (l && (t.publishStatus = l, l && typeof l == "object")) {
                  l.libraryName && (r.mainComponent.libraryName = l.libraryName), l.libraryKey && (r.mainComponent.libraryKey = l.libraryKey), l.fileKey && (r.mainComponent.fileKey = l.fileKey);
                  const h = {};
                  Object.keys(l).forEach((y) => {
                    (y.toLowerCase().includes("library") || y.toLowerCase().includes("file")) && (h[y] = l[y]);
                  }), Object.keys(h).length > 0 && (t.libraryRelatedFromPublishStatus = h);
                }
              } catch (l) {
                t.publishStatusError = String(l);
              }
            try {
              const l = figma.teamLibrary, h = Object.getOwnPropertyNames(
                l
              ).filter((y) => typeof l[y] == "function");
              if (t.teamLibraryAvailableMethods = h, typeof (l == null ? void 0 : l.getAvailableLibraryComponentSetsAsync) == "function") {
                const y = await l.getAvailableLibraryComponentSetsAsync();
                if (t.availableComponentSetsCount = (y == null ? void 0 : y.length) || 0, y && Array.isArray(y)) {
                  const b = [];
                  for (const m of y)
                    try {
                      const p = {
                        name: m.name,
                        key: m.key,
                        libraryName: m.libraryName,
                        libraryKey: m.libraryKey
                      };
                      if (b.push(p), m.key === o.key || m.name === o.name) {
                        t.matchingComponentSet = p, m.libraryName && (r.mainComponent.libraryName = m.libraryName), m.libraryKey && (r.mainComponent.libraryKey = m.libraryKey);
                        break;
                      }
                    } catch (p) {
                      b.push({
                        error: String(p)
                      });
                    }
                  t.componentSets = b;
                }
              } else
                t.componentSetsApiNote = "getAvailableLibraryComponentSetsAsync not available";
            } catch (l) {
              t.teamLibrarySearchError = String(l);
            }
            try {
              const l = await figma.importComponentByKeyAsync(
                o.key
              );
              l && (t.importedComponentInfo = {
                id: l.id,
                name: l.name,
                type: l.type,
                remote: l.remote
              }, l.libraryName && (r.mainComponent.libraryName = l.libraryName, t.importedComponentLibraryName = l.libraryName), l.libraryKey && (r.mainComponent.libraryKey = l.libraryKey, t.importedComponentLibraryKey = l.libraryKey));
            } catch (l) {
              t.importComponentError = String(l);
            }
          } catch (l) {
            t.libraryInfoError = String(l);
          }
        }
        Object.keys(t).length > 0 && (r.mainComponent._debug = t), i.add("mainComponent");
      }
    } catch (o) {
      console.log(
        "Error getting main component for " + (e.name || "unknown") + ":",
        o
      );
    }
  return r;
}
function L(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((r) => {
    a += L(r);
  }), a;
}
async function z(e, a = /* @__PURE__ */ new WeakSet(), r = {}) {
  var g, A, l, h, y;
  if (!e || typeof e != "object")
    return e;
  const i = (g = r.maxNodes) != null ? g : 1e4, o = (A = r.nodeCount) != null ? A : 0;
  if (o >= i)
    return {
      _truncated: !0,
      _reason: `Maximum node count (${i}) reached`,
      _nodeCount: o
    };
  const t = {
    visited: (l = r.visited) != null ? l : /* @__PURE__ */ new WeakSet(),
    depth: (h = r.depth) != null ? h : 0,
    maxDepth: (y = r.maxDepth) != null ? y : 100,
    nodeCount: o + 1,
    maxNodes: i,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: r.variableTable,
    collectionTable: r.collectionTable
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), t.visited = a;
  const n = {}, s = await le(e, t);
  Object.assign(n, s);
  const d = e.type;
  if (d)
    switch (d) {
      case "FRAME":
      case "COMPONENT": {
        const b = await j(e);
        Object.assign(n, b);
        break;
      }
      case "INSTANCE": {
        const b = await me(
          e
        );
        Object.assign(n, b);
        const m = await j(
          e
        );
        Object.assign(n, m);
        break;
      }
      case "TEXT": {
        const b = await de(e);
        Object.assign(n, b);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const b = await pe(e);
        Object.assign(n, b);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const b = await fe(e);
        Object.assign(n, b);
        break;
      }
      default:
        t.unhandledKeys.add("_unknownType");
        break;
    }
  const u = Object.getOwnPropertyNames(e), c = /* @__PURE__ */ new Set([
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
  (d === "FRAME" || d === "COMPONENT" || d === "INSTANCE") && (c.add("layoutMode"), c.add("primaryAxisSizingMode"), c.add("counterAxisSizingMode"), c.add("primaryAxisAlignItems"), c.add("counterAxisAlignItems"), c.add("paddingLeft"), c.add("paddingRight"), c.add("paddingTop"), c.add("paddingBottom"), c.add("itemSpacing"), c.add("cornerRadius"), c.add("clipsContent"), c.add("layoutWrap"), c.add("layoutGrow")), d === "TEXT" && (c.add("characters"), c.add("fontName"), c.add("fontSize"), c.add("textAlignHorizontal"), c.add("textAlignVertical"), c.add("letterSpacing"), c.add("lineHeight"), c.add("textCase"), c.add("textDecoration"), c.add("textAutoResize"), c.add("paragraphSpacing"), c.add("paragraphIndent"), c.add("listOptions")), (d === "VECTOR" || d === "LINE") && (c.add("fillGeometry"), c.add("strokeGeometry")), (d === "RECTANGLE" || d === "ELLIPSE" || d === "STAR" || d === "POLYGON") && (c.add("pointCount"), c.add("innerRadius"), c.add("arcData")), d === "INSTANCE" && (c.add("mainComponent"), c.add("componentProperties"));
  for (const b of u)
    typeof e[b] != "function" && (c.has(b) || t.unhandledKeys.add(b));
  if (t.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(t.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const b = t.maxDepth;
    if (t.depth >= b)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${b}) reached`,
        _count: e.children.length
      };
    else if (t.nodeCount >= i)
      n.children = {
        _truncated: !0,
        _reason: `Maximum node count (${i}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const m = I(v({}, t), {
        depth: t.depth + 1
      }), p = [];
      let S = !1;
      for (const R of e.children) {
        if (m.nodeCount >= i) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${i}) reached during children processing`,
            _processed: p.length,
            _total: e.children.length,
            children: p
          }, S = !0;
          break;
        }
        const w = await z(R, a, m);
        p.push(w), m.nodeCount && (t.nodeCount = m.nodeCount);
      }
      S || (n.children = p);
    }
  }
  return n;
}
async function ue(e) {
  try {
    const a = e.pageIndex;
    if (a === void 0 || typeof a != "number")
      return {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    await figma.loadAllPagesAsync();
    const r = figma.root.children;
    if (a < 0 || a >= r.length)
      return {
        type: "exportPage",
        success: !1,
        error: !0,
        message: "Invalid page selection",
        data: {}
      };
    const i = r[a];
    console.log("Exporting page: " + i.name);
    const o = new O(), t = new T();
    let n = [];
    try {
      n = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((A) => ({
        libraryName: A.libraryName,
        key: A.key,
        name: A.name
      }));
    } catch (g) {
      console.log(
        "Could not get library variable collections:",
        g instanceof Error ? g.message : String(g)
      );
    }
    const s = await z(
      i,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: o,
        collectionTable: t
      }
    ), d = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.4.0",
        // Updated version for simplified variable table (removed unnecessary fields)
        figmaApiVersion: figma.apiVersion,
        originalPageName: i.name,
        totalNodes: L(s),
        pluginVersion: "1.0.0"
      },
      collections: t.getTable(),
      variables: o.getSerializedTable(),
      libraries: n,
      pageData: s
    }, u = JSON.stringify(d, null, 2), c = i.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return console.log(
      "Export complete. Total nodes:",
      L(s)
    ), {
      type: "exportPage",
      success: !0,
      error: !1,
      message: "Page exported successfully",
      data: {
        filename: c,
        jsonData: u,
        pageName: i.name
      }
    };
  } catch (a) {
    return console.error("Error exporting page:", a), {
      type: "exportPage",
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {}
    };
  }
}
async function ye(e, a) {
  const r = /* @__PURE__ */ new Map();
  for (const [i, o] of Object.entries(a)) {
    const t = e.modes.find((n) => n.name === o);
    if (t)
      r.set(i, t.modeId);
    else {
      const n = e.addMode(o);
      r.set(i, n);
    }
  }
  return r;
}
async function q(e) {
  let a;
  if (e.isLocal) {
    const o = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (t) => t.name === e.collectionName
    );
    o ? a = o : a = figma.variables.createVariableCollection(
      e.collectionName
    );
  } else {
    const o = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find(
      (d) => d.name === e.collectionName
    );
    if (!o)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const t = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      o.key
    );
    if (t.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const n = await figma.variables.importVariableByKeyAsync(
      t[0].key
    ), s = await figma.variables.getVariableCollectionByIdAsync(
      n.variableCollectionId
    );
    if (!s)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    a = s;
  }
  const r = await ye(
    a,
    e.modes
  );
  return { collection: a, modeMapping: r };
}
async function _(e, a) {
  if (a) {
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
async function k(e, a) {
  for (const r of e.variableIds)
    try {
      const i = await figma.variables.getVariableByIdAsync(r);
      if (i && i.name === a)
        return i;
    } catch (i) {
      continue;
    }
  return null;
}
function U(e, a) {
  const r = e.resolvedType.toUpperCase(), i = a.toUpperCase();
  return r !== i ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${r}" but expected "${i}". Skipping binding.`
  ), !1) : !0;
}
async function be(e, a, r, i, o) {
  for (const [t, n] of Object.entries(a)) {
    const s = i.get(t);
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
        const d = n;
        let u = null;
        if (d._varRef !== void 0) {
          const c = r.getVariableByIndex(
            d._varRef
          );
          if (c) {
            let g = null;
            if (o && c._colRef !== void 0) {
              const A = o.getCollectionByIndex(
                c._colRef
              );
              A && (g = (await q(A)).collection);
            }
            !g && c.collectionName && c.isLocal !== void 0 && (g = await _(
              c.collectionName,
              c.isLocal
            )), g && (u = await k(
              g,
              c.variableName
            ));
          }
        }
        if (!u && d.id)
          try {
            u = await figma.variables.getVariableByIdAsync(
              d.id
            );
          } catch (c) {
          }
        if (u) {
          const c = {
            type: "VARIABLE_ALIAS",
            id: u.id
          };
          e.setValueForMode(s, c);
        } else
          console.warn(
            `Could not resolve variable alias for mode ${t} (mapped to ${s}) in variable "${e.name}". Original ID: ${d.id}`
          );
      }
    } catch (d) {
      console.warn(
        `Error setting value for mode ${t} (mapped to ${s}) in variable "${e.name}":`,
        d
      );
    }
  }
}
async function G(e, a, r, i, o) {
  const t = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  return e.valuesByMode && await be(
    t,
    e.valuesByMode,
    r,
    i,
    o
  ), t;
}
async function X(e, a, r) {
  var o;
  const i = a.getVariableByIndex(e._varRef);
  if (!i)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    let t;
    const n = (o = i._colRef) != null ? o : i.collectionRef;
    if (n !== void 0 && (t = r.getCollectionByIndex(n)), !t && i.collectionId && i.isLocal !== void 0) {
      const c = r.getCollectionIndex(
        i.collectionId
      );
      c >= 0 && (t = r.getCollectionByIndex(c));
    }
    if (!t) {
      const c = await _(
        i.collectionName || "",
        i.isLocal || !1
      );
      let g = await k(c, i.variableName);
      return g ? U(g, i.variableType) ? g : null : i.valuesByMode ? (g = await G(
        i,
        c,
        a,
        /* @__PURE__ */ new Map(),
        // Empty mode mapping for legacy
        r
        // Pass collection table for alias resolution
      ), g) : (console.warn(
        `Cannot create variable "${i.variableName}" without valuesByMode data`
      ), null);
    }
    const { collection: s, modeMapping: d } = await q(t);
    let u = await k(s, i.variableName);
    return u ? U(u, i.variableType) ? u : null : i.valuesByMode ? (u = await G(
      i,
      s,
      a,
      d,
      r
      // Pass collection table for alias resolution
    ), u) : (console.warn(
      `Cannot create variable "${i.variableName}" without valuesByMode data`
    ), null);
  } catch (t) {
    if (console.error(
      `Error resolving variable reference for "${i.variableName}":`,
      t
    ), t instanceof Error && t.message.includes("External collection"))
      throw t;
    return null;
  }
}
function he(e, a) {
  if (!a || !M(e))
    return null;
  const r = a.getVariableByIndex(e._varRef);
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
async function Ae(e, a, r, i, o) {
  if (!(!a || typeof a != "object"))
    try {
      const t = e[r];
      if (!t || !Array.isArray(t))
        return;
      for (const [n, s] of Object.entries(a))
        if (n === "fills" && Array.isArray(s))
          for (let d = 0; d < s.length && d < t.length; d++) {
            let u = null;
            const c = s[d];
            if (M(c) && i && o) {
              const g = await X(
                c,
                i,
                o
              );
              g && t[d].boundVariables && (t[d].boundVariables[r] = {
                type: "VARIABLE_ALIAS",
                id: g.id
              });
            } else c && typeof c == "object" && "type" in c && c.type === "VARIABLE_ALIAS" && (u = c, u && await ve(
              t[d],
              u,
              r,
              i
            ));
          }
        else {
          let d = null;
          M(s) ? d = he(s, i) : s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && (d = s), d && await Y(e, n, d, i);
        }
    } catch (t) {
      console.log(`Error restoring bound variables for ${r}:`, t);
    }
}
async function Y(e, a, r, i) {
  try {
    let o = null;
    try {
      o = await figma.variables.getVariableByIdAsync(r.id);
    } catch (t) {
    }
    if (!o && i) {
      if (r.isLocal) {
        const t = await _(
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
      e.boundVariables || (e.boundVariables = {}), e.boundVariables[a] || (e.boundVariables[a] = t);
    }
  } catch (o) {
    console.log(`Error binding variable to property ${a}:`, o);
  }
}
async function ve(e, a, r, i) {
  if (!(!e || typeof e != "object"))
    try {
      let o = null;
      try {
        o = await figma.variables.getVariableByIdAsync(a.id);
      } catch (t) {
        if (i) {
          if (a.isLocal) {
            const n = await _(
              a.collectionName || "",
              !0
            );
            o = await k(
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
      o && e.boundVariables && (e.boundVariables[r] = {
        type: "VARIABLE_ALIAS",
        id: o.id
      });
    } catch (o) {
      console.log("Error binding variable to property object:", o);
    }
}
function xe(e, a) {
  const r = ne(a);
  if (e.visible === void 0 && (e.visible = r.visible), e.locked === void 0 && (e.locked = r.locked), e.opacity === void 0 && (e.opacity = r.opacity), e.rotation === void 0 && (e.rotation = r.rotation), e.blendMode === void 0 && (e.blendMode = r.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const i = x;
    e.layoutMode === void 0 && (e.layoutMode = i.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = i.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = i.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = i.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = i.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = i.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = i.paddingRight), e.paddingTop === void 0 && (e.paddingTop = i.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = i.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = i.itemSpacing);
  }
  if (a === "TEXT") {
    const i = E;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = i.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = i.textAlignVertical), e.textCase === void 0 && (e.textCase = i.textCase), e.textDecoration === void 0 && (e.textDecoration = i.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = i.textAutoResize);
  }
}
async function K(e, a, r = null, i = null) {
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
    if (xe(t, e.type || "FRAME"), e.name !== void 0 && (t.name = e.name || "Unnamed Node"), e.x !== void 0 && (t.x = e.x), e.y !== void 0 && (t.y = e.y), e.width !== void 0 && e.height !== void 0 && t.resize(e.width, e.height), e.visible !== void 0 && (t.visible = e.visible), e.locked !== void 0 && (t.locked = e.locked), e.opacity !== void 0 && (t.opacity = e.opacity), e.rotation !== void 0 && (t.rotation = e.rotation), e.blendMode !== void 0 && (t.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && r && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const d = {};
            for (const [u, c] of Object.entries(
              s.boundVariables
            ))
              d[u] = c;
            return I(v({}, s), { boundVariables: d });
          }
          return s;
        })), t.fills = n, (o = e.boundVariables) != null && o.fills && await Ae(
          t,
          e.boundVariables,
          "fills",
          r,
          i
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
          if (M(s) && r && i) {
            const d = await X(
              s,
              r,
              i
            );
            if (d) {
              const u = {
                type: "VARIABLE_ALIAS",
                id: d.id
              };
              t.boundVariables || (t.boundVariables = {}), t.boundVariables[n] || (t.boundVariables[n] = u);
            }
          } else s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && await Y(
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
        const s = await K(
          n,
          t,
          r,
          i
        );
        s && t.appendChild(s);
      }
    return a && a.appendChild(t), t;
  } catch (t) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      t
    ), null;
  }
}
async function Ce(e) {
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
    const r = a.pageData, i = a.metadata;
    let o = null;
    if (a.collections)
      try {
        o = T.fromTable(a.collections), console.log(
          `Loaded collections table with ${o.getSize()} collections`
        );
      } catch (g) {
        console.warn("Failed to load collections table:", g);
      }
    let t = null;
    if (a.variables)
      try {
        t = O.fromTable(a.variables), console.log(
          `Loaded variable table with ${t.getSize()} variables`
        );
      } catch (g) {
        console.warn("Failed to load variable table:", g);
      }
    const n = "2.3.0", s = i.exportFormatVersion || "1.0.0";
    s !== n && console.warn(
      `Export format version mismatch: exported with ${s}, current version is ${n}. Import may have compatibility issues.`
    );
    const u = "Imported - " + (i.originalPageName ? i.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), c = figma.createPage();
    if (c.name = u, figma.root.appendChild(c), console.log("Created new page: " + u), console.log("Importing " + (i.totalNodes || "unknown") + " nodes"), r.children && Array.isArray(r.children)) {
      for (const g of r.children) {
        if (g._truncated) {
          console.log(
            `Skipping truncated children: ${g._reason || "Unknown"}`
          );
          continue;
        }
        await K(
          g,
          c,
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
async function Se(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    console.log("Found " + a.length + " pages in the document");
    const r = 11, i = a[r];
    if (!i)
      return {
        type: "quickCopy",
        success: !1,
        error: !0,
        message: "No page found at index 11",
        data: {}
      };
    const o = await z(
      i,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + i.name + " (index: " + r + ")"
    );
    const t = JSON.stringify(o, null, 2), n = JSON.parse(t), s = "Copy - " + n.name, d = figma.createPage();
    if (d.name = s, figma.root.appendChild(d), n.children && n.children.length > 0) {
      let c = function(A) {
        A.forEach((l) => {
          const h = (l.x || 0) + (l.width || 0);
          h > g && (g = h), l.children && l.children.length > 0 && c(l.children);
        });
      };
      console.log(
        "Recreating " + n.children.length + " top-level children..."
      );
      let g = 0;
      c(n.children), console.log("Original content rightmost edge: " + g);
      for (const A of n.children)
        await K(A, d, null, null);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const u = L(n);
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
async function we(e) {
  try {
    const a = e.accessToken, r = e.selectedRepo;
    return a ? (await figma.clientStorage.setAsync("accessToken", a), r && await figma.clientStorage.setAsync("selectedRepo", r), {
      type: "storeAuthData",
      success: !0,
      error: !1,
      message: "Auth data stored successfully",
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
async function Ee(e) {
  try {
    const a = await figma.clientStorage.getAsync("accessToken"), r = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
      data: {
        accessToken: a || void 0,
        selectedRepo: r || void 0
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
async function Ie(e) {
  try {
    return await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), {
      type: "clearAuthData",
      success: !0,
      error: !1,
      message: "Auth data cleared successfully",
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
async function Pe(e) {
  try {
    const a = e.selectedRepo;
    return a ? (await figma.clientStorage.setAsync("selectedRepo", a), {
      type: "storeSelectedRepo",
      success: !0,
      error: !1,
      message: "Selected repo stored successfully",
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
const Ne = {
  getCurrentUser: ie,
  loadPages: ae,
  exportPage: ue,
  importPage: Ce,
  quickCopy: Se,
  storeAuthData: we,
  loadAuthData: Ee,
  clearAuthData: Ie,
  storeSelectedRepo: Pe
}, ke = Ne;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  console.log("Received message:", e);
  try {
    const a = e.type, r = ke[a];
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
    const i = await r(e.data);
    figma.ui.postMessage(I(v({}, i), {
      requestId: e.requestId
    }));
  } catch (a) {
    console.error("Error handling message:", a);
    const r = {
      type: e.type,
      success: !1,
      error: !0,
      message: a instanceof Error ? a.message : "Unknown error occurred",
      data: {},
      requestId: e.requestId
    };
    figma.ui.postMessage(r);
  }
};
