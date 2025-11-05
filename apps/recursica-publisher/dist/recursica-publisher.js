var D = Object.defineProperty, ee = Object.defineProperties;
var te = Object.getOwnPropertyDescriptors;
var F = Object.getOwnPropertySymbols;
var re = Object.prototype.hasOwnProperty, ae = Object.prototype.propertyIsEnumerable;
var B = (e, i, r) => i in e ? D(e, i, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[i] = r, v = (e, i) => {
  for (var r in i || (i = {}))
    re.call(i, r) && B(e, r, i[r]);
  if (F)
    for (var r of F(i))
      ae.call(i, r) && B(e, r, i[r]);
  return e;
}, I = (e, i) => ee(e, te(i));
var P = (e, i, r) => B(e, typeof i != "symbol" ? i + "" : i, r);
async function ie(e) {
  var i;
  try {
    return {
      type: "getCurrentUser",
      success: !0,
      error: !1,
      message: "Current user retrieved successfully",
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
async function oe(e) {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "loadPages",
      success: !0,
      error: !1,
      message: "Pages loaded successfully",
      data: {
        pages: figma.root.children.map((a, o) => ({
          name: a.name,
          index: o
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
}, C = I(v({}, x), {
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
}), E = I(v({}, x), {
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
}), N = I(v({}, x), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), W = I(v({}, x), {
  cornerRadius: 0
}), ne = I(v({}, x), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function se(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return C;
    case "TEXT":
      return E;
    case "VECTOR":
      return N;
    case "LINE":
      return ne;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return W;
    default:
      return x;
  }
}
function f(e, i) {
  if (Array.isArray(e))
    return Array.isArray(i) ? e.length !== i.length || e.some((r, a) => f(r, i[a])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof i == "object" && i !== null) {
      const r = Object.keys(e), a = Object.keys(i);
      return r.length !== a.length ? !0 : r.some(
        (o) => !(o in i) || f(e[o], i[o])
      );
    }
    return !0;
  }
  return e !== i;
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
    const r = new T(), a = Object.entries(i).sort(
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
    const r = new O(), a = Object.entries(i).sort(
      (t, n) => parseInt(t[0], 10) - parseInt(n[0], 10)
    );
    for (const [t, n] of a) {
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
function ce(e) {
  return {
    _varRef: e
  };
}
function M(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
async function J(e, i, r, a = /* @__PURE__ */ new Set()) {
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
        const d = await figma.variables.getVariableByIdAsync(s);
        if (!d) {
          o[t] = {
            type: "VARIABLE_ALIAS",
            id: s
          };
          continue;
        }
        const m = new Set(a);
        m.add(s);
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
          const y = await q(
            l,
            r
          );
          A._colRef = y;
        }
        d.valuesByMode && (A.valuesByMode = await J(
          d.valuesByMode,
          i,
          r,
          m
        ));
        const h = i.addVariable(A);
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
async function q(e, i) {
  const r = {};
  for (const o of e.modes)
    r[o.modeId] = o.name;
  const a = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: !e.remote,
    modes: r
  };
  return i.addCollection(a);
}
async function $(e, i, r) {
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
    const n = await q(
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
    a.valuesByMode && (s.valuesByMode = await J(
      a.valuesByMode,
      i,
      r,
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const d = i.addVariable(s);
    return ce(d);
  } catch (a) {
    return console.log("Could not resolve variable alias:", e.id, a), null;
  }
}
async function V(e, i, r) {
  if (!e || typeof e != "object") return e;
  const a = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const t = e[o];
      if (t && typeof t == "object" && !Array.isArray(t))
        if (t.type === "VARIABLE_ALIAS") {
          const n = await $(
            t,
            i,
            r
          );
          n && (a[o] = n);
        } else
          a[o] = await V(
            t,
            i,
            r
          );
      else Array.isArray(t) ? a[o] = await Promise.all(
        t.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await $(
          n,
          i,
          r
        ) || n : n && typeof n == "object" ? await V(
          n,
          i,
          r
        ) : n)
      ) : a[o] = t;
    }
  return a;
}
async function le(e, i, r) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (a) => {
      if (!a || typeof a != "object") return a;
      const o = {};
      for (const t in a)
        Object.prototype.hasOwnProperty.call(a, t) && (t === "boundVariables" ? o[t] = await V(
          a[t],
          i,
          r
        ) : o[t] = a[t]);
      return o;
    })
  );
}
async function de(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  if (e.type && (r.type = e.type, a.add("type")), e.id && (r.id = e.id, a.add("id")), e.name !== void 0 && e.name !== "" && (r.name = e.name, a.add("name")), e.x !== void 0 && e.x !== 0 && (r.x = e.x, a.add("x")), e.y !== void 0 && e.y !== 0 && (r.y = e.y, a.add("y")), e.width !== void 0 && (r.width = e.width, a.add("width")), e.height !== void 0 && (r.height = e.height, a.add("height")), e.visible !== void 0 && f(e.visible, x.visible) && (r.visible = e.visible, a.add("visible")), e.locked !== void 0 && f(e.locked, x.locked) && (r.locked = e.locked, a.add("locked")), e.opacity !== void 0 && f(e.opacity, x.opacity) && (r.opacity = e.opacity, a.add("opacity")), e.rotation !== void 0 && f(e.rotation, x.rotation) && (r.rotation = e.rotation, a.add("rotation")), e.blendMode !== void 0 && f(e.blendMode, x.blendMode) && (r.blendMode = e.blendMode, a.add("blendMode")), e.effects !== void 0 && f(e.effects, x.effects) && (r.effects = e.effects, a.add("effects")), e.fills !== void 0) {
    const o = await le(
      e.fills,
      i.variableTable,
      i.collectionTable
    );
    f(o, x.fills) && (r.fills = o), a.add("fills");
  }
  if (e.strokes !== void 0 && f(e.strokes, x.strokes) && (r.strokes = e.strokes, a.add("strokes")), e.strokeWeight !== void 0 && f(e.strokeWeight, x.strokeWeight) && (r.strokeWeight = e.strokeWeight, a.add("strokeWeight")), e.strokeAlign !== void 0 && f(e.strokeAlign, x.strokeAlign) && (r.strokeAlign = e.strokeAlign, a.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await V(
      e.boundVariables,
      i.variableTable,
      i.collectionTable
    );
    Object.keys(o).length > 0 && (r.boundVariables = o), a.add("boundVariables");
  }
  return r;
}
async function j(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && f(e.layoutMode, C.layoutMode) && (r.layoutMode = e.layoutMode, a.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && f(
    e.primaryAxisSizingMode,
    C.primaryAxisSizingMode
  ) && (r.primaryAxisSizingMode = e.primaryAxisSizingMode, a.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && f(
    e.counterAxisSizingMode,
    C.counterAxisSizingMode
  ) && (r.counterAxisSizingMode = e.counterAxisSizingMode, a.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && f(
    e.primaryAxisAlignItems,
    C.primaryAxisAlignItems
  ) && (r.primaryAxisAlignItems = e.primaryAxisAlignItems, a.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && f(
    e.counterAxisAlignItems,
    C.counterAxisAlignItems
  ) && (r.counterAxisAlignItems = e.counterAxisAlignItems, a.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && f(e.paddingLeft, C.paddingLeft) && (r.paddingLeft = e.paddingLeft, a.add("paddingLeft")), e.paddingRight !== void 0 && f(e.paddingRight, C.paddingRight) && (r.paddingRight = e.paddingRight, a.add("paddingRight")), e.paddingTop !== void 0 && f(e.paddingTop, C.paddingTop) && (r.paddingTop = e.paddingTop, a.add("paddingTop")), e.paddingBottom !== void 0 && f(e.paddingBottom, C.paddingBottom) && (r.paddingBottom = e.paddingBottom, a.add("paddingBottom")), e.itemSpacing !== void 0 && f(e.itemSpacing, C.itemSpacing) && (r.itemSpacing = e.itemSpacing, a.add("itemSpacing")), e.cornerRadius !== void 0 && f(e.cornerRadius, C.cornerRadius) && (r.cornerRadius = e.cornerRadius, a.add("cornerRadius")), e.clipsContent !== void 0 && f(e.clipsContent, C.clipsContent) && (r.clipsContent = e.clipsContent, a.add("clipsContent")), e.layoutWrap !== void 0 && f(e.layoutWrap, C.layoutWrap) && (r.layoutWrap = e.layoutWrap, a.add("layoutWrap")), e.layoutGrow !== void 0 && f(e.layoutGrow, C.layoutGrow) && (r.layoutGrow = e.layoutGrow, a.add("layoutGrow")), r;
}
async function pe(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (r.characters = e.characters, a.add("characters")), e.fontName !== void 0 && (r.fontName = e.fontName, a.add("fontName")), e.fontSize !== void 0 && (r.fontSize = e.fontSize, a.add("fontSize")), e.textAlignHorizontal !== void 0 && f(
    e.textAlignHorizontal,
    E.textAlignHorizontal
  ) && (r.textAlignHorizontal = e.textAlignHorizontal, a.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && f(
    e.textAlignVertical,
    E.textAlignVertical
  ) && (r.textAlignVertical = e.textAlignVertical, a.add("textAlignVertical")), e.letterSpacing !== void 0 && f(e.letterSpacing, E.letterSpacing) && (r.letterSpacing = e.letterSpacing, a.add("letterSpacing")), e.lineHeight !== void 0 && f(e.lineHeight, E.lineHeight) && (r.lineHeight = e.lineHeight, a.add("lineHeight")), e.textCase !== void 0 && f(e.textCase, E.textCase) && (r.textCase = e.textCase, a.add("textCase")), e.textDecoration !== void 0 && f(e.textDecoration, E.textDecoration) && (r.textDecoration = e.textDecoration, a.add("textDecoration")), e.textAutoResize !== void 0 && f(e.textAutoResize, E.textAutoResize) && (r.textAutoResize = e.textAutoResize, a.add("textAutoResize")), e.paragraphSpacing !== void 0 && f(
    e.paragraphSpacing,
    E.paragraphSpacing
  ) && (r.paragraphSpacing = e.paragraphSpacing, a.add("paragraphSpacing")), e.paragraphIndent !== void 0 && f(e.paragraphIndent, E.paragraphIndent) && (r.paragraphIndent = e.paragraphIndent, a.add("paragraphIndent")), e.listOptions !== void 0 && f(e.listOptions, E.listOptions) && (r.listOptions = e.listOptions, a.add("listOptions")), r;
}
async function fe(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && f(e.fillGeometry, N.fillGeometry) && (r.fillGeometry = e.fillGeometry, a.add("fillGeometry")), e.strokeGeometry !== void 0 && f(e.strokeGeometry, N.strokeGeometry) && (r.strokeGeometry = e.strokeGeometry, a.add("strokeGeometry")), e.strokeCap !== void 0 && f(e.strokeCap, N.strokeCap) && (r.strokeCap = e.strokeCap, a.add("strokeCap")), e.strokeJoin !== void 0 && f(e.strokeJoin, N.strokeJoin) && (r.strokeJoin = e.strokeJoin, a.add("strokeJoin")), e.dashPattern !== void 0 && f(e.dashPattern, N.dashPattern) && (r.dashPattern = e.dashPattern, a.add("dashPattern")), r;
}
async function ge(e, i) {
  const r = {}, a = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && f(e.cornerRadius, W.cornerRadius) && (r.cornerRadius = e.cornerRadius, a.add("cornerRadius")), e.pointCount !== void 0 && (r.pointCount = e.pointCount, a.add("pointCount")), e.innerRadius !== void 0 && (r.innerRadius = e.innerRadius, a.add("innerRadius")), e.pointCount !== void 0 && (r.pointCount = e.pointCount, a.add("pointCount")), r;
}
function ue(e) {
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
async function me(e, i) {
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
          const u = [];
          try {
            for (const p of [...l, ...h])
              (p.toLowerCase().includes("library") || p.toLowerCase().includes("remote") || p.toLowerCase().includes("file")) && u.push(p);
            t.libraryRelatedProperties = u;
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
        let d, m;
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
                  const u = l.parent;
                  if (u === null)
                    t.componentSetParentIsNull = !0;
                  else if (u === void 0)
                    t.componentSetParentIsUndefined = !0;
                  else {
                    t.componentSetParentExists = !0;
                    try {
                      t.componentSetParentType = u.type, t.componentSetParentName = u.name;
                    } catch (p) {
                      t.componentSetParentPropertyAccessError = String(p);
                    }
                  }
                } catch (u) {
                  t.componentSetParentCheckError = String(u);
                }
            } catch (u) {
              t.mainComponentParentDebugError = String(u);
            }
          else
            t.mainComponentParentExists = !1;
          for (; l && y < b; )
            try {
              const u = l.type, p = l.name;
              if (c.push(
                `${u}:${p || "(unnamed)"}`
              ), u === "COMPONENT_SET" && !m && (m = p, t.componentSetName = p, t.componentSetFound = !0), u === "PAGE")
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
                const w = S.type, Z = S.name;
                t[`parentAtDepth${y + 1}Type`] = w, t[`parentAtDepth${y + 1}Name`] = Z;
              } catch (w) {
                t.nextParentAccessErrorAtDepth = y, t.nextParentAccessError = String(w);
              }
              l = S, y++;
            } catch (u) {
              t.parentTraverseErrorAtDepth = y, t.parentTraverseError = String(u), t.parentTraverseErrorName = u instanceof Error ? u.name : "Unknown", t.parentTraverseErrorMessage = u instanceof Error ? u.message : String(u);
              break;
            }
          d = h.join("/"), t.mainComponentParentChain = c, t.mainComponentParentChainDepth = y, t.mainComponentParentPath = d, t.mainComponentParentPathParts = h;
        } catch (l) {
          t.mainComponentParentPathError = String(l);
        }
        const g = ue(e);
        if (t.instanceParentPath = g, r.mainComponent = {
          id: o.id,
          name: o.name,
          key: o.key,
          // Component key for reference
          type: o.type
        }, m && (r.mainComponent.componentSetName = m), n && (r.mainComponent.variantProperties = n), s && (r.mainComponent.componentProperties = s), d && (r.mainComponent._path = d), g && (r.mainComponent._instancePath = g), o.remote === !0) {
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
                  for (const u of y)
                    try {
                      const p = {
                        name: u.name,
                        key: u.key,
                        libraryName: u.libraryName,
                        libraryKey: u.libraryKey
                      };
                      if (b.push(p), u.key === o.key || u.name === o.name) {
                        t.matchingComponentSet = p, u.libraryName && (r.mainComponent.libraryName = u.libraryName), u.libraryKey && (r.mainComponent.libraryKey = u.libraryKey);
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
function L(e) {
  let i = 1;
  return e.children && e.children.length > 0 && e.children.forEach((r) => {
    i += L(r);
  }), i;
}
async function z(e, i = /* @__PURE__ */ new WeakSet(), r = {}) {
  var g, A, l, h, y;
  if (!e || typeof e != "object")
    return e;
  const a = (g = r.maxNodes) != null ? g : 1e4, o = (A = r.nodeCount) != null ? A : 0;
  if (o >= a)
    return {
      _truncated: !0,
      _reason: `Maximum node count (${a}) reached`,
      _nodeCount: o
    };
  const t = {
    visited: (l = r.visited) != null ? l : /* @__PURE__ */ new WeakSet(),
    depth: (h = r.depth) != null ? h : 0,
    maxDepth: (y = r.maxDepth) != null ? y : 100,
    nodeCount: o + 1,
    maxNodes: a,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: r.variableTable,
    collectionTable: r.collectionTable
  };
  if (i.has(e))
    return "[Circular Reference]";
  i.add(e), t.visited = i;
  const n = {}, s = await de(e, t);
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
        const u = await j(
          e
        );
        Object.assign(n, u);
        break;
      }
      case "TEXT": {
        const b = await pe(e);
        Object.assign(n, b);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const b = await fe(e);
        Object.assign(n, b);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const b = await ge(e);
        Object.assign(n, b);
        break;
      }
      default:
        t.unhandledKeys.add("_unknownType");
        break;
    }
  const m = Object.getOwnPropertyNames(e), c = /* @__PURE__ */ new Set([
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
  for (const b of m)
    typeof e[b] != "function" && (c.has(b) || t.unhandledKeys.add(b));
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
      const u = I(v({}, t), {
        depth: t.depth + 1
      }), p = [];
      let S = !1;
      for (const R of e.children) {
        if (u.nodeCount >= a) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${a}) reached during children processing`,
            _processed: p.length,
            _total: e.children.length,
            children: p
          }, S = !0;
          break;
        }
        const w = await z(R, i, u);
        p.push(w), u.nodeCount && (t.nodeCount = u.nodeCount);
      }
      S || (n.children = p);
    }
  }
  return n;
}
async function ye(e) {
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
      a,
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
        originalPageName: a.name,
        totalNodes: L(s),
        pluginVersion: "1.0.0"
      },
      collections: t.getTable(),
      variables: o.getSerializedTable(),
      libraries: n,
      pageData: s
    }, m = JSON.stringify(d, null, 2), c = a.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
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
        jsonData: m,
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
async function be(e, i) {
  const r = /* @__PURE__ */ new Map();
  for (const [a, o] of Object.entries(i)) {
    const t = e.modes.find((n) => n.name === o);
    if (t)
      r.set(a, t.modeId);
    else {
      const n = e.addMode(o);
      r.set(a, n);
    }
  }
  return r;
}
async function X(e) {
  let i;
  if (e.isLocal) {
    const o = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (t) => t.name === e.collectionName
    );
    o ? i = o : i = figma.variables.createVariableCollection(
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
    i = s;
  }
  const r = await be(
    i,
    e.modes
  );
  return { collection: i, modeMapping: r };
}
async function _(e, i) {
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
function U(e, i) {
  const r = e.resolvedType.toUpperCase(), a = i.toUpperCase();
  return r !== a ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${r}" but expected "${a}". Skipping binding.`
  ), !1) : !0;
}
async function he(e, i, r, a, o) {
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
        const d = n;
        let m = null;
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
              A && (g = (await X(A)).collection);
            }
            !g && c.collectionName && c.isLocal !== void 0 && (g = await _(
              c.collectionName,
              c.isLocal
            )), g && (m = await k(
              g,
              c.variableName
            ));
          }
        }
        if (!m && d.id)
          try {
            m = await figma.variables.getVariableByIdAsync(
              d.id
            );
          } catch (c) {
          }
        if (m) {
          const c = {
            type: "VARIABLE_ALIAS",
            id: m.id
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
async function G(e, i, r, a, o) {
  const t = figma.variables.createVariable(
    e.variableName,
    i,
    e.variableType
  );
  return e.valuesByMode && await he(
    t,
    e.valuesByMode,
    r,
    a,
    o
  ), t;
}
async function Y(e, i, r) {
  var o;
  const a = i.getVariableByIndex(e._varRef);
  if (!a)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    let t;
    const n = (o = a._colRef) != null ? o : a.collectionRef;
    if (n !== void 0 && (t = r.getCollectionByIndex(n)), !t && a.collectionId && a.isLocal !== void 0) {
      const c = r.getCollectionIndex(
        a.collectionId
      );
      c >= 0 && (t = r.getCollectionByIndex(c));
    }
    if (!t) {
      const c = await _(
        a.collectionName || "",
        a.isLocal || !1
      );
      let g = await k(c, a.variableName);
      return g ? U(g, a.variableType) ? g : null : a.valuesByMode ? (g = await G(
        a,
        c,
        i,
        /* @__PURE__ */ new Map(),
        // Empty mode mapping for legacy
        r
        // Pass collection table for alias resolution
      ), g) : (console.warn(
        `Cannot create variable "${a.variableName}" without valuesByMode data`
      ), null);
    }
    const { collection: s, modeMapping: d } = await X(t);
    let m = await k(s, a.variableName);
    return m ? U(m, a.variableType) ? m : null : a.valuesByMode ? (m = await G(
      a,
      s,
      i,
      d,
      r
      // Pass collection table for alias resolution
    ), m) : (console.warn(
      `Cannot create variable "${a.variableName}" without valuesByMode data`
    ), null);
  } catch (t) {
    if (console.error(
      `Error resolving variable reference for "${a.variableName}":`,
      t
    ), t instanceof Error && t.message.includes("External collection"))
      throw t;
    return null;
  }
}
function Ae(e, i) {
  if (!i || !M(e))
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
async function ve(e, i, r, a, o) {
  if (!(!i || typeof i != "object"))
    try {
      const t = e[r];
      if (!t || !Array.isArray(t))
        return;
      for (const [n, s] of Object.entries(i))
        if (n === "fills" && Array.isArray(s))
          for (let d = 0; d < s.length && d < t.length; d++) {
            let m = null;
            const c = s[d];
            if (M(c) && a && o) {
              const g = await Y(
                c,
                a,
                o
              );
              g && t[d].boundVariables && (t[d].boundVariables[r] = {
                type: "VARIABLE_ALIAS",
                id: g.id
              });
            } else c && typeof c == "object" && "type" in c && c.type === "VARIABLE_ALIAS" && (m = c, m && await Ce(
              t[d],
              m,
              r,
              a
            ));
          }
        else {
          let d = null;
          M(s) ? d = Ae(s, a) : s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && (d = s), d && await Q(e, n, d, a);
        }
    } catch (t) {
      console.log(`Error restoring bound variables for ${r}:`, t);
    }
}
async function Q(e, i, r, a) {
  try {
    let o = null;
    try {
      o = await figma.variables.getVariableByIdAsync(r.id);
    } catch (t) {
    }
    if (!o && a) {
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
      e.boundVariables || (e.boundVariables = {}), e.boundVariables[i] || (e.boundVariables[i] = t);
    }
  } catch (o) {
    console.log(`Error binding variable to property ${i}:`, o);
  }
}
async function Ce(e, i, r, a) {
  if (!(!e || typeof e != "object"))
    try {
      let o = null;
      try {
        o = await figma.variables.getVariableByIdAsync(i.id);
      } catch (t) {
        if (a) {
          if (i.isLocal) {
            const n = await _(
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
function xe(e, i) {
  const r = se(i);
  if (e.visible === void 0 && (e.visible = r.visible), e.locked === void 0 && (e.locked = r.locked), e.opacity === void 0 && (e.opacity = r.opacity), e.rotation === void 0 && (e.rotation = r.rotation), e.blendMode === void 0 && (e.blendMode = r.blendMode), i === "FRAME" || i === "COMPONENT" || i === "INSTANCE") {
    const a = C;
    e.layoutMode === void 0 && (e.layoutMode = a.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = a.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = a.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = a.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = a.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = a.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = a.paddingRight), e.paddingTop === void 0 && (e.paddingTop = a.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = a.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = a.itemSpacing);
  }
  if (i === "TEXT") {
    const a = E;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = a.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = a.textAlignVertical), e.textCase === void 0 && (e.textCase = a.textCase), e.textDecoration === void 0 && (e.textDecoration = a.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = a.textAutoResize);
  }
}
async function K(e, i, r = null, a = null) {
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
            for (const [m, c] of Object.entries(
              s.boundVariables
            ))
              d[m] = c;
            return I(v({}, s), { boundVariables: d });
          }
          return s;
        })), t.fills = n, (o = e.boundVariables) != null && o.fills && await ve(
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
          if (M(s) && r && a) {
            const d = await Y(
              s,
              r,
              a
            );
            if (d) {
              const m = {
                type: "VARIABLE_ALIAS",
                id: d.id
              };
              t.boundVariables || (t.boundVariables = {}), t.boundVariables[n] || (t.boundVariables[n] = m);
            }
          } else s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && await Q(
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
async function Se(e) {
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
        o = T.fromTable(i.collections), console.log(
          `Loaded collections table with ${o.getSize()} collections`
        );
      } catch (g) {
        console.warn("Failed to load collections table:", g);
      }
    let t = null;
    if (i.variables)
      try {
        t = O.fromTable(i.variables), console.log(
          `Loaded variable table with ${t.getSize()} variables`
        );
      } catch (g) {
        console.warn("Failed to load variable table:", g);
      }
    const n = "2.3.0", s = a.exportFormatVersion || "1.0.0";
    s !== n && console.warn(
      `Export format version mismatch: exported with ${s}, current version is ${n}. Import may have compatibility issues.`
    );
    const m = "Imported - " + (a.originalPageName ? a.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), c = figma.createPage();
    if (c.name = m, figma.root.appendChild(c), console.log("Created new page: " + m), console.log("Importing " + (a.totalNodes || "unknown") + " nodes"), r.children && Array.isArray(r.children)) {
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
async function we(e) {
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
    const o = await z(
      a,
      /* @__PURE__ */ new WeakSet(),
      {}
    );
    console.log(
      "Selected page: " + a.name + " (index: " + r + ")"
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
    const m = L(n);
    return {
      type: "quickCopy",
      success: !0,
      error: !1,
      message: "Quick copy completed successfully",
      data: {
        pageName: n.name,
        newPageName: s,
        totalNodes: m
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
async function Ee(e) {
  try {
    const i = e.accessToken, r = e.selectedRepo;
    return i ? (await figma.clientStorage.setAsync("accessToken", i), r && await figma.clientStorage.setAsync("selectedRepo", r), {
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
async function Ie(e) {
  try {
    const i = await figma.clientStorage.getAsync("accessToken"), r = await figma.clientStorage.getAsync("selectedRepo");
    return {
      type: "loadAuthData",
      success: !0,
      error: !1,
      message: "Auth data loaded successfully",
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
async function Pe(e) {
  try {
    return await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), {
      type: "clearAuthData",
      success: !0,
      error: !1,
      message: "Auth data cleared successfully",
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
async function Ne(e) {
  try {
    const i = e.selectedRepo;
    return i ? (await figma.clientStorage.setAsync("selectedRepo", i), {
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
function H(e, i = {}) {
  return {
    type: e,
    success: !0,
    error: !1,
    message: "",
    data: i
  };
}
function ke(e, i, r = {}) {
  const a = i instanceof Error ? i.message : i;
  return {
    type: e,
    success: !1,
    error: !0,
    message: a,
    data: r
  };
}
function Re(e) {
  return e.replace(/[^a-zA-Z0-9_\-\s]/g, "");
}
const Me = "RecursicaPublishedMetadata";
async function Ve(e) {
  try {
    const i = figma.currentPage, r = i.getPluginData(Me);
    if (!r) {
      const t = {
        _ver: 1,
        id: "",
        name: Re(i.name),
        version: 0,
        publishDate: "",
        history: {}
      };
      return H("getComponentMetadata", {
        componentMetadata: t
      });
    }
    const a = JSON.parse(r);
    return H("getComponentMetadata", {
      componentMetadata: a
    });
  } catch (i) {
    return console.error("Error getting component metadata:", i), ke(
      "getComponentMetadata",
      i instanceof Error ? i : "Unknown error occurred"
    );
  }
}
const Le = {
  getCurrentUser: ie,
  loadPages: oe,
  exportPage: ye,
  importPage: Se,
  quickCopy: we,
  storeAuthData: Ee,
  loadAuthData: Ie,
  clearAuthData: Pe,
  storeSelectedRepo: Ne,
  getComponentMetadata: Ve
}, Te = Le;
figma.showUI(__html__, {
  width: 500,
  height: 650
});
figma.ui.onmessage = async (e) => {
  console.log("Received message:", e);
  try {
    const i = e.type, r = Te[i];
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
    figma.ui.postMessage(I(v({}, a), {
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
