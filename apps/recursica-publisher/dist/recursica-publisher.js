var ne = Object.defineProperty, se = Object.defineProperties;
var ce = Object.getOwnPropertyDescriptors;
var K = Object.getOwnPropertySymbols;
var le = Object.prototype.hasOwnProperty, fe = Object.prototype.propertyIsEnumerable;
var F = (e, a, t) => a in e ? ne(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t, k = (e, a) => {
  for (var t in a || (a = {}))
    le.call(a, t) && F(e, t, a[t]);
  if (K)
    for (var t of K(a))
      fe.call(a, t) && F(e, t, a[t]);
  return e;
}, w = (e, a) => se(e, ce(a));
var N = (e, a, t) => F(e, typeof a != "symbol" ? a + "" : a, t);
async function pe() {
  try {
    const e = await figma.variables.getLocalVariableCollectionsAsync();
    for (const a of e) {
      console.log(
        "resetting variables-synced tag for collection " + a.name
      ), a.setSharedPluginData("recursica", "variables-synced", "");
      for (const t of a.variableIds) {
        const r = await figma.variables.getVariableByIdAsync(t);
        r && (console.log(
          "resetting variables-synced tag for variable " + r.name
        ), r.setSharedPluginData("recursica", "variables-synced", ""));
      }
    }
    return console.log(
      "Successfully reset variables-synced metadata for ",
      e.length,
      " variable collections"
    ), {
      type: "reset-metadata-response",
      success: !0,
      message: "Successfully reset variables-synced metadata for " + e.length + " variable collections. File type and theme name have been preserved."
    };
  } catch (e) {
    return console.error("Error resetting metadata:", e), {
      type: "reset-metadata-response",
      success: !1,
      error: e instanceof Error ? e.message : "Unknown error occurred"
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
}, v = w(k({}, x), {
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
}), E = w(k({}, x), {
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
}), I = w(k({}, x), {
  fillGeometry: null,
  strokeGeometry: null,
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
}), W = w(k({}, x), {
  cornerRadius: 0
}), ge = w(k({}, x), {
  strokeCap: "NONE",
  strokeJoin: "MITER",
  dashPattern: []
});
function de(e) {
  switch (e) {
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
      return v;
    case "TEXT":
      return E;
    case "VECTOR":
      return I;
    case "LINE":
      return ge;
    case "RECTANGLE":
    case "ELLIPSE":
    case "STAR":
    case "POLYGON":
      return W;
    default:
      return x;
  }
}
function g(e, a) {
  if (Array.isArray(e))
    return Array.isArray(a) ? e.length !== a.length || e.some((t, r) => g(t, a[r])) : e.length > 0;
  if (typeof e == "object" && e !== null) {
    if (typeof a == "object" && a !== null) {
      const t = Object.keys(e), r = Object.keys(a);
      return t.length !== r.length ? !0 : t.some(
        (o) => !(o in a) || g(e[o], a[o])
      );
    }
    return !0;
  }
  return e !== a;
}
class T {
  constructor() {
    N(this, "collectionMap");
    // collectionId -> index
    N(this, "collections");
    // index -> collection data
    N(this, "nextIndex");
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
    const r = this.nextIndex++;
    return this.collectionMap.set(t, r), this.collections[r] = a, r;
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
   * Used for JSON serialization
   */
  getTable() {
    const a = {};
    for (let t = 0; t < this.collections.length; t++)
      a[String(t)] = this.collections[t];
    return a;
  }
  /**
   * Reconstructs a CollectionTable from a serialized table object
   */
  static fromTable(a) {
    const t = new T(), r = Object.entries(a).sort(
      (o, i) => parseInt(o[0], 10) - parseInt(i[0], 10)
    );
    for (const [o, i] of r) {
      const n = parseInt(o, 10);
      t.collectionMap.set(i.collectionId, n), t.collections[n] = i, t.nextIndex = Math.max(
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
class O {
  constructor() {
    N(this, "variableMap");
    // variableKey -> index
    N(this, "variables");
    // index -> variable data
    N(this, "nextIndex");
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
    const r = this.nextIndex++;
    return this.variableMap.set(t, r), this.variables[r] = a, r;
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
      const r = this.variables[t], o = k(k(k(k(k(k({
        variableName: r.variableName,
        variableType: r.variableType
      }, r._colRef !== void 0 && { _colRef: r._colRef }), r.valuesByMode && { valuesByMode: r.valuesByMode }), r._colRef === void 0 && r.collectionRef !== void 0 && {
        collectionRef: r.collectionRef
      }), r._colRef === void 0 && r.collectionName && { collectionName: r.collectionName }), r._colRef === void 0 && r.collectionId && { collectionId: r.collectionId }), r._colRef === void 0 && r.isLocal !== void 0 && { isLocal: r.isLocal });
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
    const t = new O(), r = Object.entries(a).sort(
      (i, n) => parseInt(i[0], 10) - parseInt(n[0], 10)
    );
    for (const [i, n] of r) {
      const s = parseInt(i, 10);
      n.variableKey && t.variableMap.set(n.variableKey, s);
      const l = w(k({}, n), {
        // Prefer _colRef, fallback to collectionRef for backward compatibility
        _colRef: (o = n._colRef) != null ? o : n.collectionRef
      });
      t.variables[s] = l, t.nextIndex = Math.max(t.nextIndex, s + 1);
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
function me(e) {
  return {
    _varRef: e
  };
}
function V(e) {
  return e && typeof e == "object" && typeof e._varRef == "number" && !("type" in e);
}
async function J(e, a, t, r = /* @__PURE__ */ new Set()) {
  const o = {};
  for (const [i, n] of Object.entries(e)) {
    if (n == null) {
      o[i] = n;
      continue;
    }
    if (typeof n == "string" || typeof n == "number" || typeof n == "boolean") {
      o[i] = n;
      continue;
    }
    if (typeof n == "object" && n !== null && "type" in n && n.type === "VARIABLE_ALIAS" && "id" in n) {
      const s = n.id;
      if (r.has(s)) {
        o[i] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
        continue;
      }
      try {
        const l = await figma.variables.getVariableByIdAsync(s);
        if (!l) {
          o[i] = {
            type: "VARIABLE_ALIAS",
            id: s
          };
          continue;
        }
        const m = new Set(r);
        m.add(s);
        const c = await figma.variables.getVariableCollectionByIdAsync(
          l.variableCollectionId
        ), u = l.key;
        if (!u) {
          o[i] = {
            type: "VARIABLE_ALIAS",
            id: s
          };
          continue;
        }
        const A = {
          variableName: l.name,
          variableType: l.resolvedType,
          collectionName: c == null ? void 0 : c.name,
          collectionId: l.variableCollectionId,
          variableKey: u,
          id: s,
          isLocal: !l.remote
        }, f = await figma.variables.getVariableCollectionByIdAsync(
          l.variableCollectionId
        );
        if (f) {
          const y = await q(
            f,
            t
          );
          A._colRef = y;
        }
        l.valuesByMode && (A.valuesByMode = await J(
          l.valuesByMode,
          a,
          t,
          m
        ));
        const b = a.addVariable(A);
        o[i] = {
          type: "VARIABLE_ALIAS",
          id: s,
          _varRef: b
        };
      } catch (l) {
        console.log(
          "Could not resolve variable alias in valuesByMode:",
          s,
          l
        ), o[i] = {
          type: "VARIABLE_ALIAS",
          id: s
        };
      }
    } else
      o[i] = n;
  }
  return o;
}
async function q(e, a) {
  const t = {};
  for (const o of e.modes)
    t[o.modeId] = o.name;
  const r = {
    collectionName: e.name,
    collectionId: e.id,
    isLocal: !e.remote,
    modes: t
  };
  return a.addCollection(r);
}
async function $(e, a, t) {
  if (!e || typeof e != "object" || e.type !== "VARIABLE_ALIAS")
    return null;
  try {
    const r = await figma.variables.getVariableByIdAsync(e.id);
    if (!r)
      return console.log("Could not resolve variable alias:", e.id), null;
    const o = await figma.variables.getVariableCollectionByIdAsync(
      r.variableCollectionId
    );
    if (!o)
      return console.log("Could not resolve collection for variable:", e.id), null;
    const i = r.key;
    if (!i)
      return console.log("Variable missing key:", e.id), null;
    const n = await q(
      o,
      t
    ), s = {
      variableName: r.name,
      variableType: r.resolvedType,
      _colRef: n,
      // Reference to collection table (v2.4.0+)
      variableKey: i,
      // Internal-only: used for deduplication during export
      id: e.id
      // Internal-only: used for fallback in legacy scenarios
      // Legacy fields kept for backward compatibility (only if needed)
    };
    r.valuesByMode && (s.valuesByMode = await J(
      r.valuesByMode,
      a,
      t,
      /* @__PURE__ */ new Set([e.id])
      // Start with current variable ID in visited set
    ));
    const l = a.addVariable(s);
    return me(l);
  } catch (r) {
    return console.log("Could not resolve variable alias:", e.id, r), null;
  }
}
async function L(e, a, t) {
  if (!e || typeof e != "object") return e;
  const r = {};
  for (const o in e)
    if (Object.prototype.hasOwnProperty.call(e, o)) {
      const i = e[o];
      if (i && typeof i == "object" && !Array.isArray(i))
        if (i.type === "VARIABLE_ALIAS") {
          const n = await $(
            i,
            a,
            t
          );
          n && (r[o] = n);
        } else
          r[o] = await L(
            i,
            a,
            t
          );
      else Array.isArray(i) ? r[o] = await Promise.all(
        i.map(async (n) => (n == null ? void 0 : n.type) === "VARIABLE_ALIAS" ? await $(
          n,
          a,
          t
        ) || n : n && typeof n == "object" ? await L(
          n,
          a,
          t
        ) : n)
      ) : r[o] = i;
    }
  return r;
}
async function ye(e, a, t) {
  return !e || !Array.isArray(e) ? [] : Promise.all(
    e.map(async (r) => {
      if (!r || typeof r != "object") return r;
      const o = {};
      for (const i in r)
        Object.prototype.hasOwnProperty.call(r, i) && (i === "boundVariables" ? o[i] = await L(
          r[i],
          a,
          t
        ) : o[i] = r[i]);
      return o;
    })
  );
}
async function ue(e, a) {
  const t = {}, r = /* @__PURE__ */ new Set();
  if (e.type && (t.type = e.type, r.add("type")), e.id && (t.id = e.id, r.add("id")), e.name !== void 0 && e.name !== "" && (t.name = e.name, r.add("name")), e.x !== void 0 && e.x !== 0 && (t.x = e.x, r.add("x")), e.y !== void 0 && e.y !== 0 && (t.y = e.y, r.add("y")), e.width !== void 0 && (t.width = e.width, r.add("width")), e.height !== void 0 && (t.height = e.height, r.add("height")), e.visible !== void 0 && g(e.visible, x.visible) && (t.visible = e.visible, r.add("visible")), e.locked !== void 0 && g(e.locked, x.locked) && (t.locked = e.locked, r.add("locked")), e.opacity !== void 0 && g(e.opacity, x.opacity) && (t.opacity = e.opacity, r.add("opacity")), e.rotation !== void 0 && g(e.rotation, x.rotation) && (t.rotation = e.rotation, r.add("rotation")), e.blendMode !== void 0 && g(e.blendMode, x.blendMode) && (t.blendMode = e.blendMode, r.add("blendMode")), e.effects !== void 0 && g(e.effects, x.effects) && (t.effects = e.effects, r.add("effects")), e.fills !== void 0) {
    const o = await ye(
      e.fills,
      a.variableTable,
      a.collectionTable
    );
    g(o, x.fills) && (t.fills = o), r.add("fills");
  }
  if (e.strokes !== void 0 && g(e.strokes, x.strokes) && (t.strokes = e.strokes, r.add("strokes")), e.strokeWeight !== void 0 && g(e.strokeWeight, x.strokeWeight) && (t.strokeWeight = e.strokeWeight, r.add("strokeWeight")), e.strokeAlign !== void 0 && g(e.strokeAlign, x.strokeAlign) && (t.strokeAlign = e.strokeAlign, r.add("strokeAlign")), e.boundVariables !== void 0 && e.boundVariables !== null) {
    const o = await L(
      e.boundVariables,
      a.variableTable,
      a.collectionTable
    );
    Object.keys(o).length > 0 && (t.boundVariables = o), r.add("boundVariables");
  }
  return t;
}
async function U(e, a) {
  const t = {}, r = /* @__PURE__ */ new Set();
  return e.layoutMode !== void 0 && g(e.layoutMode, v.layoutMode) && (t.layoutMode = e.layoutMode, r.add("layoutMode")), e.primaryAxisSizingMode !== void 0 && g(
    e.primaryAxisSizingMode,
    v.primaryAxisSizingMode
  ) && (t.primaryAxisSizingMode = e.primaryAxisSizingMode, r.add("primaryAxisSizingMode")), e.counterAxisSizingMode !== void 0 && g(
    e.counterAxisSizingMode,
    v.counterAxisSizingMode
  ) && (t.counterAxisSizingMode = e.counterAxisSizingMode, r.add("counterAxisSizingMode")), e.primaryAxisAlignItems !== void 0 && g(
    e.primaryAxisAlignItems,
    v.primaryAxisAlignItems
  ) && (t.primaryAxisAlignItems = e.primaryAxisAlignItems, r.add("primaryAxisAlignItems")), e.counterAxisAlignItems !== void 0 && g(
    e.counterAxisAlignItems,
    v.counterAxisAlignItems
  ) && (t.counterAxisAlignItems = e.counterAxisAlignItems, r.add("counterAxisAlignItems")), e.paddingLeft !== void 0 && g(e.paddingLeft, v.paddingLeft) && (t.paddingLeft = e.paddingLeft, r.add("paddingLeft")), e.paddingRight !== void 0 && g(e.paddingRight, v.paddingRight) && (t.paddingRight = e.paddingRight, r.add("paddingRight")), e.paddingTop !== void 0 && g(e.paddingTop, v.paddingTop) && (t.paddingTop = e.paddingTop, r.add("paddingTop")), e.paddingBottom !== void 0 && g(e.paddingBottom, v.paddingBottom) && (t.paddingBottom = e.paddingBottom, r.add("paddingBottom")), e.itemSpacing !== void 0 && g(e.itemSpacing, v.itemSpacing) && (t.itemSpacing = e.itemSpacing, r.add("itemSpacing")), e.cornerRadius !== void 0 && g(e.cornerRadius, v.cornerRadius) && (t.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.clipsContent !== void 0 && g(e.clipsContent, v.clipsContent) && (t.clipsContent = e.clipsContent, r.add("clipsContent")), e.layoutWrap !== void 0 && g(e.layoutWrap, v.layoutWrap) && (t.layoutWrap = e.layoutWrap, r.add("layoutWrap")), e.layoutGrow !== void 0 && g(e.layoutGrow, v.layoutGrow) && (t.layoutGrow = e.layoutGrow, r.add("layoutGrow")), t;
}
async function he(e, a) {
  const t = {}, r = /* @__PURE__ */ new Set();
  return e.characters !== void 0 && e.characters !== "" && (t.characters = e.characters, r.add("characters")), e.fontName !== void 0 && (t.fontName = e.fontName, r.add("fontName")), e.fontSize !== void 0 && (t.fontSize = e.fontSize, r.add("fontSize")), e.textAlignHorizontal !== void 0 && g(
    e.textAlignHorizontal,
    E.textAlignHorizontal
  ) && (t.textAlignHorizontal = e.textAlignHorizontal, r.add("textAlignHorizontal")), e.textAlignVertical !== void 0 && g(
    e.textAlignVertical,
    E.textAlignVertical
  ) && (t.textAlignVertical = e.textAlignVertical, r.add("textAlignVertical")), e.letterSpacing !== void 0 && g(e.letterSpacing, E.letterSpacing) && (t.letterSpacing = e.letterSpacing, r.add("letterSpacing")), e.lineHeight !== void 0 && g(e.lineHeight, E.lineHeight) && (t.lineHeight = e.lineHeight, r.add("lineHeight")), e.textCase !== void 0 && g(e.textCase, E.textCase) && (t.textCase = e.textCase, r.add("textCase")), e.textDecoration !== void 0 && g(e.textDecoration, E.textDecoration) && (t.textDecoration = e.textDecoration, r.add("textDecoration")), e.textAutoResize !== void 0 && g(e.textAutoResize, E.textAutoResize) && (t.textAutoResize = e.textAutoResize, r.add("textAutoResize")), e.paragraphSpacing !== void 0 && g(
    e.paragraphSpacing,
    E.paragraphSpacing
  ) && (t.paragraphSpacing = e.paragraphSpacing, r.add("paragraphSpacing")), e.paragraphIndent !== void 0 && g(e.paragraphIndent, E.paragraphIndent) && (t.paragraphIndent = e.paragraphIndent, r.add("paragraphIndent")), e.listOptions !== void 0 && g(e.listOptions, E.listOptions) && (t.listOptions = e.listOptions, r.add("listOptions")), t;
}
async function be(e, a) {
  const t = {}, r = /* @__PURE__ */ new Set();
  return e.fillGeometry !== void 0 && g(e.fillGeometry, I.fillGeometry) && (t.fillGeometry = e.fillGeometry, r.add("fillGeometry")), e.strokeGeometry !== void 0 && g(e.strokeGeometry, I.strokeGeometry) && (t.strokeGeometry = e.strokeGeometry, r.add("strokeGeometry")), e.strokeCap !== void 0 && g(e.strokeCap, I.strokeCap) && (t.strokeCap = e.strokeCap, r.add("strokeCap")), e.strokeJoin !== void 0 && g(e.strokeJoin, I.strokeJoin) && (t.strokeJoin = e.strokeJoin, r.add("strokeJoin")), e.dashPattern !== void 0 && g(e.dashPattern, I.dashPattern) && (t.dashPattern = e.dashPattern, r.add("dashPattern")), t;
}
async function Ae(e, a) {
  const t = {}, r = /* @__PURE__ */ new Set();
  return e.cornerRadius !== void 0 && g(e.cornerRadius, W.cornerRadius) && (t.cornerRadius = e.cornerRadius, r.add("cornerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, r.add("pointCount")), e.innerRadius !== void 0 && (t.innerRadius = e.innerRadius, r.add("innerRadius")), e.pointCount !== void 0 && (t.pointCount = e.pointCount, r.add("pointCount")), t;
}
function ve(e) {
  const a = [];
  let t = e.parent;
  try {
    for (; t; ) {
      let r, o, i;
      try {
        r = t.type, o = t.name, i = t.parent;
      } catch (n) {
        console.log(
          "Error accessing parent node properties in buildParentPath:",
          n
        );
        break;
      }
      if (r === "PAGE" || !i)
        break;
      o && o.trim() !== "" && a.unshift(o), t = i;
    }
  } catch (r) {
    console.log("Error during parent path traversal:", r);
  }
  return a.join("/");
}
async function xe(e, a) {
  const t = {}, r = /* @__PURE__ */ new Set();
  if (t._isInstance = !0, r.add("_isInstance"), e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const o = await e.getMainComponentAsync();
      if (o) {
        const i = {};
        try {
          i.instanceNodeName = e.name, i.instanceNodeId = e.id, i.instanceNodeType = e.type, i.componentName = o.name, i.componentType = o.type, i.componentId = o.id;
          try {
            i.componentKey = o.key;
          } catch (p) {
            i.componentKey = "(cannot access)";
          }
          try {
            i.componentRemote = o.remote;
          } catch (p) {
            i.componentRemote = "(cannot access)";
          }
          let f = [];
          try {
            f = Object.getOwnPropertyNames(o), i.ownProperties = f;
          } catch (p) {
            i.ownProperties = "(cannot access)";
          }
          const b = [];
          try {
            let p = Object.getPrototypeOf(o);
            for (; p && p !== Object.prototype; )
              b.push(
                ...Object.getOwnPropertyNames(p).filter(
                  (C) => !b.includes(C)
                )
              ), p = Object.getPrototypeOf(p);
            i.prototypeProperties = b;
          } catch (p) {
            i.prototypeProperties = "(cannot access)";
          }
          let y = [];
          try {
            y = Object.keys(o), i.enumerableProperties = y;
          } catch (p) {
            i.enumerableProperties = "(cannot access)";
          }
          const h = [];
          try {
            for (const p of [...f, ...b])
              if (!(p === "instances" || p === "children" || p === "parent"))
                try {
                  typeof o[p] == "function" && h.push(p);
                } catch (C) {
                }
            i.availableMethods = h;
          } catch (p) {
            i.availableMethods = "(cannot access)";
          }
          const d = [];
          try {
            for (const p of [...f, ...b])
              (p.toLowerCase().includes("library") || p.toLowerCase().includes("remote") || p.toLowerCase().includes("file")) && d.push(p);
            i.libraryRelatedProperties = d;
          } catch (p) {
            i.libraryRelatedProperties = "(cannot access)";
          }
          try {
            o.remote !== void 0 && (i.remoteValue = o.remote);
          } catch (p) {
          }
          try {
            o.libraryName !== void 0 && (i.libraryNameValue = o.libraryName);
          } catch (p) {
          }
          try {
            o.libraryKey !== void 0 && (i.libraryKeyValue = o.libraryKey);
          } catch (p) {
          }
          try {
            if (o.parent !== void 0) {
              const p = o.parent;
              if (p) {
                i.mainComponentHasParent = !0;
                try {
                  i.mainComponentParentType = p.type, i.mainComponentParentName = p.name, i.mainComponentParentId = p.id;
                } catch (C) {
                  i.mainComponentParentAccessError = String(C);
                }
              } else
                i.mainComponentHasParent = !1;
            } else
              i.mainComponentParentUndefined = !0;
          } catch (p) {
            i.mainComponentParentCheckError = String(p);
          }
          try {
            o.variantProperties !== void 0 && (i.mainComponentVariantProperties = o.variantProperties);
          } catch (p) {
          }
          try {
            o.componentPropertyDefinitions !== void 0 && (i.mainComponentPropertyDefinitions = Object.keys(
              o.componentPropertyDefinitions
            ));
          } catch (p) {
          }
        } catch (f) {
          i.debugError = String(f);
        }
        let n, s;
        try {
          e.variantProperties && (n = e.variantProperties, i.instanceVariantProperties = n), e.componentProperties && (s = e.componentProperties, i.instanceComponentProperties = s);
        } catch (f) {
          i.propertiesError = String(f);
        }
        let l, m;
        const c = [];
        try {
          let f = o.parent;
          const b = [];
          let y = 0;
          const h = 20;
          if (f)
            try {
              if (i.mainComponentParentExists = !0, i.mainComponentParentType = f.type, i.mainComponentParentName = f.name, i.mainComponentParentId = f.id, f.type === "COMPONENT_SET")
                try {
                  const d = f.parent;
                  if (d === null)
                    i.componentSetParentIsNull = !0;
                  else if (d === void 0)
                    i.componentSetParentIsUndefined = !0;
                  else {
                    i.componentSetParentExists = !0;
                    try {
                      i.componentSetParentType = d.type, i.componentSetParentName = d.name;
                    } catch (p) {
                      i.componentSetParentPropertyAccessError = String(p);
                    }
                  }
                } catch (d) {
                  i.componentSetParentCheckError = String(d);
                }
            } catch (d) {
              i.mainComponentParentDebugError = String(d);
            }
          else
            i.mainComponentParentExists = !1;
          for (; f && y < h; )
            try {
              const d = f.type, p = f.name;
              if (c.push(
                `${d}:${p || "(unnamed)"}`
              ), d === "COMPONENT_SET" && !m && (m = p, i.componentSetName = p, i.componentSetFound = !0), d === "PAGE")
                break;
              p && p.trim() !== "" && b.unshift(p);
              let C, M = !1;
              try {
                "parent" in f ? (M = !0, i[`hasParentPropertyAtDepth${y}`] = !0, C = f.parent, C === null ? i[`parentIsNullAtDepth${y}`] = !0 : C === void 0 ? i[`parentIsUndefinedAtDepth${y}`] = !0 : i[`parentExistsAtDepth${y}`] = !0) : i[`noParentPropertyAtDepth${y}`] = !0;
              } catch (S) {
                i.parentAccessErrorAtDepth = y, i.parentAccessError = String(S), i.parentAccessErrorName = S instanceof Error ? S.name : "Unknown", i.parentAccessErrorMessage = S instanceof Error ? S.message : String(S);
                break;
              }
              if (!C) {
                i.noParentAtDepth = y, i.parentAccessAttemptedAtDepth = M;
                break;
              }
              try {
                const S = C.type, oe = C.name;
                i[`parentAtDepth${y + 1}Type`] = S, i[`parentAtDepth${y + 1}Name`] = oe;
              } catch (S) {
                i.nextParentAccessErrorAtDepth = y, i.nextParentAccessError = String(S);
              }
              f = C, y++;
            } catch (d) {
              i.parentTraverseErrorAtDepth = y, i.parentTraverseError = String(d), i.parentTraverseErrorName = d instanceof Error ? d.name : "Unknown", i.parentTraverseErrorMessage = d instanceof Error ? d.message : String(d);
              break;
            }
          l = b.join("/"), i.mainComponentParentChain = c, i.mainComponentParentChainDepth = y, i.mainComponentParentPath = l, i.mainComponentParentPathParts = b;
        } catch (f) {
          i.mainComponentParentPathError = String(f);
        }
        const u = ve(e);
        if (i.instanceParentPath = u, t.mainComponent = {
          id: o.id,
          name: o.name,
          key: o.key,
          // Component key for reference
          type: o.type
        }, m && (t.mainComponent.componentSetName = m), n && (t.mainComponent.variantProperties = n), s && (t.mainComponent.componentProperties = s), l && (t.mainComponent._path = l), u && (t.mainComponent._instancePath = u), o.remote === !0) {
          t.mainComponent.remote = !0;
          try {
            if (typeof o.getPublishStatusAsync == "function")
              try {
                const f = await o.getPublishStatusAsync();
                if (f && (i.publishStatus = f, f && typeof f == "object")) {
                  f.libraryName && (t.mainComponent.libraryName = f.libraryName), f.libraryKey && (t.mainComponent.libraryKey = f.libraryKey), f.fileKey && (t.mainComponent.fileKey = f.fileKey);
                  const b = {};
                  Object.keys(f).forEach((y) => {
                    (y.toLowerCase().includes("library") || y.toLowerCase().includes("file")) && (b[y] = f[y]);
                  }), Object.keys(b).length > 0 && (i.libraryRelatedFromPublishStatus = b);
                }
              } catch (f) {
                i.publishStatusError = String(f);
              }
            try {
              const f = figma.teamLibrary, b = Object.getOwnPropertyNames(
                f
              ).filter((y) => typeof f[y] == "function");
              if (i.teamLibraryAvailableMethods = b, typeof (f == null ? void 0 : f.getAvailableLibraryComponentSetsAsync) == "function") {
                const y = await f.getAvailableLibraryComponentSetsAsync();
                if (i.availableComponentSetsCount = (y == null ? void 0 : y.length) || 0, y && Array.isArray(y)) {
                  const h = [];
                  for (const d of y)
                    try {
                      const p = {
                        name: d.name,
                        key: d.key,
                        libraryName: d.libraryName,
                        libraryKey: d.libraryKey
                      };
                      if (h.push(p), d.key === o.key || d.name === o.name) {
                        i.matchingComponentSet = p, d.libraryName && (t.mainComponent.libraryName = d.libraryName), d.libraryKey && (t.mainComponent.libraryKey = d.libraryKey);
                        break;
                      }
                    } catch (p) {
                      h.push({
                        error: String(p)
                      });
                    }
                  i.componentSets = h;
                }
              } else
                i.componentSetsApiNote = "getAvailableLibraryComponentSetsAsync not available";
            } catch (f) {
              i.teamLibrarySearchError = String(f);
            }
            try {
              const f = await figma.importComponentByKeyAsync(
                o.key
              );
              f && (i.importedComponentInfo = {
                id: f.id,
                name: f.name,
                type: f.type,
                remote: f.remote
              }, f.libraryName && (t.mainComponent.libraryName = f.libraryName, i.importedComponentLibraryName = f.libraryName), f.libraryKey && (t.mainComponent.libraryKey = f.libraryKey, i.importedComponentLibraryKey = f.libraryKey));
            } catch (f) {
              i.importComponentError = String(f);
            }
          } catch (f) {
            i.libraryInfoError = String(f);
          }
        }
        Object.keys(i).length > 0 && (t.mainComponent._debug = i), r.add("mainComponent");
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
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    a += _(t);
  }), a;
}
async function X(e, a = /* @__PURE__ */ new WeakSet(), t = {}) {
  var u, A, f, b, y;
  if (!e || typeof e != "object")
    return e;
  const r = (u = t.maxNodes) != null ? u : 1e4, o = (A = t.nodeCount) != null ? A : 0;
  if (o >= r)
    return {
      _truncated: !0,
      _reason: `Maximum node count (${r}) reached`,
      _nodeCount: o
    };
  const i = {
    visited: (f = t.visited) != null ? f : /* @__PURE__ */ new WeakSet(),
    depth: (b = t.depth) != null ? b : 0,
    maxDepth: (y = t.maxDepth) != null ? y : 100,
    nodeCount: o + 1,
    maxNodes: r,
    unhandledKeys: /* @__PURE__ */ new Set(),
    variableTable: t.variableTable,
    collectionTable: t.collectionTable
  };
  if (a.has(e))
    return "[Circular Reference]";
  a.add(e), i.visited = a;
  const n = {}, s = await ue(e, i);
  Object.assign(n, s);
  const l = e.type;
  if (l)
    switch (l) {
      case "FRAME":
      case "COMPONENT": {
        const h = await U(e);
        Object.assign(n, h);
        break;
      }
      case "INSTANCE": {
        const h = await xe(
          e
        );
        Object.assign(n, h);
        const d = await U(
          e
        );
        Object.assign(n, d);
        break;
      }
      case "TEXT": {
        const h = await he(e);
        Object.assign(n, h);
        break;
      }
      case "VECTOR":
      case "LINE": {
        const h = await be(e);
        Object.assign(n, h);
        break;
      }
      case "RECTANGLE":
      case "ELLIPSE":
      case "STAR":
      case "POLYGON": {
        const h = await Ae(e);
        Object.assign(n, h);
        break;
      }
      default:
        i.unhandledKeys.add("_unknownType");
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
  (l === "FRAME" || l === "COMPONENT" || l === "INSTANCE") && (c.add("layoutMode"), c.add("primaryAxisSizingMode"), c.add("counterAxisSizingMode"), c.add("primaryAxisAlignItems"), c.add("counterAxisAlignItems"), c.add("paddingLeft"), c.add("paddingRight"), c.add("paddingTop"), c.add("paddingBottom"), c.add("itemSpacing"), c.add("cornerRadius"), c.add("clipsContent"), c.add("layoutWrap"), c.add("layoutGrow")), l === "TEXT" && (c.add("characters"), c.add("fontName"), c.add("fontSize"), c.add("textAlignHorizontal"), c.add("textAlignVertical"), c.add("letterSpacing"), c.add("lineHeight"), c.add("textCase"), c.add("textDecoration"), c.add("textAutoResize"), c.add("paragraphSpacing"), c.add("paragraphIndent"), c.add("listOptions")), (l === "VECTOR" || l === "LINE") && (c.add("fillGeometry"), c.add("strokeGeometry")), (l === "RECTANGLE" || l === "ELLIPSE" || l === "STAR" || l === "POLYGON") && (c.add("pointCount"), c.add("innerRadius"), c.add("arcData")), l === "INSTANCE" && (c.add("mainComponent"), c.add("componentProperties"));
  for (const h of m)
    typeof e[h] != "function" && (c.has(h) || i.unhandledKeys.add(h));
  if (i.unhandledKeys.size > 0 && (n._unhandledKeys = Array.from(i.unhandledKeys).sort()), e.children && Array.isArray(e.children)) {
    const h = i.maxDepth;
    if (i.depth >= h)
      n.children = {
        _truncated: !0,
        _reason: `Maximum depth (${h}) reached`,
        _count: e.children.length
      };
    else if (i.nodeCount >= r)
      n.children = {
        _truncated: !0,
        _reason: `Maximum node count (${r}) reached`,
        _count: e.children.length,
        _processed: 0
      };
    else {
      const d = w(k({}, i), {
        depth: i.depth + 1
      }), p = [];
      let C = !1;
      for (const M of e.children) {
        if (d.nodeCount >= r) {
          n.children = {
            _truncated: !0,
            _reason: `Maximum node count (${r}) reached during children processing`,
            _processed: p.length,
            _total: e.children.length,
            children: p
          }, C = !0;
          break;
        }
        const S = await X(M, a, d);
        p.push(S), d.nodeCount && (i.nodeCount = d.nodeCount);
      }
      C || (n.children = p);
    }
  }
  return n;
}
async function Ce() {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "pages-loaded",
      success: !0,
      pages: figma.root.children.map((t, r) => ({
        name: t.name,
        index: r
      }))
    };
  } catch (e) {
    return console.error("Error loading pages:", e), {
      type: "pages-loaded",
      success: !1,
      error: e instanceof Error ? e.message : "Unknown error occurred"
    };
  }
}
async function ke(e) {
  try {
    await figma.loadAllPagesAsync();
    const a = figma.root.children;
    if (e < 0 || e >= a.length)
      return {
        type: "page-export-response",
        success: !1,
        error: "Invalid page selection"
      };
    const t = a[e];
    console.log("Exporting page: " + t.name);
    const r = new O(), o = new T();
    let i = [];
    try {
      i = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((u) => ({
        libraryName: u.libraryName,
        key: u.key,
        name: u.name
      }));
    } catch (c) {
      console.log(
        "Could not get library variable collections:",
        c instanceof Error ? c.message : String(c)
      );
    }
    const n = await X(
      t,
      /* @__PURE__ */ new WeakSet(),
      {
        variableTable: r,
        collectionTable: o
      }
    ), s = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        exportFormatVersion: "2.4.0",
        // Updated version for simplified variable table (removed unnecessary fields)
        figmaApiVersion: figma.apiVersion,
        originalPageName: t.name,
        totalNodes: _(n),
        pluginVersion: "1.0.0"
      },
      collections: o.getTable(),
      variables: r.getSerializedTable(),
      libraries: i,
      pageData: n
    }, l = JSON.stringify(s, null, 2), m = t.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return console.log(
      "Export complete. Total nodes:",
      _(n)
    ), {
      type: "page-export-response",
      success: !0,
      filename: m,
      jsonData: l,
      pageName: t.name
    };
  } catch (a) {
    return console.error("Error exporting page:", a), {
      type: "page-export-response",
      success: !1,
      error: a instanceof Error ? a.message : "Unknown error occurred"
    };
  }
}
async function Se(e, a) {
  const t = /* @__PURE__ */ new Map();
  for (const [r, o] of Object.entries(a)) {
    const i = e.modes.find((n) => n.name === o);
    if (i)
      t.set(r, i.modeId);
    else {
      const n = e.addMode(o);
      t.set(r, n);
    }
  }
  return t;
}
async function Y(e) {
  let a;
  if (e.isLocal) {
    const o = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (i) => i.name === e.collectionName
    );
    o ? a = o : a = figma.variables.createVariableCollection(
      e.collectionName
    );
  } else {
    const o = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find(
      (l) => l.name === e.collectionName
    );
    if (!o)
      throw new Error(
        `External collection "${e.collectionName}" not found in team library. Please ensure the collection is published and available.`
      );
    const i = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      o.key
    );
    if (i.length === 0)
      throw new Error(
        `External collection "${e.collectionName}" exists but has no variables. Cannot import.`
      );
    const n = await figma.variables.importVariableByKeyAsync(
      i[0].key
    ), s = await figma.variables.getVariableCollectionByIdAsync(
      n.variableCollectionId
    );
    if (!s)
      throw new Error(
        `Failed to import external collection "${e.collectionName}"`
      );
    a = s;
  }
  const t = await Se(
    a,
    e.modes
  );
  return { collection: a, modeMapping: t };
}
async function z(e, a) {
  if (a) {
    const r = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (o) => o.name === e
    );
    return r || figma.variables.createVariableCollection(e);
  } else {
    const r = (await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).find(
      (s) => s.name === e
    );
    if (!r)
      throw new Error(
        `External collection "${e}" not found in team library. Please ensure the collection is published and available.`
      );
    const o = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      r.key
    );
    if (o.length === 0)
      throw new Error(
        `External collection "${e}" exists but has no variables. Cannot import.`
      );
    const i = await figma.variables.importVariableByKeyAsync(
      o[0].key
    ), n = await figma.variables.getVariableCollectionByIdAsync(
      i.variableCollectionId
    );
    if (!n)
      throw new Error(
        `Failed to import external collection "${e}"`
      );
    return n;
  }
}
async function P(e, a) {
  for (const t of e.variableIds)
    try {
      const r = await figma.variables.getVariableByIdAsync(t);
      if (r && r.name === a)
        return r;
    } catch (r) {
      continue;
    }
  return null;
}
function j(e, a) {
  const t = e.resolvedType.toUpperCase(), r = a.toUpperCase();
  return t !== r ? (console.warn(
    `Variable type mismatch: Variable "${e.name}" has type "${t}" but expected "${r}". Skipping binding.`
  ), !1) : !0;
}
async function Ee(e, a, t, r, o) {
  for (const [i, n] of Object.entries(a)) {
    const s = r.get(i);
    if (!s) {
      console.warn(
        `Mode ID ${i} not found in mode mapping for variable "${e.name}". Skipping.`
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
        const l = n;
        let m = null;
        if (l._varRef !== void 0) {
          const c = t.getVariableByIndex(
            l._varRef
          );
          if (c) {
            let u = null;
            if (o && c._colRef !== void 0) {
              const A = o.getCollectionByIndex(
                c._colRef
              );
              A && (u = (await Y(A)).collection);
            }
            !u && c.collectionName && c.isLocal !== void 0 && (u = await z(
              c.collectionName,
              c.isLocal
            )), u && (m = await P(
              u,
              c.variableName
            ));
          }
        }
        if (!m && l.id)
          try {
            m = await figma.variables.getVariableByIdAsync(
              l.id
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
            `Could not resolve variable alias for mode ${i} (mapped to ${s}) in variable "${e.name}". Original ID: ${l.id}`
          );
      }
    } catch (l) {
      console.warn(
        `Error setting value for mode ${i} (mapped to ${s}) in variable "${e.name}":`,
        l
      );
    }
  }
}
async function G(e, a, t, r, o) {
  const i = figma.variables.createVariable(
    e.variableName,
    a,
    e.variableType
  );
  return e.valuesByMode && await Ee(
    i,
    e.valuesByMode,
    t,
    r,
    o
  ), i;
}
async function Q(e, a, t) {
  var o;
  const r = a.getVariableByIndex(e._varRef);
  if (!r)
    return console.warn(`Variable not found in table at index ${e._varRef}`), null;
  try {
    let i;
    const n = (o = r._colRef) != null ? o : r.collectionRef;
    if (n !== void 0 && (i = t.getCollectionByIndex(n)), !i && r.collectionId && r.isLocal !== void 0) {
      const c = t.getCollectionIndex(
        r.collectionId
      );
      c >= 0 && (i = t.getCollectionByIndex(c));
    }
    if (!i) {
      const c = await z(
        r.collectionName || "",
        r.isLocal || !1
      );
      let u = await P(c, r.variableName);
      return u ? j(u, r.variableType) ? u : null : r.valuesByMode ? (u = await G(
        r,
        c,
        a,
        /* @__PURE__ */ new Map(),
        // Empty mode mapping for legacy
        t
        // Pass collection table for alias resolution
      ), u) : (console.warn(
        `Cannot create variable "${r.variableName}" without valuesByMode data`
      ), null);
    }
    const { collection: s, modeMapping: l } = await Y(i);
    let m = await P(s, r.variableName);
    return m ? j(m, r.variableType) ? m : null : r.valuesByMode ? (m = await G(
      r,
      s,
      a,
      l,
      t
      // Pass collection table for alias resolution
    ), m) : (console.warn(
      `Cannot create variable "${r.variableName}" without valuesByMode data`
    ), null);
  } catch (i) {
    if (console.error(
      `Error resolving variable reference for "${r.variableName}":`,
      i
    ), i instanceof Error && i.message.includes("External collection"))
      throw i;
    return null;
  }
}
function we(e, a) {
  if (!a || !V(e))
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
async function Ne(e, a, t, r, o) {
  if (!(!a || typeof a != "object"))
    try {
      const i = e[t];
      if (!i || !Array.isArray(i))
        return;
      for (const [n, s] of Object.entries(a))
        if (n === "fills" && Array.isArray(s))
          for (let l = 0; l < s.length && l < i.length; l++) {
            let m = null;
            const c = s[l];
            if (V(c) && r && o) {
              const u = await Q(
                c,
                r,
                o
              );
              u && i[l].boundVariables && (i[l].boundVariables[t] = {
                type: "VARIABLE_ALIAS",
                id: u.id
              });
            } else c && typeof c == "object" && "type" in c && c.type === "VARIABLE_ALIAS" && (m = c, m && await Ie(
              i[l],
              m,
              t,
              r
            ));
          }
        else {
          let l = null;
          V(s) ? l = we(s, r) : s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && (l = s), l && await Z(e, n, l, r);
        }
    } catch (i) {
      console.log(`Error restoring bound variables for ${t}:`, i);
    }
}
async function Z(e, a, t, r) {
  try {
    let o = null;
    try {
      o = await figma.variables.getVariableByIdAsync(t.id);
    } catch (i) {
    }
    if (!o && r) {
      if (t.isLocal) {
        const i = await z(
          t.collectionName || "",
          !0
        );
        o = await P(
          i,
          t.variableName || ""
        ), !o && t.variableName && t.variableType && console.warn(
          `Cannot create variable "${t.variableName}" without valuesByMode. Use resolveVariableReferenceOnImport instead.`
        );
      } else if (t.variableKey)
        try {
          o = await figma.variables.importVariableByKeyAsync(
            t.variableKey
          );
        } catch (i) {
          console.log(
            `Could not import team variable: ${t.variableName}`
          );
        }
    }
    if (o) {
      const i = {
        type: "VARIABLE_ALIAS",
        id: o.id
      };
      e.boundVariables || (e.boundVariables = {}), e.boundVariables[a] || (e.boundVariables[a] = i);
    }
  } catch (o) {
    console.log(`Error binding variable to property ${a}:`, o);
  }
}
async function Ie(e, a, t, r) {
  if (!(!e || typeof e != "object"))
    try {
      let o = null;
      try {
        o = await figma.variables.getVariableByIdAsync(a.id);
      } catch (i) {
        if (r) {
          if (a.isLocal) {
            const n = await z(
              a.collectionName || "",
              !0
            );
            o = await P(
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
function Re(e, a) {
  const t = de(a);
  if (e.visible === void 0 && (e.visible = t.visible), e.locked === void 0 && (e.locked = t.locked), e.opacity === void 0 && (e.opacity = t.opacity), e.rotation === void 0 && (e.rotation = t.rotation), e.blendMode === void 0 && (e.blendMode = t.blendMode), a === "FRAME" || a === "COMPONENT" || a === "INSTANCE") {
    const r = v;
    e.layoutMode === void 0 && (e.layoutMode = r.layoutMode), e.primaryAxisSizingMode === void 0 && (e.primaryAxisSizingMode = r.primaryAxisSizingMode), e.counterAxisSizingMode === void 0 && (e.counterAxisSizingMode = r.counterAxisSizingMode), e.primaryAxisAlignItems === void 0 && (e.primaryAxisAlignItems = r.primaryAxisAlignItems), e.counterAxisAlignItems === void 0 && (e.counterAxisAlignItems = r.counterAxisAlignItems), e.paddingLeft === void 0 && (e.paddingLeft = r.paddingLeft), e.paddingRight === void 0 && (e.paddingRight = r.paddingRight), e.paddingTop === void 0 && (e.paddingTop = r.paddingTop), e.paddingBottom === void 0 && (e.paddingBottom = r.paddingBottom), e.itemSpacing === void 0 && (e.itemSpacing = r.itemSpacing);
  }
  if (a === "TEXT") {
    const r = E;
    e.textAlignHorizontal === void 0 && (e.textAlignHorizontal = r.textAlignHorizontal), e.textAlignVertical === void 0 && (e.textAlignVertical = r.textAlignVertical), e.textCase === void 0 && (e.textCase = r.textCase), e.textDecoration === void 0 && (e.textDecoration = r.textDecoration), e.textAutoResize === void 0 && (e.textAutoResize = r.textAutoResize);
  }
}
async function D(e, a, t = null, r = null) {
  var o;
  try {
    let i;
    switch (e.type) {
      case "FRAME":
        i = figma.createFrame();
        break;
      case "RECTANGLE":
        i = figma.createRectangle();
        break;
      case "ELLIPSE":
        i = figma.createEllipse();
        break;
      case "TEXT":
        i = figma.createText();
        break;
      case "VECTOR":
        i = figma.createVector();
        break;
      case "STAR":
        i = figma.createStar();
        break;
      case "LINE":
        i = figma.createLine();
        break;
      case "COMPONENT":
        i = figma.createComponent();
        break;
      case "INSTANCE":
        if (console.log("Found instance node: " + e.name), e.mainComponent && e.mainComponent.key)
          try {
            const n = await figma.importComponentByKeyAsync(
              e.mainComponent.key
            );
            n && n.type === "COMPONENT" ? (i = n.createInstance(), console.log(
              "Created instance from main component: " + e.mainComponent.name
            )) : (console.log("Main component not found, creating frame fallback"), i = figma.createFrame());
          } catch (n) {
            console.log(
              "Error creating instance: " + n + ", creating frame fallback"
            ), i = figma.createFrame();
          }
        else
          console.log("No main component info, creating frame fallback"), i = figma.createFrame();
        break;
      case "GROUP":
        i = figma.createFrame();
        break;
      case "BOOLEAN_OPERATION":
        console.log(
          "Boolean operation found: " + e.name + ", creating frame fallback"
        ), i = figma.createFrame();
        break;
      case "POLYGON":
        i = figma.createPolygon();
        break;
      default:
        console.log(
          "Unsupported node type: " + e.type + ", creating frame instead"
        ), i = figma.createFrame();
        break;
    }
    if (!i)
      return null;
    if (Re(i, e.type || "FRAME"), e.name !== void 0 && (i.name = e.name || "Unnamed Node"), e.x !== void 0 && (i.x = e.x), e.y !== void 0 && (i.y = e.y), e.width !== void 0 && e.height !== void 0 && i.resize(e.width, e.height), e.visible !== void 0 && (i.visible = e.visible), e.locked !== void 0 && (i.locked = e.locked), e.opacity !== void 0 && (i.opacity = e.opacity), e.rotation !== void 0 && (i.rotation = e.rotation), e.blendMode !== void 0 && (i.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills !== void 0)
      try {
        let n = e.fills;
        Array.isArray(n) && t && (n = n.map((s) => {
          if (s && typeof s == "object" && s.boundVariables) {
            const l = {};
            for (const [m, c] of Object.entries(
              s.boundVariables
            ))
              l[m] = c;
            return w(k({}, s), { boundVariables: l });
          }
          return s;
        })), i.fills = n, (o = e.boundVariables) != null && o.fills && await Ne(
          i,
          e.boundVariables,
          "fills",
          t,
          r
        );
      } catch (n) {
        console.log("Error setting fills:", n);
      }
    if (e.strokes !== void 0 && e.strokes.length > 0)
      try {
        i.strokes = e.strokes;
      } catch (n) {
        console.log("Error setting strokes:", n);
      }
    if (e.strokeWeight !== void 0 && (i.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (i.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (i.cornerRadius = e.cornerRadius), e.effects !== void 0 && e.effects.length > 0 && (i.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode !== void 0 && (i.layoutMode = e.layoutMode), e.primaryAxisSizingMode !== void 0 && (i.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode !== void 0 && (i.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems !== void 0 && (i.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems !== void 0 && (i.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (i.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (i.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (i.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (i.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (i.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap !== void 0 && (i.strokeCap = e.strokeCap), e.strokeJoin !== void 0 && (i.strokeJoin = e.strokeJoin), e.dashPattern !== void 0 && e.dashPattern.length > 0 && (i.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters !== void 0)
      try {
        if (e.fontName)
          try {
            await figma.loadFontAsync(e.fontName), i.fontName = e.fontName;
          } catch (n) {
            await figma.loadFontAsync({
              family: "Roboto",
              style: "Regular"
            }), i.fontName = { family: "Roboto", style: "Regular" };
          }
        else
          await figma.loadFontAsync({
            family: "Roboto",
            style: "Regular"
          }), i.fontName = { family: "Roboto", style: "Regular" };
        i.characters = e.characters, e.fontSize !== void 0 && (i.fontSize = e.fontSize), e.textAlignHorizontal !== void 0 && (i.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical !== void 0 && (i.textAlignVertical = e.textAlignVertical), e.letterSpacing !== void 0 && (i.letterSpacing = e.letterSpacing), e.lineHeight !== void 0 && (i.lineHeight = e.lineHeight), e.textCase !== void 0 && (i.textCase = e.textCase), e.textDecoration !== void 0 && (i.textDecoration = e.textDecoration), e.textAutoResize !== void 0 && (i.textAutoResize = e.textAutoResize);
      } catch (n) {
        console.log("Error setting text properties: " + n);
        try {
          i.characters = e.characters;
        } catch (s) {
          console.log("Could not set text characters: " + s);
        }
      }
    if (e.boundVariables) {
      for (const [n, s] of Object.entries(
        e.boundVariables
      ))
        if (n !== "fills")
          if (V(s) && t && r) {
            const l = await Q(
              s,
              t,
              r
            );
            if (l) {
              const m = {
                type: "VARIABLE_ALIAS",
                id: l.id
              };
              i.boundVariables || (i.boundVariables = {}), i.boundVariables[n] || (i.boundVariables[n] = m);
            }
          } else s && typeof s == "object" && "type" in s && s.type === "VARIABLE_ALIAS" && await Z(
            i,
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
          i,
          t,
          r
        );
        s && i.appendChild(s);
      }
    return a && a.appendChild(i), i;
  } catch (i) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      i
    ), null;
  }
}
async function Pe(e) {
  try {
    if (console.log("Importing page from JSON"), !e.pageData || !e.metadata)
      return {
        type: "page-import-response",
        success: !1,
        error: "Invalid JSON format. Expected pageData and metadata."
      };
    const a = e.pageData, t = e.metadata;
    let r = null;
    if (e.collections)
      try {
        r = T.fromTable(e.collections), console.log(
          `Loaded collections table with ${r.getSize()} collections`
        );
      } catch (c) {
        console.warn("Failed to load collections table:", c);
      }
    let o = null;
    if (e.variables)
      try {
        o = O.fromTable(e.variables), console.log(
          `Loaded variable table with ${o.getSize()} variables`
        );
      } catch (c) {
        console.warn("Failed to load variable table:", c);
      }
    const i = "2.3.0", n = t.exportFormatVersion || "1.0.0";
    n !== i && console.warn(
      `Export format version mismatch: exported with ${n}, current version is ${i}. Import may have compatibility issues.`
    );
    const l = "Imported - " + (t.originalPageName ? t.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "Unknown"), m = figma.createPage();
    if (m.name = l, figma.root.appendChild(m), console.log("Created new page: " + l), console.log("Importing " + (t.totalNodes || "unknown") + " nodes"), a.children && Array.isArray(a.children)) {
      for (const c of a.children) {
        if (c._truncated) {
          console.log(
            `Skipping truncated children: ${c._reason || "Unknown"}`
          );
          continue;
        }
        await D(
          c,
          m,
          o,
          r
        );
      }
      console.log("Successfully imported page content with all children");
    } else
      console.log("No children to import");
    return {
      type: "page-import-response",
      success: !0,
      pageName: t.originalPageName,
      totalNodes: t.totalNodes || 0
    };
  } catch (a) {
    return console.error("Error importing page:", a), {
      type: "page-import-response",
      success: !1,
      error: a instanceof Error ? a.message : "Unknown error occurred"
    };
  }
}
function ee(e) {
  let a = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    a += ee(t);
  }), a;
}
function H(e) {
  return e ? Array.isArray(e) ? e.map((a) => {
    const t = Object.assign({}, a);
    a.boundVariables && (t.boundVariables = Object.assign({}, a.boundVariables));
  }) : e : [];
}
function te(e) {
  var t;
  const a = {
    id: e.id,
    name: e.name,
    type: e.type,
    visible: e.visible,
    locked: e.locked,
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    rotation: e.rotation,
    opacity: e.opacity,
    blendMode: e.blendMode,
    effects: e.effects,
    fills: H(e == null ? void 0 : e.fills),
    strokes: e.strokes,
    strokeWeight: e.strokeWeight,
    strokeAlign: e.strokeAlign,
    strokeCap: e.strokeCap,
    strokeJoin: e.strokeJoin,
    dashPattern: e.dashPattern,
    cornerRadius: e.cornerRadius,
    characters: e.characters,
    fontSize: e.fontSize,
    fontName: e.fontName,
    textAlignHorizontal: e.textAlignHorizontal,
    textAlignVertical: e.textAlignVertical,
    letterSpacing: e.letterSpacing,
    lineHeight: e.lineHeight,
    textCase: e.textCase,
    textDecoration: e.textDecoration,
    textAutoResize: e.textAutoResize,
    layoutMode: e.layoutMode,
    primaryAxisSizingMode: e.primaryAxisSizingMode,
    counterAxisSizingMode: e.counterAxisSizingMode,
    primaryAxisAlignItems: e.primaryAxisAlignItems,
    counterAxisAlignItems: e.counterAxisAlignItems,
    paddingLeft: e.paddingLeft,
    paddingRight: e.paddingRight,
    paddingTop: e.paddingTop,
    paddingBottom: e.paddingBottom,
    itemSpacing: e.itemSpacing,
    children: []
  };
  if (e.type === "INSTANCE" && typeof e.getMainComponentAsync == "function")
    try {
      const r = e.getMainComponentAsync();
      r && (a.mainComponent = {
        id: r.id,
        name: r.name,
        key: r.key,
        fills: r.fills,
        children: (t = r == null ? void 0 : r.children) == null ? void 0 : t.map((o) => {
          const i = H(o == null ? void 0 : o.fills);
          return {
            id: o.id,
            fills: i,
            strokes: o.strokes,
            strokeWeight: o.strokeWeight,
            strokeAlign: o.strokeAlign,
            strokeCap: o.strokeCap,
            strokeJoin: o.strokeJoin,
            dashPattern: o.dashPattern,
            name: o.name,
            type: o.type
          };
        })
      });
    } catch (r) {
      console.log("Error getting main component for " + e.name + ":", r);
    }
  return e.children && e.children.length > 0 && (a.children = e.children.map((r) => te(r))), a;
}
async function ie(e, a) {
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
        if (console.log("Found instance node: " + e.name), e.mainComponent && e.mainComponent.id)
          try {
            const r = await figma.importComponentByKeyAsync(
              e.mainComponent.key
            );
            if (r && r.type === "COMPONENT") {
              if (t = r.createInstance(), console.log(
                "Created instance from main component: " + e.mainComponent.name
              ), e.fills && e.fills.length > 0)
                try {
                  t.fills = e.fills;
                } catch (o) {
                  console.log("Error applying instance fills: " + o);
                }
              e.mainComponent.children && e.mainComponent.children.length > 0 && t.children && t.children.length > 0 && t.children.forEach((o) => {
                const i = e.children.find(
                  (n) => n.name === o.name
                );
                if (i)
                  try {
                    if (i.fills && i.fills.length > 0) {
                      const n = i.fills.map((s) => {
                        const l = Object.assign({}, s);
                        return s != null && s.boundVariables && (l.boundVariables = Object.assign(
                          {},
                          s.boundVariables
                        )), l;
                      });
                      o.fills = n != null ? n : {};
                    }
                    i.strokes && i.strokes.length > 0 && (o.strokes = i.strokes), i.strokeWeight !== void 0 && (o.strokeWeight = i.strokeWeight), i.strokeAlign !== void 0 && (o.strokeAlign = i.strokeAlign), i.strokeCap !== void 0 && (o.strokeCap = i.strokeCap), i.strokeJoin !== void 0 && (o.strokeJoin = i.strokeJoin), i.dashPattern && i.dashPattern.length > 0 && (o.dashPattern = i.dashPattern);
                  } catch (n) {
                    console.log(
                      "Error updating child " + o.name + ": " + n
                    );
                  }
              });
            } else
              console.log("Main component not found, creating frame fallback"), t = figma.createFrame();
          } catch (r) {
            console.log(
              "Error creating instance: " + r + ", creating frame fallback"
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
    if (t) {
      if (t.name = e.name || "Unnamed Node", t.x = e.x || 0, t.y = e.y || 0, t.resize(e.width || 100, e.height || 100), e.visible !== void 0 && (t.visible = e.visible), e.locked !== void 0 && (t.locked = e.locked), e.opacity !== void 0 && (t.opacity = e.opacity), e.rotation !== void 0 && (t.rotation = e.rotation), e.blendMode !== void 0 && (t.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills && e.fills.length === 0 && (t.fills = []), e.strokes && e.strokes.length > 0 && (t.strokes = e.strokes), e.strokeWeight !== void 0 && (t.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (t.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (t.cornerRadius = e.cornerRadius), e.effects && e.effects.length > 0 && (t.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode && (t.layoutMode = e.layoutMode), e.primaryAxisSizingMode && (t.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode && (t.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems && (t.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems && (t.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (t.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (t.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (t.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (t.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (t.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap && (t.strokeCap = e.strokeCap), e.strokeJoin && (t.strokeJoin = e.strokeJoin), e.dashPattern && e.dashPattern.length > 0 && (t.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters)
        try {
          if (e.fontName)
            try {
              await figma.loadFontAsync(e.fontName), t.fontName = e.fontName;
            } catch (r) {
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
          t.characters = e.characters, e.fontSize && (t.fontSize = e.fontSize), e.textAlignHorizontal && (t.textAlignHorizontal = e.textAlignHorizontal), e.textAlignVertical && (t.textAlignVertical = e.textAlignVertical), e.letterSpacing && (t.letterSpacing = e.letterSpacing), e.lineHeight && (t.lineHeight = e.lineHeight), e.textCase && (t.textCase = e.textCase), e.textDecoration && (t.textDecoration = e.textDecoration), e.textAutoResize && (t.textAutoResize = e.textAutoResize);
        } catch (r) {
          console.log("Error setting text properties: " + r);
          try {
            t.characters = e.characters;
          } catch (o) {
            console.log("Could not set text characters: " + o);
          }
        }
      if (e.children && e.children.length > 0)
        for (const r of e.children) {
          const o = await ie(r, t);
          o && t.appendChild(o);
        }
      a.appendChild(t);
    }
    return t;
  } catch (t) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      t
    ), null;
  }
}
async function Me() {
  try {
    await figma.loadAllPagesAsync();
    const e = figma.root.children;
    console.log("Found " + e.length + " pages in the document");
    const a = 11, t = e[a];
    if (!t)
      return {
        type: "quick-copy-response",
        success: !1,
        error: "No page found at index 11"
      };
    const r = te(t);
    console.log(
      "Selected page: " + t.name + " (index: " + a + ")"
    );
    const o = JSON.stringify(r, null, 2), i = JSON.parse(o), n = "Copy - " + i.name, s = figma.createPage();
    if (s.name = n, figma.root.appendChild(s), i.children && i.children.length > 0) {
      let m = function(u) {
        u.forEach((A) => {
          const f = (A.x || 0) + (A.width || 0);
          f > c && (c = f), A.children && A.children.length > 0 && m(A.children);
        });
      };
      console.log(
        "Recreating " + i.children.length + " top-level children..."
      );
      let c = 0;
      m(i.children), console.log("Original content rightmost edge: " + c);
      for (const u of i.children)
        await ie(u, s);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const l = ee(i);
    return {
      type: "quick-copy-response",
      success: !0,
      pageName: i.name,
      newPageName: n,
      totalNodes: l
    };
  } catch (e) {
    return console.error("Error performing quick copy:", e), {
      type: "quick-copy-response",
      success: !1,
      error: e instanceof Error ? e.message : "Unknown error occurred"
    };
  }
}
const R = "recursica", re = "file-type", B = "theme-name";
async function ae() {
  try {
    let e = "", a = "";
    const t = await figma.variables.getLocalVariableCollectionsAsync();
    if (t.length > 0) {
      const r = t[0];
      e = r.getSharedPluginData(R, re) || "", a = r.getSharedPluginData(R, B) || "";
    }
    return {
      type: "theme-settings-loaded",
      success: !0,
      fileType: e,
      themeName: a
    };
  } catch (e) {
    return console.error("Error loading theme settings:", e), {
      type: "theme-settings-loaded",
      success: !1,
      error: e instanceof Error ? e.message : "Failed to load theme settings"
    };
  }
}
async function Ve(e, a) {
  try {
    if (!e)
      return {
        type: "theme-settings-updated",
        success: !1,
        error: "File type is required"
      };
    if (e === "themes" && !a)
      return {
        type: "theme-settings-updated",
        success: !1,
        error: "Theme name is required when file type is 'themes'"
      };
    const t = await figma.variables.getLocalVariableCollectionsAsync();
    return t.length === 0 ? {
      type: "theme-settings-updated",
      success: !1,
      error: "No variable collections found. Please create a variable collection first."
    } : (t.forEach((r) => {
      r.setSharedPluginData(R, re, e), e === "themes" ? r.setSharedPluginData(
        R,
        B,
        a
      ) : r.setSharedPluginData(R, B, "");
    }), figma.notify(
      `Theme settings updated: File type set to "${e}"${e === "themes" ? `, Theme name set to "${a}"` : ""}`
    ), {
      type: "theme-settings-updated",
      success: !0,
      message: "Theme settings updated successfully"
    });
  } catch (t) {
    return console.error("Error updating theme settings:", t), {
      type: "theme-settings-updated",
      success: !1,
      error: t instanceof Error ? t.message : "Failed to update theme settings"
    };
  }
}
figma.showUI(__html__, {
  width: 500,
  height: 650
});
ae().then((e) => {
  figma.ui.postMessage(e);
});
figma.ui.onmessage = async (e) => {
  var a;
  console.log("Received message:", e);
  try {
    switch (e.type) {
      case "get-current-user": {
        figma.ui.postMessage({
          type: "current-user",
          payload: (a = figma.currentUser) == null ? void 0 : a.id
        });
        break;
      }
      case "reset-metadata": {
        const t = await pe();
        figma.ui.postMessage(t);
        break;
      }
      case "load-pages": {
        const t = await Ce();
        figma.ui.postMessage(t);
        break;
      }
      case "export-page": {
        const t = await ke(e.pageIndex);
        figma.ui.postMessage(t);
        break;
      }
      case "import-page": {
        const t = await Pe(e.jsonData);
        figma.ui.postMessage(t);
        break;
      }
      case "quick-copy": {
        const t = await Me();
        figma.ui.postMessage(t);
        break;
      }
      case "load-theme-settings": {
        const t = await ae();
        figma.ui.postMessage(t);
        break;
      }
      case "update-theme-settings": {
        const t = await Ve(
          e.fileType,
          e.themeName
        );
        figma.ui.postMessage(t);
        break;
      }
      case "store-auth-data": {
        await figma.clientStorage.setAsync("accessToken", e.accessToken), e.selectedRepo && await figma.clientStorage.setAsync(
          "selectedRepo",
          e.selectedRepo
        ), figma.ui.postMessage({
          type: "auth-data-stored",
          success: !0
        });
        break;
      }
      case "load-auth-data": {
        try {
          const t = await figma.clientStorage.getAsync("accessToken"), r = await figma.clientStorage.getAsync("selectedRepo");
          figma.ui.postMessage({
            type: "auth-data-loaded",
            success: !0,
            accessToken: t || void 0,
            selectedRepo: r || void 0
          });
        } catch (t) {
          figma.ui.postMessage({
            type: "auth-data-loaded",
            success: !1,
            error: t instanceof Error ? t.message : "Failed to load auth data"
          });
        }
        break;
      }
      case "clear-auth-data": {
        await figma.clientStorage.deleteAsync("accessToken"), await figma.clientStorage.deleteAsync("selectedRepo"), figma.ui.postMessage({
          type: "auth-data-cleared",
          success: !0
        });
        break;
      }
      case "store-selected-repo": {
        await figma.clientStorage.setAsync(
          "selectedRepo",
          e.selectedRepo
        ), figma.ui.postMessage({
          type: "selected-repo-stored",
          success: !0
        });
        break;
      }
      case "load-reference-files": {
        try {
          const t = await figma.clientStorage.getAsync("referenceFiles") || [];
          figma.ui.postMessage({
            type: "reference-files-loaded",
            success: !0,
            files: t
          });
        } catch (t) {
          figma.ui.postMessage({
            type: "reference-files-loaded",
            success: !1,
            error: t instanceof Error ? t.message : "Failed to load reference files"
          });
        }
        break;
      }
      case "add-reference-file": {
        try {
          const t = figma.fileKey;
          if (!t) {
            figma.notify(
              "Please save the file first before adding it as a reference. Go to File > Save or press Cmd/Ctrl+S",
              { error: !0, timeout: 5e3 }
            ), figma.ui.postMessage({
              type: "reference-file-added",
              success: !1,
              error: "This file is not saved. Please save the file first (File > Save or Cmd/Ctrl+S) before adding it as a reference."
            });
            break;
          }
          const r = figma.root.name, o = `https://www.figma.com/file/${t}/${encodeURIComponent(r)}`, i = await figma.clientStorage.getAsync("referenceFiles") || [], n = i.findIndex(
            (l) => l.fileKey === t
          );
          if (n >= 0) {
            const l = i[n];
            figma.notify(
              `"${l.fileName}" is already in your reference files list.`,
              { timeout: 3e3 }
            ), figma.ui.postMessage({
              type: "reference-file-added",
              success: !1,
              error: "This file is already in your reference files list."
            });
            break;
          }
          const s = {
            fileKey: t,
            fileName: r,
            fileUrl: o
          };
          i.push(s), await figma.clientStorage.setAsync("referenceFiles", i), figma.notify(`Successfully added "${r}" to reference files`, {
            timeout: 3e3
          }), figma.ui.postMessage({
            type: "reference-file-added",
            success: !0,
            file: s
          });
        } catch (t) {
          const r = t instanceof Error ? t.message : "Failed to add reference file";
          figma.notify(r, { error: !0, timeout: 5e3 }), figma.ui.postMessage({
            type: "reference-file-added",
            success: !1,
            error: r
          });
        }
        break;
      }
      case "add-reference-file-manual": {
        try {
          const { fileKey: t, fileName: r, fileUrl: o } = e;
          if (!t || !t.trim()) {
            figma.notify("File key is required", {
              error: !0,
              timeout: 3e3
            }), figma.ui.postMessage({
              type: "reference-file-added",
              success: !1,
              error: "File key is required"
            });
            break;
          }
          const i = await figma.clientStorage.getAsync("referenceFiles") || [], n = i.findIndex(
            (l) => l.fileKey === t
          );
          if (n >= 0) {
            const l = i[n];
            figma.notify(
              `"${l.fileName}" is already in your reference files list.`,
              { timeout: 3e3 }
            ), figma.ui.postMessage({
              type: "reference-file-added",
              success: !1,
              error: "This file is already in your reference files list."
            });
            break;
          }
          const s = {
            fileKey: t.trim(),
            fileName: r || "Unknown File",
            fileUrl: o
          };
          i.push(s), await figma.clientStorage.setAsync("referenceFiles", i), figma.notify(
            `Successfully added "${s.fileName}" to reference files`,
            {
              timeout: 3e3
            }
          ), figma.ui.postMessage({
            type: "reference-file-added",
            success: !0,
            file: s
          });
        } catch (t) {
          const r = t instanceof Error ? t.message : "Failed to add reference file";
          figma.notify(r, { error: !0, timeout: 5e3 }), figma.ui.postMessage({
            type: "reference-file-added",
            success: !1,
            error: r
          });
        }
        break;
      }
      case "remove-reference-file": {
        try {
          const r = (await figma.clientStorage.getAsync("referenceFiles") || []).filter(
            (o) => o.fileKey !== e.fileKey
          );
          await figma.clientStorage.setAsync("referenceFiles", r), figma.ui.postMessage({
            type: "reference-file-removed",
            success: !0
          });
        } catch (t) {
          figma.ui.postMessage({
            type: "reference-file-removed",
            success: !1,
            error: t instanceof Error ? t.message : "Failed to remove reference file"
          });
        }
        break;
      }
      case "open-external-url": {
        try {
          const t = e.url;
          if (console.log("Opening external URL:", t), !t || typeof t != "string")
            throw new Error("Invalid URL provided");
          const r = decodeURIComponent(t);
          console.log("Decoded URL:", r), await figma.openExternal(r), console.log("URL opened successfully"), figma.notify("Opening file in browser...", { timeout: 2e3 });
        } catch (t) {
          console.error("Error opening URL:", t);
          const r = t instanceof Error ? t.message : "Unknown error";
          figma.notify(`Failed to open URL: ${r}`, {
            error: !0,
            timeout: 5e3
          }), figma.ui.postMessage({
            type: "error",
            success: !1,
            error: `Failed to open URL: ${r}`
          });
        }
        break;
      }
      default: {
        console.warn("Unknown message type:", e.type);
        const t = {
          type: "error",
          success: !1,
          error: "Unknown message type: " + e.type
          // eslint-disable-line @typescript-eslint/no-explicit-any
        };
        figma.ui.postMessage(t);
      }
    }
  } catch (t) {
    console.error("Error handling message:", t);
    const r = {
      type: "error",
      success: !1,
      error: t instanceof Error ? t.message : "Unknown error occurred"
    };
    figma.ui.postMessage(r);
  }
};
