var k = Object.defineProperty;
var M = (e, t, a) =>
  t in e ? k(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (e[t] = a);
var b = (e, t, a) => M(e, typeof t != 'symbol' ? t + '' : t, a);
const _ = '9.0.0',
  R = {
    version: _,
  };
async function F() {
  const e = await h('accessToken'),
    t = await h('platform'),
    a = await h('selectedProject'),
    i = await h('agreedPublishChanges');
  figma.ui.postMessage({
    type: 'GET_LOCAL_STORAGE',
    payload: {
      accessToken: e,
      platform: t,
      selectedProject: a,
      agreedPublishChanges: i,
    },
  });
}
async function h(e) {
  return figma.clientStorage.getAsync(e);
}
async function v(e, t) {
  await figma.clientStorage.setAsync(e, t),
    e === 'accessToken' &&
      (await figma.clientStorage.deleteAsync('selectedProject'),
      figma.notify('Access token updated')),
    e === 'platform' &&
      (await figma.clientStorage.deleteAsync('selectedProject'),
      await figma.clientStorage.deleteAsync('accessToken'),
      figma.notify('Platform updated')),
    e === 'selectedProject' && figma.notify('Selected project updated');
}
function j(e) {
  if (e.unit === 'AUTO')
    return {
      unit: 'AUTO',
      value: 0,
      // Default value for AUTO line height
    };
  if (e.unit === 'PERCENT') {
    const t = e.value;
    return {
      unit: 'PERCENT',
      value: t % 1 > 0.9 ? Math.ceil(t) : t,
    };
  }
  return {
    unit: e.unit,
    value: e.value,
  };
}
function V(e, t, a) {
  return `[${e}][${t}][${a}]`.split(' ').join('-');
}
function C(e) {
  const t = {};
  return (
    e.forEach((a) => {
      Object.assign(t, a);
    }),
    t
  );
}
function D({ r: e, g: t, b: a, a: i }) {
  if (i !== 1)
    return `rgba(${[e, t, a].map((s) => Math.round(s * 255)).join(', ')}, ${i.toFixed(4)})`;
  const n = (s) => {
    const c = Math.round(s * 255).toString(16);
    return c.length === 1 ? '0' + c : c;
  };
  return `#${[n(e), n(t), n(a)].join('')}`;
}
function x(e) {
  const t = ['thin'],
    a = ['extralight'],
    i = ['light'],
    n = ['regular'],
    l = ['medium'],
    s = ['semibold'],
    c = ['bold'],
    u = ['extra bold', 'extrabold'],
    f = ['black', 'heavy'],
    r = e.toLowerCase();
  return t.some((o) => r.includes(o))
    ? 100
    : a.some((o) => r.includes(o))
      ? 200
      : i.some((o) => r.includes(o))
        ? 300
        : n.some((o) => r.includes(o))
          ? 400
          : l.some((o) => r.includes(o))
            ? 500
            : s.some((o) => r.includes(o))
              ? 600
              : c.some((o) => r.includes(o))
                ? 700
                : u.some((o) => r.includes(o))
                  ? 800
                  : f.some((o) => r.includes(o))
                    ? 900
                    : 400;
}
function B(e) {
  return !e || typeof e != 'string'
    ? ''
    : e
        .split(/[\s\-_]+/)
        .filter((a) => a.length > 0)
        .map((a) =>
          a
            .split(/(?=[A-Z])/)
            .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
            .join('')
        )
        .join('');
}
async function $(e) {
  try {
    const [t, a] = await Promise.all([
      figma.variables.getVariableByIdAsync(e.id),
      figma.variables
        .getVariableByIdAsync(e.id)
        .then((i) =>
          i ? figma.variables.getVariableCollectionByIdAsync(i.variableCollectionId) : null
        ),
    ]);
    if (t && a)
      return {
        collection: a.name,
        name: t.name,
      };
  } catch (t) {
    console.warn('Failed to resolve variable alias:', t);
  }
  return null;
}
async function U(e, t) {
  if (typeof e == 'object' && e !== null) {
    if ('type' in e && e.type) return await $(e);
    if (t === 'COLOR') return D(e);
  }
  return e;
}
async function T(e, t, a, i, n) {
  const l = n.modes.find((c) => c.modeId === e);
  if (!l) return null;
  const s = await U(t, i);
  return s === null
    ? null
    : {
        collection: n.name,
        mode: l.name,
        name: a,
        type: i.toLowerCase(),
        value: s,
      };
}
async function S(e) {
  try {
    return await figma.variables.getVariableCollectionByIdAsync(e);
  } catch (t) {
    return console.warn(`Failed to get variable collection ${e}:`, t), null;
  }
}
async function O(e) {
  try {
    return await figma.variables.importVariableByKeyAsync(e);
  } catch (t) {
    return console.warn(`Failed to import variable ${e}:`, t), null;
  }
}
async function G(e) {
  const t = e.variableIds.map(async (i) => {
      const n = await figma.variables.getVariableByIdAsync(i);
      if (!n) return {};
      const { valuesByMode: l, name: s, resolvedType: c } = n,
        u = {},
        f = Object.entries(l).map(async ([o, m]) => {
          const y = await T(o, m, s, c, e);
          return y ? { key: V(y.collection, y.mode, y.name), data: y } : null;
        });
      return (
        (await Promise.all(f)).forEach((o) => {
          o && (u[o.key] = o.data);
        }),
        u
      );
    }),
    a = await Promise.all(t);
  return C(a);
}
async function W(e) {
  try {
    const a = (await figma.teamLibrary.getVariablesInLibraryCollectionAsync(e)).map(async (n) => {
        const l = await O(n.key);
        if (!l) return {};
        const { valuesByMode: s, name: c, resolvedType: u, variableCollectionId: f } = l,
          r = await S(f);
        if (!r) return {};
        const o = {},
          m = Object.entries(s).map(async ([g, I]) => {
            const p = await T(g, I, c, u, r);
            return p ? { key: V(p.collection, p.mode, p.name), data: p } : null;
          });
        return (
          (await Promise.all(m)).forEach((g) => {
            g && (o[g.key] = g.data);
          }),
          o
        );
      }),
      i = await Promise.all(a);
    return C(i);
  } catch (t) {
    return console.warn(`Failed to process remote variable collection ${e}:`, t), {};
  }
}
async function K() {
  const e = {},
    t = await figma.getLocalTextStylesAsync();
  for (const a of t) {
    const {
      name: i,
      fontName: { family: n, style: l },
      fontSize: s,
      lineHeight: c,
      letterSpacing: u,
      textCase: f,
      textDecoration: r,
    } = a;
    e[i] = {
      variableName: i,
      fontFamily: n,
      fontSize: s,
      fontWeight: {
        value: x(l),
        alias: l,
      },
      lineHeight: j(c),
      letterSpacing: u,
      textCase: f,
      textDecoration: r,
    };
  }
  return e;
}
async function Y() {
  const e = {},
    t = await figma.getLocalEffectStylesAsync();
  for (const { name: a, effects: i } of t)
    e[a] = {
      variableName: a,
      effects: i.map((n) => ({
        type: n.type,
        color: n.color,
        offset: n.offset,
        radius: 'radius' in n ? n.radius : 0,
        spread: n.spread || 0,
      })),
    };
  return e;
}
async function H() {
  const e = {},
    a = (await figma.variables.getLocalVariableCollectionsAsync()).filter(
      (i) => i.name !== 'ID variables'
    );
  for (const i of a) Object.assign(e, await G(i));
  return e;
}
async function z() {
  return await K();
}
async function J() {
  return await Y();
}
async function Z() {
  const e = await H(),
    t = await z(),
    a = await J();
  return C([e, t, a]);
}
const q = {
  'ui kit': 'ui-kit',
  tokens: 'tokens',
  themes: 'themes',
};
async function Q(e) {
  const t = await Z(),
    a = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(),
    i = {};
  for (const r of a)
    i[r.libraryName] || (i[r.libraryName] = []),
      i[r.libraryName].push({
        value: r.key,
        name: r.name,
      });
  const n = Object.fromEntries(
      Object.entries(i).filter(([, r]) =>
        r == null
          ? void 0
          : r.some((o) => {
              const m = o.name.toLowerCase();
              return Object.keys(q).some((y) => m.includes(y.toLowerCase()));
            })
      )
    ),
    l = Object.entries(n).map(async ([, r]) => {
      const [o, m, y] = await X(r);
      return { variables: o, filetype: m, themeName: y };
    }),
    s = await Promise.all(l);
  let c = {};
  const u = {};
  for (const { variables: r, filetype: o, themeName: m } of s)
    o === 'tokens' ? (c = r) : o === 'themes' && m && (u[m] = r);
  const f = {
    type: 'RECURSICA_VARIABLES',
    payload: {
      pluginVersion: e,
      tokens: c,
      themes: u,
      uiKit: t,
    },
  };
  return console.log(f), figma.ui.postMessage(f), i;
}
async function X(e) {
  const t = e.filter((c) => c.name !== 'ID variables'),
    a = await Promise.all(t.map((c) => W(c.value))),
    i = C(a),
    n = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(e[0].value),
    l = await O(n[0].key),
    s = await S(l.variableCollectionId);
  return e.length > 0
    ? [
        i,
        (s == null ? void 0 : s.getSharedPluginData('recursica', 'file-type')) || 'unknown',
        (s == null ? void 0 : s.getSharedPluginData('recursica', 'theme-name')) || void 0,
      ]
    : [i, 'icons', void 0];
}
async function ee(e, t) {
  const a = e.map(async (i) => {
    const n = i.variableIds.map(async (l) => {
      const s = await figma.variables.getVariableByIdAsync(l);
      if (!s) return null;
      const c = Object.entries(s.valuesByMode).map(async ([u, f]) => {
        if (typeof f == 'object' && f !== null && 'type' in f) {
          const r = await figma.variables.getVariableByIdAsync(f.id);
          if (r) {
            const o = t.get(r.name);
            if (r.remote && o && o.key !== r.key) {
              console.log(`syncing ${r.name} to ${o.name}`);
              const m = {
                type: 'VARIABLE_ALIAS',
                id: o.id,
              };
              figma.variables.getVariableCollectionByIdAsync(o.variableCollectionId),
                s.setValueForMode(u, m);
            }
          }
        }
      });
      return await Promise.all(c), s;
    });
    return Promise.all(n);
  });
  await Promise.all(a),
    figma.ui.postMessage({
      type: 'SYNC_VARIABLES_COMPLETE',
    });
}
async function te(e, t, a) {
  const i = e.map(async (n) => {
    if (
      (n.setSharedPluginData('recursica', 'file-type', t),
      n.setSharedPluginData('recursica', 'variables-synced', 'true'),
      t === 'themes')
    ) {
      const l = figma.root.name.replace(/[^a-zA-Z\s]/g, '').replace(/\d+/g, ''),
        s = a || B(l);
      n.setSharedPluginData('recursica', 'theme-name', s);
    }
  });
  await Promise.all(i),
    figma.ui.postMessage({
      type: 'GENERATE_METADATA_COMPLETE',
    });
}
function N(e) {
  if ('visible' in e && !e.visible) return !1;
  if (e.type === 'VECTOR') {
    const t = e,
      a = t.fills,
      i = Array.isArray(a) && a.length > 0,
      n = t.strokes,
      l = Array.isArray(n) && n.length > 0;
    return i || l;
  }
  return 'children' in e ? e.children.some((t) => N(t)) : !0;
}
async function ae(e) {
  var t, a;
  try {
    if (!N(e))
      return console.warn(`Component "${e.name}" has no visible content, skipping export`), null;
    const i = await e.exportAsync({ format: 'SVG' });
    if (!i || i.length === 0)
      return console.warn(`Component "${e.name}" exported empty SVG, skipping`), null;
    const n = String.fromCharCode.apply(null, Array.from(i)).replace(/fill="#[0-9A-Fa-f]{6}"/g, '');
    return !n.trim() || n.length < 50
      ? (console.warn(`Component "${e.name}" produced invalid SVG content, skipping`), null)
      : n;
  } catch (i) {
    return (
      console.error(
        `Failed to export component "${(t = e.parent) == null ? void 0 : t.name}[${e.name}]":`,
        i
      ),
      figma.notify(
        `Failed to export component "${(a = e.parent) == null ? void 0 : a.name}[${e.name}]":
 ${i}`,
        {
          timeout: 1 / 0,
        }
      ),
      null
    );
  }
}
async function L(e, t) {
  var a, i;
  if (
    e.type === 'VECTOR' &&
    ((a = e.parent) == null ? void 0 : a.type) === 'COMPONENT' &&
    ((i = e.parent.parent) == null ? void 0 : i.type) === 'COMPONENT_SET'
  ) {
    const n = e.parent,
      l = await ae(n);
    if (l) {
      const s = `${e.parent.parent.name}[${e.parent.name}]`;
      t[s] || (t[s] = l);
    }
  }
  'children' in e && (await Promise.all(e.children.map((n) => L(n, t))));
}
async function ie() {
  const e = {};
  try {
    console.log('Starting icon export from current page...'), await L(figma.currentPage, e);
    const t = Object.keys(e).length;
    console.log(`Icon export completed. Found ${t} valid icons.`);
    const a = {
      type: 'SVG_ICONS',
      payload: e,
    };
    return t > 0
      ? (console.log('svgIcons', e), figma.ui.postMessage(a), e)
      : (console.warn('No valid icons found for export'), figma.ui.postMessage(a), e);
  } catch (t) {
    return (
      console.error('Error during icon export:', t),
      figma.ui.postMessage({
        type: 'SVG_ICONS',
        payload: e,
        // Return whatever we managed to collect
      }),
      e
    );
  }
}
class A extends Error {
  constructor(t) {
    super(t), (this.name = 'PluginError'), figma.notify(t), figma.closePlugin();
  }
}
const d = class d {
  constructor() {
    b(this, 'cachedResult', null);
    b(this, 'isDetecting', !1);
    b(this, 'detectionPromise', null);
  }
  static getInstance() {
    return d.instance || (d.instance = new d()), d.instance;
  }
  /**
   * Detects the file type from local variable collections and falls back to icon detection if needed.
   *
   * This function analyzes collection names to determine the project type and extracts
   * theme information. It uses pattern matching on collection names to classify the file.
   *
   * File type detection priority:
   * 1. 'tokens' - if any collection contains 'tokens' in the name
   * 2. 'themes' - if any collection contains 'themes' in the name
   * 3. 'ui-kit' - if any collection contains 'ui kit' or 'uikit' in the name
   * 4. 'icons' - if no collections found, checks for icons in pages
   *
   * Theme name extraction:
   * - Looks for an "ID variables" collection
   * - Searches for a variable named 'theme' within that collection
   * - Extracts the first mode value as the theme name
   *
   * @returns Promise resolving to an object containing:
   *   - fileType: The detected file type ('themes', 'ui-kit', 'tokens', 'icons')
   *   - themeName: The extracted theme name (empty string if not found)
   *
   * @throws Error if no file type can be determined
   *
   * @example
   * const { fileType, themeName } = await detectFiletype();
   * // fileType: 'themes', themeName: 'DarkTheme'
   */
  async detectFiletypeInternal() {
    const t = await figma.variables.getLocalVariableCollectionsAsync();
    let a,
      i = '';
    if (t.length > 0) {
      const n = t.find((u) => u.name.toLowerCase().includes('tokens')),
        l = t.find((u) => u.name.toLowerCase().includes('themes')),
        s = t.find(
          (u) => u.name.toLowerCase().includes('ui kit') || u.name.toLowerCase().includes('uikit')
        );
      n ? (a = 'tokens') : l ? (a = 'themes') : s && (a = 'ui-kit');
      const c = t.find((u) => u.name === 'ID variables');
      if (c)
        for (const u of c.variableIds) {
          const f = await figma.variables.getVariableByIdAsync(u);
          if (f) {
            if (f.name === 'project-type') {
              const r = Object.values(f.valuesByMode)[0];
              typeof r == 'string' && (a = r);
              continue;
            }
            if (f.name === 'theme') {
              const r = Object.values(f.valuesByMode)[0];
              typeof r == 'string' && (i = r);
              continue;
            }
          }
        }
    }
    if (a === void 0 || a === 'icons') {
      let n = !1;
      for (const l of figma.root.children)
        if (l.type === 'PAGE') {
          await figma.setCurrentPageAsync(l);
          const s = await ie();
          if (s && Object.keys(s).length > 0) {
            n = !0;
            break;
          }
        }
      if (!n)
        throw new A('This is not a recursica file: no variable collections or icons detected.');
      a = 'icons';
    }
    if (!a) throw new A('This is not a recursica file: no variable collections or icons detected.');
    return { fileType: a, themeName: i };
  }
  /**
   * Gets the filetype and theme name, using cached results if available.
   * If not cached, performs detection and caches the result.
   *
   * @returns Promise resolving to the filetype result
   */
  async getFiletype() {
    if (this.cachedResult) return this.cachedResult;
    if (this.isDetecting && this.detectionPromise) return this.detectionPromise;
    (this.isDetecting = !0), (this.detectionPromise = this.detectFiletypeInternal());
    try {
      const t = await this.detectionPromise;
      return (this.cachedResult = t), t;
    } finally {
      (this.isDetecting = !1), (this.detectionPromise = null);
    }
  }
  /**
   * Clears the cached filetype result, forcing a new detection on next call.
   */
  clearCache() {
    this.cachedResult = null;
  }
  /**
   * Gets the cached filetype result without performing detection.
   * Returns null if no cached result is available.
   *
   * @returns Cached filetype result or null
   */
  getCachedFiletype() {
    return this.cachedResult;
  }
};
b(d, 'instance');
let E = d;
const ne = E.getInstance();
async function w() {
  return ne.getFiletype();
}
function se(e, t) {
  if (t === 'themes') {
    const a = Object.values(e).filter((n) => n.name.toLowerCase().includes('tokens')),
      i = a.every((n) => n.getSharedPluginData('recursica', 'variables-synced') === 'true');
    if (a.length === 0)
      return {
        isValid: !1,
        errorMessage: 'NO_TOKENS_FOUND',
      };
    if (!i)
      return {
        isValid: !1,
        errorMessage: 'TOKENS_NOT_CONNECTED',
      };
  }
  if (t === 'ui-kit') {
    const a = Object.values(e).filter((s) => s.name.toLowerCase().includes('tokens')),
      i = a.every((s) => s.getSharedPluginData('recursica', 'variables-synced') === 'true'),
      n = Object.values(e).filter((s) => s.name.toLowerCase().includes('themes')),
      l = n.every((s) => s.getSharedPluginData('recursica', 'variables-synced') === 'true');
    if (a.length === 0)
      return {
        isValid: !1,
        errorMessage: 'NO_TOKENS_FOUND',
      };
    if (!i)
      return {
        isValid: !1,
        errorMessage: 'TOKENS_NOT_CONNECTED',
      };
    if (n.length === 0)
      return {
        isValid: !1,
        errorMessage: 'NO_THEMES_FOUND',
      };
    if (!l)
      return {
        isValid: !1,
        errorMessage: 'THEMES_NOT_CONNECTED',
      };
  }
  return { isValid: !0 };
}
async function re(e) {
  const t = {},
    a = e.map(async (s) => {
      const u = (await figma.teamLibrary.getVariablesInLibraryCollectionAsync(s.key)).map(
        async (f) => {
          const r = await figma.variables.importVariableByKeyAsync(f.key);
          if (!t[s.key]) {
            const o = await figma.variables.getVariableCollectionByIdAsync(r.variableCollectionId);
            o && (t[s.key] = o);
          }
          return r;
        }
      );
      return Promise.all(u);
    }),
    n = (await Promise.all(a)).flat(),
    l = new Map(n.map((s) => [s.name, s]));
  return {
    collections: t,
    remoteVariables: l,
  };
}
function oe(e) {
  return e.filter((a) => a.getSharedPluginData('recursica', 'variables-synced') !== 'true');
}
async function le() {
  const e = await figma.variables.getLocalVariableCollectionsAsync(),
    t = oe(e),
    { fileType: a, themeName: i } = await w();
  if (t.length > 0) {
    const { collections: n, remoteVariables: l } = await re(
        await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
      ),
      s = se(n, a);
    if (!s.isValid)
      return figma.ui.postMessage({
        type: s.errorMessage,
      });
    await ee(t, l), await te(t, a, i);
  } else
    figma.ui.postMessage({
      type: 'SYNC_VARIABLES_COMPLETE',
    }),
      figma.ui.postMessage({
        type: 'GENERATE_METADATA_COMPLETE',
      });
}
const P = R.version;
console.log('Running in', 'development', 'mode');
figma.showUI(__html__, {
  width: 370,
  height: 350,
});
figma.ui.onmessage = async (e) => {
  var t;
  if (
    (e.type === 'GET_LOCAL_STORAGE' && F(),
    e.type === 'GET_CURRENT_USER' &&
      figma.ui.postMessage({
        type: 'CURRENT_USER',
        payload: (t = figma.currentUser) == null ? void 0 : t.id,
      }),
    e.type === 'UPDATE_ACCESS_TOKEN' && v('accessToken', e.payload),
    e.type === 'UPDATE_PLATFORM' && v('platform', e.payload),
    e.type === 'UPDATE_SELECTED_PROJECT' && v('selectedProject', e.payload),
    e.type === 'UPDATE_AGREED_PUBLISH_CHANGES' && v('agreedPublishChanges', e.payload),
    e.type === 'GET_VARIABLES')
  ) {
    const { fileType: a } = await w();
    a === 'ui-kit' && Q(P);
  }
  if ((e.type === 'SYNC_TOKENS' && le(), e.type === 'GET_FILETYPE'))
    try {
      const { fileType: a, themeName: i } = await w();
      figma.ui.postMessage({
        type: 'FILETYPE_DETECTED',
        payload: {
          fileType: a,
          themeName: i,
          pluginVersion: P,
        },
      });
    } catch (a) {
      figma.ui.postMessage({
        type: 'FILETYPE_ERROR',
        payload: {
          error: a instanceof Error ? a.message : 'Unknown error occurred',
        },
      });
    }
  e.type === 'CLOSE_PLUGIN' && figma.closePlugin();
};
