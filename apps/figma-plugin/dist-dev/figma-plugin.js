const S = '0.0.2',
  O = {
    version: S,
  };
class b extends Error {
  constructor(t) {
    super(t), (this.name = 'PluginError'), figma.notify(t), figma.closePlugin();
  }
}
const C = ['ui-kit', 'themes', 'tokens', 'icons'],
  E = 'ID variables';
function R(e) {
  return C.includes(e);
}
async function N(e) {
  const t = {},
    o = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (a) => a.name.toLowerCase() === E.toLowerCase()
    );
  if (!o) throw new b('Cannot execute the plugin because the metadata collection is missing.');
  for (const a of o.variableIds) {
    const s = await figma.variables.getVariableByIdAsync(a);
    if (!s) continue;
    const { valuesByMode: r, name: c } = s,
      u = r[o.defaultModeId];
    if (
      typeof u == 'string' &&
      (c === 'project-id' && (t.projectId = u),
      c === 'theme' && (t.theme = u),
      c === 'project-type')
    ) {
      if (!R(u)) throw new b(`Project type invalid, must be ${C.join(',')}.`);
      t.projectType = u;
    }
  }
  if (!t.projectId) throw new b('Missing project id in metadata');
  if (t.projectType === 'themes' && !t.theme) throw new b('Missing theme name in metadata');
  if (!t.projectType) throw new b('Missing project type in metadata');
  return (
    figma.ui.postMessage({
      type: 'METADATA',
      payload: {
        projectId: t.projectId,
        projectType: t.projectType,
        theme: t.theme,
        pluginVersion: e,
      },
    }),
    t
  );
}
async function M() {
  const e = await w('accessToken'),
    t = await w('platform'),
    n = await w('selectedProject');
  figma.ui.postMessage({
    type: 'GET_LOCAL_STORAGE',
    payload: {
      accessToken: e,
      platform: t,
      selectedProject: n,
    },
  });
}
async function w(e) {
  return figma.clientStorage.getAsync(e);
}
async function A(e, t) {
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
function F(e) {
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
function j(e, t, n) {
  return `[${e}][${t}][${n}]`.split(' ').join('-');
}
function v(e) {
  const t = {};
  return (
    e.forEach((n) => {
      Object.assign(t, n);
    }),
    t
  );
}
function _({ r: e, g: t, b: n, a: o }) {
  if (o !== 1)
    return `rgba(${[e, t, n].map((r) => Math.round(r * 255)).join(', ')}, ${o.toFixed(4)})`;
  const a = (r) => {
    const c = Math.round(r * 255).toString(16);
    return c.length === 1 ? '0' + c : c;
  };
  return `#${[a(e), a(t), a(n)].join('')}`;
}
function x(e) {
  const t = ['thin'],
    n = ['extralight'],
    o = ['light'],
    a = ['regular'],
    s = ['medium'],
    r = ['semibold'],
    c = ['bold'],
    u = ['extra bold', 'extrabold'],
    y = ['black', 'heavy'],
    l = e.toLowerCase();
  return t.some((i) => l.includes(i))
    ? 100
    : n.some((i) => l.includes(i))
      ? 200
      : o.some((i) => l.includes(i))
        ? 300
        : a.some((i) => l.includes(i))
          ? 400
          : s.some((i) => l.includes(i))
            ? 500
            : r.some((i) => l.includes(i))
              ? 600
              : c.some((i) => l.includes(i))
                ? 700
                : u.some((i) => l.includes(i))
                  ? 800
                  : y.some((i) => l.includes(i))
                    ? 900
                    : 400;
}
async function k(e) {
  try {
    const [t, n] = await Promise.all([
      figma.variables.getVariableByIdAsync(e.id),
      figma.variables
        .getVariableByIdAsync(e.id)
        .then((o) =>
          o ? figma.variables.getVariableCollectionByIdAsync(o.variableCollectionId) : null
        ),
    ]);
    if (t && n)
      return {
        collection: n.name,
        name: t.name,
      };
  } catch (t) {
    console.warn('Failed to resolve variable alias:', t);
  }
  return null;
}
async function B(e, t) {
  if (typeof e == 'object' && e !== null) {
    if ('type' in e && e.type) return await k(e);
    if (t === 'COLOR') return _(e);
  }
  return e;
}
async function P(e, t, n, o, a) {
  const s = a.modes.find((c) => c.modeId === e);
  if (!s) return null;
  const r = await B(t, o);
  return r === null
    ? null
    : {
        collection: a.name,
        mode: s.name,
        name: n,
        type: o.toLowerCase(),
        value: r,
      };
}
async function D(e) {
  try {
    return await figma.variables.getVariableCollectionByIdAsync(e);
  } catch (t) {
    return console.warn(`Failed to get variable collection ${e}:`, t), null;
  }
}
async function W(e) {
  try {
    return await figma.variables.importVariableByKeyAsync(e);
  } catch (t) {
    return console.warn(`Failed to import variable ${e}:`, t), null;
  }
}
async function $(e) {
  const t = e.variableIds.map(async (o) => {
      const a = await figma.variables.getVariableByIdAsync(o);
      if (!a) return {};
      const { valuesByMode: s, name: r, resolvedType: c } = a,
        u = {},
        y = Object.entries(s).map(async ([i, f]) => {
          const m = await P(i, f, r, c, e);
          return m ? { key: j(m.collection, m.mode, m.name), data: m } : null;
        });
      return (
        (await Promise.all(y)).forEach((i) => {
          i && (u[i.key] = i.data);
        }),
        u
      );
    }),
    n = await Promise.all(t);
  return v(n);
}
async function G(e) {
  try {
    const n = (await figma.teamLibrary.getVariablesInLibraryCollectionAsync(e)).map(async (a) => {
        const s = await W(a.key);
        if (!s) return {};
        const { valuesByMode: r, name: c, resolvedType: u, variableCollectionId: y } = s,
          l = await D(y);
        if (!l) return {};
        const i = {},
          f = Object.entries(r).map(async ([d, g]) => {
            const p = await P(d, g, c, u, l);
            return p ? { key: j(p.collection, p.mode, p.name), data: p } : null;
          });
        return (
          (await Promise.all(f)).forEach((d) => {
            d && (i[d.key] = d.data);
          }),
          i
        );
      }),
      o = await Promise.all(n);
    return v(o);
  } catch (t) {
    return console.warn(`Failed to process remote variable collection ${e}:`, t), {};
  }
}
async function U() {
  const e = {},
    t = await figma.getLocalTextStylesAsync();
  for (const n of t) {
    const {
      name: o,
      fontName: { family: a, style: s },
      fontSize: r,
      lineHeight: c,
      letterSpacing: u,
      textCase: y,
      textDecoration: l,
    } = n;
    e[o] = {
      variableName: o,
      fontFamily: a,
      fontSize: r,
      fontWeight: {
        value: x(s),
        alias: s,
      },
      lineHeight: F(c),
      letterSpacing: u,
      textCase: y,
      textDecoration: l,
    };
  }
  return e;
}
async function K() {
  const e = {},
    t = await figma.getLocalEffectStylesAsync();
  for (const { name: n, effects: o } of t)
    e[n] = {
      variableName: n,
      effects: o.map((a) => ({
        type: a.type,
        color: a.color,
        offset: a.offset,
        radius: 'radius' in a ? a.radius : 0,
        spread: a.spread || 0,
      })),
    };
  return e;
}
async function J() {
  const e = {},
    t = await figma.variables.getLocalVariableCollectionsAsync();
  for (const n of t) n.name.toLowerCase() !== E.toLowerCase() && Object.assign(e, await $(n));
  return e;
}
async function z() {
  return await U();
}
async function H() {
  return await K();
}
async function q() {
  const e = await J(),
    t = await z(),
    n = await H();
  return v([e, t, n]);
}
async function Q(e, t) {
  var i;
  const n = await q(),
    o = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync(),
    a = {};
  for (const f of o)
    a[f.libraryName] || (a[f.libraryName] = []),
      a[f.libraryName].push({
        value: f.key,
        name: f.name,
      });
  const r = Object.keys(a)
      .filter((f) => {
        const m = a == null ? void 0 : a[f];
        return m == null ? void 0 : m.some((d) => d.name === 'ID variables');
      })
      .map(async (f) => {
        var h;
        const m = a == null ? void 0 : a[f],
          [d, g] = await X(m),
          p =
            (h = Object.values(g).find((L) => L.name === 'project-type')) == null
              ? void 0
              : h.value;
        return { variables: d, metadata: g, filetype: p };
      }),
    c = await Promise.all(r);
  let u = {};
  const y = {};
  for (const { variables: f, metadata: m, filetype: d } of c)
    if (d === 'tokens') u = f;
    else if (d === 'themes') {
      const g = (i = Object.values(m).find((p) => p.name === 'theme')) == null ? void 0 : i.value;
      g && (y[g] = f);
    }
  const l = {
    type: 'RECURSICA_VARIABLES',
    payload: {
      projectId: e,
      pluginVersion: t,
      tokens: u,
      themes: y,
      uiKit: n,
    },
  };
  return console.log(l), figma.ui.postMessage(l), a;
}
async function X(e) {
  const t = e.find((r) => r.name === 'ID variables');
  if (!t) return figma.notify('No metadata collection found'), [{}, {}];
  const n = e.filter((r) => r.name !== 'ID variables'),
    [o, ...a] = await Promise.all([T(t.value), ...n.map((r) => T(r.value))]);
  return [v(a), o];
}
async function T(e) {
  return await G(e);
}
async function I(e, t) {
  var n, o;
  if (
    e.type === 'VECTOR' &&
    ((n = e.parent) == null ? void 0 : n.type) === 'COMPONENT' &&
    ((o = e.parent.parent) == null ? void 0 : o.type) === 'COMPONENT_SET'
  ) {
    const a = await e.parent.exportAsync({ format: 'SVG' }),
      s = String.fromCharCode.apply(null, Array.from(a)).replace(/fill="#[0-9A-Fa-f]{6}"/g, ''),
      r = `${e.parent.parent.name}[${e.parent.name}]`;
    t[r] || (t[r] = s);
  }
  'children' in e && (await Promise.all(e.children.map((a) => I(a, t))));
}
async function Y() {
  const e = {};
  await I(figma.currentPage, e), figma.ui.postMessage({ type: 'SVG_ICONS', payload: e });
}
const V = O.version;
figma.showUI(__html__, {
  width: 370,
  height: 350,
});
async function Z() {
  const { projectId: e, projectType: t } = await N(V);
  t === 'icons' ? Y() : Q(e, V);
}
figma.ui.onmessage = async (e) => {
  e.type === 'GET_LOCAL_STORAGE' && M(),
    e.type === 'UPDATE_ACCESS_TOKEN' && A('accessToken', e.payload),
    e.type === 'UPDATE_PLATFORM' && A('platform', e.payload),
    e.type === 'UPDATE_SELECTED_PROJECT' && A('selectedProject', e.payload),
    e.type === 'GET_VARIABLES' && Z();
};
