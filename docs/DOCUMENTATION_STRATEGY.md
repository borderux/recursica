# Documentation Strategy (Human & AI)

Recursica is designed to be easily navigable and understandable by both human developers and Artificial Intelligence (AI) agents. This document outlines our philosophy and strategy for maintaining documentation across the monorepo.

## 1. Human Documentation

The traditional documentation stack provides high-level architecture, contribution guidelines, and detailed usage instructions for developers.

- **`README.md`**: The primary entry point for a package. Provides an overview, installation instructions, and basic usage.
- **`USAGE.md`**: Detailed instructions, code snippets, and API references for consuming a package.
- **`ARCHITECTURE.md`**: Details project architecture, dependencies, and core philosophy of a specific library or application.
- **`CONTRIBUTING.md`**: Guidelines for human developers on how to fork, test, and submit pull requests.

## 2. AI Documentation

With the rise of AI-assisted coding, we maintain specific files that act as maps and constraint-setters for AI agents. We strictly separate internal monorepo development from external package consumption.

### `AGENT.md` (Internal Development)

**Target Audience**: AI agents operating _inside_ the Recursica monorepo (e.g., an agent helping a Recursica maintainer build or refactor the codebase).

- **Purpose**: Provides instructions on monorepo architecture, testing commands, linting rules, and strict coding constraints (e.g., "Do not swallow exceptions", "Run turbo build").
- **Location**: Found at the monorepo root, and inside every package/app directory.
- **Navigation**: The root `AGENT.md` acts as a central hub, routing the AI to package-specific `AGENT.md` files depending on the context of the task.

### `llms.txt` (External Consumption)

**Target Audience**: AI agents operating in a _consumer's_ repository (e.g., an agent helping an external developer use `@recursica/mantine-adapter` in their own project).

- **Purpose**: Based on the [llmstxt.org](https://llmstxt.org/) standard, it provides LLMs with context on how to consume the library's API.
- **Location**: Found at the monorepo root (for high-level repository exploration), and inside every public package.
- **Navigation**: Instead of duplicating documentation, `llms.txt` serves as a router. It points the AI directly to `USAGE.md`, `ARCHITECTURE.md`, and `README.md`.

## 3. NPM Bundling Strategy

To ensure that AI agents have immediate, local access to our documentation without relying on fragile network requests, we bundle key documentation directly into our published NPM packages.

For every public package (e.g., `@recursica/mantine-adapter` or `@recursica/mui-adapter`), the `package.json` `"files"` array explicitly includes:

- `"llms.txt"`
- `"USAGE.md"`
- `"ARCHITECTURE.md"` (if applicable)

**Why this matters:** When a user installs our package, their AI agent can easily discover `node_modules/@recursica/mantine-adapter/llms.txt`. Because `USAGE.md` is also bundled in that same directory, the relative links within `llms.txt` (e.g., `[USAGE](USAGE.md)`) resolve perfectly on the user's local file system. This creates a fast, offline-capable context gathering loop for the agent.

## 4. Shared vs. Adapter-Specific Contributor Docs

Recursica ships multiple adapters (`mantine-adapter`, `mui-adapter`, and future ones) that are structurally identical but wrap different UI libraries. Two of their contributor-facing docs — `docs/COMPONENT_DEV_GUIDE.md` and `docs/COMPONENT_STORYBOOK_GUIDE.md` — are ~90% identical in content. Hand-copying that content into each adapter has caused real drift in the past (an adapter's dev guide referencing the wrong UI library's API), so we split those two:

- **Canonical versions** live in [`packages/adapter-common/docs/`](../packages/adapter-common/docs/) — `adapter-common` is the one package every adapter already depends on, making it the natural single source of truth. These define every rule that applies to all adapters equally.
- **Each adapter's own `docs/COMPONENT_DEV_GUIDE.md` and `docs/COMPONENT_STORYBOOK_GUIDE.md`** are thin deltas: they link back to the canonical doc and cover only what's genuinely specific to that adapter's UI library (e.g. how polymorphism is implemented in that library, or a CSS-specificity note tied to its styling engine).
- See [`packages/adapter-common/docs/PIPELINE.md`](../packages/adapter-common/docs/PIPELINE.md) for the full end-to-end flow (`adapter-common` → adapter → `storybook-template` → `recursica-storybook`) and each adapter's own `CONTRIBUTING.md` for the rule on which doc to edit when.

**`docs/PHILOSOPHY.md` deliberately does _not_ follow this canonical/delta pattern.** It explains consumer-relevant behavior (why `overStyled` exists, how the escape hatch works for that specific UI library) rather than pure contributor process, so each adapter keeps its own **full, independent** `docs/PHILOSOPHY.md` — no cross-package link, relative or absolute. **The rule for keeping them in sync is manual, not structural:** if you change something in one adapter's `docs/PHILOSOPHY.md` that reflects a philosophy shared by every adapter (as opposed to something genuinely specific to that UI library), check whether the other adapter's `docs/PHILOSOPHY.md` needs the same change, and vice versa. Each adapter's own `CONTRIBUTING.md` states this rule explicitly.

**This split (for either the canonical/delta docs or `PHILOSOPHY.md`) does not apply to `USAGE.md`, `README.md`, `SETUP.md`, or `OVERSTYLING.md`.** Those are npm-consumer-facing (see §3 above) and must remain fully self-contained per adapter — a consumer who only installed `@recursica/mui-adapter` should never need to resolve a cross-package link to understand how to use it. The canonical/delta split is only for docs that are never published and are read exclusively by repo contributors and AI agents working inside a full monorepo checkout (`AGENT.md`, `CONTRIBUTING.md`, `docs/COMPONENT_DEV_GUIDE.md`, `docs/COMPONENT_STORYBOOK_GUIDE.md`), where relative links across `packages/*` always resolve — and _between those specific files_, that's guaranteed, not assumed: they're deliberately absent from every adapter's `package.json` `"files"` allowlist (see §3), so a consumer's `node_modules` tree never contains any of them, broken link or otherwise.

**`README.md` is the one file that needs care, and it bit us once already.** npm always publishes `README.md` regardless of what's in `"files"` — it's on npm's own always-include list alongside `LICENSE` and `package.json`. Both adapters' `README.md` used to contain a plain relative link to `docs/PHILOSOPHY.md`, back when `docs/PHILOSOPHY.md` wasn't in the `"files"` allowlist — a real, live 404 for anyone reading it via `npmjs.com` or `node_modules`. That's now fixed by adding `docs/PHILOSOPHY.md` to each adapter's `"files"` array (so the plain relative link is genuinely safe), rather than by changing the link itself. `README.md` still links to `CONTRIBUTING.md` and `AGENT.md` with **absolute GitHub URLs**, since those two are genuinely monorepo-only and will never be published. The rule going forward: a link from `README.md` (or any other always-published file) to something is only safe as a relative path if that something is _also_ in the `"files"` array — otherwise use an absolute GitHub URL, or add the target to `"files"` if it's actually meant for consumers (as we did here for `PHILOSOPHY.md`).
