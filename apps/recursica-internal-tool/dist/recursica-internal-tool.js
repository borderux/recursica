var V = Object.defineProperty, L = Object.defineProperties;
var O = Object.getOwnPropertyDescriptors;
var C = Object.getOwnPropertySymbols;
var z = Object.prototype.hasOwnProperty, U = Object.prototype.propertyIsEnumerable;
var v = (e, s, t) => s in e ? V(e, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[s] = t, k = (e, s) => {
  for (var t in s || (s = {}))
    z.call(s, t) && v(e, t, s[t]);
  if (C)
    for (var t of C(s))
      U.call(s, t) && v(e, t, s[t]);
  return e;
}, A = (e, s) => L(e, O(s));
async function B() {
  try {
    const e = await figma.variables.getLocalVariableCollectionsAsync();
    for (const s of e) {
      console.log(
        "resetting variables-synced tag for collection " + s.name
      ), s.setSharedPluginData("recursica", "variables-synced", "");
      for (const t of s.variableIds) {
        const i = await figma.variables.getVariableByIdAsync(t);
        i && (console.log(
          "resetting variables-synced tag for variable " + i.name
        ), i.setSharedPluginData("recursica", "variables-synced", ""));
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
function x(e) {
  let s = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    s += x(t);
  }), s;
}
function P(e) {
  return e ? Array.isArray(e) ? e.map((s) => {
    const t = Object.assign({}, s);
    s.boundVariables && (t.boundVariables = Object.assign({}, s.boundVariables));
  }) : e : [];
}
function S(e) {
  var t;
  const s = {
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
    fills: P(e == null ? void 0 : e.fills),
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
      const i = e.getMainComponentAsync();
      i && (s.mainComponent = {
        id: i.id,
        name: i.name,
        key: i.key,
        fills: i.fills,
        children: (t = i == null ? void 0 : i.children) == null ? void 0 : t.map((r) => {
          const a = P(r == null ? void 0 : r.fills);
          return {
            id: r.id,
            fills: a,
            strokes: r.strokes,
            strokeWeight: r.strokeWeight,
            strokeAlign: r.strokeAlign,
            strokeCap: r.strokeCap,
            strokeJoin: r.strokeJoin,
            dashPattern: r.dashPattern,
            name: r.name,
            type: r.type
          };
        })
      });
    } catch (i) {
      console.log("Error getting main component for " + e.name + ":", i);
    }
  return e.children && e.children.length > 0 && (s.children = e.children.map((i) => S(i))), s;
}
async function J() {
  try {
    return await figma.loadAllPagesAsync(), {
      type: "pages-loaded",
      success: !0,
      pages: figma.root.children.map((t, i) => ({
        name: t.name,
        index: i
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
async function _(e) {
  try {
    await figma.loadAllPagesAsync();
    const s = figma.root.children;
    if (e < 0 || e >= s.length)
      return {
        type: "page-export-response",
        success: !1,
        error: "Invalid page selection"
      };
    const t = s[e];
    console.log("Exporting page: " + t.name);
    const i = S(t), r = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        figmaVersion: figma.apiVersion,
        originalPageName: t.name,
        totalNodes: x(i),
        pluginVersion: "1.0.0"
      },
      pageData: i
    }, a = JSON.stringify(r, null, 2), n = t.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return console.log(i), {
      type: "page-export-response",
      success: !0,
      filename: n,
      jsonData: a,
      pageName: t.name
    };
  } catch (s) {
    return console.error("Error exporting page:", s), {
      type: "page-export-response",
      success: !1,
      error: s instanceof Error ? s.message : "Unknown error occurred"
    };
  }
}
async function E(e, s) {
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
            const i = await figma.importComponentByKeyAsync(
              e.mainComponent.key
            );
            if (i && i.type === "COMPONENT") {
              if (t = i.createInstance(), console.log(
                "Created instance from main component: " + e.mainComponent.name
              ), e.fills && e.fills.length > 0)
                try {
                  t.fills = e.fills;
                } catch (r) {
                  console.log("Error applying instance fills: " + r);
                }
              e.mainComponent.children && e.mainComponent.children.length > 0 && t.children && t.children.length > 0 && t.children.forEach((r) => {
                const a = e.children.find(
                  (n) => n.name === r.name
                );
                if (a)
                  try {
                    if (a.fills && a.fills.length > 0) {
                      const n = a.fills.map((c) => {
                        const p = Object.assign({}, c);
                        return c != null && c.boundVariables && (p.boundVariables = Object.assign(
                          {},
                          c.boundVariables
                        )), p;
                      });
                      r.fills = n != null ? n : {};
                    }
                    a.strokes && a.strokes.length > 0 && (r.strokes = a.strokes), a.strokeWeight !== void 0 && (r.strokeWeight = a.strokeWeight), a.strokeAlign !== void 0 && (r.strokeAlign = a.strokeAlign), a.strokeCap !== void 0 && (r.strokeCap = a.strokeCap), a.strokeJoin !== void 0 && (r.strokeJoin = a.strokeJoin), a.dashPattern && a.dashPattern.length > 0 && (r.dashPattern = a.dashPattern);
                  } catch (n) {
                    console.log(
                      "Error updating child " + r.name + ": " + n
                    );
                  }
              });
            } else
              console.log("Main component not found, creating frame fallback"), t = figma.createFrame();
          } catch (i) {
            console.log(
              "Error creating instance: " + i + ", creating frame fallback"
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
            } catch (i) {
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
        } catch (i) {
          console.log("Error setting text properties: " + i);
          try {
            t.characters = e.characters;
          } catch (r) {
            console.log("Could not set text characters: " + r);
          }
        }
      if (e.children && e.children.length > 0)
        for (const i of e.children) {
          const r = await E(i, t);
          r && t.appendChild(r);
        }
      s.appendChild(t);
    }
    return t;
  } catch (t) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      t
    ), null;
  }
}
async function H(e) {
  try {
    if (console.log("Importing page from JSON:", e), !e.pageData || !e.metadata)
      return {
        type: "page-import-response",
        success: !1,
        error: "Invalid JSON format. Expected pageData and metadata."
      };
    const s = e.pageData, t = e.metadata, r = "Imported - " + (e.metadata.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "Unknown"), a = figma.createPage();
    if (a.name = r, figma.root.appendChild(a), console.log("Created new page: " + r), console.log("Importing " + (t.totalNodes || "unknown") + " nodes"), s.children && s.children.length > 0) {
      for (const n of s.children)
        await E(n, a);
      console.log("Successfully imported page content with all children");
    } else
      console.log("No children to import");
    return {
      type: "page-import-response",
      success: !0,
      pageName: t.originalPageName,
      totalNodes: t.totalNodes || 0
    };
  } catch (s) {
    return console.error("Error importing page:", s), {
      type: "page-import-response",
      success: !1,
      error: s instanceof Error ? s.message : "Unknown error occurred"
    };
  }
}
async function W() {
  try {
    await figma.loadAllPagesAsync();
    const e = figma.root.children;
    console.log("Found " + e.length + " pages in the document");
    const s = 11, t = e[s];
    if (!t)
      return {
        type: "quick-copy-response",
        success: !1,
        error: "No page found at index 11"
      };
    const i = S(t);
    console.log(
      "Selected page: " + t.name + " (index: " + s + ")"
    );
    const r = JSON.stringify(i, null, 2), a = JSON.parse(r), n = "Copy - " + a.name, c = figma.createPage();
    if (c.name = n, figma.root.appendChild(c), a.children && a.children.length > 0) {
      let m = function(f) {
        f.forEach((l) => {
          const u = (l.x || 0) + (l.width || 0);
          u > g && (g = u), l.children && l.children.length > 0 && m(l.children);
        });
      };
      console.log(
        "Recreating " + a.children.length + " top-level children..."
      );
      let g = 0;
      m(a.children), console.log("Original content rightmost edge: " + g);
      for (const f of a.children)
        await E(f, c);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const p = x(a);
    return {
      type: "quick-copy-response",
      success: !0,
      pageName: a.name,
      newPageName: n,
      totalNodes: p
    };
  } catch (e) {
    return console.error("Error performing quick copy:", e), {
      type: "quick-copy-response",
      success: !1,
      error: e instanceof Error ? e.message : "Unknown error occurred"
    };
  }
}
const d = "recursica", M = "file-type", w = "theme-name";
async function R() {
  try {
    let e = "", s = "";
    const t = await figma.variables.getLocalVariableCollectionsAsync();
    if (t.length > 0) {
      const i = t[0];
      e = i.getSharedPluginData(d, M) || "", s = i.getSharedPluginData(d, w) || "";
    }
    return {
      type: "theme-settings-loaded",
      success: !0,
      fileType: e,
      themeName: s
    };
  } catch (e) {
    return console.error("Error loading theme settings:", e), {
      type: "theme-settings-loaded",
      success: !1,
      error: e instanceof Error ? e.message : "Failed to load theme settings"
    };
  }
}
async function q(e, s) {
  try {
    if (!e)
      return {
        type: "theme-settings-updated",
        success: !1,
        error: "File type is required"
      };
    if (e === "themes" && !s)
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
    } : (t.forEach((i) => {
      i.setSharedPluginData(d, M, e), e === "themes" ? i.setSharedPluginData(
        d,
        w,
        s
      ) : i.setSharedPluginData(d, w, "");
    }), figma.notify(
      `Theme settings updated: File type set to "${e}"${e === "themes" ? `, Theme name set to "${s}"` : ""}`
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
async function G() {
  var e;
  try {
    const s = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(), t = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
    for (const o of s)
      t.add(o.libraryName), i.has(o.libraryName) || i.set(o.libraryName, []), (e = i.get(o.libraryName)) == null || e.push(o.key);
    const r = {};
    for (const o of t)
      r[o] = {
        libraryName: o,
        usedIn: {
          components: 0,
          styles: 0,
          variables: 0
        }
      };
    await figma.loadAllPagesAsync();
    const a = figma.root.children.filter(
      (o) => o.type === "PAGE"
    ), n = [], c = [], p = /* @__PURE__ */ new Set();
    for (const o of a)
      for (const y of o.children)
        await T(
          y,
          n,
          c,
          p
        );
    const m = /* @__PURE__ */ new Map();
    for (const o of n)
      m.has(o.key) ? m.get(o.key).nodeIds.push(...o.nodeIds) : m.set(o.key, A(k({}, o), { nodeIds: [...o.nodeIds] }));
    const g = Array.from(m.values()), f = /* @__PURE__ */ new Map();
    for (const o of c)
      f.has(o.key) ? f.get(o.key).nodeIds.push(...o.nodeIds) : f.set(o.key, A(k({}, o), { nodeIds: [...o.nodeIds] }));
    const l = Array.from(f.values());
    for (const o of p)
      try {
        const y = await figma.variables.getVariableByIdAsync(o);
        if (y)
          for (const I of s)
            try {
              if ((await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
                I.key
              )).find(
                (h) => h.name === y.name
              )) {
                const h = I.libraryName;
                r[h] && r[h].usedIn.variables++;
                break;
              }
            } catch (F) {
            }
      } catch (y) {
      }
    const u = Object.values(r).filter(
      (o) => o.usedIn.variables > 0
    );
    let N = `Found ${u.length} library file(s) with variables in use`;
    return (g.length > 0 || l.length > 0) && (N += `. Also detected ${g.length} remote component(s) and ${l.length} remote style(s) (library names not available due to API limitations).`), {
      type: "used-libraries-response",
      success: !0,
      libraries: u,
      remoteComponents: g.length > 0 ? g : void 0,
      remoteStyles: l.length > 0 ? l : void 0,
      message: N
    };
  } catch (s) {
    return console.error("Error detecting used libraries:", s), {
      type: "used-libraries-response",
      success: !1,
      libraries: [],
      error: s instanceof Error ? s.message : "Unknown error occurred"
    };
  }
}
async function T(e, s, t, i) {
  if (e.type === "INSTANCE")
    try {
      const r = await e.getMainComponentAsync();
      r && r.remote && s.push({
        key: r.key,
        name: r.name,
        nodeIds: [e.id]
      });
    } catch (r) {
      console.warn("Could not get main component:", r);
    }
  if ("fillStyleId" in e && e.fillStyleId && typeof e.fillStyleId == "string")
    try {
      const r = await figma.getStyleByIdAsync(e.fillStyleId);
      r && r.remote && (r.type === "PAINT" || r.type === "TEXT" || r.type === "EFFECT" || r.type === "GRID") && t.push({
        key: r.key,
        name: r.name,
        type: r.type,
        nodeIds: [e.id]
      });
    } catch (r) {
    }
  if ("textStyleId" in e && e.textStyleId && typeof e.textStyleId == "string")
    try {
      const r = await figma.getStyleByIdAsync(e.textStyleId);
      r && r.remote && (r.type === "PAINT" || r.type === "TEXT" || r.type === "EFFECT" || r.type === "GRID") && t.push({
        key: r.key,
        name: r.name,
        type: r.type,
        nodeIds: [e.id]
      });
    } catch (r) {
    }
  if ("effectStyleId" in e && e.effectStyleId && typeof e.effectStyleId == "string")
    try {
      const r = await figma.getStyleByIdAsync(e.effectStyleId);
      r && r.remote && (r.type === "PAINT" || r.type === "TEXT" || r.type === "EFFECT" || r.type === "GRID") && t.push({
        key: r.key,
        name: r.name,
        type: r.type,
        nodeIds: [e.id]
      });
    } catch (r) {
    }
  if ("fills" in e && Array.isArray(e.fills))
    for (const r of e.fills)
      r.type === "SOLID" && "boundVariables" in r && b(r.boundVariables, i);
  if ("strokes" in e && Array.isArray(e.strokes))
    for (const r of e.strokes)
      "boundVariables" in r && b(r.boundVariables, i);
  if ("effects" in e && Array.isArray(e.effects))
    for (const r of e.effects)
      "boundVariables" in r && b(r.boundVariables, i);
  if (e.type === "TEXT" && "boundVariables" in e && b(e.boundVariables, i), "children" in e) {
    if ("loadAsync" in e && typeof e.loadAsync == "function")
      try {
        await e.loadAsync();
      } catch (r) {
        console.warn("Could not load node:", r);
      }
    for (const r of e.children)
      await T(
        r,
        s,
        t,
        i
      );
  }
}
function b(e, s) {
  if (!(!e || typeof e != "object"))
    for (const t of Object.values(e))
      t && typeof t == "object" && "type" in t && t.type === "VARIABLE_ALIAS" && "id" in t && s.add(t.id);
}
figma.showUI(__html__, {
  width: 500,
  height: 650
});
R().then((e) => {
  figma.ui.postMessage(e);
});
figma.ui.onmessage = async (e) => {
  var s;
  console.log("Received message:", e);
  try {
    switch (e.type) {
      case "get-current-user": {
        figma.ui.postMessage({
          type: "current-user",
          payload: (s = figma.currentUser) == null ? void 0 : s.id
        });
        break;
      }
      case "reset-metadata": {
        const t = await B();
        figma.ui.postMessage(t);
        break;
      }
      case "load-pages": {
        const t = await J();
        figma.ui.postMessage(t);
        break;
      }
      case "export-page": {
        const t = await _(e.pageIndex);
        figma.ui.postMessage(t);
        break;
      }
      case "import-page": {
        const t = await H(e.jsonData);
        figma.ui.postMessage(t);
        break;
      }
      case "quick-copy": {
        const t = await W();
        figma.ui.postMessage(t);
        break;
      }
      case "load-theme-settings": {
        const t = await R();
        figma.ui.postMessage(t);
        break;
      }
      case "update-theme-settings": {
        const t = await q(
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
          const t = await figma.clientStorage.getAsync("accessToken"), i = await figma.clientStorage.getAsync("selectedRepo");
          figma.ui.postMessage({
            type: "auth-data-loaded",
            success: !0,
            accessToken: t || void 0,
            selectedRepo: i || void 0
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
      case "detect-used-libraries": {
        const t = await G();
        figma.ui.postMessage(t);
        break;
      }
      case "select-node": {
        try {
          const t = await figma.getNodeByIdAsync(e.nodeId);
          if (t) {
            let i = null, r = t;
            for (; r && r.type !== "PAGE"; )
              r = r.parent;
            r && r.type === "PAGE" && (i = r), i ? (await figma.setCurrentPageAsync(i), t.type !== "DOCUMENT" && (figma.currentPage.selection = [t], figma.viewport.scrollAndZoomIntoView([t])), figma.ui.postMessage({
              type: "select-node-response",
              success: !0
            })) : figma.ui.postMessage({
              type: "select-node-response",
              success: !1,
              error: "Could not find page containing node"
            });
          } else
            figma.ui.postMessage({
              type: "select-node-response",
              success: !1,
              error: "Node not found"
            });
        } catch (t) {
          figma.ui.postMessage({
            type: "select-node-response",
            success: !1,
            error: t instanceof Error ? t.message : "Failed to select node"
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
    const i = {
      type: "error",
      success: !1,
      error: t instanceof Error ? t.message : "Unknown error occurred"
    };
    figma.ui.postMessage(i);
  }
};
