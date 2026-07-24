# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo overview

Recursica is a design system and component library monorepo (Turborepo + npm workspaces) that bridges Figma designs and framework-specific UI code. Design tokens are authored in Figma, exported as JSON via a Figma plugin (or Recursica Forge, a separate hosted tool at forge.recursica.com), validated against JSON schemas, compiled into CSS variables, and consumed by framework "adapters" (Mantine, MUI) that expose a single semantic component API on top of each underlying UI library.

**This repo already has an `AGENT.md` at the root and inside almost every package/app** — read the relevant one(s) before working in a given package; they contain more detail than is duplicated here. Root `AGENT.md` also documents a repo-wide `llms.txt` convention (docs for _external_ consumers of published packages) that is distinct from `AGENT.md` (docs for agents working _inside_ this monorepo) — don't confuse the two when adding documentation.

Note: `README.md` and the root `AGENT.md`'s package tables are **out of date** — they omit `packages/adapter-tester`, `packages/official-release`, `packages/recursica-mcp`, `packages/recursica-token-analyzer`, and list only `mantine-adapter` (README) despite `mui-adapter` also existing. Trust the actual `packages/`/`apps/` directory listing over those tables.

## Commands

Run from repo root unless noted:

```bash
npm install              # installs deps, sets up Husky pre-commit hook via prepare script
npm run build             # turbo run build (all packages/apps, respects dependency graph)
npm run lint               # turbo run lint
npm run check-types      # turbo run check-types
npm run test                # turbo run test
npm run format             # prettier --write across the whole repo
npm run precommit        # check-types + lint + test + format (what the pre-commit hook runs)
npm run simulate-ci        # ./scripts/simulate-ci-build.sh — reproduces the CI build locally
npx changeset               # create a changeset (required for any user-facing PR)
```

Scope any of these to one package with npm workspaces or Turborepo filtering:

```bash
npm run build -w @recursica/common
npx turbo run test --filter=@recursica/mantine-adapter
```

Run a single test file with Vitest (used by `common`, `mantine-adapter`, `mui-adapter`, `recursica-mcp`, etc.):

```bash
cd packages/<pkg> && npx vitest run path/to/file.test.ts
```

Storybook dev servers (used for adapter development and by `adapter-tester`'s visual diffing):

```bash
npm run storybook -w @recursica/mantine-adapter   # port 6011
npm run storybook -w @recursica/mui-adapter          # port 6012
```

## Architecture

### Token flow

`packages/schemas` defines the JSON schemas for every Recursica file format (`recursica.json`, token/variable bundles, icon files) and generates TypeScript types from them. `packages/common` validates JSON against those schemas and enforces the core token hierarchy: **Tokens (raw values only) → Themes (must only reference Tokens) → UI Kit (must only reference Themes)**. `packages/official-release` is the published, generated artifact containing the actual compiled CSS variables (`recursica_variables_scoped.css`) and JSON token files — these files are generated exclusively by Forge/the Figma plugin and must never be hand-edited. `packages/recursica-token-analyzer` (bin `analyze-tokens`) statically diffs adapter component source against `recursica_variables_scoped.css` to find broken/missing or unused variable references; it runs as a `prebuild` step in both adapters and **fails the build** on any unexempted mismatch (exemptions are inline `/* recursica-ignore: --var-name */` comments in `.module.css` files). `packages/recursica-postcss-vars` does the same kind of validation as a PostCSS plugin (`strict: false` warns, `strict: true` exits 1).

### Adapter architecture

`packages/adapter-common` holds framework-agnostic primitives/hooks shared by every adapter and must never import a UI framework (Mantine, MUI, etc.). `packages/mantine-adapter` (Mantine 8, the primary/reference adapter) and `packages/mui-adapter` (MUI 7) each wrap their underlying library's components behind a single semantic Recursica prop API, decoupled from the underlying library's own variant/prop names. Both follow the same rules (detailed in each package's `CONTRIBUTING.md`/`docs/PHILOSOPHY.md`):

- Wrap component props with `RecursicaOverStyled`; never hardcode colors or sizing — only consume CSS variables from `recursica_variables_scoped.css`. If no token exists for a need, stop and ask rather than inventing one.
- Never mutate the underlying library's theme object or internals; style via scoped `.module.css` + targeted `className`/`classNames` only.
- Arbitrary styling props (`p`, `bg`, `c`, `styles`, `classNames`) are stripped by default; only DOM layout props pass through. `overStyled={true}` is a deliberate, visible escape hatch meant to be temporary.
- Every component needs a Storybook story, a `USAGE.md` (public integration docs), and an `IMPLEMENTATION_NOTES.md` (internal rationale/CSS hacks).

`packages/adapter-tester` runs Playwright visual-regression tests comparing the MUI adapter's rendering against the Mantine adapter (source of truth) pixel-by-pixel — goal is visual/token parity, not DOM parity. The global diff threshold lives in `tests/config.ts` (`VISUAL_DIFF_THRESHOLD_PIXELS`) and must not be changed globally; use a documented local override instead.

### Other packages

- `packages/recursica-mcp` (`@recursica/mcp`, bin `recursica-mcp`) — MCP server exposing Recursica component/usage lookup tools to AI assistants.
- `packages/storybook-template` — shared, framework-agnostic Storybook config/decorators reused by `apps/recursica-storybook` and the adapters.
- `packages/typescript-config` / `packages/eslint-config` — shared `tsconfig`/ESLint presets; changes here are monorepo-wide, treat with care.
- `packages/eslint-plugin` — appears to be an orphaned/in-progress package (no `package.json`, no git history); don't treat it as an active, maintained package without checking with the user first.

### Apps

- `apps/figma-plugin` (`@recursica/figma-plugin`, internally "Recursica Publisher") — the Figma plugin that exports design tokens/components as JSON and opens sync PRs against a GitHub repo (or imports Figma content from a repo). Uses `documentAccess: "dynamic-page"`, so plugin code must use Figma's **async** API (`getMainComponentAsync()`, `getNodeByIdAsync()`, etc.) — never the sync equivalents. Figma node properties (fills/strokes/effects) are read-only; clone before mutating and reassign, or use setters like `setBoundVariable()`. Two separate Vite builds: `vite.config.ts` (UI, React 19) and `vite.config.lib.ts` (plugin sandbox code in `src/plugin/`).
- `apps/recursica-storybook` — thin build/deploy wrapper with no stories of its own; it builds and publishes the adapters' Storybooks to GitHub Pages. To change actual stories/components, edit `packages/mantine-adapter` or `packages/mui-adapter`, not this app.

## Repo-wide agent rules (from root `AGENT.md`)

- Before changing a package/app, read its `AGENT.md` and `CONTRIBUTING.md` first, plus any docs they point to (`USAGE.md`, `PHILOSOPHY.md`, etc.).
- Do not add fallbacks, default values, or silent error handling unless explicitly requested — code should fail hard and visibly.
- Do not swallow exceptions; do not catch-and-rethrow unless necessary or requested.
- Every user-facing PR needs a changeset (`npx changeset`) — select affected packages and bump type (patch/minor/major).
- CI (`.github/workflows/pull-request.yml`) runs `check-types`, `build`, and `test` on every PR into `main`; releases (`.github/workflows/release.yml`) are driven by merging the Changesets-generated "Version Packages" PR, which publishes npm packages (`"private": false`) and/or uploads GitHub release zip assets (`"private": true`) depending on each package's `package.json`.
