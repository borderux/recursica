# Creating a Recursica Adapter

> **This document is generic.** It is the canonical, adapter-agnostic process for creating any Recursica adapter, and lives in `@recursica/adapter-common`. Each adapter repository keeps only a short pointer to it. Adapter-specific details (UI-kit quirks, deviations, decision history) belong in that adapter's own `ARCHITECTURE.md`, `AGENT.md` and per-component `IMPLEMENTATION_NOTES.md`, never here.

This document is the repeatable process for turning a third-party UI kit into a Recursica adapter: a standalone, independently-published npm package that lets application developers use that UI kit through Recursica's unified component API and design tokens.

It's written so anyone — human or AI agent — can follow it for a **new** UI kit, in a **new**, empty repository. It doesn't assume access to any particular person's machine; the only adapter it references is **the genesis adapter, `mantine-adapter`** — the original, most complete, actively-maintained Recursica adapter, published as its own standalone repository, **not** a package inside the `recursica` monorepo (`https://github.com/borderux/recursica-adapter-mantine-v8`). Every other adapter, including this one, is built by following this document against that single reference.

## 0. Prerequisites

- A UI kit that ships components and can be installed as an npm peer dependency.
- Read access to **the genesis adapter**, `recursica-adapter-mantine-v8` (`https://github.com/borderux/recursica-adapter-mantine-v8`) — a standalone repository, not a package inside the `recursica` monorepo. Use it as the structural reference for every step below.
- Read access to the `recursica` monorepo (`https://github.com/borderux/recursica`), which hosts **`packages/adapter-common`** (published as `@recursica/adapter-common`) — the framework-agnostic shared layer every adapter depends on: prop-contract types (`RecursicaOverStyled`, `RecursicaSpacing`, etc.), `RecursicaThemeProvider`, `Layer`, and the **canonical** component/Storybook dev guides. (Open question, not yet resolved: whether a given UI kit's adapter actually needs `adapter-common` as a real dependency — treat it as required until that's confirmed one way or another.)
- A new, empty GitHub repository for the adapter (e.g. `recursica-adapter-<ui-kit>-<version>`), created under whichever org will own it.
- Node.js >=20, npm.

## 1. Understand the genesis adapter before copying anything

Read, in order:

1. `packages/adapter-common/src/types.ts` and `packages/adapter-common/src/index.ts` in the monorepo — this is the actual contract an adapter implements (`RecursicaOverStyled<T>`, `RECURSICA_COMPONENTS`/`RecursicaComponent`, `RecursicaThemeProvider`).
2. `packages/adapter-common/docs/PIPELINE.md` — how doc and code changes flow from `adapter-common` through an adapter to Storybook.
3. `packages/adapter-common/docs/COMPONENT_DEV_GUIDE.md` and `docs/COMPONENT_STORYBOOK_GUIDE.md` — the canonical rules every adapter's components must follow.
4. The genesis adapter's (`recursica-adapter-mantine-v8`) own root docs (`README.md`, `ARCHITECTURE.md`, `SETUP.md`, `CONTRIBUTING.md`, `USAGE.md`, `OVERSTYLING.md`, `AGENT.md`, `docs/PHILOSOPHY.md`) and its `package.json`, `tsconfig.json`, `eslint.config.mjs`, `vite.config.ts`, `.storybook/`.

Do not skip straight to copying files — step 3 covers what's still worth deciding deliberately rather than copying on autopilot (real vs. placeholder dependencies, which docs are published vs. contributor-only).

## 2. Write `docs/ADAPTER_INTEGRATION_REPORT.md`

Before scaffolding anything, produce a written reconnaissance report answering, with real evidence from the underlying UI kit's actual source/compiled output (not its marketing docs, not guessed from component names) — not a scaffold-time formality, this is what step 9's stub order and step 10's per-component build order are actually planned from:

1. **How does the underlying kit prefer to style components?** (Plain CSS? CSS-in-JS? CSS custom properties? Does importing a component side-effect-import its styles, or is there a separate stylesheet step?) This seeds — but doesn't replace — step 8's `docs/STYLING_SYSTEM.md`, which is the authoritative, fully-detailed decision record once implementation starts; this step's answer can and should be shorter, since its job is orientation, not the final decision.
2. **How are the underlying kit's own styles included** (imports, providers, stylesheet order)? Write or update `SETUP.md`/`USAGE.md` with the actual, verified steps to wire up the underlying kit's imports/providers/stylesheets alongside this adapter's own — don't leave this to be rediscovered per-component.
3. **Can CSS Modules override the underlying kit's styles without touching global/underlying-kit styles?** (I.e., is step 8's job even achievable with this UI kit — most will be yes, but confirm rather than assume.)
4. **Can appearance-affecting styling props be filtered out to prevent overstyling, and which ones?** A first pass — the per-component `UNSUPPORTED_PROPS` audit (step 10, item 1) is where this gets nailed down exactly, but a rough survey here (does the kit have a generic `sx`/`css`/`classes`-style escape hatch beyond plain `className`/`style`? any components with unusually large styling-prop surfaces?) shapes expectations going in.
5. **Do the underlying kit's own primitives map to Recursica's layout components** (`Flex`, `Stack`, `Group`, `Grid`)? If the kit has no equivalent, that's a real gap to flag now, not discover mid-build.
6. **Does the underlying kit have generic typography primitives** like Recursica's `Text`/`Title`? Same reasoning — some kits (Mantine) have exactly this; others may only have component-embedded text with no standalone primitive.
7. **How does the underlying kit structure form controls** — label placement, description/help-text, error/read-only states, and layout (stacked vs. side-by-side)?
8. **Given (7): can the underlying kit's form controls be styled to match Recursica's stacked/side-by-side layouts directly, or does this adapter need its own `FormControlWrapper`/`FormControlLayout` (mantine-adapter's approach) to get Recursica's look regardless of what the underlying kit does natively?**
9. **A full component-by-component mapping.** For every component the genesis adapter (`mantine-adapter`) implements, identify the underlying kit's closest equivalent (if any — note naming mismatches, e.g. a plural/singular or spelling difference) and categorize it as **Easy** (a near-identical single component), **Requires work** (needs composing multiple primitives, or has real prop/behavior gaps to close), or **Does not exist** (would need substantial new implementation). Turn this into **the numbered build-order list** step 9/10 actually follow — easiest first, hardest last — not a build order invented separately later.
10. **How does the underlying kit handle light/dark mode, how do you switch between them at runtime, and how does that interact with `RecursicaThemeProvider`?** Don't stop at "how is it themed" — actually verify a live toggle keeps both the underlying kit's own theme and Recursica's theme in sync, not just that each independently supports light/dark. A provider's "default"-named theme prop is a common trap: confirm whether it's read reactively on every render or only once at mount (if the latter, runtime switching needs the kit's own hook/context API, not just re-rendering the provider with a new prop value) — and prove it with a real before/after check (e.g. via Playwright against a running Storybook), not by reading the type signature and assuming.

Read the underlying kit's actual `.d.ts`/compiled source for every claim in this document, the same rigor `docs/STYLING_SYSTEM.md` and every component's `IMPLEMENTATION_NOTES.md` already require — a wrong guess here misdirects the entire build order, not just one component. This document is **not published** (not a consumer-facing doc — it's for whoever builds this adapter next, human or AI), so it can be as long and evidence-dense as it needs to be.

## 3. Decide what's monorepo-specific vs. portable

Before scaffolding, identify:

- **Real npm dependencies** the adapter needs (`@recursica/adapter-common`, `@recursica/storybook-template`, `@recursica/recursica-postcss-vars`, `@recursica/token-analyzer`, the UI kit itself). Confirm each is actually published (`npm view <package> version`) — don't assume a package referenced with `"*"` in the monorepo's `package.json` is public. Some devDependencies are internal-only build tooling (scoped `@repo/*`) and will 404 on the public registry. Drop those; if a tool that 404s turns out to be load-bearing, that's an open item to raise with whoever owns the monorepo, not something to silently work around — see the "initial scaffold" and "`@recursica/token-analyzer` brought in" decisions-log entries below for exactly this happening with token-analyzer (dropped when unpublished, brought back in once it was published).
- **Docs that ship in the npm package** vs. **contributor-only docs**. Check the genesis adapter's `package.json` `"files"` array — only what's listed there reaches consumers. Everything else (`CONTRIBUTING.md`, `AGENT.md`, the canonical `adapter-common/docs/*` guides) lives in the repo but isn't published, so a standalone adapter's docs must link to them as **absolute GitHub URLs** back into the monorepo, not relative paths — they don't exist in the published package or in a repo that doesn't contain them.
- **CI/publishing**: the monorepo's `.github/workflows/release.yml` is a Turborepo + Changesets pipeline that also builds Figma plugins. A standalone single-package repo needs its own, much simpler version: build → Changesets version/publish. No Turborepo, no zip/upload-release-assets steps.
- **Repo-relative doc links** (`../adapter-common/docs/...`) become absolute GitHub URLs once the adapter is out of the monorepo.
- **Git hooks**: the monorepo enforces formatting/linting/type-checking/tests at commit time via Husky + lint-staged (`.husky/`, `scripts/lint-staged.config.js`, root `package.json`'s `prepare`/`precommit` scripts). A standalone repo needs its own copy of this, simplified for a single package (see step 4).

## 4. Scaffold the package

Mirror the genesis adapter's root-level structure inside the new repo (not inside a `packages/` subfolder — the new repo's root _is_ the package root):

```
<repo-root>/
├── .changeset/               # config.json + README.md (standalone: no "linked"/"fixed" cross-package config needed)
├── .github/workflows/        # release.yml, pull-request.yml (standalone versions, see step 7)
├── .husky/                    # install.mjs, pre-commit (git hooks — see below)
├── .storybook/                # main.ts, preview.tsx, manager.ts, RecursicaTheme.ts, commonArgTypes.ts, vitest.setup.ts
├── docs/
│   ├── PHILOSOPHY.md          # published; adapt Mantine-specific language to the new UI kit
│   ├── COMPONENT_DEV_GUIDE.md # NOT published; thin delta, links to the canonical guide via GitHub URL
│   ├── COMPONENT_STORYBOOK_GUIDE.md # same
│   ├── ADAPTER_INTEGRATION_REPORT.md # NOT published; written in step 2, before scaffolding starts
│   ├── STYLING_SYSTEM.md      # NOT published; written in step 8, before any component CSS
│   └── CREATING_AN_ADAPTER.md # this file, if the new adapter is meant to keep documenting the process further
├── scripts/
│   └── lint-staged.config.cjs # single-package lint-staged config (see below)
├── src/
│   ├── index.ts                # the package's entry point (vite.config.ts's build.lib.entry points here): imports @recursica/adapter-common/style.css, re-exports ./components
│   ├── env.d.ts
│   ├── GlobalExemptions.modules.css
│   ├── types/                  # index.ts, scss-modules.d.ts, plus a UI-kit module-augmentation file if needed
│   ├── utils/                  # index.ts, filterStylingProps.ts (UI-kit-specific BLOCKED_STYLING_KEYS/LAYOUT_PROPS)
│   └── components/             # index.ts barrel: re-exports @recursica/adapter-common + every component; one folder per component, added incrementally
├── AGENT.md
├── ARCHITECTURE.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── OVERSTYLING.md
├── README.md
├── SETUP.md
├── USAGE.md
├── .prettierignore
├── eslint.config.mjs
├── llms.txt
├── package.json
├── prettier.config.mjs
├── recursica.json
├── tsconfig.json
├── vite.config.ts
├── vitest.workspace.ts
└── vitest.shims.d.ts
```

Adapt each config file from the genesis adapter:

- **`package.json`**: rename (`@recursica/adapter-<kit>`), update `description`/`repository`/`homepage`/`bugs` to the new repo (no `directory` field — it's not a monorepo subpackage), replace `peerDependencies` with the new UI kit's packages and versions (check the UI kit's own `peerDependencies` for the framework version range it supports), keep `@recursica/adapter-common` as a real dependencies, pin `"*"` devDependencies to their actual published versions, add `version`/`release` scripts (`changeset version` / `changeset publish`) since there's no monorepo root to define them either. **Do not add a `test` script** (see the "removed the test infrastructure" decisions-log entry below) — the genesis adapter (`mantine-adapter`) doesn't have one either, despite shipping the same `vitest`/`@storybook/addon-vitest`/`playwright` devDependencies; match that, don't go beyond it, unless a human explicitly asks for automated story tests. `check-types` is a real gap worth asking about explicitly before adding — the genesis adapter doesn't have that script either, and it's not yet resolved here whether that's intentional or an oversight in the genesis adapter itself. Pick an unused Storybook port relative to the genesis adapter's own (`6011`).
- **`tsconfig.json`**, **`eslint.config.mjs`**: copy as-is — both were already self-contained in the genesis adapter (neither actually extends the internal `@repo/typescript-config`/`@repo/eslint-config` packages despite them appearing in `devDependencies`).
- **`vite.config.ts`**: update the library `name`/`fileName` and the `rollupOptions.external` list to the new UI kit's package name(s).
- **`.storybook/main.ts`**, **`manager.ts`**, **`RecursicaTheme.ts`**, **`commonArgTypes.ts`**, **`vitest.setup.ts`**: copy as-is — these use `@recursica/storybook-template` and are UI-kit-agnostic.
- **Do not add a `.storybook/preview-head.html` with hardcoded Google Fonts `@import`s.** `preview.tsx`'s `createPreviewConfig({ recursicaTokensJsonPath: ... })` already wires up `@recursica/storybook-template`'s `withRecursicaFonts` decorator, which reads `tokens.font.typefaces.*.$extensions["com.google.fonts"].url` from the checked-in `recursica_tokens.json` and injects `<link>` tags at runtime — a static file duplicates this and silently drifts out of sync with the JSON. If a UI-kit-agnostic global CSS reset is genuinely needed (e.g. a body `font-family` fallback), that's the only thing `preview-head.html` should contain.
- **`.storybook/preview.tsx`**: replace the UI kit's provider/theme wrapper (in mantine-adapter, `<MantineProvider>` + `ColorSchemeWrapper`) with the new UI kit's equivalent. If you don't yet know the UI kit's theming API with confidence, leave a clearly-marked `TODO` rather than guessing — an unverified provider wrapper is worse than a documented gap.

  **The two bullets above hold only when the new adapter targets the same Storybook framework as `@recursica/storybook-template`.** Copying its `.storybook/*` files "as-is" is only agnostic to _which UI kit_, not to the framework the UI kit is written in. A UI kit built on a different framework needs that framework's own real Storybook integration, scaffolded via Storybook's own `storybook init` (or equivalent), not hand-assembled from the genesis adapter's `.storybook/` by analogy. Confirm by actually running `npm run storybook` and checking for a real dev-server-started log line. Don't trust Storybook's auto-detected framework or "latest" for a pinned UI-kit version: verify the framework package's `peerDependencies` cover your pinned UI-kit version (`npm view <pkg> peerDependencies`) before installing, since a mismatch fails with a generic `ERESOLVE` error rather than a "wrong framework" message. Record the exact framework choice and any pins in this adapter's own docs.

- **`.changeset/config.json`**: copy as-is (single-package config needs no `linked`/`fixed` package groups).
- **`.github/workflows/`**: strip Turborepo caching, figma-plugin env vars, and the zip/upload-release-assets steps. Keep: checkout → setup Node → `npm ci` → `npm run check-types`/`npm run lint`/`npm run build` (PR workflow) and checkout → setup Node → `npm ci` → build → `changesets/action@v1` with `publish: npm run release` (release workflow). No `npm run test` step — see the note on not adding a `test` script above.
- **Git hooks (Husky + lint-staged)**: the monorepo's root `package.json` wires a `prepare` script (`node .husky/install.mjs`) that installs Husky on `npm install`, and a `.husky/pre-commit` hook that runs `npx lint-staged --config scripts/lint-staged.config.js`. Copy `.husky/install.mjs` as-is. For `.husky/pre-commit`, copy the one-line command but write it as `npx lint-staged --config scripts/lint-staged.config.cjs` — **`.cjs`, not `.js`**: the monorepo's root `package.json` has no `"type"` field (defaults to CommonJS), but a standalone adapter's `package.json` has `"type": "module"` (needed for the rest of the ESM tooling), and lint-staged's config uses CommonJS `module.exports`. A plain `.js` file gets parsed as ESM under `"type": "module"` and fails to load — `.cjs` is unambiguous regardless of the package's `"type"`. `scripts/lint-staged.config.cjs` also needs to be **simplified**: the monorepo's version routes staged files to their owning `apps/*`/`packages/*` directory and runs `turbo run check-types test --filter=...` per affected package — there's no Turborepo and only one package here, so the standalone version just runs `prettier --write`/`eslint --fix` on staged JS/TS files plus `npm run check-types` on the whole package (no `test` step — see the note on not adding a `test` script above; see this repo's `scripts/lint-staged.config.cjs` for the concrete version). Add `husky`, `lint-staged`, and `prettier` as devDependencies (pin to the same versions the monorepo uses), add a `format` script (`prettier --write "**/*.{js,jsx,ts,tsx,json,md,css,scss}"`), a `precommit` script (`npm run check-types && npm run lint && npm run format`, matching the monorepo's), and a root `prettier.config.mjs` (empty is fine — the monorepo's is empty too, meaning default Prettier settings) plus a `.prettierignore` that at minimum excludes `dist`, `storybook-static`, and the `recursica_*`/`recursica.json` files `@recursica/official-release`'s postinstall manages (see step 5's note on that postinstall behavior — reformatting those files fights it). Run `npm install` afterward so the `prepare` script actually installs the hook, then confirm it took with `git config --get core.hooksPath` (should print `.husky/_` or equivalent, not be empty) — and actually try a commit (or run `npx lint-staged --config scripts/lint-staged.config.cjs` directly) rather than assuming the hook works, since a broken config here silently blocks every future commit.

## 5. Scaffold `src/`

Even before any real component exists, `src/` should be a **buildable, empty adapter**:

- `src/index.ts` is the package's entry point (`vite.config.ts`'s `build.lib.entry` points here): imports `@recursica/adapter-common/style.css` and re-exports `./components`.
- `src/components/index.ts` re-exports every component source and styles and underlying `adapter-common` types and source used. It can re-export from `adapter-common`, but we shouldn't do a `export * from @recursica/adapter-common`.
- `src/utils/filterStylingProps.ts` re-exports the shared types/utils from `@recursica/adapter-common` and defines `BLOCKED_STYLING_KEYS` for the new UI kit. Start this list from what the UI kit's components actually accept as styling props (Mantine exposes a large atomic style-prop system; not every UI kit does — check the UI kit's own component prop docs rather than copying Mantine's list wholesale) and expand it as real components surface gaps. Leave `LAYOUT_PROPS`/`SPACING_MAP` wiring in place (framework-agnostic — it maps `rec-*` tokens to `--recursica_brand_dimensions_*` CSS variables) but empty `LAYOUT_PROPS` until a layout component is built.

Run `npm install`, then `npm run build`, `npm run lint`, `npm run check-types` to confirm the empty scaffold actually compiles and builds before writing any docs content or components on top of it. (`npm install` needs to be run once, by a human, to generate `package-lock.json` — see the open items log.)

**All five files are checked into git.** Install the Recursica JSON and CSS from Forge (https://forge.recursica.com) into the root and commit them. Don't gitignore any of them, and don't have `vite.config.ts`/`.storybook/main.ts`/`.storybook/preview.tsx` resolve their working copies from `node_modules` — point them at the checked-in root files instead (`resolve(__dirname, "../recursica_variables_scoped.css")`, `import "../recursica_tokens.json"`, etc.), so what's committed is provably what the build reads. These root copies are what a developer edits going forward, by hand or via a Forge export per `SETUP.md`; review `git diff` for token drift whenever they are refreshed.

> **Gotcha**: `.storybook/main.ts` runs under Node's native ESM loader (unlike `vite.config.ts`, which Vite's config loader shims `__dirname` into) — a bare `resolve(__dirname, ...)` there throws and Storybook won't boot at all. Reconstruct it explicitly: `const __dirname = dirname(fileURLToPath(import.meta.url));` (same pattern `eslint.config.mjs` already uses). This is exactly the kind of break that stays invisible through `check-types`/`build` and only shows up when you actually run `npm run storybook` — see step 7.

## 6. Scaffold the docs

Copy each genesis-adapter doc and adapt UI-kit-specific language (framework name, peer install commands, code examples that reference the old UI kit's props):

- `README.md`, `ARCHITECTURE.md`, `SETUP.md`, `USAGE.md`, `OVERSTYLING.md`, `AGENT.md`, `CONTRIBUTING.md`, `llms.txt`, `CHANGELOG.md` (start this one as a stub — Changesets will populate it).
- `docs/PHILOSOPHY.md` — despite living in `docs/`, this one is **published** (it's in `package.json`'s `"files"`) and is **not** a thin delta; the genesis adapter's copy is fully written in Mantine-specific language throughout, so it needs a genuine rewrite for the new UI kit's vocabulary, not just a find-and-replace of the framework name.
- `docs/COMPONENT_DEV_GUIDE.md`, `docs/COMPONENT_STORYBOOK_GUIDE.md` — these **are** thin deltas. Link to the canonical versions in `adapter-common` via absolute GitHub URL, and only document what's genuinely different for the new UI kit. It's fine (expected, even) for these to start nearly empty and grow as real components are built.
- Every doc that references "check the genesis adapter's delta doc for parity" should point to `mantine-adapter` in the monorepo via GitHub URL, not a relative path, since there's no shared workspace here.

## 7. Verify the pipeline end-to-end

Before considering the scaffold "done":

1. `npm install` (generates `package-lock.json`, needed for `npm ci` in CI; also installs the Husky git hook via the `prepare` script).
2. `npm run build` — should produce `dist/` with `.js`/`.cjs`/`.d.ts`/`.css` outputs even with zero components.
3. `npm run lint`, `npm run check-types`, `npm run format`.
4. `npm run storybook` — should boot even with an empty component barrel.
5. Push the branch, open a draft PR, confirm `pull-request.yml` goes green.
6. Confirm `release.yml`'s `NPM_CONFIG_PROVENANCE`/OIDC setup and the `RELEASE_PAT` secret are configured in the new repo's GitHub settings before merging anything — first-time publish of a new scoped package can 404/401 via CI-only auth; see the monorepo's `PUBLISHING.md` "First-Time Package Publishing" section for the manual `npm login && npm publish --access public` workaround if that happens.
7. Wire up `@recursica/adapter-tester` (published, `^5.0.0`+ — `npm install --save-dev @recursica/adapter-tester @playwright/test && npx playwright install chromium`) so the new adapter can be diffed against `mantine-adapter` as the visual source of truth, without needing this monorepo checked out. This is a real CLI (`adapter-tester`) reading an optional JSON config — no Playwright config or spec file to hand-author (earlier versions of this step, when 1.x was hand-config-only and 2.x/3.x/4.x used different config shapes, are preserved in the decisions log below for history, but don't follow them — they're obsolete).

   - Add three scripts: `"adapter-tester": "adapter-tester --serve"` (interactive side-by-side dev mode), `"adapter-tester:automated": "adapter-tester"` (the headless own-drift check against this project's own committed `test/golden/` — fast, no network, run this normally), and `"adapter-tester:source-of-truth": "adapter-tester --divergence-only"` (the separate, opt-in divergence check against the source-of-truth adapter's goldens).
   - Leave the adapter's own `storybook` script with **no fixed `-p <port>`** (a plain `storybook dev`) — `adapter-tester` auto-detects the real port from Storybook's own startup output rather than trusting a configured one, since Storybook silently falls back to an OS-assigned port whenever its default/configured one is taken. A hardcoded port is a first-guess hint at best and a source of flaky `webServer` timeouts at worst. **No config file is required at all** for a bare setup — `adapter-tester` reads the project name from `package.json`. Add `adapter-tester.config.json` only to override a default (raise `sourceOfTruthThresholdPixels`, add per-story `stories.<id>.sourceOfTruthThreshold`/`exclude` overrides, etc.) — see the package's README for the full schema.
   - Add `.adapter-tester/`, `playwright-report/`, and `test-results/` to `.gitignore` — all three are regenerated on every run. Commit `test/golden/` (images + `manifest.json`) — that's the own-drift baseline, not a regenerated artifact.
   - **Read `packages/adapter-tester/AGENT.md` in the monorepo before touching thresholds.** It's an explicit, enforced guardrail: AI agents must never modify `goldenThresholdPixels`/`sourceOfTruthThresholdPixels` (the two global thresholds — own-drift stays tight, default 10; cross-library divergence is deliberately much looser, default 3500), and may only add per-story `stories.<id>.sourceOfTruthThreshold`/`goldenThreshold` overrides or `exclude: true` with a human's explicit permission, after documenting exactly why the difference is unfixable. The source-of-truth divergence check is a hard fail as of 5.0 (previously a soft, non-failing flag) — a genuine, reviewed divergence needs `--approve-divergence` (only valid combined with `--divergence-only`), not a threshold bump, to stop re-flagging until the source of truth's own golden changes again. A threshold failure is the tool doing its job, not something to route around — see the decisions log entry below for a case that looked like an unfixable cross-library difference at first glance and turned out to be a real, fixable bug in the _tool's own harness_, not the adapter.
   - `adapter-tester:source-of-truth` also runs a **story parity check**: it fails if `mantine-adapter` has a golden for a story id this adapter's Storybook doesn't have at all (and hasn't marked `exclude: true`). Porting the missing story is almost always the right fix over excluding it.

   **Story titles must match `mantine-adapter`'s `"UI-Kit/<Component>"` convention exactly** — the suite fetches the source of truth's story index and requests the _same story id_ from the target adapter's Storybook. A component titled `"Components/Button"` (this repo's stub-scaffolding default, see step 9) produces story ids like `components-button--default`, not `ui-kit-button--default` — the target-side navigation then hits a nonexistent story, `#storybook-root` never renders, and the test times out rather than failing with a useful diff. **Rename a component's story title to `"UI-Kit/<Component>"` as part of turning it from a stub into a real implementation** (Button and Loader were renamed as part of this integration) — not before, since there's no point making an unimplemented stub diffable.

   **Run it once at scaffold time to confirm the harness itself works, not to expect a clean pass — and don't chase every pixel-diff failure as if it's a component bug.** A timeout usually means a story the target adapter doesn't have yet (expected for a stub), not a bug. Treat the diff threshold and the exact story set as things to calibrate with a human once a component is real, not a hard gate at scaffold time.

## 8. Decide and document the styling system

Before writing any component CSS — stub or real — research how the underlying UI kit actually styles itself and write `docs/STYLING_SYSTEM.md` answering, explicitly, in writing:

1. **How does the underlying UI kit style its own components?** Read its compiled output (not just its docs) — plain CSS classes? CSS custom properties? CSS-in-JS injected at runtime? Does it ship its own stylesheet as a side effect of importing the component, or does the consumer own everything? This determines what override mechanism is even available.
2. **No global style pollution.** A Recursica component must be able to sit next to a plain, undecorated instance of the underlying UI kit's own component with zero bleed either direction. Recursica's overrides must never touch global selectors (`:root`, bare element selectors, the underlying kit's own base classes unscoped) — every override has to be scoped to the specific component instance.
3. **Recursica's own styling should not be trivially targetable/overridable from outside.** Prefer a mechanism that generates unique, non-guessable class names per build (CSS Modules is the default choice for this reason — see `docs/COMPONENT_DEV_GUIDE.md`'s and `CONTRIBUTING.md`'s CSS Modules requirement) rather than fixed, easily-guessed class names another stylesheet could target and override.
4. **Prefer the underlying kit's own idiomatic approach, but prefer static/non-dynamic styling over CSS-in-JS** when there's a choice — deterministic output, no runtime style-computation cost. If the underlying kit is itself CSS-in-JS-only, document that tension explicitly rather than silently picking one side.
5. **Conclude with the concrete overstyling-prevention mechanism** this adapter uses: which override technique (e.g. CSS custom-property overrides vs. direct property overrides — whichever fits the underlying kit's own architecture per point 1) is preferred going forward, and how it composes with the TypeScript (`RecursicaOverStyled`) and runtime (`filterStylingProps`/`omitUnsupportedProps`) blocking layers from `src/utils/filterStylingProps.ts`. Update `docs/STYLING_SYSTEM.md` if a later component reveals the initial conclusion was wrong or incomplete — it's a living doc, not a one-time write.

This only needs the scaffold, not a full component — do it once the pipeline is verified (step 7) and before stubbing/building anything (steps 9–10), since it directly shapes both.

## 9. Stub every component first (recommended)

Before building real components one at a time, generate a placeholder for the full component set — informed by step 2's `docs/ADAPTER_INTEGRATION_REPORT.md`, not independent of it — so the whole surface is importable, type-checked, browsable in Storybook, and already carries the report's per-component findings from day one. This turns "build a component" into "fill in one already-scaffolded file with its own notes already written," not "also wire up scaffolding and re-derive the underlying-kit research as you go."

For each component in the genesis adapter's (`mantine-adapter`) `src/components/` (excluding `RecursicaThemeProvider` and `Layer` — see step 5, those are already covered via `@recursica/adapter-common`'s re-export; also excluding sub-components like `CheckboxGroup`/`AccordionItem`/etc. — stub those alongside their parent when it's actually built):

1. Create `src/components/<Name>/<Name>.tsx` exporting a real, component-specific `<Name>Props` type built on `RecursicaOverStyled` (from `src/utils/filterStylingProps.ts`) — even though the body doesn't use the props yet, the public type shape should already be correct-ish.
2. The body should render a placeholder, not silently return `null` — a missing component should be **obviously** missing. Put the placeholder markup/text in one shared internal component (e.g. `src/components/_InDevelopmentStub.tsx`, leading underscore = not part of the public set) that every stub imports, so the placeholder only needs to change in one place.
3. Create `src/components/<Name>/<Name>.stories.tsx` (CSF3) with `title: "Components/🚧 <Name>"` — **the 🚧 emoji prefix on the story title is what makes in-development components visually obvious in the Storybook sidebar**, grouped and sorted alongside real ones with no extra tooling. Storybook renders titles as-is, so a leading emoji is enough; no addon or custom sidebar renderer needed. Prefix the leaf component name specifically (`Components/🚧 Button`), not the whole path, so the group itself isn't marked.
4. Also create `src/components/<Name>/<Name>.module.css`, **left empty** (a header comment only — no rules yet), and import it into `<Name>.tsx` as `import styles from "./<Name>.module.css";`, applying `className={styles.root}` to the stub's root element. This isn't decorative: it wires up CSS Modules — the adapter's only styling mechanism (see `CONTRIBUTING.md`, `docs/COMPONENT_DEV_GUIDE.md`) — from day one, establishing the `.root`-scoped-class convention every real implementation will build on, and gives every component a working (if empty) style hook to verify against instead of retrofitting one later. An empty `.module.css` compiles fine and `styles.root` resolving to `undefined` at runtime is harmless (`className={undefined}` renders no class).
5. **Create `src/components/<Name>/IMPLEMENTATION_NOTES.md`, seeded from `docs/ADAPTER_INTEGRATION_REPORT.md`'s §9 mapping table** — pull this component's row (category, underlying-kit candidate(s), the specific gap/finding noted) into its own file, plus anything else from the report specifically relevant to it (a cross-reference to a related component's own gap, a downstream note about another story that depends on this one existing, etc.). The goal: whoever picks this component up for step 10 starts from the report's already-verified findings, not a blank page or a re-read of a 170-line document to find their one row. Explicitly flag it as a pre-implementation survey, not a substitute for step 10's own prop audit — re-verification against the underlying kit's real `.d.ts` at implementation time still stands.
6. Export it from `src/components/index.ts` (see step 5's note — `src/index.ts` re-exports `./components` as a whole, nothing to add there per component). If the exported `Recursica<Name>Props` collides with `@recursica/adapter-common`'s own type of the same name, add an explicit `export type { Recursica<Name>Props } from "./<Name>/<Name>";` line right after the `export *` for that component to resolve the ambiguity in favor of the component's own (richer) version, matching the genesis adapter's pattern.
7. **When the component is later implemented for real** (step 10 below), change its story's `title` from `"Components/🚧 <Name>"` to `"UI-Kit/<Name>"` — matching `mantine-adapter`'s own convention exactly, not just stripping the emoji — and stop importing `_InDevelopmentStub`. This isn't cosmetic: `@recursica/adapter-tester`'s visual-regression comparison (step 7, item 7) matches stories by id between the source-of-truth and target Storybooks, and a `"Components/*"`-titled story produces a different id than Mantine's `"UI-Kit/*"` one, so it silently never gets compared (see step 7's adapter-tester entry for what that failure actually looks like). Both the title and the stub-import are signals, not decoration — leaving either on a finished component is misleading. Keep the `.module.css` file and `styles.root` wiring — that part becomes real, not stubbed. The stub's `IMPLEMENTATION_NOTES.md` becomes the real one — expand it with what implementation actually found, don't discard and start over.

This can be done as one batch (49 components at once, in this repo's case) via a small generator script rather than by hand — see the "2026-08-26 — stub components" entry in the decisions log below for exactly what that looked like here, including one required follow-up fix (`eslint`'s `no-unused-vars` needing an `argsIgnorePattern` for the intentionally-unused stub props parameter). That entry also covers a `test` script + CI-testing setup that was tried and then explicitly reverted a few passes later — see the "removed the test infrastructure" entry further down for why; don't re-add it without being asked.

## 10. Build components incrementally

Build components one at a time (whether starting from a step-9 stub or from scratch) following `docs/COMPONENT_DEV_GUIDE.md` (which points to the canonical guide). For each component:

1. **Audit the underlying UI-kit component's full prop list against the canonical `Recursica<Name>Props` contract** (`@recursica/adapter-common`) before writing any implementation code. For every prop the underlying component exposes:
   - **Appearance-affecting props** (color, variant/kind, size, radius, shadow, or anything else that changes how the component looks) that aren't part of the Recursica contract get **removed**: `Omit<>`'d from the public TypeScript type, hardcoded to a sensible default in the render, _and_ added to a local `UNSUPPORTED_PROPS` const passed through `omitUnsupportedProps` — all three, not just the type-level `Omit<>`. The runtime deletion matters even though the component's own render also re-asserts its value after `{...sanitizedProps}` in JSX (so a leaked prop would be overridden by JSX order anyway) — relying on assertion order as the _only_ protection is a real bug class (see `Button/IMPLEMENTATION_NOTES.md`'s "className overwrite bug" citation), so delete explicitly rather than trust order alone.
   - **Behavior-affecting props** with no Recursica equivalent (not about appearance — e.g. a progress value, a controlled/uncontrolled toggle) get a considered, _documented_ decision each: either genuinely useful and passed through as-is, or blocked via the same `UNSUPPORTED_PROPS` mechanism as unsupported. Don't leave a prop unaddressed by default — every prop on the underlying component should have a traceable decision, even if that decision is "allowed through, no Recursica equivalent needed."
   - **Recursica's own props take precedence.** Where the canonical contract defines a prop that maps to (or conflicts with) one of the underlying kit's own props (e.g. Recursica's `variant` mapping to the UI kit's own `variant`/`kind`/`type`-ish prop), the underlying kit's raw prop name is part of the "appearance-affecting, remove it" bucket above — callers only ever get to set the Recursica name, mapped internally to whatever value the underlying kit expects.
2. Implement `ComponentName.tsx` + `ComponentName.module.css`, wrapping the UI kit's component, filtering props through `filterStylingProps`, using CSS variables from `recursica_variables_scoped.css` only (no hardcoded values, no `var(--x, fallback)`). If replacing a step-9 stub, delete the `_InDevelopmentStub` import.
3. Write `ComponentName.stories.tsx` (CSF3) per `docs/COMPONENT_STORYBOOK_GUIDE.md`. If replacing a step-9 stub, remove the `🚧 ` prefix from the story's `title`.
4. Write `USAGE.md` (public) and expand `IMPLEMENTATION_NOTES.md` (internal; the filename is always exactly `IMPLEMENTATION_NOTES.md`, never prefixed with the component name) in the component's folder. If starting from a step-9 stub, this file already exists, seeded from the integration report — add what implementation actually found rather than replacing it wholesale.
5. Export it from `src/components/index.ts` (see step 5's note); add the explicit `export type { Recursica<Name>Props }` override alongside it if the name collides with `@recursica/adapter-common`'s own, same as other components.
6. Add it to `llms.txt` in alphabetical order.
7. Add a changeset (`npx changeset`).
8. Update `docs/COMPONENT_DEV_GUIDE.md`/`docs/COMPONENT_STORYBOOK_GUIDE.md` with anything UI-kit-specific you learned building it.

**Verify step 1 actually holds, don't just read the code back**: for at least one appearance-affecting prop you blocked, try to force it through anyway (e.g. via a Storybook story's `args` — `?args=<propName>:<value>`) and confirm via a real computed-style/class check that the forced value had no effect. Reading `UNSUPPORTED_PROPS` and confirming the prop name is spelled correctly is not the same as confirming the deletion actually prevents the override at runtime.

## 11. Governance: branches, not commits

Whoever (human or agent) does this work commits to their own feature branch and opens a PR. Committing directly, or merging without human review, is out of scope for an automated contributor — the repo owner reviews and merges.
