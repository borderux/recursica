# Adapter Pipeline: From Token to Published Storybook

This document walks the full path a component or design-token change takes across Recursica's repos, and states where each kind of documentation lives along that path. Read this if you're adding a new component, changing a shared primitive, or trying to figure out which repo(s)/package(s) an edit needs to touch.

**Adapters are no longer packages in this monorepo.** Each UI-kit adapter is its own standalone, independently-versioned, independently-published repo. `recursica-adapter-mantine-v8` (npm `@recursica/adapter-mantine-v8`) is the **source-of-truth adapter** — every other adapter is built and visually diffed against it (see `packages/adapter-tester`). `recursica-adapter-mui-v7` (npm `@recursica/adapter-mui-v7`) is the other current adapter. Both depend on this monorepo's `@recursica/adapter-common` as a real, published npm dependency — not a workspace link.

## The chain

```
packages/adapter-common (this monorepo)   (shared prop-contract types, Layer, RecursicaThemeProvider, canonical docs/)
        │
        ├──▶ recursica-adapter-mantine-v8 (separate repo, npm dependency on adapter-common — SOURCE OF TRUTH)
        │           │
        │           ▼
        │    own .storybook/, own test/golden/, own GitHub Pages deploy
        │
        └──▶ recursica-adapter-mui-v7     (separate repo, npm dependency on adapter-common)
                    │
                    ▼
             own .storybook/, own test/golden/, own GitHub Pages deploy,
             visually diffed against mantine-v8's published goldens via adapter-tester

Both adapters depend on packages/storybook-template (this monorepo, published as
@recursica/storybook-template) for shared .storybook config/decorators.
```

**A change to a shared primitive or prop contract in `adapter-common` almost always needs a corresponding change in both adapter repos** — see [`AGENT.md`](../../../AGENT.md)'s standing rule that new components are built in every adapter to keep them in sync. There is no longer a single monorepo-wide Storybook publishing step (`apps/recursica-storybook` was removed) — each adapter repo builds and publishes its own Storybook independently.

## What lives where

1. **`packages/adapter-common`** (this monorepo) — Framework-agnostic prop-contract types (`Recursica<Name>Props.ts`) shared by every adapter, plus the handful of components with real cross-framework implementations (`Layer`, `EmptyValueRenderer`, `RecursicaThemeProvider`). Also home to the **canonical, shared contributor docs**: [`docs/COMPONENT_DEV_GUIDE.md`](./COMPONENT_DEV_GUIDE.md) and [`docs/COMPONENT_STORYBOOK_GUIDE.md`](./COMPONENT_STORYBOOK_GUIDE.md) — the rules that apply to every adapter, regardless of UI library. (`PHILOSOPHY.md` is **not** part of this canonical set — see below.)
2. **`recursica-adapter-mantine-v8`** and **`recursica-adapter-mui-v7`** (separate repos) — The concrete, library-specific component implementations. Each has its own `docs/COMPONENT_DEV_GUIDE.md` and `docs/COMPONENT_STORYBOOK_GUIDE.md`, which are **thin deltas** that link back to the canonical versions in this monorepo's `adapter-common/docs/` via **absolute GitHub URLs** (not relative paths — the adapter is out of the monorepo, so `packages/*` relative links don't resolve there) and only describe what's genuinely different for that library (e.g. how polymorphism is implemented, or a CSS-specificity note tied to that library's styling engine). Each adapter also has its own npm-consumer-facing docs (`USAGE.md`, `README.md`, `SETUP.md`, `OVERSTYLING.md`, and — see below — `docs/PHILOSOPHY.md`), fully self-contained per adapter.
3. **`packages/storybook-template`** (this monorepo) — Shared `.storybook/main.ts` / `preview.tsx` factories and decorators, published as `@recursica/storybook-template` and installed as a real dependency by both adapter repos' own `.storybook/` configs.
4. **`packages/adapter-tester`** (this monorepo) — Published as `@recursica/adapter-tester`, installed by every adapter (including the source-of-truth one) to visually diff its own Storybook against its own committed goldens, and — for every adapter except mantine-v8 itself — against mantine-v8's published goldens as the divergence check.

## Why the canonical docs live in `adapter-common` — and why `PHILOSOPHY.md` doesn't

Every adapter already depends on `@recursica/adapter-common` as a real npm dependency — it's the one package both `recursica-adapter-mantine-v8` and `recursica-adapter-mui-v7` have in common. That makes it the natural home for documentation that's genuinely shared, rather than duplicating full copies inside each adapter repo and hoping they don't drift. (They have drifted before — see the note in each adapter's `CONTRIBUTING.md` on keeping docs in sync.)

This split does **not** apply to `USAGE.md`, `README.md`, `SETUP.md`, `OVERSTYLING.md`, or `docs/PHILOSOPHY.md` — those ship inside each adapter's published npm package (per `docs/DOCUMENTATION_STRATEGY.md`'s NPM Bundling Strategy) and are read by consumers who only have that one adapter installed. Those must stay fully self-contained per adapter, with **no cross-package links of any kind** — not a relative path, not an absolute GitHub URL either. Each adapter's `docs/PHILOSOPHY.md` is a full, independent document; keeping the two in sync is a **documented manual rule** (see `docs/DOCUMENTATION_STRATEGY.md` §4), not a structural single-source-of-truth link. `PHILOSOPHY.md` explains consumer-relevant behavior (why `overStyled` exists, how the escape hatch works) unlike `COMPONENT_DEV_GUIDE.md`/`COMPONENT_STORYBOOK_GUIDE.md`, which are pure contributor guidance — that's why it gets this different treatment.

The canonical/delta split with a single source of truth is only for **contributor- and AI-agent-facing docs that are never published** (`docs/COMPONENT_DEV_GUIDE.md`, `docs/COMPONENT_STORYBOOK_GUIDE.md`, and `CONTRIBUTING.md`). Each adapter now lives in its own repo, so its delta doc links back to the canonical version with an **absolute GitHub URL** into this monorepo, not a relative `packages/*` path — a relative path only resolved back when the adapter itself lived at `packages/<name>` here, and no longer does.

**This isn't just a convention — it's structurally enforced.** Each adapter's `package.json` `"files"` array (the npm publish allowlist) deliberately does **not** include `CONTRIBUTING.md` or the rest of `docs/` — only `docs/PHILOSOPHY.md` specifically, plus `llms.txt`, `USAGE.md`, `ARCHITECTURE.md`, `SETUP.md`, and `OVERSTYLING.md`, are published. That means `docs/COMPONENT_DEV_GUIDE.md` never exists inside `node_modules/@recursica/adapter-mantine-v8/` or `node_modules/@recursica/adapter-mui-v7/` in the first place — a package consumer has no path to it at all, broken link or otherwise. The only way to ever read `COMPONENT_DEV_GUIDE.md`/`COMPONENT_STORYBOOK_GUIDE.md`/`CONTRIBUTING.md` is a full checkout of the relevant repo(s) (a clone, a fork, or GitHub's own file browser, which also resolves absolute GitHub URLs correctly) — and in every one of those cases, the cross-repo links resolve.

**The one exception: `README.md`.** npm always publishes `README.md` regardless of what's in `"files"` — so a link _inside_ `README.md` is reachable by every consumer even though the _target_ of that link might not be published. Each adapter's `README.md` links to its own `docs/PHILOSOPHY.md` with a plain relative path (safe now that it's published), but still links to `CONTRIBUTING.md` and `AGENT.md` — genuinely monorepo-only, contributor/agent-facing docs that don't belong in a published package — with **absolute GitHub URLs**, since those two remain unpublished. If you add a new link from `README.md` (or any other always-published file) to something that isn't in that adapter's `"files"` array, use an absolute GitHub URL, not a relative path. If a doc's publish status ever changes, re-check every link into and out of it.

## Adding a new component, end to end

1. If the component needs a new shared prop-contract type, add `Recursica<Name>Props.ts` under `packages/adapter-common/src/components/<Name>/` in this monorepo.
2. Implement the component in **every** adapter repo it targets (see the standing rule in the root `AGENT.md`), following that adapter's `docs/COMPONENT_DEV_GUIDE.md` delta plus the canonical guide it links to.
3. Add a story per [`docs/COMPONENT_STORYBOOK_GUIDE.md`](./COMPONENT_STORYBOOK_GUIDE.md) (canonical) and your adapter's delta, using the shared decorators/config from `storybook-template` (already wired into each adapter's `.storybook/` directory).
4. Add the component's `USAGE.md` (and `{COMPONENT}_IMPLEMENTATION_NOTES.md` if it required layout workarounds) inside that adapter's component folder, and update that adapter's `llms.txt`.
5. If you built the component on `recursica-adapter-mantine-v8` (the source-of-truth adapter), capture golden images there (`--update-golden`) and publish a release so other adapters' `adapter-tester` divergence checks have something to diff against.
