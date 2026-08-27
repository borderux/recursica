# Proposal: run adapter-tester against installed packages, not sibling monorepo folders

## Problem

`adapter-tester` currently only knows how to compare two adapters that live as
sibling packages inside this monorepo. `playwright.config.ts`'s `webServer`
entries hardcode `cwd: "../mantine-adapter"` / `cwd: "../mui-adapter"`, and
`tests/visual-regression.spec.ts` hardcodes `MANTINE_URL`/`MUI_URL` as
`localhost:6011`/`6012` constants. Story discovery filters on
`entry.id.startsWith("ui-kit-")`.

This means adapter-tester can't be pointed at any adapter that isn't checked
out as `packages/<name>` in this repo — which blocks comparing against
`@recursica/beam-adapter` (a separate, standalone repo) at all, and blocks
comparing against any future third-party-maintained adapter the same way.

## Proposed solution

Every published Recursica adapter (`@recursica/mantine-adapter`,
`@recursica/mui-adapter`, `@recursica/beam-adapter`, ...) already ships its
component source — including every `.stories.tsx` file — in its npm tarball
(`files` includes `"src"`). Combined with `@recursica/storybook-template`'s
published `createMainConfig`/`createPreviewConfig` factories, a real Storybook
instance for **any published adapter** can be booted from a small, generic
**harness** project that:

1. Installs the target adapter as a real npm dependency (not a workspace
   link) — `@recursica/mantine-adapter`, `@recursica/beam-adapter`, etc.
2. Installs `@recursica/storybook-template` + `@recursica/official-release`
   - `storybook`/`@storybook/react-vite` + the UI kit itself
     (`@mantine/core`, `@viasat/beam-react`, ...) as its own real dependencies.
3. Has its own tiny `.storybook/main.ts` + `preview.tsx` — a few lines each,
   built entirely from `storybook-template`'s exported factories — with a
   `stories` glob pointed at `node_modules/@recursica/<adapter>/src/**/*.stories.tsx`
   instead of a local `../src`.

This has been **prototyped and verified end-to-end**, not just reasoned about
in the abstract (see "Verification" below): a real, correctly-themed
`@recursica/mantine-adapter` Button story rendered from a harness that only
ever ran `npm install` — no monorepo checkout, no sibling folder.

If adapter-tester's `webServer` config launches one such harness per adapter
instead of assuming `cwd: "../<adapter>"`, it stops caring whether the target
adapter lives in this monorepo at all. That's what unlocks comparing against
beam-adapter (or any future adapter) as a first-class citizen, and opens the
door to N-way comparison instead of a fixed pairwise one.

## Verification

Built a throwaway harness (`npm install` only, no workspace, no monorepo
checkout) with:

```jsonc
// package.json (only the relevant bits)
{
  "dependencies": {
    "@recursica/mantine-adapter": "*",
    "@recursica/storybook-template": "*",
    "@recursica/official-release": "*",
    "@recursica/adapter-common": "*",
    "@mantine/core": "*",
    "@mantine/dates": "*",
    "react": "*",
    "react-dom": "*",
    "storybook": "*",
    "@storybook/react-vite": "*",
  },
}
```

```ts
// .storybook/main.ts
import { createMainConfig } from "@recursica/storybook-template/main";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default createMainConfig({
  stories: [
    "../node_modules/@recursica/mantine-adapter/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  enableCORS: true,
  recursicaCSSPath: require.resolve(
    "@recursica/official-release/recursica_variables_scoped.css",
  ),
});
```

```tsx
// .storybook/preview.tsx
import type { Preview } from "@storybook/react-vite";
import { createPreviewConfig } from "@recursica/storybook-template/preview";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@recursica/adapter-common/style.css";
import "@recursica/official-release/recursica_variables_scoped.css";
import recursicaTokens from "@recursica/official-release/recursica_tokens.json";
import recursicaBrand from "@recursica/official-release/recursica_brand.json";
import recursicaUIKit from "@recursica/official-release/recursica_ui-kit.json";

const basePreview = createPreviewConfig({
  defaultTheme: "light",
  recursicaTokensJsonPath: recursicaTokens,
  recursicaBrandJsonPath: recursicaBrand,
  recursicaUIKitJsonPath: recursicaUIKit,
});

export default {
  ...basePreview,
  decorators: [
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
    ...(basePreview.decorators || []),
  ],
} satisfies Preview;
```

Result: `storybook dev` booted, `index.json` correctly listed every real
`ui-kit-*` story from the installed package (e.g. `ui-kit-button--default`,
`ui-kit-accordion--default`, ...), and a Playwright check against
`ui-kit-button--default` rendered a real button with the correct Recursica
token colors (`background-color: rgb(194, 27, 67)`) — a full, correctly
themed render, not a broken shell.

## Gaps found along the way (real, fixable, not hypothetical)

These are the actual failures hit while getting the harness to boot, in the
order they were found. All are fixable in a harness's own setup; two are
worth fixing upstream too so future harnesses don't have to rediscover them.

1. **`react-markdown` isn't resolvable.** `mantine-adapter`'s
   `src/OverStyling.tsx` (imported by its own story files) needs
   `react-markdown` at runtime, but it's listed only in mantine-adapter's
   `devDependencies`, not `dependencies` — so it's never installed for an
   external consumer of the published package. _Fix for now:_ the harness
   installs `react-markdown` itself. _Better fix upstream:_ mantine-adapter
   promotes `react-markdown` to a real `dependency`, since its published
   `src/` genuinely needs it at runtime for anyone who mounts its stories.

2. **`storybook-template`'s default addons aren't declared as peer deps.**
   `createMainConfig`'s default `addons` list is
   `["@storybook/addon-docs", "@storybook/addon-a11y", "storybook-dark-mode"]`.
   None of these are `peerDependencies` of `@recursica/storybook-template`,
   so a harness that doesn't happen to install all three gets a _silent_
   `Could not resolve addon, skipping` warning at boot, then a **hard runtime
   crash** later when Vite tries to pre-bundle `preview.tsx`'s dependency
   graph and can't resolve `storybook-dark-mode` from a stale
   `.cache/storybook/.../deps/preview-*.js` bundle. _Fix for now:_ the
   harness installs all three explicitly. _Better fix upstream:_ declare
   them as `peerDependencies` of `storybook-template` (or make the default
   addons list itself configurable/optional so a minimal harness isn't
   forced to carry `storybook-dark-mode`, which is a developer-UX addon with
   no relevance to automated visual-regression testing).

3. **`react-docgen-typescript` crashes on `preview.tsx` in this harness
   layout.** With `reactDocgen: "react-docgen-typescript"` (the default,
   same setting mantine-adapter's own real dev config uses), the
   `vite:react-docgen-typescript` Vite plugin throws
   `Cannot read properties of undefined (reading 'fileExists')` inside
   `resolveTypescriptProject` while processing `.storybook/preview.tsx`
   specifically (not story/component files, which docgen'd fine) — and the
   failure surfaces to the browser as a plain 404 on `preview.tsx` rather
   than a visible error, which is what made this the hardest of the three to
   track down. Root cause not fully isolated (looks like the plugin's
   ts-morph "project service" doesn't resolve a project for a config file
   living in `.storybook/` when the actual component source it's docgen'ing
   lives three directories down inside `node_modules`), but the workaround
   is simple and has no relevant downside for this use case: set
   `reactDocgen: false` in the harness's own `main.ts`. Docgen only powers
   Storybook's auto-generated Controls/Docs prop tables — irrelevant to
   automated pixel/style diffing, which is all adapter-tester does. Worth a
   short upstream issue against `@joshwooding/vite-plugin-react-docgen-typescript`
   or a note in `storybook-template`'s own docs, but not a blocker.

None of these are architectural blockers — all three were solvable within the
harness's own `package.json`/`main.ts`, without touching the target adapter
or `storybook-template` at all. They're documented here so whoever builds the
real harness doesn't have to re-discover them.

## What adapter-tester itself would need to change

1. **`playwright.config.ts`**: replace the two hardcoded `webServer` entries
   (`cwd: "../mantine-adapter"` / `"../mui-adapter"`) with entries that
   launch a harness directory per adapter (e.g.
   `packages/adapter-tester/harnesses/mantine/`,
   `packages/adapter-tester/harnesses/beam/`), each a small project like the
   one prototyped above, installing that adapter's real published package.
2. **`tests/visual-regression.spec.ts`**: replace the `MANTINE_URL`/`MUI_URL`
   constants with a config-driven list of `{ name, port, sourceOfTruth }`
   entries, so the suite can run pairwise (any adapter vs. the source of
   truth) or be extended to N-way later without touching the spec itself.
3. **Story discovery filter**: `entry.id.startsWith("ui-kit-")` assumes every
   adapter titles its stories `"UI-Kit/*"`. `mantine-adapter`/`mui-adapter`
   do; `beam-adapter` currently titles its stories `"Components/*"` instead.
   Either beam-adapter renames its story titles to match the `"UI-Kit/*"`
   convention (recommended — it's a one-line change per story file and
   brings it in line with every other adapter), or the filter needs to
   become adapter-agnostic (e.g. exclude a known denylist of meta/intro
   titles instead of requiring an allowlist prefix).

## Recommendation

This is worth doing — the packaging story here is fundamentally sound, the
one prototype proves it end-to-end, and none of the three gaps found are
hard blockers. Suggest scoping it as its own follow-up piece of work (not
bundled into bringing in `token-analyzer`), since it touches
`adapter-tester`'s core config/spec files and is worth a focused pass rather
than a drive-by change.
