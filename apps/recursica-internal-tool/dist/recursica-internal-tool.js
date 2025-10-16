async function S() {
  try {
    const e = await figma.variables.getLocalVariableCollectionsAsync();
    for (const s of e) {
      console.log(
        "resetting variables-synced tag for collection " + s.name
      ), s.setSharedPluginData("recursica", "variables-synced", "");
      for (const t of s.variableIds) {
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
function u(e) {
  let s = 1;
  return e.children && e.children.length > 0 && e.children.forEach((t) => {
    s += u(t);
  }), s;
}
function A(e) {
  return e ? Array.isArray(e) ? e.map((s) => {
    const t = Object.assign({}, s);
    s.boundVariables && (t.boundVariables = Object.assign({}, s.boundVariables));
  }) : e : [];
}
function h(e) {
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
    fills: A(e == null ? void 0 : e.fills),
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
      r && (s.mainComponent = {
        id: r.id,
        name: r.name,
        key: r.key,
        fills: r.fills,
        children: (t = r == null ? void 0 : r.children) == null ? void 0 : t.map((i) => {
          const a = A(i == null ? void 0 : i.fills);
          return {
            id: i.id,
            fills: a,
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
    } catch (r) {
      console.log("Error getting main component for " + e.name + ":", r);
    }
  return e.children && e.children.length > 0 && (s.children = e.children.map((r) => h(r))), s;
}
async function E() {
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
async function N(e) {
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
    const r = h(t), i = {
      metadata: {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
        figmaVersion: figma.apiVersion,
        originalPageName: t.name,
        totalNodes: u(r),
        pluginVersion: "1.0.0"
      },
      pageData: r
    }, a = JSON.stringify(i, null, 2), o = t.name.replace(/[^a-z0-9]/gi, "_") + "_export.json";
    return console.log(r), {
      type: "page-export-response",
      success: !0,
      filename: o,
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
async function d(e, s) {
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
                } catch (i) {
                  console.log("Error applying instance fills: " + i);
                }
              e.mainComponent.children && e.mainComponent.children.length > 0 && t.children && t.children.length > 0 && t.children.forEach((i) => {
                const a = e.children.find(
                  (o) => o.name === i.name
                );
                if (a)
                  try {
                    if (a.fills && a.fills.length > 0) {
                      const o = a.fills.map((n) => {
                        const g = Object.assign({}, n);
                        return n != null && n.boundVariables && (g.boundVariables = Object.assign(
                          {},
                          n.boundVariables
                        )), g;
                      });
                      i.fills = o != null ? o : {};
                    }
                    a.strokes && a.strokes.length > 0 && (i.strokes = a.strokes), a.strokeWeight !== void 0 && (i.strokeWeight = a.strokeWeight), a.strokeAlign !== void 0 && (i.strokeAlign = a.strokeAlign), a.strokeCap !== void 0 && (i.strokeCap = a.strokeCap), a.strokeJoin !== void 0 && (i.strokeJoin = a.strokeJoin), a.dashPattern && a.dashPattern.length > 0 && (i.dashPattern = a.dashPattern);
                  } catch (o) {
                    console.log(
                      "Error updating child " + i.name + ": " + o
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
          } catch (i) {
            console.log("Could not set text characters: " + i);
          }
        }
      if (e.children && e.children.length > 0)
        for (const r of e.children) {
          const i = await d(r, t);
          i && t.appendChild(i);
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
async function w(e) {
  try {
    if (console.log("Importing page from JSON:", e), !e.pageData || !e.metadata)
      return {
        type: "page-import-response",
        success: !1,
        error: "Invalid JSON format. Expected pageData and metadata."
      };
    const s = e.pageData, t = e.metadata, i = "Imported - " + (e.metadata.originalPageName.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "Unknown"), a = figma.createPage();
    if (a.name = i, figma.root.appendChild(a), console.log("Created new page: " + i), console.log("Importing " + (t.totalNodes || "unknown") + " nodes"), s.children && s.children.length > 0) {
      for (const o of s.children)
        await d(o, a);
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
async function C() {
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
    const r = h(t);
    console.log(
      "Selected page: " + t.name + " (index: " + s + ")"
    );
    const i = JSON.stringify(r, null, 2), a = JSON.parse(i), o = "Copy - " + a.name, n = figma.createPage();
    if (n.name = o, figma.root.appendChild(n), a.children && a.children.length > 0) {
      let y = function(f) {
        f.forEach((c) => {
          const k = (c.x || 0) + (c.width || 0);
          k > p && (p = k), c.children && c.children.length > 0 && y(c.children);
        });
      };
      console.log(
        "Recreating " + a.children.length + " top-level children..."
      );
      let p = 0;
      y(a.children), console.log("Original content rightmost edge: " + p);
      for (const f of a.children)
        await d(f, n);
      console.log("Successfully recreated page content with all children");
    } else
      console.log("No children to recreate");
    const g = u(a);
    return {
      type: "quick-copy-response",
      success: !0,
      pageName: a.name,
      newPageName: o,
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
async function x() {
  try {
    let e = "", s = "";
    const t = await figma.variables.getLocalVariableCollectionsAsync();
    if (t.length > 0) {
      const r = t[0];
      e = r.getSharedPluginData(l, b) || "", s = r.getSharedPluginData(l, m) || "";
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
async function R(e, s) {
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
    } : (t.forEach((r) => {
      r.setSharedPluginData(l, b, e), e === "themes" ? r.setSharedPluginData(
        l,
        m,
        s
      ) : r.setSharedPluginData(l, m, "");
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
figma.showUI(__html__, {
  width: 500,
  height: 650
});
x().then((e) => {
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
        const t = await S();
        figma.ui.postMessage(t);
        break;
      }
      case "load-pages": {
        const t = await E();
        figma.ui.postMessage(t);
        break;
      }
      case "export-page": {
        const t = await N(e.pageIndex);
        figma.ui.postMessage(t);
        break;
      }
      case "import-page": {
        const t = await w(e.jsonData);
        figma.ui.postMessage(t);
        break;
      }
      case "quick-copy": {
        const t = await C();
        figma.ui.postMessage(t);
        break;
      }
      case "load-theme-settings": {
        const t = await x();
        figma.ui.postMessage(t);
        break;
      }
      case "update-theme-settings": {
        const t = await R(
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
