const S = '0.0.4',
  L = {
    version: S,
  };
async function k(e) {
  const t = (await figma.variables.getLocalVariableCollectionsAsync())[0].getSharedPluginData(
    'recursica',
    'file-type'
  );
  return (
    figma.ui.postMessage({
      type: 'METADATA',
      payload: {
        projectType: t,
        pluginVersion: e,
      },
    }),
    t
  );
}
async function O() {
  const e = await h('accessToken'),
    a = await h('platform'),
    t = await h('selectedProject');
  figma.ui.postMessage({
    type: 'GET_LOCAL_STORAGE',
    payload: {
      accessToken: e,
      platform: a,
      selectedProject: t,
    },
  });
}
async function h(e) {
  return figma.clientStorage.getAsync(e);
}
async function w(e, a) {
  await figma.clientStorage.setAsync(e, a),
    e === 'accessToken' &&
      (await figma.clientStorage.deleteAsync('selectedProject'),
      figma.notify('Access token updated')),
    e === 'platform' &&
      (await figma.clientStorage.deleteAsync('selectedProject'),
      await figma.clientStorage.deleteAsync('accessToken'),
      figma.notify('Platform updated')),
    e === 'selectedProject' && figma.notify('Selected project updated');
}
function N(e) {
  if (e.unit === 'AUTO')
    return {
      unit: 'AUTO',
      value: 0,
      // Default value for AUTO line height
    };
  if (e.unit === 'PERCENT') {
    const a = e.value;
    return {
      unit: 'PERCENT',
      value: a % 1 > 0.9 ? Math.ceil(a) : a,
    };
  }
  return {
    unit: e.unit,
    value: e.value,
  };
}
function C(e, a, t) {
  return `[${e}][${a}][${t}]`.split(' ').join('-');
}
function g(e) {
  const a = {};
  return (
    e.forEach((t) => {
      Object.assign(a, t);
    }),
    a
  );
}
function _({ r: e, g: a, b: t, a: s }) {
  if (s !== 1)
    return `rgba(${[e, a, t].map((l) => Math.round(l * 255)).join(', ')}, ${s.toFixed(4)})`;
  const o = (l) => {
    const u = Math.round(l * 255).toString(16);
    return u.length === 1 ? '0' + u : u;
  };
  return `#${[o(e), o(a), o(t)].join('')}`;
}
function I(e) {
  const a = ['thin'],
    t = ['extralight'],
    s = ['light'],
    o = ['regular'],
    r = ['medium'],
    l = ['semibold'],
    u = ['bold'],
    c = ['extra bold', 'extrabold'],
    m = ['black', 'heavy'],
    n = e.toLowerCase();
  return a.some((i) => n.includes(i))
    ? 100
    : t.some((i) => n.includes(i))
      ? 200
      : s.some((i) => n.includes(i))
        ? 300
        : o.some((i) => n.includes(i))
          ? 400
          : r.some((i) => n.includes(i))
            ? 500
            : l.some((i) => n.includes(i))
              ? 600
              : u.some((i) => n.includes(i))
                ? 700
                : c.some((i) => n.includes(i))
                  ? 800
                  : m.some((i) => n.includes(i))
                    ? 900
                    : 400;
}
function R(e) {
  return !e || typeof e != 'string'
    ? ''
    : e
        .split(/[\s\-_]+/)
        .filter((t) => t.length > 0)
        .map((t) =>
          t
            .split(/(?=[A-Z])/)
            .map((o) => o.charAt(0).toUpperCase() + o.slice(1).toLowerCase())
            .join('')
        )
        .join('');
}
async function j(e) {
  try {
    const [a, t] = await Promise.all([
      figma.variables.getVariableByIdAsync(e.id),
      figma.variables
        .getVariableByIdAsync(e.id)
        .then((s) =>
          s ? figma.variables.getVariableCollectionByIdAsync(s.variableCollectionId) : null
        ),
    ]);
    if (a && t)
      return {
        collection: t.name,
        name: a.name,
      };
  } catch (a) {
    console.warn('Failed to resolve variable alias:', a);
  }
  return null;
}
async function M(e, a) {
  if (typeof e == 'object' && e !== null) {
    if ('type' in e && e.type) return await j(e);
    if (a === 'COLOR') return _(e);
  }
  return e;
}
async function A(e, a, t, s, o) {
  const r = o.modes.find((u) => u.modeId === e);
  if (!r) return null;
  const l = await M(a, s);
  return l === null
    ? null
    : {
        collection: o.name,
        mode: r.name,
        name: t,
        type: s.toLowerCase(),
        value: l,
      };
}
async function T(e) {
  try {
    return await figma.variables.getVariableCollectionByIdAsync(e);
  } catch (a) {
    return console.warn(`Failed to get variable collection ${e}:`, a), null;
  }
}
async function V(e) {
  try {
    return await figma.variables.importVariableByKeyAsync(e);
  } catch (a) {
    return console.warn(`Failed to import variable ${e}:`, a), null;
  }
}
async function F(e) {
  const a = e.variableIds.map(async (s) => {
      const o = await figma.variables.getVariableByIdAsync(s);
      if (!o) return {};
      const { valuesByMode: r, name: l, resolvedType: u } = o,
        c = {},
        m = Object.entries(r).map(async ([i, f]) => {
          const y = await A(i, f, l, u, e);
          return y ? { key: C(y.collection, y.mode, y.name), data: y } : null;
        });
      return (
        (await Promise.all(m)).forEach((i) => {
          i && (c[i.key] = i.data);
        }),
        c
      );
    }),
    t = await Promise.all(a);
  return g(t);
}
async function B(e) {
  try {
    const t = (await figma.teamLibrary.getVariablesInLibraryCollectionAsync(e)).map(async (o) => {
        const r = await V(o.key);
        if (!r) return {};
        const { valuesByMode: l, name: u, resolvedType: c, variableCollectionId: m } = r,
          n = await T(m);
        if (!n) return {};
        const i = {},
          f = Object.entries(l).map(async ([d, b]) => {
            const p = await A(d, b, u, c, n);
            return p ? { key: C(p.collection, p.mode, p.name), data: p } : null;
          });
        return (
          (await Promise.all(f)).forEach((d) => {
            d && (i[d.key] = d.data);
          }),
          i
        );
      }),
      s = await Promise.all(t);
    return g(s);
  } catch (a) {
    return console.warn(`Failed to process remote variable collection ${e}:`, a), {};
  }
}
async function x() {
  const e = {},
    a = await figma.getLocalTextStylesAsync();
  for (const t of a) {
    const {
      name: s,
      fontName: { family: o, style: r },
      fontSize: l,
      lineHeight: u,
      letterSpacing: c,
      textCase: m,
      textDecoration: n,
    } = t;
    e[s] = {
      variableName: s,
      fontFamily: o,
      fontSize: l,
      fontWeight: {
        value: I(r),
        alias: r,
      },
      lineHeight: N(u),
      letterSpacing: c,
      textCase: m,
      textDecoration: n,
    };
  }
  return e;
}
async function U() {
  const e = {},
    a = await figma.getLocalEffectStylesAsync();
  for (const { name: t, effects: s } of a)
    e[t] = {
      variableName: t,
      effects: s.map((o) => ({
        type: o.type,
        color: o.color,
        offset: o.offset,
        radius: 'radius' in o ? o.radius : 0,
        spread: o.spread || 0,
      })),
    };
  return e;
}
async function D() {
  const e = await figma.variables.getLocalVariableCollectionsAsync();
  let a = 'icons';
  if (e.length > 0) {
    const c = e.find((i) => i.name.toLowerCase().includes('tokens')),
      m = e.find((i) => i.name.toLowerCase().includes('themes')),
      n = e.find(
        (i) => i.name.toLowerCase().includes('ui kit') || i.name.toLowerCase().includes('uikit')
      );
    c ? (a = 'tokens') : m ? (a = 'themes') : n && (a = 'ui-kit');
  }
  const t = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  if (a === 'themes' && !t.some((m) => m.name.toLowerCase().includes('tokens')))
    return figma.ui.postMessage({
      type: 'NO_TOKENS_FOUND',
    });
  if (a === 'ui-kit') {
    const c = t.some((n) => n.name.toLowerCase().includes('tokens')),
      m = t.some((n) => n.name.toLowerCase().includes('themes'));
    (!c || !m) &&
      figma.ui.postMessage({
        type: 'NO_TOKENS_OR_THEMES_FOUND',
      });
  }
  t.length === 0 &&
    figma.notify('No libraries connected to this project', {
      timeout: 5e3,
    });
  const s = t.map(async (c) => {
      const n = (await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key)).map((i) =>
        figma.variables.importVariableByKeyAsync(i.key)
      );
      return Promise.all(n);
    }),
    r = (await Promise.all(s)).flat(),
    l = new Map(r.map((c) => [c.name, c])),
    u = e.map(async (c) => {
      c.setSharedPluginData('recursica', 'file-type', a),
        a === 'themes' && c.setSharedPluginData('recursica', 'theme-name', R(figma.root.name));
      const m = c.variableIds.map(async (n) => {
        const i = await figma.variables.getVariableByIdAsync(n);
        if (!i) return null;
        const f = Object.entries(i.valuesByMode).map(async ([y, d]) => {
          if (typeof d == 'object' && d !== null && 'type' in d) {
            const b = await figma.variables.getVariableByIdAsync(d.id);
            if (b) {
              const p = l.get(b.name);
              if (b.remote && p && p.key !== b.key) {
                console.log(`syncing ${b.name} to ${p.name}`);
                const v = {
                  type: 'VARIABLE_ALIAS',
                  id: p.id,
                };
                i.setValueForMode(y, v);
              }
            }
          }
        });
        return await Promise.all(f), i;
      });
      return Promise.all(m);
    });
  await Promise.all(u),
    figma.ui.postMessage({
      type: 'SYNC_TOKENS_COMPLETE',
    });
}
async function W() {
  const e = {},
    a = await figma.variables.getLocalVariableCollectionsAsync();
  for (const t of a) Object.assign(e, await F(t));
  return e;
}
async function $() {
  return await x();
}
async function G() {
  return await U();
}
async function K() {
  const e = await W(),
    a = await $(),
    t = await G();
  return g([e, a, t]);
}
const Y = {
  'ui kit': 'ui-kit',
  tokens: 'tokens',
  themes: 'themes',
};
async function H(e) {
  const a = await K(),
    t = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(),
    s = {};
  for (const n of t)
    s[n.libraryName] || (s[n.libraryName] = []),
      s[n.libraryName].push({
        value: n.key,
        name: n.name,
      });
  const o = Object.fromEntries(
      Object.entries(s).filter(([, n]) =>
        n == null
          ? void 0
          : n.some((i) => {
              const f = i.name.toLowerCase();
              return Object.keys(Y).some((y) => f.includes(y.toLowerCase()));
            })
      )
    ),
    r = Object.entries(o).map(async ([, n]) => {
      const [i, f, y] = await J(n);
      return { variables: i, filetype: f, themeName: y };
    }),
    l = await Promise.all(r);
  let u = {};
  const c = {};
  for (const { variables: n, filetype: i, themeName: f } of l)
    i === 'tokens' ? (u = n) : i === 'themes' && f && (c[f] = n);
  const m = {
    type: 'RECURSICA_VARIABLES',
    payload: {
      pluginVersion: e,
      tokens: u,
      themes: c,
      uiKit: a,
    },
  };
  return console.log(m), figma.ui.postMessage(m), s;
}
async function J(e) {
  const a = await Promise.all(e.map((l) => B(l.value))),
    t = g(a),
    s = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(e[0].value),
    o = await V(s[0].key),
    r = await T(o.variableCollectionId);
  return e.length === 1
    ? [
        t,
        (r == null ? void 0 : r.getSharedPluginData('recursica', 'file-type')) || 'unknown',
        (r == null ? void 0 : r.getSharedPluginData('recursica', 'theme-name')) || void 0,
      ]
    : [t, 'icons', void 0];
}
async function E(e, a) {
  var t, s;
  if (
    e.type === 'VECTOR' &&
    ((t = e.parent) == null ? void 0 : t.type) === 'COMPONENT' &&
    ((s = e.parent.parent) == null ? void 0 : s.type) === 'COMPONENT_SET'
  ) {
    const o = await e.parent.exportAsync({ format: 'SVG' }),
      r = String.fromCharCode.apply(null, Array.from(o)).replace(/fill="#[0-9A-Fa-f]{6}"/g, ''),
      l = `${e.parent.parent.name}[${e.parent.name}]`;
    a[l] || (a[l] = r);
  }
  'children' in e && (await Promise.all(e.children.map((o) => E(o, a))));
}
async function z() {
  const e = {};
  await E(figma.currentPage, e);
  const a = {
    type: 'SVG_ICONS',
    payload: e,
  };
  console.log(a), figma.ui.postMessage(a);
}
const P = L.version;
figma.showUI(__html__, {
  width: 370,
  height: 350,
});
const Z = k(P);
async function q() {
  const e = await Z;
  e === 'icons' && z(), e === 'ui-kit' && H(P);
}
figma.ui.onmessage = async (e) => {
  var a;
  e.type === 'GET_LOCAL_STORAGE' && O(),
    e.type === 'GET_CURRENT_USER' &&
      figma.ui.postMessage({
        type: 'CURRENT_USER',
        payload: (a = figma.currentUser) == null ? void 0 : a.id,
      }),
    e.type === 'UPDATE_ACCESS_TOKEN' && w('accessToken', e.payload),
    e.type === 'UPDATE_PLATFORM' && w('platform', e.payload),
    e.type === 'UPDATE_SELECTED_PROJECT' && w('selectedProject', e.payload),
    e.type === 'GET_VARIABLES' && q(),
    e.type === 'SYNC_TOKENS' && D(),
    e.type === 'CLOSE_PLUGIN' && figma.closePlugin();
};
