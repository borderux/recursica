async function x() {
  try {
    const e = await figma.variables.getLocalVariableCollectionsAsync();
    for (const r of e) {
      console.log(
        "resetting variables-synced tag for collection " + r.name
      ), r.setSharedPluginData("recursica", "variables-synced", "");
      for (const t of r.variableIds) {
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
function u(e) {
  let r = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    r += u(t);
  }), r;
}
function h(e) {
  const r = {
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
    fills: e.fills ? e.fills.map((t) => {
      const i = Object.assign({}, t);
      return t.boundVariables && (i.boundVariables = Object.assign(
        {},
        t.boundVariables
      )), i;
    }) : e.fills,
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
      const t = e.getMainComponentAsync();
      t && (r.mainComponent = {
        id: t.id,
        name: t.name,
        key: t.key,
        fills: t.fills,
        children: t.children.map((i) => {
          const o = i.fills ? i.fills.map((s) => {
            const a = Object.assign({}, s);
            return s.boundVariables && (a.boundVariables = Object.assign(
              {},
              s.boundVariables
            )), a;
          }) : [];
          return {
            id: i.id,
            fills: o,
            strokes: i.strokes,
            strokeWeight: i.strokeWeight,
            strokeAlign: i.strokeAlign,
            strokeCap: i.strokeCap,
            strokeJoin: i.strokeJoin,
            dashPattern: i.dashPattern,
            name: i.name,
            type: i.type
          };
        })
      });
    } catch (t) {
      console.log("Error getting main component for " + e.name + ":", t);
    }
  return e.children && e.children.length > 0 && (r.children = e.children.map((t) => h(t))), r;
}
async function E() {
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
async function N(e) {
  try {
    await figma.loadAllPagesAsync();
    const r = figma.root.children;
    if (e < 0 || e >= r.length)
      return {
        type: "page-export-response",
        success: !1,
        error: "Invalid page selection"
      };
    const t = r[e];
    console.log("Exporting page: " + t.name);
    const i = h(t), o = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        figmaVersion: figma.apiVersion,
        originalPageName: t.name,
        totalNodes: u(i),
        pluginVersion: "1.0.0"
      },
      pageData: i
    }, s = JSON.stringify(o, null, 2);
    return {
      type: "page-export-response",
      success: !0,
      filename: t.name.replace(/[^a-z0-9]/gi, "_") + "_export.json",
      jsonData: s,
      pageName: t.name
    };
  } catch (r) {
    return console.error("Error exporting page:", r), {
      type: "page-export-response",
      success: !1,
      error: r instanceof Error ? r.message : "Unknown error occurred"
    };
  }
}
async function y(e, r) {
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
                } catch (o) {
                  console.log("Error applying instance fills: " + o);
                }
              e.mainComponent.children && e.mainComponent.children.length > 0 && t.children && t.children.length > 0 && t.children.forEach((o) => {
                const s = e.children.find(
                  (a) => a.name === o.name
                );
                if (s)
                  try {
                    if (s.fills && s.fills.length > 0) {
                      const a = s.fills.map((n) => {
                        const g = Object.assign({}, n);
                        return n.boundVariables && (g.boundVariables = Object.assign(
                          {},
                          n.boundVariables
                        )), g;
                      });
                      o.fills = a;
                    }
                    s.strokes && s.strokes.length > 0 && (o.strokes = s.strokes), s.strokeWeight !== void 0 && (o.strokeWeight = s.strokeWeight), s.strokeAlign !== void 0 && (o.strokeAlign = s.strokeAlign), s.strokeCap !== void 0 && (o.strokeCap = s.strokeCap), s.strokeJoin !== void 0 && (o.strokeJoin = s.strokeJoin), s.dashPattern && s.dashPattern.length > 0 && (o.dashPattern = s.dashPattern);
                  } catch (a) {
                    console.log(
                      "Error updating child " + o.name + ": " + a
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
      if (t.name = e.name || "Unnamed Node", t.x = e.x || 0, t.y = e.y || 0, t.resize(e.width || 100, e.height || 100), e.visible !== void 0 && (t.visible = e.visible), e.locked !== void 0 && (t.locked = e.locked), e.opacity !== void 0 && (t.opacity = e.opacity), e.rotation !== void 0 && (t.rotation = e.rotation), e.blendMode !== void 0 && (t.blendMode = e.blendMode), e.type !== "INSTANCE" && e.fills && e.fills.length > 0) {
        const i = e.fills.map(
          (o) => {
            const s = Object.assign({}, o);
            return o.boundVariables && (s.boundVariables = Object.assign({}, o.boundVariables)), s;
          }
        );
        t.fills = i;
      } else e.type !== "INSTANCE" && e.fills && e.fills.length === 0 && (t.fills = []);
      if (e.strokes && e.strokes.length > 0 && (t.strokes = e.strokes), e.strokeWeight !== void 0 && (t.strokeWeight = e.strokeWeight), e.strokeAlign !== void 0 && (t.strokeAlign = e.strokeAlign), e.cornerRadius !== void 0 && (t.cornerRadius = e.cornerRadius), e.effects && e.effects.length > 0 && (t.effects = e.effects), (e.type === "FRAME" || e.type === "COMPONENT" || e.type === "INSTANCE") && (e.layoutMode && (t.layoutMode = e.layoutMode), e.primaryAxisSizingMode && (t.primaryAxisSizingMode = e.primaryAxisSizingMode), e.counterAxisSizingMode && (t.counterAxisSizingMode = e.counterAxisSizingMode), e.primaryAxisAlignItems && (t.primaryAxisAlignItems = e.primaryAxisAlignItems), e.counterAxisAlignItems && (t.counterAxisAlignItems = e.counterAxisAlignItems), e.paddingLeft !== void 0 && (t.paddingLeft = e.paddingLeft), e.paddingRight !== void 0 && (t.paddingRight = e.paddingRight), e.paddingTop !== void 0 && (t.paddingTop = e.paddingTop), e.paddingBottom !== void 0 && (t.paddingBottom = e.paddingBottom), e.itemSpacing !== void 0 && (t.itemSpacing = e.itemSpacing)), (e.type === "VECTOR" || e.type === "LINE") && (e.strokeCap && (t.strokeCap = e.strokeCap), e.strokeJoin && (t.strokeJoin = e.strokeJoin), e.dashPattern && e.dashPattern.length > 0 && (t.dashPattern = e.dashPattern)), e.type === "TEXT" && e.characters)
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
          } catch (o) {
            console.log("Could not set text characters: " + o);
          }
        }
      if (e.children && e.children.length > 0)
        for (const i of e.children) {
          const o = await y(i, t);
          o && t.appendChild(o);
        }
      r.appendChild(t);
    }
    return t;
  } catch (t) {
    return console.log(
      "Error recreating node " + (e.name || e.type) + ":",
      t
    ), null;
  }
}
async function C(e) {
  try {
    if (console.log("Importing page from JSON:", e), !e.pageData || !e.metadata)
      return {
        type: "page-import-response",
        success: !1,
        error: "Invalid JSON format. Expected pageData and metadata."
      };
    const r = e.pageData, t = e.metadata, i = "Imported - " + (t.originalPageName || "Unknown"), o = figma.createPage();
    if (o.name = i, figma.root.appendChild(o), console.log("Created new page: " + i), console.log("Importing " + (t.totalNodes || "unknown") + " nodes"), r.children && r.children.length > 0) {
      for (const s of r.children)
        await y(s, o);
      console.log("Successfully imported page content with all children");
    } else
      console.log("No children to import");
    return {
      type: "page-import-response",
      success: !0,
      pageName: t.originalPageName,
      totalNodes: t.totalNodes || 0
    };
  } catch (r) {
    return console.error("Error importing page:", r), {
      type: "page-import-response",
      success: !1,
      error: r instanceof Error ? r.message : "Unknown error occurred"
    };
  }
}
async function S() {
  try {
    await figma.loadAllPagesAsync();
    const e = figma.root.children;
    console.log("Found " + e.length + " pages in the document");
    const r = 11, t = e[r];
    if (!t)
      return {
        type: "quick-copy-response",
        success: !1,
        error: "No page found at index 11"
      };
    const i = h(t);
    console.log(
      "Selected page: " + t.name + " (index: " + r + ")"
    );
    const o = JSON.stringify(i, null, 2), s = JSON.parse(o), a = "Copy - " + s.name, n = figma.createPage();
    if (n.name = a, figma.root.appendChild(n), s.children && s.children.length > 0) {
      let d = function(f) {
        f.forEach((c) => {
          const k = (c.x || 0) + (c.width || 0);
          k > p && (p = k), c.children && c.children.length > 0 && d(c.children);
        });
      };
      console.log(
        "Recreating " + s.children.length + " top-level children..."
      );
      let p = 0;
      d(s.children), console.log("Original content rightmost edge: " + p);
      for (const f of s.children)
        await y(f, n);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const g = u(s);
    return {
      type: "quick-copy-response",
      success: !0,
      pageName: s.name,
      newPageName: a,
      totalNodes: g
    };
  } catch (e) {
    return console.error("Error performing quick copy:", e), {
      type: "quick-copy-response",
      success: !1,
      error: e instanceof Error ? e.message : "Unknown error occurred"
    };
  }
}
const l = "recursica", b = "file-type", m = "theme-name";
async function A() {
  try {
    let e = "", r = "";
    const t = await figma.variables.getLocalVariableCollectionsAsync();
    if (t.length > 0) {
      const i = t[0];
      e = i.getSharedPluginData(l, b) || "", r = i.getSharedPluginData(l, m) || "";
    }
    return {
      type: "theme-settings-loaded",
      success: !0,
      fileType: e,
      themeName: r
    };
  } catch (e) {
    return console.error("Error loading theme settings:", e), {
      type: "theme-settings-loaded",
      success: !1,
      error: e instanceof Error ? e.message : "Failed to load theme settings"
    };
  }
}
async function w(e, r) {
  try {
    if (!e)
      return {
        type: "theme-settings-updated",
        success: !1,
        error: "File type is required"
      };
    if (e === "themes" && !r)
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
      i.setSharedPluginData(l, b, e), e === "themes" ? i.setSharedPluginData(
        l,
        m,
        r
      ) : i.setSharedPluginData(l, m, "");
    }), figma.notify(
      `Theme settings updated: File type set to "${e}"${e === "themes" ? `, Theme name set to "${r}"` : ""}`
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
  height: 500
});
A().then((e) => {
  figma.ui.postMessage(e);
});
figma.ui.onmessage = async (e) => {
  console.log("Received message:", e);
  try {
    switch (e.type) {
      case "reset-metadata": {
        const r = await x();
        figma.ui.postMessage(r);
        break;
      }
      case "load-pages": {
        const r = await E();
        figma.ui.postMessage(r);
        break;
      }
      case "export-page": {
        const r = await N(e.pageIndex);
        figma.ui.postMessage(r);
        break;
      }
      case "import-page": {
        const r = await C(e.jsonData);
        figma.ui.postMessage(r);
        break;
      }
      case "quick-copy": {
        const r = await S();
        figma.ui.postMessage(r);
        break;
      }
      case "load-theme-settings": {
        const r = await A();
        figma.ui.postMessage(r);
        break;
      }
      case "update-theme-settings": {
        const r = await w(
          e.fileType,
          e.themeName
        );
        figma.ui.postMessage(r);
        break;
      }
      default: {
        console.warn("Unknown message type:", e.type);
        const r = {
          type: "error",
          success: !1,
          error: "Unknown message type: " + e.type
          // eslint-disable-line @typescript-eslint/no-explicit-any
        };
        figma.ui.postMessage(r);
      }
    }
  } catch (r) {
    console.error("Error handling message:", r);
    const t = {
      type: "error",
      success: !1,
      error: r instanceof Error ? r.message : "Unknown error occurred"
    };
    figma.ui.postMessage(t);
  }
};
